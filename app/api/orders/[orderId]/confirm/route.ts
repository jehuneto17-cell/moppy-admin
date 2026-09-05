import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { settleOrder } from "@/lib/payments";

// Cliente confirma "está tudo certo" (C23) — calcula o split e credita a carteira
// da faxineira (o dinheiro já está com a Moppy desde a cobrança em D-1, então isso
// não chama o Asaas). A mesma lógica roda via /api/cron/auto-confirm se o cliente
// não responder em 24h.
export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) return NextResponse.json({ error: "não autenticado" }, { status: 401 });

  let clientId: string;
  try {
    clientId = (await adminAuth.verifyIdToken(idToken)).uid;
  } catch {
    return NextResponse.json({ error: "token inválido" }, { status: 401 });
  }

  const { orderId } = await params;
  const orderRef = adminDb.collection("orders").doc(orderId);
  const order = (await orderRef.get()).data();
  if (!order) return NextResponse.json({ error: "pedido não encontrado" }, { status: 404 });
  if (order.client_id !== clientId) return NextResponse.json({ error: "pedido não é seu" }, { status: 403 });

  try {
    const { split } = await settleOrder(orderId);
    await orderRef.update({ status: "completed", client_confirmed_at: FieldValue.serverTimestamp(), updated_at: FieldValue.serverTimestamp() });
    return NextResponse.json({ ok: true, split });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "erro ao confirmar" }, { status: 409 });
  }
}
