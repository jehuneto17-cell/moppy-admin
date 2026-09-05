import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { settleOrder } from "@/lib/payments";

// Cliente tem 24h pra confirmar (C23) depois que a faxineira marca "Concluído" (F12).
// Sem resposta, o app confirma sozinho e captura o pagamento (PAYMENT-PROFILE.md).
export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const due = await adminDb
    .collection("orders")
    .where("status", "==", "in_progress")
    .where("confirm_deadline_at", "<=", Timestamp.now())
    .get();

  let confirmed = 0;
  for (const doc of due.docs) {
    const order = doc.data();
    if (!order.cleaner_completed_at || order.client_confirmed_at) continue;
    try {
      await settleOrder(doc.id);
      await doc.ref.update({ status: "completed", client_confirmed_at: FieldValue.serverTimestamp(), updated_at: FieldValue.serverTimestamp() });
      confirmed++;
    } catch {
      // pagamento não estava em charge_success (ex: disputa já aberta) — pula.
    }
  }

  return NextResponse.json({ ok: true, confirmed });
}
