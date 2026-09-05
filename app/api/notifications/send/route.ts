import { NextRequest, NextResponse } from "next/server";

import { adminAuth as auth, adminDb as db } from "@/lib/firebase-admin";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

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

    const decodedToken = await auth.verifyIdToken(idToken);
    const callerUid = decodedToken.uid;

    const payload: NotificationPayload = await req.json();
    const { userId, title, body, data } = payload;

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const fcmToken = userDoc.data()?.fcm_token;
    if (!fcmToken) {
      return NextResponse.json({ error: "No FCM token for user" }, { status: 400 });
    }

    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
      },
      body: JSON.stringify({
        to: fcmToken,
        sound: "default",
        title,
        body,
        data: data || {},
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Erro ao enviar notificação via Expo:", error);
      return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }

    const result = await response.json();
    console.log("✅ Notificação enviada:", result);

    return NextResponse.json({ success: true, message_id: result.id });
  } catch (error: any) {
    console.error("❌ Erro no endpoint de notificações:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
