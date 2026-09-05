"use client";

import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { useStore } from "@/contexts/StoreContext";
import { db } from "@/lib/firebase";

type Dispute = {
  id: string;
  order_id: string;
  client_id: string;
  cleaner_id: string;
  client_claim: { description: string; photos: string[] };
  cleaner_response: { description: string; photos: string[] } | null;
  status: "open" | "responded" | "decided";
  created_at: { seconds: number } | null;
};

const STATUS_LABEL: Record<Dispute["status"], { label: string; classes: string }> = {
  open: { label: "Novo", classes: "bg-danger-bg text-danger-dark" },
  responded: { label: "Em análise", classes: "bg-warning-bg text-warning-dark" },
  decided: { label: "Resolvido", classes: "bg-success-bg text-success-dark" },
};

function formatMoney(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(ts: { seconds: number } | null) {
  if (!ts) return "—";
  return new Date(ts.seconds * 1000).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DisputasPage() {
  const [disputes, setDisputes] = useState<Dispute[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<"Todos" | Dispute["status"]>("Todos");
  const [activeId, setActiveId] = useState<string | null>(null);

  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [decision, setDecision] = useState<"total" | "parcial" | "libera">("libera");
  const [partialAmount, setPartialAmount] = useState("");
  const [justification, setJustification] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const { showToast } = useStore();

  useEffect(() => {
    const q = query(collection(db, "disputes"), orderBy("created_at", "desc"));
    return onSnapshot(q, (snap) => setDisputes(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Dispute))));
  }, []);

  const active = disputes?.find((d) => d.id === activeId) ?? null;

  function openDispute(d: Dispute) {
    setActiveId(d.id);
    setDecision("libera");
    setPartialAmount("");
    setJustification("");
    setResultMsg(null);
    setPaymentAmount(null);
    getDoc(doc(db, "payments", d.order_id)).then((snap) => setPaymentAmount(snap.data()?.amount?.gross ?? null));
  }

  const filtered = disputes?.filter((d) => statusFilter === "Todos" || d.status === statusFilter) ?? [];

  async function handleApply() {
    if (!active || justification.trim().length < 10) return;
    setSubmitting(true);
    setResultMsg(null);
    try {
      const res = await fetch(`/api/disputes/${active.id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, partial_refund_amount: decision === "parcial" ? Number(partialAmount) : undefined, justification }),
      });
      const data = await res.json();
      const msg = res.ok ? "Disputa resolvida e processada via Asaas." : data.error;
      setResultMsg(msg);
      showToast(msg, res.ok ? "success" : "error");
    } catch {
      setResultMsg("Falha ao processar a decisão.");
      showToast("Falha ao processar a decisão.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const applyDisabled = submitting || justification.trim().length < 10 || (decision === "parcial" && !partialAmount);

  return (
    <AdminShell>
      <h1 className="mb-5 text-[28px] font-bold text-ink">Disputas</h1>

      <div className="mb-5 flex gap-2">
        {(["Todos", "open", "responded", "decided"] as const).map((s) => {
          const sel = statusFilter === s;
          const label = s === "Todos" ? "Todos" : STATUS_LABEL[s].label;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-[34px] rounded-full border px-4 text-[13px] transition-colors ${sel ? "border-brand bg-brand font-bold text-white" : "border-border bg-white font-medium text-ink-soft hover:bg-surface"}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {disputes === null && <p className="text-sm text-faint">Carregando...</p>}
      {disputes?.length === 0 && <p className="mt-20 text-center text-sm text-muted">Nenhuma disputa em aberto no momento.</p>}

      {disputes && disputes.length > 0 && (
        <div className="flex gap-4">
          <div className="flex-1 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="grid grid-cols-[1.2fr_1.6fr_1.2fr_130px] border-b border-border bg-surface px-4">
              {["Pedido", "Cliente", "Data", "Status"].map((h) => (
                <span key={h} className="flex h-10 items-center text-sm font-medium text-muted">
                  {h}
                </span>
              ))}
            </div>
            {filtered.map((d, i) => {
              const s = STATUS_LABEL[d.status];
              const isActive = d.id === activeId;
              return (
                <div
                  key={d.id}
                  onClick={() => openDispute(d)}
                  className={`grid min-h-[44px] cursor-pointer grid-cols-[1.2fr_1.6fr_1.2fr_130px] items-center border-b border-gray-100 px-4 transition-colors ${isActive ? "bg-brand-tint" : i % 2 ? "bg-surface hover:bg-gray-100" : "bg-white hover:bg-surface"}`}
                >
                  <span className="text-xs font-medium text-brand">{d.order_id.slice(0, 8)}</span>
                  <span className="text-xs text-ink">{d.client_id.slice(0, 8)}</span>
                  <span className="text-xs text-muted">{formatDate(d.created_at)}</span>
                  <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium ${s.classes}`}>{s.label}</span>
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
                className="w-[420px] self-start rounded-lg bg-white p-6 shadow-sm"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="mb-1 text-xs font-medium text-brand">Disputa do pedido {active.order_id.slice(0, 8)}</p>
                    <h2 className="text-xl font-bold text-ink">{paymentAmount != null ? formatMoney(paymentAmount) : "—"}</h2>
                  </div>
                  <button onClick={() => setActiveId(null)} className="text-faint hover:text-ink">
                    ✕
                  </button>
                </div>

                <div className="mt-4 rounded-lg border border-border bg-surface p-3.5">
                  <p className="mb-2 text-xs font-bold tracking-wide text-ink uppercase">Alegação do cliente</p>
                  <p className="text-sm leading-relaxed text-ink-soft">{active.client_claim.description}</p>
                  {active.client_claim.photos.length > 0 && <p className="mt-2 text-xs text-faint">{active.client_claim.photos.length} foto(s) anexada(s)</p>}
                </div>

                <div className="mt-3 rounded-lg border border-border bg-surface p-3.5">
                  <p className="mb-2 text-xs font-bold tracking-wide text-ink uppercase">Resposta da faxineira</p>
                  <p className="text-sm leading-relaxed text-ink-soft">{active.cleaner_response?.description ?? "Ainda não respondeu."}</p>
                </div>

                {active.status !== "decided" ? (
                  <>
                    <p className="mt-4 mb-2 text-xs font-medium tracking-wide text-muted uppercase">Decisão</p>
                    {(
                      [
                        { key: "libera", label: "Libera pagamento à faxineira" },
                        { key: "parcial", label: "Reembolso parcial" },
                        { key: "total", label: `Reembolso total ao cliente${paymentAmount != null ? ` (${formatMoney(paymentAmount)})` : ""}` },
                      ] as const
                    ).map((d) => {
                      const sel = decision === d.key;
                      return (
                        <button
                          key={d.key}
                          onClick={() => setDecision(d.key)}
                          className={`mb-2 block w-full rounded-lg border-2 p-3 text-left transition-colors ${sel ? "border-brand bg-brand-tint" : "border-border bg-white"}`}
                        >
                          <span className="text-sm font-medium text-ink">{d.label}</span>
                          {d.key === "parcial" && sel && (
                            <input
                              value={partialAmount}
                              onChange={(e) => setPartialAmount(e.target.value)}
                              placeholder="R$ 0,00"
                              onClick={(e) => e.stopPropagation()}
                              className="mt-2 block h-[34px] w-[140px] rounded-md border border-border-strong px-2.5 text-sm"
                            />
                          )}
                        </button>
                      );
                    })}

                    <label className="mt-3 mb-1.5 block text-xs font-medium text-muted">Justificativa da decisão *</label>
                    <textarea
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="Explique a base da decisão."
                      className="w-full resize-none rounded-md border border-border p-2.5 font-sans text-sm"
                    />

                    {resultMsg && <p className={`mt-2 text-xs ${resultMsg.includes("resolvida") ? "text-success-dark" : "text-danger"}`}>{resultMsg}</p>}

                    <button
                      onClick={handleApply}
                      disabled={applyDisabled}
                      className="mt-4 h-11 w-full rounded-lg bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-[#A78BFA]"
                    >
                      {submitting ? "Processando..." : "Aplicar decisão"}
                    </button>
                  </>
                ) : (
                  <p className="mt-4 text-[13px] text-success-dark">Disputa já resolvida.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AdminShell>
  );
}
