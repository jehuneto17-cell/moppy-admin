"use client";

import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { db } from "@/lib/firebase";

type OrderRow = {
  id: string;
  client_id: string;
  cleaner_id: string | null;
  status: string;
  scheduled_at: string;
  pricing: { gross_total: number };
  address: { city: string };
};

const STATUS_LABEL: Record<string, { label: string; bg: string; color: string }> = {
  draft: { label: "Rascunho", color: "#374151", bg: "#F3F4F6" },
  open: { label: "Aberto", color: "#6D28D9", bg: "#EDE9FE" },
  confirmed: { label: "Agendado", color: "#1E40AF", bg: "#DBEAFE" },
  in_progress: { label: "Em andamento", color: "#92400E", bg: "#FEF3C7" },
  completed: { label: "Concluído", color: "#065F46", bg: "#D1FAE5" },
  disputed: { label: "Em disputa", color: "#92400E", bg: "#FEF3C7" },
  cancelled: { label: "Cancelado", color: "#991B1B", bg: "#FEE2E2" },
};

function formatMoney(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [captureMsg, setCaptureMsg] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("created_at", "desc"));
    return onSnapshot(q, (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderRow))));
  }, []);

  const active = orders?.find((o) => o.id === activeId) ?? null;

  async function handleCancel() {
    if (!active) return;
    await updateDoc(doc(db, "orders", active.id), {
      status: "cancelled",
      cancellation: { cancelled_by: "system", cancelled_at: serverTimestamp(), cancellation_reason: reason },
      updated_at: serverTimestamp(),
    });
    setCancelling(false);
    setReason("");
  }

  async function handleCapture() {
    if (!active) return;
    setCapturing(true);
    setCaptureMsg(null);
    try {
      const res = await fetch(`/api/orders/${active.id}/capture`, { method: "POST" });
      const data = await res.json();
      setCaptureMsg(res.ok ? "Pagamento capturado e repassado à faxineira." : data.error);
    } catch {
      setCaptureMsg("Falha ao capturar pagamento.");
    } finally {
      setCapturing(false);
    }
  }

  return (
    <AdminShell>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1F2937", margin: "0 0 20px 0" }}>Pedidos</h1>

      {orders === null && <p style={{ color: "#9CA3AF", fontSize: 14 }}>Carregando...</p>}
      {orders?.length === 0 && <p style={{ color: "#6B7280", fontSize: 14, marginTop: 80, textAlign: "center" }}>Nenhum pedido ainda.</p>}

      {orders && orders.length > 0 && (
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 1.3fr 130px 110px", padding: "0 16px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
              {["ID", "Cidade", "Data", "Status", "Valor"].map((h) => (
                <span key={h} style={{ fontSize: 14, fontWeight: 500, color: "#6B7280", height: 40, display: "flex", alignItems: "center" }}>
                  {h}
                </span>
              ))}
            </div>
            {orders.map((o, i) => {
              const s = STATUS_LABEL[o.status] ?? STATUS_LABEL.draft;
              const isActive = o.id === activeId;
              return (
                <div
                  key={o.id}
                  onClick={() => {
                    setActiveId(o.id);
                    setCancelling(false);
                  }}
                  style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 1.3fr 130px 110px", padding: "0 16px", alignItems: "center", minHeight: 44, borderBottom: "1px solid #F3F4F6", background: isActive ? "#F3E8FF" : i % 2 ? "#F9FAFB" : "#fff", cursor: "pointer" }}
                >
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#A78BFA" }}>{o.id.slice(0, 8)}</span>
                  <span style={{ fontSize: 12, color: "#1F2937" }}>{o.address?.city}</span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{formatDate(o.scheduled_at)}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: s.color, background: s.bg, borderRadius: 999, padding: "3px 10px", width: "fit-content" }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#1F2937", textAlign: "right" }}>{formatMoney(o.pricing?.gross_total ?? 0)}</span>
                </div>
              );
            })}
          </div>

          {active && (
            <div style={{ width: 380, background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: 24, alignSelf: "flex-start" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "#A78BFA", margin: "0 0 4px 0" }}>{active.id.slice(0, 8)}</p>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937", margin: 0 }}>{formatMoney(active.pricing?.gross_total ?? 0)}</h2>
                  <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0 0" }}>{formatDate(active.scheduled_at)}</p>
                </div>
                <button onClick={() => setActiveId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                  ✕
                </button>
              </div>

              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 16 }}>
                Status atual: <strong>{(STATUS_LABEL[active.status] ?? STATUS_LABEL.draft).label}</strong>
              </p>
              <p style={{ fontSize: 12, color: "#6B7280" }}>Faxineira: {active.cleaner_id ? active.cleaner_id.slice(0, 8) : "nenhuma ainda"}</p>

              {active.status === "confirmed" && (
                <>
                  <button
                    onClick={handleCapture}
                    disabled={capturing}
                    style={{ width: "100%", height: 44, marginTop: 20, borderRadius: 8, border: "none", background: capturing ? "#C4B5FD" : "#A78BFA", color: "#fff", fontSize: 14, fontWeight: 700, cursor: capturing ? "not-allowed" : "pointer" }}
                  >
                    {capturing ? "Capturando..." : "Capturar pagamento"}
                  </button>
                  {captureMsg && <p style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>{captureMsg}</p>}
                </>
              )}

              {!["completed", "cancelled"].includes(active.status) && (
                <>
                  {!cancelling && (
                    <button
                      onClick={() => setCancelling(true)}
                      style={{ width: "100%", height: 44, marginTop: 20, borderRadius: 8, border: "1px solid #EF4444", background: "#fff", color: "#EF4444", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                    >
                      Cancelar pedido
                    </button>
                  )}
                  {cancelling && (
                    <div style={{ marginTop: 16 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", display: "block", marginBottom: 6 }}>Motivo do cancelamento</label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        style={{ width: "100%", height: 80, padding: 10, border: "1px solid #E5E7EB", borderRadius: 6, fontFamily: "inherit", fontSize: 14, boxSizing: "border-box", resize: "none" }}
                      />
                      <button
                        onClick={handleCancel}
                        disabled={reason.trim().length < 5}
                        style={{ width: "100%", height: 40, marginTop: 12, borderRadius: 8, border: "none", background: reason.trim().length < 5 ? "#FCA5A5" : "#EF4444", color: "#fff", fontSize: 14, fontWeight: 700, cursor: reason.trim().length < 5 ? "not-allowed" : "pointer" }}
                      >
                        Confirmar cancelamento
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
