"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Falha ao autenticar");
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (e: any) {
      setError(mapError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface">
      <form onSubmit={handleSubmit} className="w-[400px] rounded-lg bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Moppy" width={36} height={36} className="rounded-lg" />
          <h1 className="text-[28px] font-bold text-ink">Admin Moppy</h1>
        </div>

        <div className="mt-7">
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-ink">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@moppy.com"
              required
              className="w-full rounded-md border border-border px-3 py-2.5 text-sm text-ink focus:outline-2 focus:outline-brand focus:outline-offset-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-md border border-border px-3 py-2.5 text-sm text-ink focus:outline-2 focus:outline-brand focus:outline-offset-2"
            />
          </div>

          {error && <p className="mt-3 text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 h-11 w-full rounded-lg bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </main>
  );
}

function mapError(e: any) {
  switch (e?.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha incorretos.";
    case "auth/invalid-email":
      return "E-mail inválido.";
    default:
      return e?.message || "Não foi possível continuar. Tente novamente.";
  }
}
