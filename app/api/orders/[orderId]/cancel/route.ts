import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { cancelOrder } from "@/lib/payments";

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

// Cancelamento pelo admin. Antes disso o botão só escrevia status:"cancelled" no
// Firestore sem tocar no pagamento — com cobrança real isso deixava o cliente
// cobrado por um pedido cancelado (PAYMENT-IMPLEMENTATION.md §4, achado #2).
export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const adminId = await requireAdmin();
  if (!adminId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { orderId } = await params;
  const { reason, cancelled_by } = await req.json();
  if (!reason || reason.trim().length < 5) {
    return NextResponse.json({ error: "motivo do cancelamento é obrigatório" }, { status: 400 });
  }
  if (!["client", "cleaner"].includes(cancelled_by)) {
    return NextResponse.json({ error: "cancelled_by precisa ser 'client' ou 'cleaner'" }, { status: 400 });
  }

  try {
    const result = await cancelOrder(orderId, cancelled_by, reason, `admin:${adminId}`);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "erro ao cancelar" }, { status: 409 });
  }
}
