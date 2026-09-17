import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { sendPushNotification } from "@/lib/notifications";
import { isEventProcessed, logPaymentEvent, pushPaymentStatus } from "@/lib/payments";

// O Asaas autentica o webhook devolvendo, em todo POST, o header `asaas-access-token`
// com o valor configurado no cadastro — não é `authorization: Bearer` (esse era o
// payload inventado do desenho antigo, ver PAYMENT-FLOW.md §3.2).
export async function POST(req: NextRequest) {
  if (req.headers.get("asaas-access-token") !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id: eventId, event, payment, transfer } = body ?? {};
  if (!eventId || !event) {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  // Eventos de transferência (saque da faxineira) — payload separado de payment,
  // tratado à parte porque não tem order_id nenhum envolvido.
  if (transfer?.id) {
    return handleTransferEvent(eventId, event, transfer);
  }

  if (!payment?.externalReference) {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  const orderId = payment.externalReference;
  if (await isEventProcessed(orderId, eventId)) {
    return NextResponse.json({ status: "already_processed" });
  }

  await logPaymentEvent(orderId, { type: "webhook", status: "success", asaas_event_id: eventId, asaas_response: payment });

  switch (event) {
    case "PAYMENT_CONFIRMED":
      await pushPaymentStatus(orderId, "charge_success");
      break;
    case "PAYMENT_RECEIVED":
      // Liquidação na conta (D+30 ou antecipada) — só registra, não muda o estado do pedido.
      break;
    case "PAYMENT_REFUNDED": {
      const current = (await adminDb.collection("payments").doc(orderId).get()).data();
      if (current?.status === "refund_pending") {
        await pushPaymentStatus(orderId, current.split ? "partial_refund" : "refunded");
      }
      break;
    }
    case "PAYMENT_CHARGEBACK_REQUESTED":
      await pushPaymentStatus(orderId, "chargeback_requested");
      // Congela o saldo desse pedido: marca o crédito da carteira como não liberável
      // mesmo se D+15 já tiver passado. A trava real é o cron release-balance
      // checar esse campo antes de mover pending_release → available.
      await adminDb.collection("payments").doc(orderId).set({ balance_frozen: true }, { merge: true });
      break;
    case "PAYMENT_DELETED":
      // Cobrança removida do lado do Asaas — reconcilia no próximo /api/cron/reconcile.
      break;
    default:
      break;
  }

  return NextResponse.json({ status: "processed" });
}

// TRANSFER_FAILED/TRANSFER_CANCELLED: o saque é debitado da carteira na hora que a
// faxineira pede (POST /api/wallets/withdraw), otimista — se a transferência falhar
// depois (chave PIX inválida, conta bloqueada, etc.), sem isso o dinheiro simplesmente
// sumia do saldo sem devolução automática. Ver ESTADO.md 2026-09-16.
async function handleTransferEvent(eventId: string, event: string, transfer: { id: string; status?: string; failReason?: string }) {
  const transferRef = adminDb.collection("transfers").doc(transfer.id);
  const transferSnap = await transferRef.get();
  if (!transferSnap.exists) {
    // Transferência que não veio do fluxo de saque da faxineira (ex: teste manual
    // no painel do Asaas) — nada pra reconciliar aqui.
    return NextResponse.json({ status: "ignored", reason: "transfer não rastreada" });
  }

  const alreadyProcessed = await transferRef.collection("events").where("asaas_event_id", "==", eventId).limit(1).get();
  if (!alreadyProcessed.empty) {
    return NextResponse.json({ status: "already_processed" });
  }
  await transferRef.collection("events").add({ event, asaas_event_id: eventId, timestamp: FieldValue.serverTimestamp() });

  const data = transferSnap.data()!;

  if (event === "TRANSFER_FAILED" || event === "TRANSFER_CANCELLED") {
    if (data.status === "failed" || data.status === "cancelled") {
      return NextResponse.json({ status: "already_failed" });
    }
    const walletRef = adminDb.collection("wallets").doc(data.cleaner_id);
    const wallet = (await walletRef.get()).data();
    const balance = wallet?.balance ?? { total: 0, pending_release: 0, available: 0 };
    await walletRef.update({
      "balance.available": balance.available + data.amount,
      "balance.total": balance.total + data.amount,
      updated_at: FieldValue.serverTimestamp(),
    });
    await walletRef.collection("transactions").add({
      type: "withdraw_reversed",
      amount: data.amount,
      balance_after: balance.total + data.amount,
      withdraw_id: transfer.id,
      reason: `Saque falhou (${transfer.failReason ?? event}) — valor devolvido`,
      timestamp: FieldValue.serverTimestamp(),
    });
    await adminDb
      .collection("cleaners")
      .doc(data.cleaner_id)
      .collection("withdraw_history")
      .doc(data.withdraw_history_doc_id)
      .update({ status: "failed", fail_reason: transfer.failReason ?? null });
    await transferRef.update({ status: event === "TRANSFER_FAILED" ? "failed" : "cancelled" });
    await sendPushNotification(
      data.cleaner_id,
      "Saque não foi concluído",
      "Seu saque não foi processado — o valor já voltou pra sua carteira. Confira sua chave PIX no perfil e tente de novo."
    );
    return NextResponse.json({ status: "reversed" });
  }

  if (event === "TRANSFER_DONE") {
    await transferRef.update({ status: "done" });
    await adminDb
      .collection("cleaners")
      .doc(data.cleaner_id)
      .collection("withdraw_history")
      .doc(data.withdraw_history_doc_id)
      .update({ status: "done" });
    await sendPushNotification(data.cleaner_id, "Saque concluído", "O valor já caiu na sua chave PIX.");
  }

  return NextResponse.json({ status: "processed" });
}
