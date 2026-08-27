"use client";

import { collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { db } from "@/lib/firebase";

type PendingCleaner = {
  id: string;
  email?: string;
  documents?: Record<string, { storage_url: string; cpf_number?: string }>;
  created_at?: any;
};

const DOC_LABELS: Record<string, string> = {
  id_document: "RG/CNH",
  cpf_document: "CPF",
  selfie: "Selfie",
  address_proof: "Comprovante de endereço",
};

function formatDate(ts: any) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AprovacoesPage() {
  const [rows, setRows] = useState<PendingCleaner[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [confirming, setConfirming] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    const q = query(collection(db, "cleaners"), where("approval_status", "==", "pending"));
    return onSnapshot(q, (snap) => setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PendingCleaner))));
  }, []);

  const active = rows?.find((r) => r.id === activeId) ?? null;

  async function handleDecide(decision: "approve" | "reject") {
    if (!active) return;
    if (decision === "reject") {
      await updateDoc(doc(db, "cleaners", active.id), {
        approval_status: "rejected",
        approval_rejection_reason: reason,
        rejection_date: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    } else {
      await updateDoc(doc(db, "cleaners", active.id), {
        approval_status: "approved",
        approval_date: serverTimestamp(),
        is_active: true,
        updated_at: serverTimestamp(),
      });
    }
    setConfirming(null);
    setActiveId(null);
    setReason("");
  }

  return (
    <AdminShell>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1F2937", margin: "0 0 24px 0" }}>Aprovações pendentes</h1>

      {rows === null && <p style={{ color: "#9CA3AF", fontSize: 14 }}>Carregando...</p>}
      {rows?.length === 0 && <p style={{ color: "#6B7280", fontSize: 14, marginTop: 80, textAlign: "center" }}>Nenhum item nesta fila agora.</p>}

      {rows && rows.length > 0 && (
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "56px 2fr 1.5fr 1.5fr 100px", padding: "12px 16px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
              <span />
              <HeaderCell>E-mail</HeaderCell>
              <HeaderCell>CPF</HeaderCell>
              <HeaderCell>Cadastro</HeaderCell>
              <span />
            </div>
            {rows.map((row) => {
              const isActive = row.id === activeId;
              const initials = (row.email ?? "?").slice(0, 2).toUpperCase();
              return (
                <div
                  key={row.id}
                  style={{ display: "grid", gridTemplateColumns: "56px 2fr 1.5fr 1.5fr 100px", padding: "12px 16px", alignItems: "center", borderBottom: "1px solid #F3F4F6", background: isActive ? "#F3E8FF" : "#fff" }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 9999, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#A78BFA" }}>{initials}</div>
                  <span style={{ fontSize: 12, color: "#1F2937" }}>{row.email}</span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{row.documents?.cpf_document?.cpf_number ?? "—"}</span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{formatDate(row.created_at)}</span>
                  <button
                    onClick={() => {
                      setActiveId(row.id);
                      setConfirming(null);
                      setReason("");
                    }}
                    style={{ height: 28, padding: "0 12px", borderRadius: 6, border: "1px solid #A78BFA", background: isActive ? "#A78BFA" : "#fff", color: isActive ? "#fff" : "#A78BFA", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
                  >
                    Revisar
                  </button>
                </div>
              );
            })}
          </div>

          {active && (
            <div style={{ width: 380, background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: 24, alignSelf: "flex-start" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937", margin: 0 }}>{active.email}</h2>
                  <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0 0" }}>CPF {active.documents?.cpf_document?.cpf_number ?? "—"}</p>
                </div>
                <button onClick={() => setActiveId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                  ✕
                </button>
              </div>

              <p style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", margin: "20px 0 8px 0", textTransform: "uppercase" }}>Documentos</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {Object.entries(DOC_LABELS).map(([key, label]) => {
                  const doc = active.documents?.[key];
                  return (
                    <div key={key} style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 14, color: "#1F2937" }}>{label}</span>
                      <span style={{ fontSize: 12, color: doc ? "#10B981" : "#EF4444" }}>{doc ? "Enviado" : "Faltando"}</span>
                    </div>
                  );
                })}
              </div>

              <p style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", margin: "20px 0 8px 0", textTransform: "uppercase" }}>Decisão</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setConfirming("approve")}
                  style={{ flex: 1, padding: 12, borderRadius: 8, border: `2px solid ${confirming === "approve" ? "#10B981" : "#E5E7EB"}`, background: confirming === "approve" ? "#D1FAE5" : "#fff", color: confirming === "approve" ? "#065F46" : "#6B7280", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  Aprovar
                </button>
                <button
                  onClick={() => setConfirming("reject")}
                  style={{ flex: 1, padding: 12, borderRadius: 8, border: `2px solid ${confirming === "reject" ? "#EF4444" : "#E5E7EB"}`, background: confirming === "reject" ? "#FEE2E2" : "#fff", color: confirming === "reject" ? "#991B1B" : "#6B7280", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  Reprovar
                </button>
              </div>

              {confirming === "reject" && (
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Descreva o motivo para a faxineira poder corrigir"
                  style={{ width: "100%", height: 80, marginTop: 16, padding: 10, border: "1px solid #E5E7EB", borderRadius: 6, fontFamily: "inherit", fontSize: 14, color: "#1F2937", boxSizing: "border-box", resize: "none" }}
                />
              )}

              {confirming && (
                <button
                  onClick={() => handleDecide(confirming)}
                  disabled={confirming === "reject" && reason.trim().length < 5}
                  style={{ width: "100%", height: 44, marginTop: 16, borderRadius: 8, border: "none", background: "#A78BFA", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
                >
                  Salvar decisão
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>{children}</span>;
}
