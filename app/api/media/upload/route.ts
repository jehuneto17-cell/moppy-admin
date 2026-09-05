import { NextRequest, NextResponse } from "next/server";

import { uploadMedia } from "@/lib/cloudinary";
import { adminAuth } from "@/lib/firebase-admin";

// Pastas com documento sensível (KYC) sempre sobem como "authenticated" (URL
// assinada), mesmo que o cliente tente mandar sensitive=false — a decisão de
// privacidade não pode depender do app, só do prefixo da pasta.
function isSensitiveFolder(folder: string) {
  return folder === "kyc" || folder.startsWith("kyc/");
}

export async function POST(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) return NextResponse.json({ error: "não autenticado" }, { status: 401 });

  try {
    await adminAuth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "token inválido" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const folder = form.get("folder");

  if (!(file instanceof File) || typeof folder !== "string" || !folder) {
    return NextResponse.json({ error: "file e folder são obrigatórios" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;

  const result = await uploadMedia(dataUri, folder, isSensitiveFolder(folder));
  return NextResponse.json(result);
}
