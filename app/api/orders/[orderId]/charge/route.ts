import { NextRequest, NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { chargeOrder } from "@/lib/payments";

const URGENT_WINDOW_MS = 24 * 60 * 60 * 1000;

// Chamado pelo app logo depois que o cliente escolhe a candidata (C19). O cron D-1
// só cobra pedidos de "amanhã" — um pedido pra hoje, ou fechado às 23h pra amanhã
// de manhã, nunca seria cobrado a tempo (PAYMENT-PROFILE.md §1). Se faltar menos de
// 24h pro serviço, cobra agora; senão não faz nada (o cron cuida disso à noite).
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
  const order = (await adminDb.collection("orders").doc(orderId).get()).data();
  if (!order) return NextResponse.json({ error: "pedido não encontrado" }, { status: 404 });
  if (order.client_id !== clientId) return NextResponse.json({ error: "pedido não é seu" }, { status: 403 });
  if (order.status !== "confirmed") return NextResponse.json({ ok: true, charged: false, reason: "pedido não está confirmado" });

  const msUntilService = new Date(order.scheduled_at).getTime() - Date.now();
  if (msUntilService >= URGENT_WINDOW_MS) {
    return NextResponse.json({ ok: true, charged: false, reason: "mais de 24h — cron D-1 cobra à noite" });
  }

  try {
    const outcome = await chargeOrder(orderId);
    return NextResponse.json({ ok: true, charged: true, outcome: outcome.outcome });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "erro ao cobrar" }, { status: 409 });
  }
}
