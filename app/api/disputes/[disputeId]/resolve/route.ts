import { FieldValue } from "firebase-admin/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { runCapture, runRefund } from "@/lib/payments";

async function requireAdmin() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(cookie);
    const adminDoc = await adminDb.collection("admin_whitelist").doc(decoded.uid).get();
    return adminDoc.exists ? decoded.uid : null;
  } catch {
    return null;
  }
}

// Admin decide uma disputa (A05): reembolso total, parcial, ou libera pagamento —
// processa via Asaas (mock) imediatamente, igual ao design mostra.
export async function POST(req: NextRequest, { params }: { params: Promise<{ disputeId: string }> }) {
  const adminId = await requireAdmin();
  if (!adminId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { disputeId } = await params;
  const { decision, partial_refund_amount, justification } = await req.json();
  if (!["total", "parcial", "libera"].includes(decision) || !justification || justification.trim().length < 10) {
    return NextResponse.json({ error: "decisão ou justificativa inválida" }, { status: 400 });
  }

  const disputeRef = adminDb.collection("disputes").doc(disputeId);
  const dispute = (await disputeRef.get()).data();
  if (!dispute) return NextResponse.json({ error: "disputa não encontrada" }, { status: 404 });

  const paymentSnap = await adminDb.collection("payments").doc(dispute.order_id).get();
  const payment = paymentSnap.data();
  if (!payment) return NextResponse.json({ error: "pagamento não encontrado" }, { status: 404 });

  try {
    let result: { split: unknown } | undefined;
    if (decision === "total") {
      await runRefund(dispute.order_id, payment.amount.gross);
    } else if (decision === "libera") {
      result = await runCapture(dispute.order_id);
    } else {
      const refundAmount = Number(partial_refund_amount);
      if (!refundAmount || refundAmount <= 0 || refundAmount >= payment.amount.gross) {
        return NextResponse.json({ error: "valor de reembolso parcial inválido" }, { status: 400 });
      }
      const creditBase = Math.max(0, payment.amount.split_base - refundAmount);
      result = await runRefund(dispute.order_id, refundAmount, creditBase);
    }

    await disputeRef.update({
      status: "decided",
      admin_decision: { decision, partial_refund_amount: partial_refund_amount ?? null, justification, admin_id: adminId, decided_at: FieldValue.serverTimestamp() },
      updated_at: FieldValue.serverTimestamp(),
    });
    await adminDb.collection("orders").doc(dispute.order_id).update({
      status: decision === "libera" ? "completed" : "cancelled",
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, split: result?.split ?? null });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "erro ao resolver disputa" }, { status: 409 });
  }
}
