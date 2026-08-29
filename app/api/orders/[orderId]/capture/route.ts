import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { runCapture } from "@/lib/payments";

async function requireAdmin() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return false;
  try {
    const decoded = await adminAuth.verifySessionCookie(cookie);
    const adminDoc = await adminDb.collection("admin_whitelist").doc(decoded.uid).get();
    return adminDoc.exists;
  } catch {
    return false;
  }
}

// Ação manual do admin (Pedidos → "Capturar pagamento") pra quando a confirmação
// automática do cliente (C23) ainda não rodou, ou pra liberar pagamento numa disputa.
export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { orderId } = await params;
  try {
    const { split } = await runCapture(orderId);
    return NextResponse.json({ ok: true, split });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "erro ao capturar" }, { status: 409 });
  }
}
