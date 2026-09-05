"use client";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { useStore } from "@/contexts/StoreContext";
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

const STATUS_LABEL: Record<string, { label: string; classes: string }> = {
  draft: { label: "Rascunho", classes: "bg-gray-100 text-ink-soft" },
  open: { label: "Aberto", classes: "bg-brand-tint-strong text-[#6D28D9]" },
  confirmed: { label: "Agendado", classes: "bg-info-bg text-info-dark" },
  in_progress: { label: "Em andamento", classes: "bg-warning-bg text-warning-dark" },
  completed: { label: "Concluído", classes: "bg-success-bg text-success-dark" },
  disputed: { label: "Em disputa", classes: "bg-warning-bg text-warning-dark" },
  cancelled: { label: "Cancelado", classes: "bg-danger-bg text-danger-dark" },
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
  const [cancelledBy, setCancelledBy] = useState<"client" | "cleaner">("client");
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [captureMsg, setCaptureMsg] = useState<string | null>(null);
  const { showToast } = useStore();

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("created_at", "desc"));
    return onSnapshot(q, (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderRow))));
  }, []);

  const active = orders?.find((o) => o.id === activeId) ?? null;

  // O pagamento já pode ter sido cobrado (D-1) — cancelar aqui precisa acionar
  // estorno/compensação, não só marcar o pedido como cancelado no Firestore.
  async function handleCancel() {
    if (!active) return;
    setCancelSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${active.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, cancelled_by: cancelledBy }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "falha ao cancelar");
      showToast(`Pedido ${active.id.slice(0, 8)} cancelado (${data.paymentOutcome})`, "error");
      setCancelling(false);
      setReason("");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "falha ao cancelar", "error");
    } finally {
      setCancelSubmitting(false);
    }
  }

  async function handleCapture() {
    if (!active) return;
    setCapturing(true);
    setCaptureMsg(null);
    try {
      const res = await fetch(`/api/orders/${active.id}/capture`, { method: "POST" });
      const data = await res.json();
      const msg = res.ok ? "Pagamento liberado e repassado à faxineira." : data.error;
      setCaptureMsg(msg);
      showToast(msg, res.ok ? "success" : "error");
    } catch {
      setCaptureMsg("Falha ao capturar pagamento.");
      showToast("Falha ao capturar pagamento.", "error");
    } finally {
      setCapturing(false);
    }
  }

  return (
    <AdminShell>
      <h1 className="mb-5 text-[28px] font-bold text-ink">Pedidos</h1>

      {orders === null && <p className="text-sm text-faint">Carregando...</p>}
      {orders?.length === 0 && <p className="mt-20 text-center text-sm text-muted">Nenhum pedido ainda.</p>}

      {orders && orders.length > 0 && (
        <div className="flex gap-4">
          <div className="flex-1 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="grid grid-cols-[1.4fr_1.2fr_1.3fr_130px_110px] border-b border-border bg-surface px-4">
              {["ID", "Cidade", "Data", "Status", "Valor"].map((h) => (
                <span key={h} className="flex h-10 items-center text-sm font-medium text-muted">
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
                  className={`grid min-h-[44px] cursor-pointer grid-cols-[1.4fr_1.2fr_1.3fr_130px_110px] items-center border-b border-gray-100 px-4 transition-colors ${isActive ? "bg-brand-tint" : i % 2 ? "bg-surface hover:bg-gray-100" : "bg-white hover:bg-surface"}`}
                >
                  <span className="text-xs font-medium text-brand">{o.id.slice(0, 8)}</span>
                  <span className="text-xs text-ink">{o.address?.city}</span>
                  <span className="text-xs text-muted">{formatDate(o.scheduled_at)}</span>
                  <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium ${s.classes}`}>{s.label}</span>
                  <span className="text-right text-xs font-medium text-ink">{formatMoney(o.pricing?.gross_total ?? 0)}</span>
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
                    <p className="mb-1 text-xs font-medium text-brand">{active.id.slice(0, 8)}</p>
                    <h2 className="text-xl font-bold text-ink">{formatMoney(active.pricing?.gross_total ?? 0)}</h2>
                    <p className="mt-1 text-xs text-faint">{formatDate(active.scheduled_at)}</p>
                  </div>
                  <button onClick={() => setActiveId(null)} className="text-faint hover:text-ink">
                    ✕
                  </button>
                </div>

                <p className="mt-4 text-xs text-muted">
                  Status atual: <strong>{(STATUS_LABEL[active.status] ?? STATUS_LABEL.draft).label}</strong>
                </p>
                <p className="text-xs text-muted">Faxineira: {active.cleaner_id ? active.cleaner_id.slice(0, 8) : "nenhuma ainda"}</p>

                {active.status === "confirmed" && (
                  <>
                    <button
                      onClick={handleCapture}
                      disabled={capturing}
                      className="mt-5 h-11 w-full rounded-lg bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-[#A78BFA]"
                    >
                      {capturing ? "Liberando..." : "Liberar pagamento"}
                    </button>
                    {captureMsg && <p className="mt-2 text-xs text-muted">{captureMsg}</p>}
                  </>
                )}

                {!["completed", "cancelled"].includes(active.status) && (
                  <>
                    {!cancelling && (
                      <button
                        onClick={() => setCancelling(true)}
                        className="mt-5 h-11 w-full rounded-lg border border-danger bg-white text-sm font-bold text-danger transition-colors hover:bg-danger-bg"
                      >
                        Cancelar pedido
                      </button>
                    )}
                    {cancelling && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                        <label className="mb-1.5 block text-xs font-medium text-muted">Quem está cancelando</label>
                        <select
                          value={cancelledBy}
                          onChange={(e) => setCancelledBy(e.target.value as "client" | "cleaner")}
                          className="mb-3 w-full rounded-md border border-border p-2.5 font-sans text-sm"
                        >
                          <option value="client">Cliente</option>
                          <option value="cleaner">Faxineira</option>
                        </select>
                        <label className="mb-1.5 block text-xs font-medium text-muted">Motivo do cancelamento</label>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full resize-none rounded-md border border-border p-2.5 font-sans text-sm"
                        />
                        <button
                          onClick={handleCancel}
                          disabled={reason.trim().length < 5 || cancelSubmitting}
                          className="mt-3 h-10 w-full rounded-lg bg-danger text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:bg-red-300"
                        >
                          {cancelSubmitting ? "Cancelando..." : "Confirmar cancelamento"}
                        </button>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AdminShell>
  );
}
