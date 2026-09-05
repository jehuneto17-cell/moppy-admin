import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { chargeOrder } from "@/lib/payments";

// Substitui /api/cron/preauth — não existe mais pré-autorização pra essa conta
// (PAYMENT-PROFILE.md §0). Roda D-1, 19h BRT, e cobra de verdade.
function isAuthorized(req: NextRequest) {
  return req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const summary = { new: 0, retried: 0, charged: 0, failed: 0 };

  // Parte 1: pedidos confirmados agendados pra amanhã, sem pagamento criado ainda.
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
    const existingPayment = await adminDb.collection("payments").doc(orderDoc.id).get();
    if (existingPayment.exists) continue;

    const outcome = await chargeOrder(orderDoc.id);
    summary.new++;
    if (outcome.outcome === "charged" || outcome.outcome === "adopted") summary.charged++;
    else if (outcome.outcome === "failed") summary.failed++;
  }

  // Parte 2: retries agendados (charge_retry_1/2) cujo next_retry_at já venceu.
  const dueRetries = await adminDb
    .collection("payments")
    .where("status", "in", ["charge_retry_1", "charge_retry_2"])
    .where("next_retry_at", "<=", Timestamp.now())
    .get();

  for (const paymentDoc of dueRetries.docs) {
    const outcome = await chargeOrder(paymentDoc.id);
    summary.retried++;
    if (outcome.outcome === "charged" || outcome.outcome === "adopted") summary.charged++;
    else if (outcome.outcome === "failed") summary.failed++;
  }

  return NextResponse.json({ ok: true, ...summary });
}
