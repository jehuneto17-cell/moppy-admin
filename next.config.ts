import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mock do Asaas vive em shared/mocks (workspace @moppy/shared) — Next precisa
  // compilar o TS de lá também, não só o que está dentro de apps/web-admin.
  transpilePackages: ["@moppy/shared"],
  // firebase-admin (via jwks-rsa → jose, ESM puro) quebra em runtime se o Turbopack
  // tentar empacotar — "require() of ES Module ... not supported" (achado testando
  // o primeiro deploy real na Vercel). Deixa esses pacotes de fora do bundle.
  serverExternalPackages: ["firebase-admin", "jwks-rsa", "jose", "google-auth-library"],
};

export default nextConfig;
