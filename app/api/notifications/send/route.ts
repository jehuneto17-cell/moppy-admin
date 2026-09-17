import { NextRequest, NextResponse } from "next/server";

import { adminAuth as auth } from "@/lib/firebase-admin";
import { sendPushNotification } from "@/lib/notifications";

type NotificationPayload = {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
};

export async function POST(req: NextRequest) {
  try {
    const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await auth.verifyIdToken(idToken);

    const payload: NotificationPayload = await req.json();
    const { userId, title, body, data } = payload;

    const result = await sendPushNotification(userId, title, body, data);
    if (!result.sent) {
      return NextResponse.json({ error: result.reason }, { status: result.reason === "sem fcm_token" ? 400 : 500 });
    }

    return NextResponse.json({ success: true, message_id: result.messageId });
  } catch (error: any) {
    console.error("❌ Erro no endpoint de notificações:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
