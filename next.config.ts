import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mock do Asaas vive em shared/mocks (workspace @moppy/shared) — Next precisa
  // compilar o TS de lá também, não só o que está dentro de apps/web-admin.
  transpilePackages: ["@moppy/shared"],
};

export default nextConfig;
