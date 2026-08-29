import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { pushPaymentStatus } from "@/lib/payments";

const RESPONSE_WINDOW_HOURS = 24;

// Cliente abre disputa (C24). O pagamento continua retido (pré-autorização mantida,
// PAYMENT-PROFILE.md) — só o admin decide o desfecho via /api/disputes/[id]/resolve.
// Payment status é escrito aqui (backend) porque cliente não pode tocar em `payments`.
export async function POST(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) return NextResponse.json({ error: "não autenticado" }, { status: 401 });

  let clientId: string;
  try {
    clientId = (await adminAuth.verifyIdToken(idToken)).uid;
  } catch {
    return NextResponse.json({ error: "token inválido" }, { status: 401 });
  }

  const { order_id, description, photos } = await req.json();
  if (!order_id || typeof description !== "string" || description.trim().length < 50) {
    return NextResponse.json({ error: "descrição precisa ter pelo menos 50 caracteres" }, { status: 400 });
  }

  const orderRef = adminDb.collection("orders").doc(order_id);
  const order = (await orderRef.get()).data();
  if (!order) return NextResponse.json({ error: "pedido não encontrado" }, { status: 404 });
  if (order.client_id !== clientId) return NextResponse.json({ error: "pedido não é seu" }, { status: 403 });

  const disputeRef = adminDb.collection("disputes").doc();
  await disputeRef.set({
    dispute_id: disputeRef.id,
    order_id,
    payment_id: order_id,
    client_id: clientId,
    cleaner_id: order.cleaner_id,
    client_claim: { description, photos: photos ?? [], submitted_at: FieldValue.serverTimestamp() },
    cleaner_response: null,
    admin_decision: null,
    status: "open",
    response_deadline: Timestamp.fromMillis(Date.now() + RESPONSE_WINDOW_HOURS * 60 * 60 * 1000),
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  });

  await orderRef.update({ status: "disputed", updated_at: FieldValue.serverTimestamp() });
  await pushPaymentStatus(order_id, "disputa_aberta");

  return NextResponse.json({ ok: true, disputeId: disputeRef.id });
}
