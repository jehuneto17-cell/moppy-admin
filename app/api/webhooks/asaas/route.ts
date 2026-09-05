import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { isEventProcessed, logPaymentEvent, pushPaymentStatus } from "@/lib/payments";

// O Asaas autentica o webhook devolvendo, em todo POST, o header `asaas-access-token`
// com o valor configurado no cadastro — não é `authorization: Bearer` (esse era o
// payload inventado do desenho antigo, ver PAYMENT-FLOW.md §3.2).
export async function POST(req: NextRequest) {
  if (req.headers.get("asaas-access-token") !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id: eventId, event, payment } = body ?? {};
  if (!eventId || !event || !payment?.externalReference) {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  const orderId = payment.externalReference;
  if (await isEventProcessed(orderId, eventId)) {
    return NextResponse.json({ status: "already_processed" });
  }

  await logPaymentEvent(orderId, { type: "webhook", status: "success", asaas_event_id: eventId, asaas_response: payment });

  switch (event) {
    case "PAYMENT_CONFIRMED":
      await pushPaymentStatus(orderId, "charge_success");
      break;
    case "PAYMENT_RECEIVED":
      // Liquidação na conta (D+30 ou antecipada) — só registra, não muda o estado do pedido.
      break;
    case "PAYMENT_REFUNDED": {
      const current = (await adminDb.collection("payments").doc(orderId).get()).data();
      if (current?.status === "refund_pending") {
        await pushPaymentStatus(orderId, current.split ? "partial_refund" : "refunded");
      }
      break;
    }
    case "PAYMENT_CHARGEBACK_REQUESTED":
      await pushPaymentStatus(orderId, "chargeback_requested");
      // Congela o saldo desse pedido: marca o crédito da carteira como não liberável
      // mesmo se D+15 já tiver passado. A trava real é o cron release-balance
      // checar esse campo antes de mover pending_release → available.
      await adminDb.collection("payments").doc(orderId).set({ balance_frozen: true }, { merge: true });
      break;
    case "PAYMENT_DELETED":
      // Cobrança removida do lado do Asaas — reconcilia no próximo /api/cron/reconcile.
      break;
    default:
      break;
  }

  return NextResponse.json({ status: "processed" });
}
