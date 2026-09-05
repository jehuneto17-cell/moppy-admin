import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import * as asaas from "@/lib/asaas";
import { adminDb } from "@/lib/firebase-admin";
import { logPaymentEvent, pushPaymentStatus } from "@/lib/payments";

const STALE_MS = 30 * 60 * 1000; // 30min
const CANCEL_AFTER_FAILED_MS = 6 * 60 * 60 * 1000; // 6h

// Roda a cada 2h (PAYMENT-FLOW.md §3.3). Garante que a resposta da criação da
// cobrança / do estorno nunca é a única fonte de verdade — se o webhook se perder,
// isso sincroniza com o Asaas.
export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const summary = { checked: 0, synced: 0, cancelled_no_payment: 0 };
  const staleCutoff = Timestamp.fromMillis(Date.now() - STALE_MS);

  const pending = await adminDb.collection("payments").where("status", "in", ["charge_pending", "refund_pending"]).get();

  for (const doc of pending.docs) {
    const payment = doc.data();
    if (!payment.updated_at || payment.updated_at.toMillis() > staleCutoff.toMillis()) continue;
    if (!payment.asaas?.payment_id) continue;

    summary.checked++;
    const remote = await asaas.getPayment(payment.asaas.payment_id).catch(() => null);
    if (!remote) continue;

    const mapped = mapAsaasStatus(remote.status);
    if (mapped && mapped !== payment.status) {
      await pushPaymentStatus(doc.id, mapped);
      await logPaymentEvent(doc.id, { type: "reconcile", status: "success", asaas_response: remote });
      summary.synced++;
    }
  }

  // Caso 6 de PAYMENT-PROFILE.md §6: 3 tentativas falharam e o cliente não trocou
  // o cartão em 6h — cancela definitivamente, nada a estornar (nunca foi cobrado).
  const failedCutoff = Timestamp.fromMillis(Date.now() - CANCEL_AFTER_FAILED_MS);
  const failed = await adminDb.collection("payments").where("status", "==", "charge_failed").get();

  for (const doc of failed.docs) {
    const payment = doc.data();
    if (!payment.updated_at || payment.updated_at.toMillis() > failedCutoff.toMillis()) continue;

    await pushPaymentStatus(doc.id, "cancelled_no_payment");
    await adminDb
      .collection("orders")
      .doc(doc.id)
      .update({ status: "cancelled", cancellation: { cancelled_by: "system", cancellation_reason: "cartão recusado, sem troca em 6h" }, updated_at: FieldValue.serverTimestamp() });
    summary.cancelled_no_payment++;
  }

  return NextResponse.json({ ok: true, ...summary });
}

function mapAsaasStatus(remoteStatus: string): string | null {
  switch (remoteStatus) {
    case "CONFIRMED":
    case "RECEIVED":
      return "charge_success";
    case "REFUNDED":
      return "refunded";
    default:
      return null;
  }
}
