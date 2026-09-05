import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import * as asaas from "@/lib/asaas";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// Tokeniza um cartão de verdade. Precisa ficar no admin (não no app) porque exige
// a API Key do Asaas — nunca pode chegar no bundle do mobile (PAYMENT-IMPLEMENTATION.md
// §6). O número/CVV passam por aqui e vão direto pro Asaas; nada de cartão é
// gravado no Firestore, só o token + últimos 4 + bandeira (isso quem grava é o
// próprio app, via addCard, depois de receber a resposta daqui).
export async function POST(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) return NextResponse.json({ error: "não autenticado" }, { status: 401 });

  let uid: string;
  let email: string | undefined;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    uid = decoded.uid;
    email = decoded.email;
  } catch {
    return NextResponse.json({ error: "token inválido" }, { status: 401 });
  }

  const { number, holderName, expiryMonth, expiryYear, cvv, cpf, phone } = await req.json();
  if (!number || !holderName || !expiryMonth || !expiryYear || !cvv) {
    return NextResponse.json({ error: "dados do cartão incompletos" }, { status: 400 });
  }

  const userRef = adminDb.collection("users").doc(uid);
  const user = (await userRef.get()).data();
  const finalCpf = cpf || user?.cpf;
  const finalPhone = phone || user?.phone;
  if (!finalCpf || !finalPhone) {
    return NextResponse.json({ error: "CPF e telefone são obrigatórios no primeiro cartão" }, { status: 400 });
  }

  const addressSnap = await adminDb.collection("users").doc(uid).collection("addresses").orderBy("created_at", "desc").limit(1).get();
  const address = addressSnap.docs[0]?.data();
  if (!address) {
    return NextResponse.json({ error: "cadastre um endereço antes de adicionar um cartão" }, { status: 400 });
  }

  let asaasCustomerId: string | undefined = user?.asaas_customer_id;
  if (!asaasCustomerId) {
    const customer = await asaas.createCustomer({
      name: holderName,
      cpfCnpj: finalCpf,
      email: email ?? user?.email ?? "",
      mobilePhone: finalPhone,
    });
    asaasCustomerId = customer.id;
  }

  const remoteIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  let tokenized;
  try {
    tokenized = await asaas.tokenizeCard({
      customer: asaasCustomerId,
      remoteIp,
      creditCard: { holderName, number, expiryMonth: String(expiryMonth).padStart(2, "0"), expiryYear: String(expiryYear), ccv: cvv },
      creditCardHolderInfo: {
        name: holderName,
        email: email ?? user?.email ?? "",
        cpfCnpj: finalCpf,
        postalCode: address.postal_code,
        addressNumber: address.number,
        phone: finalPhone,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "falha ao tokenizar cartão" }, { status: 400 });
  }

  await userRef.set(
    { asaas_customer_id: asaasCustomerId, cpf: finalCpf, phone: finalPhone, updated_at: FieldValue.serverTimestamp() },
    { merge: true }
  );

  return NextResponse.json({
    token: tokenized.creditCardToken,
    lastFour: tokenized.creditCardNumber,
    brand: tokenized.creditCardBrand,
  });
}
