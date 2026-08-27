import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Em produção, FIREBASE_SERVICE_ACCOUNT vem do .env (JSON da service account).
// Contra o emulador (dev local), basta o projectId — FIRESTORE_EMULATOR_HOST e
// FIREBASE_AUTH_EMULATOR_HOST (setados no .env.local) direcionam o SDK sozinhos.
const app = getApps().length
  ? getApps()[0]
  : initializeApp(
      process.env.FIREBASE_SERVICE_ACCOUNT
        ? { credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) }
        : { projectId: process.env.GCLOUD_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID }
    );

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
