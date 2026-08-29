import { NextRequest, NextResponse } from "next/server";

import { isEventProcessed, logPaymentEvent, pushPaymentStatus } from "@/lib/payments";

// Endpoint real do Asaas (Etapa 9). Enquanto o mock resolve tudo na hora (cron chama
// o processamento direto), este endpoint existe pra já estar pronto e testável via
// curl/script — idempotência por event_id, mesmo formato de payload esperado depois.
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.ASAAS_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { event_id, order_id, type, status, asaas_response } = body ?? {};
  if (!event_id || !order_id || !status) {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  if (await isEventProcessed(order_id, event_id)) {
    return NextResponse.json({ status: "already_processed" });
  }

  await logPaymentEvent(order_id, { type: type ?? "webhook", status: "success", asaas_event_id: event_id, asaas_response });
  await pushPaymentStatus(order_id, status, { last_webhook_status: status });

  return NextResponse.json({ status: "processed" });
}
