"use client";

import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
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

const STATUS_LABEL: Record<Dispute["status"], { label: string; bg: string; color: string }> = {
  open: { label: "Novo", bg: "#FEE2E2", color: "#991B1B" },
  responded: { label: "Em análise", bg: "#FEF3C7", color: "#92400E" },
  decided: { label: "Resolvido", bg: "#D1FAE5", color: "#065F46" },
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

  useEffect(() => {
    const q = query(collection(db, "disputes"), orderBy("created_at", "desc"));
    return onSnapshot(q, (snap) => setDisputes(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Dispute))));
  }, []);

  const active = disputes?.find((d) => d.id === activeId) ?? null;

  useEffect(() => {
    if (!active) return;
    setDecision("libera");
    setPartialAmount("");
    setJustification("");
    setResultMsg(null);
    getDoc(doc(db, "payments", active.order_id)).then((snap) => setPaymentAmount(snap.data()?.amount?.gross ?? null));
  }, [active?.id]);

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
      setResultMsg(res.ok ? "Disputa resolvida e processada via Asaas." : data.error);
    } catch {
      setResultMsg("Falha ao processar a decisão.");
    } finally {
      setSubmitting(false);
    }
  }

  const applyDisabled = submitting || justification.trim().length < 10 || (decision === "parcial" && !partialAmount);

  return (
    <AdminShell>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1F2937", margin: "0 0 20px 0" }}>Disputas</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["Todos", "open", "responded", "decided"] as const).map((s) => {
          const sel = statusFilter === s;
          const label = s === "Todos" ? "Todos" : STATUS_LABEL[s].label;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{ height: 34, padding: "0 16px", borderRadius: 999, border: `1px solid ${sel ? "#7C3AED" : "#E5E7EB"}`, background: sel ? "#7C3AED" : "#fff", color: sel ? "#fff" : "#374151", fontSize: 13, fontWeight: sel ? 700 : 500, cursor: "pointer" }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {disputes === null && <p style={{ color: "#9CA3AF", fontSize: 14 }}>Carregando...</p>}
      {disputes?.length === 0 && <p style={{ color: "#6B7280", fontSize: 14, marginTop: 80, textAlign: "center" }}>Nenhuma disputa em aberto no momento.</p>}

      {disputes && disputes.length > 0 && (
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.6fr 1.2fr 130px", padding: "0 16px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
              {["Pedido", "Cliente", "Data", "Status"].map((h) => (
                <span key={h} style={{ fontSize: 14, fontWeight: 500, color: "#6B7280", height: 40, display: "flex", alignItems: "center" }}>
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
                  onClick={() => setActiveId(d.id)}
                  style={{ display: "grid", gridTemplateColumns: "1.2fr 1.6fr 1.2fr 130px", padding: "0 16px", alignItems: "center", minHeight: 44, borderBottom: "1px solid #F3F4F6", background: isActive ? "#F3E8FF" : i % 2 ? "#F9FAFB" : "#fff", cursor: "pointer" }}
                >
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#A78BFA" }}>{d.order_id.slice(0, 8)}</span>
                  <span style={{ fontSize: 12, color: "#1F2937" }}>{d.client_id.slice(0, 8)}</span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{formatDate(d.created_at)}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: s.color, background: s.bg, borderRadius: 999, padding: "3px 10px", width: "fit-content" }}>{s.label}</span>
                </div>
              );
            })}
          </div>

          {active && (
            <div style={{ width: 420, background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: 24, alignSelf: "flex-start" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "#A78BFA", margin: "0 0 4px 0" }}>Disputa do pedido {active.order_id.slice(0, 8)}</p>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937", margin: 0 }}>{paymentAmount != null ? formatMoney(paymentAmount) : "—"}</h2>
                </div>
                <button onClick={() => setActiveId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                  ✕
                </button>
              </div>

              <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: 14, marginTop: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#1F2937", margin: "0 0 8px 0", textTransform: "uppercase" }}>Alegação do cliente</p>
                <p style={{ fontSize: 14, color: "#374151", margin: 0, lineHeight: 1.5 }}>{active.client_claim.description}</p>
                {active.client_claim.photos.length > 0 && <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>{active.client_claim.photos.length} foto(s) anexada(s)</p>}
              </div>

              <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: 14, marginTop: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#1F2937", margin: "0 0 8px 0", textTransform: "uppercase" }}>Resposta da faxineira</p>
                <p style={{ fontSize: 14, color: "#374151", margin: 0, lineHeight: 1.5 }}>{active.cleaner_response?.description ?? "Ainda não respondeu."}</p>
              </div>

              {active.status !== "decided" ? (
                <>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", margin: "16px 0 8px 0", textTransform: "uppercase" }}>Decisão</p>
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
                        style={{ display: "block", width: "100%", textAlign: "left", padding: 12, marginBottom: 8, borderRadius: 8, border: `2px solid ${sel ? "#7C3AED" : "#E5E7EB"}`, background: sel ? "#F3E8FF" : "#fff", cursor: "pointer" }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 500, color: "#1F2937" }}>{d.label}</span>
                        {d.key === "parcial" && sel && (
                          <input
                            value={partialAmount}
                            onChange={(e) => setPartialAmount(e.target.value)}
                            placeholder="R$ 0,00"
                            onClick={(e) => e.stopPropagation()}
                            style={{ display: "block", marginTop: 8, width: 140, height: 34, padding: "0 10px", border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 14 }}
                          />
                        )}
                      </button>
                    );
                  })}

                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", display: "block", marginTop: 12, marginBottom: 6 }}>Justificativa da decisão *</label>
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Explique a base da decisão."
                    style={{ width: "100%", height: 80, padding: 10, border: "1px solid #E5E7EB", borderRadius: 6, fontFamily: "inherit", fontSize: 14, boxSizing: "border-box", resize: "none" }}
                  />

                  {resultMsg && <p style={{ fontSize: 12, color: resultMsg.includes("resolvida") ? "#065F46" : "#EF4444", marginTop: 8 }}>{resultMsg}</p>}

                  <button
                    onClick={handleApply}
                    disabled={applyDisabled}
                    style={{ width: "100%", height: 44, marginTop: 16, borderRadius: 8, border: "none", background: applyDisabled ? "#C4B5FD" : "#7C3AED", color: "#fff", fontSize: 14, fontWeight: 700, cursor: applyDisabled ? "not-allowed" : "pointer" }}
                  >
                    {submitting ? "Processando..." : "Aplicar decisão"}
                  </button>
                </>
              ) : (
                <p style={{ fontSize: 13, color: "#065F46", marginTop: 16 }}>Disputa já resolvida.</p>
              )}
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
