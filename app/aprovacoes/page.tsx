"use client";

import { collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { useStore } from "@/contexts/StoreContext";
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
  const { showToast } = useStore();

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
      showToast(`${active.email} reprovado`, "error");
    } else {
      await updateDoc(doc(db, "cleaners", active.id), {
        approval_status: "approved",
        approval_date: serverTimestamp(),
        is_active: true,
        updated_at: serverTimestamp(),
      });
      showToast(`${active.email} aprovado`, "success");
    }
    setConfirming(null);
    setActiveId(null);
    setReason("");
  }

  return (
    <AdminShell>
      <h1 className="mb-6 text-[28px] font-bold text-ink">Aprovações pendentes</h1>

      {rows === null && <p className="text-sm text-faint">Carregando...</p>}
      {rows?.length === 0 && <p className="mt-20 text-center text-sm text-muted">Nenhum item nesta fila agora.</p>}

      {rows && rows.length > 0 && (
        <div className="flex gap-4">
          <div className="flex-1 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="grid grid-cols-[56px_2fr_1.5fr_1.5fr_100px] border-b border-border bg-surface px-4 py-3">
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
                  className={`grid grid-cols-[56px_2fr_1.5fr_1.5fr_100px] items-center border-b border-gray-100 px-4 py-3 transition-colors ${isActive ? "bg-brand-tint" : "bg-white hover:bg-surface"}`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tint-strong text-xs font-bold text-brand">{initials}</div>
                  <span className="text-xs text-ink">{row.email}</span>
                  <span className="text-xs text-muted">{row.documents?.cpf_document?.cpf_number ?? "—"}</span>
                  <span className="text-xs text-muted">{formatDate(row.created_at)}</span>
                  <button
                    onClick={() => {
                      setActiveId(row.id);
                      setConfirming(null);
                      setReason("");
                    }}
                    className={`h-7 rounded-md border border-brand px-3 text-xs font-medium transition-colors ${isActive ? "bg-brand text-white" : "bg-white text-brand hover:bg-brand-tint"}`}
                  >
                    Revisar
                  </button>
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
                className="w-[380px] self-start rounded-lg bg-white p-6 shadow-sm"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-ink">{active.email}</h2>
                    <p className="mt-1 text-xs text-faint">CPF {active.documents?.cpf_document?.cpf_number ?? "—"}</p>
                  </div>
                  <button onClick={() => setActiveId(null)} className="text-faint hover:text-ink">
                    ✕
                  </button>
                </div>

                <p className="mt-5 mb-2 text-xs font-medium tracking-wide text-muted uppercase">Documentos</p>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(DOC_LABELS).map(([key, label]) => {
                    const docEntry = active.documents?.[key];
                    return (
                      <div key={key} className="flex justify-between rounded-lg border border-border px-3 py-2.5">
                        <span className="text-sm text-ink">{label}</span>
                        <span className={`text-xs ${docEntry ? "text-success" : "text-danger"}`}>{docEntry ? "Enviado" : "Faltando"}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-5 mb-2 text-xs font-medium tracking-wide text-muted uppercase">Decisão</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirming("approve")}
                    className={`flex-1 rounded-lg border-2 p-3 text-sm font-bold transition-colors ${confirming === "approve" ? "border-success bg-success-bg text-success-dark" : "border-border bg-white text-muted"}`}
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => setConfirming("reject")}
                    className={`flex-1 rounded-lg border-2 p-3 text-sm font-bold transition-colors ${confirming === "reject" ? "border-danger bg-danger-bg text-danger-dark" : "border-border bg-white text-muted"}`}
                  >
                    Reprovar
                  </button>
                </div>

                <AnimatePresence>
                  {confirming === "reject" && (
                    <motion.textarea
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 80 }}
                      exit={{ opacity: 0, height: 0 }}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Descreva o motivo para a faxineira poder corrigir"
                      className="mt-4 w-full resize-none rounded-md border border-border p-2.5 font-sans text-sm text-ink"
                    />
                  )}
                </AnimatePresence>

                {confirming && (
                  <button
                    onClick={() => handleDecide(confirming)}
                    disabled={confirming === "reject" && reason.trim().length < 5}
                    className="mt-4 h-11 w-full rounded-lg bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Salvar decisão
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AdminShell>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium text-muted">{children}</span>;
}
