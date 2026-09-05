"use client";

import { collection, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { useStore } from "@/contexts/StoreContext";
import { db } from "@/lib/firebase";

type UserRow = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role?: string[];
  is_suspended?: boolean;
  created_at?: any;
};

function formatDate(ts: any) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [suspending, setSuspending] = useState(false);
  const [reason, setReason] = useState("");
  const { showToast } = useStore();

  useEffect(() => {
    return onSnapshot(collection(db, "users"), (snap) => setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserRow))));
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.email?.toLowerCase().includes(q) || u.name?.toLowerCase().includes(q) || u.phone?.includes(q));
  }, [users, search]);

  const active = users?.find((u) => u.id === activeId) ?? null;

  async function handleSuspend() {
    if (!active) return;
    await updateDoc(doc(db, "users", active.id), { is_suspended: true, suspension_reason: reason, updated_at: serverTimestamp() });
    showToast(`${active.name || active.email} suspenso`, "error");
    setSuspending(false);
    setReason("");
  }

  return (
    <AdminShell>
      <h1 className="mb-5 text-[28px] font-bold text-ink">Usuários</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por Nome, Email ou Telefone"
        className="mb-5 h-[42px] w-full max-w-[480px] rounded-md border border-border px-3.5 text-sm focus:outline-2 focus:outline-brand focus:outline-offset-2"
      />

      {users === null && <p className="text-sm text-faint">Carregando...</p>}
      {users !== null && filtered.length === 0 && <p className="mt-16 text-center text-sm text-muted">Nenhum usuário encontrado.</p>}

      {filtered.length > 0 && (
        <div className="flex gap-4">
          <div className="flex-1 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="grid grid-cols-[1.6fr_1.8fr_1fr_1fr] border-b border-border bg-surface px-4">
              {["Nome", "Email", "Status", "Cadastro"].map((h) => (
                <span key={h} className="flex h-10 items-center text-sm font-medium text-muted">
                  {h}
                </span>
              ))}
            </div>
            {filtered.map((u, i) => {
              const suspended = !!u.is_suspended;
              const isActive = u.id === activeId;
              return (
                <div
                  key={u.id}
                  onClick={() => {
                    setActiveId(u.id);
                    setSuspending(false);
                  }}
                  className={`grid min-h-[44px] cursor-pointer grid-cols-[1.6fr_1.8fr_1fr_1fr] items-center border-b border-gray-100 px-4 transition-colors ${isActive ? "bg-brand-tint" : i % 2 ? "bg-surface hover:bg-gray-100" : "bg-white hover:bg-surface"}`}
                >
                  <span className="text-xs text-ink">{u.name || "—"}</span>
                  <span className="text-xs text-muted">{u.email}</span>
                  <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium ${suspended ? "bg-danger-bg text-danger-dark" : "bg-success-bg text-success-dark"}`}>
                    {suspended ? "Suspenso" : "Ativo"}
                  </span>
                  <span className="text-xs text-muted">{formatDate(u.created_at)}</span>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.15 }}
                className="w-[360px] self-start rounded-lg bg-white p-6 shadow-sm"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-ink">{active.name || active.email}</h2>
                    <p className="mt-1 text-xs text-faint">{(active.role ?? []).join(", ") || "sem papel"}</p>
                  </div>
                  <button onClick={() => setActiveId(null)} className="text-faint hover:text-ink">
                    ✕
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Row label="Email" value={active.email} />
                  <Row label="Telefone" value={active.phone || "—"} />
                  <Row label="Cadastro" value={formatDate(active.created_at)} />
                </div>

                {!active.is_suspended && !suspending && (
                  <button
                    onClick={() => setSuspending(true)}
                    className="mt-5 h-11 w-full rounded-lg border border-danger bg-white text-sm font-bold text-danger transition-colors hover:bg-danger-bg"
                  >
                    Suspender conta
                  </button>
                )}
                {active.is_suspended && (
                  <div className="mt-5 rounded-lg bg-danger-bg p-3 text-center text-sm text-danger-dark">Conta suspensa</div>
                )}
                {suspending && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                    <label className="mb-1.5 block text-xs font-medium text-muted">Motivo da suspensão</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full resize-none rounded-md border border-border p-2.5 font-sans text-sm"
                    />
                    <button
                      onClick={handleSuspend}
                      disabled={reason.trim().length < 5}
                      className="mt-3 h-10 w-full rounded-lg bg-danger text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:bg-red-300"
                    >
                      Confirmar suspensão
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AdminShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[100px_1fr]">
      <span className="text-xs text-faint">{label}</span>
      <span className="text-[13px] font-medium text-ink">{value}</span>
    </div>
  );
}
