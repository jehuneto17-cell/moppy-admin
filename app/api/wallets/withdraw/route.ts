import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import * as asaas from "@/lib/asaas";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const MIN_WITHDRAWAL = 20;

const PIX_KEY_TYPE: Record<string, "CPF" | "EMAIL" | "PHONE" | "EVP"> = {
  cpf: "CPF",
  email: "EMAIL",
  phone: "PHONE",
  random: "EVP",
};

export async function POST(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) return NextResponse.json({ error: "não autenticado" }, { status: 401 });

  let cleanerId: string;
  try {
    cleanerId = (await adminAuth.verifyIdToken(idToken)).uid;
  } catch {
    return NextResponse.json({ error: "token inválido" }, { status: 401 });
  }

  const { amount } = await req.json();
  if (typeof amount !== "number" || amount < MIN_WITHDRAWAL) {
    return NextResponse.json({ error: `valor mínimo de saque é R$ ${MIN_WITHDRAWAL}` }, { status: 400 });
  }

  const cleanerSnap = await adminDb.collection("cleaners").doc(cleanerId).get();
  const pix = cleanerSnap.data()?.pix;
  if (!pix?.key_value) {
    return NextResponse.json({ error: "cadastre uma chave PIX no seu perfil antes de sacar" }, { status: 400 });
  }
  const pixKeyType = PIX_KEY_TYPE[pix.key_type];
  if (!pixKeyType) {
    return NextResponse.json({ error: "tipo de chave PIX inválido — corrija no seu perfil" }, { status: 400 });
  }

  const walletRef = adminDb.collection("wallets").doc(cleanerId);
  const walletSnap = await walletRef.get();
  const balance = walletSnap.data()?.balance ?? { total: 0, pending_release: 0, available: 0 };
  if (amount > balance.available) {
    return NextResponse.json({ error: "saldo disponível insuficiente" }, { status: 400 });
  }

  // Sem subconta (PAYMENT-PROFILE.md §2): transfere direto da conta principal da
  // Moppy pra chave PIX da faxineira.
  const transfer = await asaas.createPixTransfer({
    value: amount,
    pixAddressKey: pix.key_value,
    pixAddressKeyType: pixKeyType,
    description: "Saque Moppy",
  });
  const newAvailable = balance.available - amount;

  await walletRef.update({
    "balance.available": newAvailable,
    "balance.total": balance.total - amount,
    updated_at: FieldValue.serverTimestamp(),
  });
  await walletRef.collection("transactions").add({
    type: "withdraw",
    amount,
    balance_after: balance.total - amount,
    withdraw_id: transfer.id,
    reason: "Saque solicitado pela faxineira",
    timestamp: FieldValue.serverTimestamp(),
  });
  await adminDb.collection("cleaners").doc(cleanerId).collection("withdraw_history").add({
    amount,
    pix_key: pix.key_value,
    status: transfer.status,
    asaas_transfer_id: transfer.id,
    requested_at: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true, transferId: transfer.id, availableBalance: newAvailable });
}
