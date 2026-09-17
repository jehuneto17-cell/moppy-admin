import { adminDb } from "./firebase-admin";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

// Núcleo do envio, sem exigir idToken de chamador — usado direto por código do
// servidor (cron, webhook, lib/payments.ts) que não tem usuário autenticado
// fazendo a chamada. app/api/notifications/send/route.ts (chamado pelo mobile,
// com o próprio idToken do usuário) delega pra cá também, pra não duplicar a
// lógica de envio.
export async function sendPushNotification(userId: string, title: string, body: string, data?: Record<string, string>) {
  const userDoc = await adminDb.collection("users").doc(userId).get();
  const fcmToken = userDoc.data()?.fcm_token;
  if (!fcmToken) return { sent: false, reason: "sem fcm_token" };

  const response = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", "Accept-Encoding": "gzip, deflate" },
    body: JSON.stringify({ to: fcmToken, sound: "default", title, body, data: data || {} }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("[notifications] falha ao enviar via Expo:", error);
    return { sent: false, reason: "expo_error" };
  }

  const result = await response.json();
  return { sent: true, messageId: result.id };
}
