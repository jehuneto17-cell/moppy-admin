import { NextRequest, NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendPushNotification } from "@/lib/notifications";
import { cancelOrder } from "@/lib/payments";

// Cancelamento pelo próprio cliente/faxineira, pelo app — cancelOrder() já tem a
// regra dos 5 cenários (PAYMENT-PROFILE.md §6), mas até agora só era acionável pelo
// admin (app/api/orders/[orderId]/cancel/route.ts, autenticado por cookie de sessão,
// não serve pro mobile). O papel (client/cleaner) não vem do corpo da requisição —
// é deduzido de quem está de fato no pedido, pra ninguém cancelar em nome do outro.
export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) return NextResponse.json({ error: "não autenticado" }, { status: 401 });

  let uid: string;
  try {
    uid = (await adminAuth.verifyIdToken(idToken)).uid;
  } catch {
    return NextResponse.json({ error: "token inválido" }, { status: 401 });
  }

  const { orderId } = await params;
  const { reason } = await req.json();
  if (!reason || reason.trim().length < 5) {
    return NextResponse.json({ error: "descreva o motivo do cancelamento" }, { status: 400 });
  }

  const order = (await adminDb.collection("orders").doc(orderId).get()).data();
  if (!order) return NextResponse.json({ error: "pedido não encontrado" }, { status: 404 });

  let cancelledBy: "client" | "cleaner";
  if (order.client_id === uid) cancelledBy = "client";
  else if (order.cleaner_id === uid) cancelledBy = "cleaner";
  else return NextResponse.json({ error: "este pedido não é seu" }, { status: 403 });

  try {
    const result = await cancelOrder(orderId, cancelledBy, reason, `${cancelledBy}:${uid}`);
    const otherPartyId = cancelledBy === "client" ? order.cleaner_id : order.client_id;
    if (otherPartyId) {
      await sendPushNotification(
        otherPartyId,
        "Pedido cancelado",
        cancelledBy === "client" ? "O cliente cancelou o pedido." : "A faxineira cancelou o pedido."
      );
    }
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "erro ao cancelar" }, { status: 409 });
  }
}
