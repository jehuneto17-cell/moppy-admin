import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import * as asaas from "@/lib/asaas";
import { adminDb } from "@/lib/firebase-admin";
import { logPaymentEvent, pushPaymentStatus } from "@/lib/payments";

const MAX_RETRIES = 2;

function isAuthorized(req: NextRequest) {
  return req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
}

async function runPreauth(orderId: string, clientId: string, cardToken: string, amount: number, currentAttempt: number) {
  const result = await asaas.preauthorize({ customerId: clientId, cardToken, amount });
  const paymentRef = adminDb.collection("payments").doc(orderId);

  if (result.status === "preauth_success") {
    await paymentRef.set({ asaas: { preauth_id: result.preauthId }, next_retry_at: null }, { merge: true });
    await pushPaymentStatus(orderId, "preauth_success");
    await logPaymentEvent(orderId, { type: "preauth_success", status: "success", asaas_response: result });
    return "success";
  }

  const attempt = currentAttempt + 1;
  await logPaymentEvent(orderId, { type: "preauth_attempt", status: "failed", asaas_response: result, error: result.error });

  if (attempt > MAX_RETRIES) {
    await paymentRef.set({ preauth_attempt: attempt, next_retry_at: null }, { merge: true });
    await pushPaymentStatus(orderId, "preauth_failed");
    return "failed";
  }

  await paymentRef.set({ preauth_attempt: attempt, next_retry_at: Timestamp.fromMillis(Date.now() + 60 * 60 * 1000) }, { merge: true });
  await pushPaymentStatus(orderId, `preauth_retry_${attempt}`);
  return "retry_scheduled";
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const summary = { new: 0, retried: 0, succeeded: 0, failed: 0 };

  // Parte 1: pedidos confirmados agendados pra amanhã, sem pré-autorização ainda (dispara D-1).
  const tomorrowStart = new Date();
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);
  tomorrowStart.setUTCHours(0, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrowStart.getTime() + 24 * 60 * 60 * 1000);

  const dueOrders = await adminDb
    .collection("orders")
    .where("status", "==", "confirmed")
    .where("scheduled_at", ">=", tomorrowStart.toISOString())
    .where("scheduled_at", "<", tomorrowEnd.toISOString())
    .get();

  for (const orderDoc of dueOrders.docs) {
    const order = orderDoc.data();
    const existingPayment = await adminDb.collection("payments").doc(orderDoc.id).get();
    if (existingPayment.exists) continue;

    const cardSnap = await adminDb.collection("users").doc(order.client_id).collection("cards").doc(order.card_id).get();
    const card = cardSnap.data();
    if (!card) continue;

    await adminDb
      .collection("payments")
      .doc(orderDoc.id)
      .set({
        payment_id: orderDoc.id,
        order_id: orderDoc.id,
        client_id: order.client_id,
        cleaner_id: order.cleaner_id,
        card: { token: card.token, last_four: card.last_four, brand: card.brand },
        // amount.gross = o que o cliente paga (cobrado no cartão) | amount.split_base = base elegível
        // pra comissão (sem a taxa de urgência, que fica 100% com o app — PAYMENT-PROFILE.md).
        amount: { gross: order.pricing.net_total_client, split_base: order.pricing.subtotal },
        status: "preauth_pending",
        status_history: [{ status: "preauth_pending", timestamp: Timestamp.now() }],
        asaas: {},
        preauth_attempt: 0,
        next_retry_at: null,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
      });

    const outcome = await runPreauth(orderDoc.id, order.client_id, card.token, order.pricing.net_total_client, 0);
    summary.new++;
    if (outcome === "success") summary.succeeded++;
    else if (outcome === "failed") summary.failed++;
  }

  // Parte 2: retries agendados (preauth_retry_1/2) cujo next_retry_at já venceu.
  const dueRetries = await adminDb
    .collection("payments")
    .where("status", "in", ["preauth_retry_1", "preauth_retry_2"])
    .where("next_retry_at", "<=", Timestamp.now())
    .get();

  for (const paymentDoc of dueRetries.docs) {
    const payment = paymentDoc.data();
    const outcome = await runPreauth(paymentDoc.id, payment.client_id, payment.card.token, payment.amount.gross, payment.preauth_attempt);
    summary.retried++;
    if (outcome === "success") summary.succeeded++;
    else if (outcome === "failed") summary.failed++;
  }

  return NextResponse.json({ ok: true, ...summary });
}
