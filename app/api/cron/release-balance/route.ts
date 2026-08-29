import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { releaseWalletBalance } from "@/lib/payments";

// Libera pra "disponível" os créditos capturados há mais de 15 dias (PAYMENT-PROFILE.md).
// Consulta só por status (índice simples) e filtra release_at em memória — evita
// collectionGroup em wallets/*/transactions, que o emulador não respeita direito
// pra matches aninhados (mesmo problema documentado em firestore.rules, Bloco 5).
export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = Timestamp.now();
  const captured = await adminDb.collection("payments").where("status", "==", "capture_success").get();

  let released = 0;
  for (const doc of captured.docs) {
    const payment = doc.data();
    if (payment.balance_released || !payment.release_at || payment.release_at.toMillis() > now.toMillis()) continue;

    await releaseWalletBalance(payment.cleaner_id, payment.split.cleaner_net);
    await doc.ref.update({ balance_released: true });
    released++;
  }

  return NextResponse.json({ ok: true, released });
}
