import { FieldValue, Timestamp } from "firebase-admin/firestore";

import * as asaas from "./asaas";
import { adminDb } from "./firebase-admin";
import { computeSplit } from "./split";

const RELEASE_DAYS = 15;
const MAX_CHARGE_RETRIES = 2;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export async function isEventProcessed(paymentId: string, asaasEventId: string) {
  const snap = await adminDb.collection("payments").doc(paymentId).collection("events").where("asaas_event_id", "==", asaasEventId).limit(1).get();
  return !snap.empty;
}

export async function logPaymentEvent(
  paymentId: string,
  data: { type: string; status: string; actor?: string; asaas_event_id?: string; asaas_response?: unknown; error?: string | null }
) {
  await adminDb
    .collection("payments")
    .doc(paymentId)
    .collection("events")
    .add({
      ...data,
      actor: data.actor ?? "system",
      asaas_event_id: data.asaas_event_id ?? null,
      asaas_response: data.asaas_response ?? null,
      error: data.error ?? null,
      timestamp: FieldValue.serverTimestamp(),
    });
}

export async function pushPaymentStatus(paymentId: string, status: string, extra: Record<string, unknown> = {}) {
  await adminDb
    .collection("payments")
    .doc(paymentId)
    .update({
      status,
      status_history: FieldValue.arrayUnion({ status, timestamp: Timestamp.now() }),
      updated_at: FieldValue.serverTimestamp(),
      ...extra,
    });
}

// Credita o valor líquido da faxineira na carteira, bloqueado até releaseAt (D+15 — PAYMENT-PROFILE.md).
export async function creditWallet(cleanerId: string, orderId: string, amount: number, releaseAt: Timestamp) {
  const walletRef = adminDb.collection("wallets").doc(cleanerId);

  const balanceAfter = await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(walletRef);
    const current = snap.exists ? snap.data()!.balance : { total: 0, pending_release: 0, available: 0 };
    const next = {
      total: current.total + amount,
      pending_release: current.pending_release + amount,
      available: current.available,
      pending_release_date: releaseAt,
    };
    tx.set(walletRef, { wallet_id: cleanerId, balance: next, updated_at: FieldValue.serverTimestamp() }, { merge: true });
    return next.total;
  });

  await walletRef.collection("transactions").add({
    type: "credit",
    amount,
    balance_after: balanceAfter,
    order_id: orderId,
    reason: "Service completed and confirmed",
    release_at: releaseAt,
    timestamp: FieldValue.serverTimestamp(),
  });
}

// Cria (se preciso) e cobra o pagamento de um pedido. Chamado pelo cron D-1 (novos +
// retries) e pela confirmação do pedido quando falta menos de 24h pro serviço —
// mesma função, mesma idempotência, dois gatilhos (PAYMENT-FLOW.md §3.1).
export async function chargeOrder(orderId: string) {
  const paymentRef = adminDb.collection("payments").doc(orderId);
  let payment = (await paymentRef.get()).data();

  if (!payment) {
    const order = (await adminDb.collection("orders").doc(orderId).get()).data();
    if (!order) throw new Error("pedido não encontrado");

    const cardSnap = await adminDb.collection("users").doc(order.client_id).collection("cards").doc(order.card_id).get();
    const card = cardSnap.data();
    if (!card) throw new Error("cliente sem cartão cadastrado");

    const user = (await adminDb.collection("users").doc(order.client_id).get()).data();
    const asaasCustomerId = user?.asaas_customer_id;
    if (!asaasCustomerId) throw new Error("cliente sem cadastro no Asaas (asaas_customer_id ausente)");

    payment = {
      payment_id: orderId,
      order_id: orderId,
      client_id: order.client_id,
      cleaner_id: order.cleaner_id,
      card: { token: card.token, last_four: card.last_four, brand: card.brand },
      // amount.gross = o que o cliente paga (cobrado no cartão) | amount.split_base = base elegível
      // pra comissão (sem a taxa de urgência, que fica 100% com o app — PAYMENT-PROFILE.md).
      amount: { gross: order.pricing.net_total_client, split_base: order.pricing.subtotal },
      status: "pending",
      status_history: [{ status: "pending", timestamp: Timestamp.now() }],
      asaas: { customer_id: asaasCustomerId, payment_id: null, refund_id: null },
      charge_attempt: 0,
      next_retry_at: null,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };
    await paymentRef.set(payment);
  }

  if (!["pending", "charge_retry_1", "charge_retry_2"].includes(payment.status)) {
    return { outcome: "skipped" as const, status: payment.status };
  }

  // Guarda anti-duplicidade: se já existe cobrança no Asaas pra esse pedido (cron
  // rodou 2x, ou retry depois de uma resposta que se perdeu), adota o id em vez de
  // cobrar de novo. Cobrança duplicada aqui é dinheiro real fora da conta do cliente.
  const existing = await asaas.findByExternalReference(orderId).catch(() => null);
  if (existing) {
    await paymentRef.set({ asaas: { ...payment.asaas, payment_id: existing.id }, next_retry_at: null }, { merge: true });
    await pushPaymentStatus(orderId, "charge_pending");
    await logPaymentEvent(orderId, { type: "charge_attempt", status: "success", asaas_response: existing });
    return { outcome: "adopted" as const, asaasPaymentId: existing.id };
  }

  try {
    const result = await asaas.createCharge({
      customerId: payment.asaas.customer_id,
      cardToken: payment.card.token,
      amount: payment.amount.gross,
      orderId,
      description: `Faxina Moppy - pedido ${orderId}`,
    });
    await paymentRef.set({ asaas: { ...payment.asaas, payment_id: result.id }, next_retry_at: null }, { merge: true });
    await pushPaymentStatus(orderId, "charge_pending");
    await logPaymentEvent(orderId, { type: "charge_attempt", status: "success", asaas_response: result });
    return { outcome: "charged" as const, asaasPaymentId: result.id };
  } catch (e) {
    const attempt = (payment.charge_attempt ?? 0) + 1;
    const errorMessage = e instanceof Error ? e.message : "erro desconhecido";
    await logPaymentEvent(orderId, { type: "charge_attempt", status: "failed", error: errorMessage });

    if (attempt > MAX_CHARGE_RETRIES) {
      await paymentRef.set({ charge_attempt: attempt, next_retry_at: null }, { merge: true });
      await pushPaymentStatus(orderId, "charge_failed");
      return { outcome: "failed" as const, error: errorMessage };
    }

    await paymentRef.set({ charge_attempt: attempt, next_retry_at: Timestamp.fromMillis(Date.now() + 60 * 60 * 1000) }, { merge: true });
    await pushPaymentStatus(orderId, `charge_retry_${attempt}`);
    return { outcome: "retry_scheduled" as const, error: errorMessage };
  }
}

// Serviço confirmado (cliente, cron 24h, ou admin liberando disputa) — calcula o
// split e credita a carteira. NENHUMA chamada ao Asaas: o dinheiro já está na conta
// da Moppy desde a cobrança em D-1 (era `runCapture`, chamava asaas.capturePayment).
export async function settleOrder(orderId: string) {
  const paymentRef = adminDb.collection("payments").doc(orderId);
  const payment = (await paymentRef.get()).data();
  if (!payment) throw new Error("pagamento não encontrado");
  if (payment.status !== "charge_success") {
    throw new Error(`pagamento em status '${payment.status}', esperava 'charge_success'`);
  }

  const split = computeSplit(payment.amount.split_base, payment.amount.gross);
  const releaseAt = Timestamp.fromMillis(Date.now() + RELEASE_DAYS * 24 * 60 * 60 * 1000);

  await paymentRef.set(
    { split: { ...split, split_executed_at: FieldValue.serverTimestamp() }, release_at: releaseAt, balance_released: false },
    { merge: true }
  );
  await pushPaymentStatus(orderId, "settled");
  await logPaymentEvent(orderId, { type: "settle", status: "success" });
  await creditWallet(payment.cleaner_id, orderId, split.cleaner_net, releaseAt);

  return { split };
}

type RefundCredit =
  | { kind: "split"; base: number } // disputa parcial: computeSplit(base) credita o resto
  | { kind: "flat"; amount: number }; // cancelamento <12h: valor fixo, sem comissão nem rateio de taxa

// Estorna no Asaas (total se refundAmount for omitido, parcial se informado) e,
// opcionalmente, credita a carteira da faxineira. GUARDA CONTRA ESTORNO DUPLICADO —
// antes desta implementação o código não checava (PAYMENT-FLOW.md §4.5).
export async function runRefund(orderId: string, refundAmount: number | undefined, credit?: RefundCredit) {
  const paymentRef = adminDb.collection("payments").doc(orderId);
  const payment = (await paymentRef.get()).data();
  if (!payment) throw new Error("pagamento não encontrado");

  if (["refunded", "partial_refund", "refund_pending"].includes(payment.status)) {
    throw new Error(`pagamento já estornado (status: ${payment.status})`);
  }
  if (!["charge_success", "disputa_aberta"].includes(payment.status)) {
    throw new Error(`pagamento em status '${payment.status}', não pode ser estornado`);
  }

  await pushPaymentStatus(orderId, "refund_pending");

  let result: Awaited<ReturnType<typeof asaas.refundPayment>>;
  try {
    result = await asaas.refundPayment({
      paymentId: payment.asaas.payment_id,
      value: refundAmount,
      description: `Estorno pedido ${orderId}`,
    });
  } catch (e) {
    await pushPaymentStatus(orderId, "refund_failed");
    await logPaymentEvent(orderId, { type: "refund", status: "failed", error: e instanceof Error ? e.message : "erro desconhecido" });
    throw e;
  }

  let split: ReturnType<typeof computeSplit> | null = null;
  if (credit) {
    const releaseAt = Timestamp.fromMillis(Date.now() + RELEASE_DAYS * 24 * 60 * 60 * 1000);
    let creditAmount: number;
    if (credit.kind === "split") {
      split = computeSplit(credit.base);
      creditAmount = split.cleaner_net;
    } else {
      creditAmount = credit.amount;
    }
    await paymentRef.set(
      {
        asaas: { ...payment.asaas, refund_id: result.id },
        split: split ? { ...split, split_executed_at: FieldValue.serverTimestamp() } : FieldValue.delete(),
        release_at: releaseAt,
        balance_released: false,
      },
      { merge: true }
    );
    await creditWallet(payment.cleaner_id, orderId, creditAmount, releaseAt);
    await pushPaymentStatus(orderId, "partial_refund");
  } else {
    await paymentRef.set({ asaas: { ...payment.asaas, refund_id: result.id } }, { merge: true });
    await pushPaymentStatus(orderId, "refunded");
  }
  await logPaymentEvent(orderId, { type: "refund", status: "success", asaas_response: result });

  return { split };
}

// Move o valor de "a liberar" pra "disponível" quando D+15 chega (cron release-balance).
export async function releaseWalletBalance(cleanerId: string, amount: number) {
  const walletRef = adminDb.collection("wallets").doc(cleanerId);
  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(walletRef);
    const current = snap.data()!.balance;
    tx.update(walletRef, {
      "balance.pending_release": current.pending_release - amount,
      "balance.available": current.available + amount,
      updated_at: FieldValue.serverTimestamp(),
    });
  });
}

// Cancelamento — os 5 cenários de PAYMENT-PROFILE.md §6. `actor` vai pro log de
// auditoria ("client" | "cleaner" | "admin:{uid}").
export async function cancelOrder(orderId: string, cancelledBy: "client" | "cleaner", reason: string, actor: string) {
  const orderRef = adminDb.collection("orders").doc(orderId);
  const order = (await orderRef.get()).data();
  if (!order) throw new Error("pedido não encontrado");
  if (["completed", "cancelled", "disputed"].includes(order.status)) {
    throw new Error(`pedido em status '${order.status}', não pode ser cancelado`);
  }

  const paymentRef = adminDb.collection("payments").doc(orderId);
  const payment = (await paymentRef.get()).data();

  let paymentOutcome: "cancelled_free" | "refunded" | "partial_refund" = "cancelled_free";

  if (!payment || payment.status === "pending") {
    // Casos 1 e 4: nada foi cobrado ainda.
    if (payment) await pushPaymentStatus(orderId, "cancelled_free");
  } else if (payment.status === "charge_success") {
    const hoursUntil = (new Date(order.scheduled_at).getTime() - Date.now()) / (60 * 60 * 1000);

    if (cancelledBy === "cleaner" || hoursUntil >= 12) {
      // Casos 2 e 5: estorno total. A faxineira não pode ser penalizada por um
      // cancelamento que não é dela, e ≥12h dá tempo de reorganizar a agenda.
      await runRefund(orderId, undefined);
      paymentOutcome = "refunded";
    } else {
      // Caso 3: retém 30% da base pra faxineira, cheio, sem comissão nem rateio de
      // taxa — ela é a parte prejudicada (PAYMENT-PROFILE.md §6).
      const compensation = round2(payment.amount.split_base * 0.3);
      const refundAmount = round2(payment.amount.gross - compensation);
      await runRefund(orderId, refundAmount, { kind: "flat", amount: compensation });
      paymentOutcome = "partial_refund";
    }
  } else {
    throw new Error(`pagamento em status '${payment.status}' não pode ser cancelado por essa via — use a disputa`);
  }

  await orderRef.update({
    status: "cancelled",
    cancellation: { cancelled_by: cancelledBy, cancelled_at: FieldValue.serverTimestamp(), cancellation_reason: reason, payment_outcome: paymentOutcome },
    updated_at: FieldValue.serverTimestamp(),
  });
  await logPaymentEvent(orderId, { type: "cancellation", status: "success", actor });

  return { paymentOutcome };
}
