"use client";

import { collection, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
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
    setSuspending(false);
    setReason("");
  }

  return (
    <AdminShell>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1F2937", margin: "0 0 20px 0" }}>Usuários</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por Nome, Email ou Telefone"
        style={{ width: "100%", maxWidth: 480, height: 42, padding: "0 14px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, marginBottom: 20, boxSizing: "border-box" }}
      />

      {users === null && <p style={{ color: "#9CA3AF", fontSize: 14 }}>Carregando...</p>}
      {users !== null && filtered.length === 0 && <p style={{ color: "#6B7280", fontSize: 14, marginTop: 60, textAlign: "center" }}>Nenhum usuário encontrado.</p>}

      {filtered.length > 0 && (
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.8fr 1fr 1fr", padding: "0 16px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
              {["Nome", "Email", "Status", "Cadastro"].map((h) => (
                <span key={h} style={{ fontSize: 14, fontWeight: 500, color: "#6B7280", height: 40, display: "flex", alignItems: "center" }}>
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
                  style={{ display: "grid", gridTemplateColumns: "1.6fr 1.8fr 1fr 1fr", padding: "0 16px", alignItems: "center", minHeight: 44, borderBottom: "1px solid #F3F4F6", background: isActive ? "#F3E8FF" : i % 2 ? "#F9FAFB" : "#fff", cursor: "pointer" }}
                >
                  <span style={{ fontSize: 12, color: "#1F2937" }}>{u.name || "—"}</span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{u.email}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: suspended ? "#991B1B" : "#065F46", background: suspended ? "#FEE2E2" : "#D1FAE5", borderRadius: 999, padding: "3px 10px", width: "fit-content" }}>
                    {suspended ? "Suspenso" : "Ativo"}
                  </span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{formatDate(u.created_at)}</span>
                </div>
              );
            })}
          </div>

          {active && (
            <div style={{ width: 360, background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: 24, alignSelf: "flex-start" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937", margin: 0 }}>{active.name || active.email}</h2>
                  <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0 0" }}>{(active.role ?? []).join(", ") || "sem papel"}</p>
                </div>
                <button onClick={() => setActiveId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                  ✕
                </button>
              </div>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <Row label="Email" value={active.email} />
                <Row label="Telefone" value={active.phone || "—"} />
                <Row label="Cadastro" value={formatDate(active.created_at)} />
              </div>

              {!active.is_suspended && !suspending && (
                <button
                  onClick={() => setSuspending(true)}
                  style={{ width: "100%", height: 44, marginTop: 20, borderRadius: 8, border: "1px solid #EF4444", background: "#fff", color: "#EF4444", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  Suspender conta
                </button>
              )}
              {active.is_suspended && (
                <div style={{ marginTop: 20, textAlign: "center", padding: 12, borderRadius: 8, background: "#FEE2E2", color: "#991B1B", fontSize: 14 }}>Conta suspensa</div>
              )}
              {suspending && (
                <div style={{ marginTop: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", display: "block", marginBottom: 6 }}>Motivo da suspensão</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{ width: "100%", height: 80, padding: 10, border: "1px solid #E5E7EB", borderRadius: 6, fontFamily: "inherit", fontSize: 14, boxSizing: "border-box", resize: "none" }}
                  />
                  <button
                    onClick={handleSuspend}
                    disabled={reason.trim().length < 5}
                    style={{ width: "100%", height: 40, marginTop: 12, borderRadius: 8, border: "none", background: reason.trim().length < 5 ? "#FCA5A5" : "#EF4444", color: "#fff", fontSize: 14, fontWeight: 700, cursor: reason.trim().length < 5 ? "not-allowed" : "pointer" }}
                  >
                    Confirmar suspensão
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "100px 1fr" }}>
      <span style={{ fontSize: 12, color: "#9CA3AF" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#1F2937" }}>{value}</span>
    </div>
  );
}
