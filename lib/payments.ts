import { FieldValue, Timestamp } from "firebase-admin/firestore";

import * as asaas from "./asaas";
import { adminDb } from "./firebase-admin";
import { computeSplit } from "./split";

const RELEASE_DAYS = 15;

export async function isEventProcessed(paymentId: string, asaasEventId: string) {
  const snap = await adminDb.collection("payments").doc(paymentId).collection("events").where("asaas_event_id", "==", asaasEventId).limit(1).get();
  return !snap.empty;
}

export async function logPaymentEvent(
  paymentId: string,
  data: { type: string; status: string; asaas_event_id?: string; asaas_response?: unknown; error?: string | null }
) {
  await adminDb
    .collection("payments")
    .doc(paymentId)
    .collection("events")
    .add({
      ...data,
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

// Captura o pagamento pré-autorizado + split + credita a carteira da faxineira.
// Chamado tanto pelo admin (Pedidos → "Capturar pagamento", pra disputas "libera
// pagamento") quanto pela confirmação do cliente (C23 "Sim, está tudo certo").
export async function runCapture(orderId: string) {
  const paymentRef = adminDb.collection("payments").doc(orderId);
  const payment = (await paymentRef.get()).data();
  if (!payment) throw new Error("pagamento não encontrado");
  if (payment.status !== "preauth_success") {
    throw new Error(`pagamento em status '${payment.status}', esperava 'preauth_success'`);
  }

  const result = await asaas.capturePayment({ preauthId: payment.asaas.preauth_id, amount: payment.amount.gross });
  const split = computeSplit(payment.amount.split_base);
  const releaseAt = Timestamp.fromMillis(Date.now() + RELEASE_DAYS * 24 * 60 * 60 * 1000);

  await paymentRef.set(
    { asaas: { capture_id: result.captureId }, split: { ...split, split_executed_at: FieldValue.serverTimestamp() }, release_at: releaseAt, balance_released: false },
    { merge: true }
  );
  await pushPaymentStatus(orderId, "capture_success");
  await logPaymentEvent(orderId, { type: "capture_success", status: "success", asaas_response: result });
  await creditWallet(payment.cleaner_id, orderId, split.cleaner_net, releaseAt);

  return { split };
}

// Estorna um pagamento (disputa: reembolso total ou parcial). Se `partialCreditBase`
// for passado, também captura e credita a faxineira pela parte não reembolsada
// (reembolso parcial — PAYMENT-PROFILE.md: "estorna parte, libera parte pra faxineira").
export async function runRefund(orderId: string, refundAmount: number, partialCreditBase?: number) {
  const paymentRef = adminDb.collection("payments").doc(orderId);
  const payment = (await paymentRef.get()).data();
  if (!payment) throw new Error("pagamento não encontrado");

  const result = await asaas.refundPayment({ captureId: payment.asaas.preauth_id, amount: refundAmount });

  let split = null;
  if (partialCreditBase && partialCreditBase > 0) {
    split = computeSplit(partialCreditBase);
    const releaseAt = Timestamp.fromMillis(Date.now() + RELEASE_DAYS * 24 * 60 * 60 * 1000);
    await paymentRef.set(
      { asaas: { refund_id: result.refundId }, split: { ...split, split_executed_at: FieldValue.serverTimestamp() }, release_at: releaseAt, balance_released: false },
      { merge: true }
    );
    await creditWallet(payment.cleaner_id, orderId, split.cleaner_net, releaseAt);
    await pushPaymentStatus(orderId, "partial_refund");
  } else {
    await paymentRef.set({ asaas: { refund_id: result.refundId } }, { merge: true });
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
