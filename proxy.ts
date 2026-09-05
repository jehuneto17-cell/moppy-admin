import { NextRequest, NextResponse } from "next/server";

import { adminAuth } from "@/lib/firebase-admin";

const PUBLIC_PATHS = ["/login"];

// O app mobile chama essas rotas de outra origem (Expo web em localhost:8081, e o
// build nativo em produção não manda Origin nenhum). Sem isso o navegador bloqueia
// a resposta mesmo a chamada tendo sido autenticada certinho (Firebase ID token) —
// achado testando o cadastro de cartão de verdade pela primeira vez, 2026-09-05.
function withCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin");
  if (origin) res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || isApi;

  if (isApi && req.method === "OPTIONS") {
    return withCors(req, new NextResponse(null, { status: 204 }));
  }
  if (isPublic) return withCors(req, NextResponse.next());

  const sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
