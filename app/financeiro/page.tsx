"use client";

import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { ArrowUpFromLine, Download, FileText, RotateCcw, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { FilterDropdown } from "@/components/FilterDropdown";
import { useStore } from "@/contexts/StoreContext";
import { db } from "@/lib/firebase";

type Row = {
  key: string;
  date: Date;
  tipo: "Comissão" | "Estorno" | "Saque";
  descricao: string;
  bruto: number | null;
  comissao: number | null;
  liquido: number;
  city: string | null;
};

const TIPO_STYLE: Record<Row["tipo"], string> = {
  Comissão: "bg-brand-tint-strong text-[#6D28D9]",
  Estorno: "bg-danger-bg text-danger-dark",
  Saque: "bg-gray-100 text-ink-soft",
};

function formatMoney(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(d: Date) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
function toDate(ts: any): Date | null {
  if (!ts) return null;
  return ts.toDate ? ts.toDate() : new Date(ts);
}
function statusHistoryTime(history: any[] | undefined, status: string): Date | null {
  const entry = history?.filter((h) => h.status === status).pop();
  return entry ? toDate(entry.timestamp) : null;
}

const PERIOD_OPTIONS = ["Este mês", "Mês anterior", "Últimos 90 dias", "Este ano"];

function periodRange(period: string): { start: Date; end: Date } {
  const now = new Date();
  if (period === "Mês anterior") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start, end };
  }
  if (period === "Últimos 90 dias") {
    return { start: new Date(now.getTime() - 90 * 86400000), end: new Date(now.getTime() + 86400000) };
  }
  if (period === "Este ano") {
    return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear() + 1, 0, 1) };
  }
  return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 1) };
}

export default function FinanceiroPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [period, setPeriod] = useState("Este mês");
  const [tipo, setTipo] = useState("Todos");
  const [city, setCity] = useState("Todas");
  const { showToast } = useStore();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [paymentsSnap, walletsSnap, ordersSnap] = await Promise.all([
        getDocs(collection(db, "payments")),
        getDocs(collection(db, "wallets")),
        getDocs(collection(db, "orders")),
      ]);

      const cityByOrderId = new Map<string, string>();
      ordersSnap.docs.forEach((o) => {
        const c = o.data().address?.city;
        if (c) cityByOrderId.set(o.id, c);
      });

      // collectionGroup em "transactions" não respeita a regra aninhada de
      // wallets/{id}/transactions neste projeto (mesmo problema já documentado
      // em firestore.rules pra cleaners/*/applications) — lemos por wallet.
      const withdrawDocs = (
        await Promise.all(walletsSnap.docs.map((w) => getDocs(collection(db, "wallets", w.id, "transactions"))))
      ).flatMap((snap) => snap.docs);

      const out: Row[] = [];

      paymentsSnap.docs.forEach((d) => {
        const p = d.data();
        const history = p.status_history;
        const orderCity = cityByOrderId.get(d.id) ?? null;

        if (p.split?.app_commission_amount != null) {
          const date = toDate(p.split.split_executed_at) ?? statusHistoryTime(history, "capture_success");
          if (date) {
            out.push({
              key: `${d.id}-comissao`,
              date,
              tipo: "Comissão",
              descricao: `Pedido ${d.id.slice(0, 8)}`,
              bruto: p.split.gross_total,
              comissao: p.split.app_commission_amount,
              liquido: p.split.app_commission_amount,
              city: orderCity,
            });
          }
        }

        if (p.status === "refunded" || p.status === "partial_refund") {
          const date = statusHistoryTime(history, p.status) ?? statusHistoryTime(history, "refunded") ?? statusHistoryTime(history, "partial_refund");
          const refundAmount = (p.amount?.gross ?? 0) - (p.split?.gross_total ?? 0);
          if (date && refundAmount > 0) {
            out.push({
              key: `${d.id}-estorno`,
              date,
              tipo: "Estorno",
              descricao: `Pedido ${d.id.slice(0, 8)} · estorno`,
              bruto: p.amount?.gross ?? null,
              comissao: null,
              liquido: -refundAmount,
              city: orderCity,
            });
          }
        }
      });

      withdrawDocs.forEach((d) => {
        const t = d.data();
        if (t.type !== "withdraw") return;
        const date = toDate(t.timestamp);
        if (!date) return;
        out.push({
          key: d.id,
          date,
          tipo: "Saque",
          descricao: "Transferência PIX para faxineira",
          bruto: null,
          comissao: null,
          liquido: -Math.abs(t.amount ?? 0),
          city: null,
        });
      });

      out.sort((a, b) => b.date.getTime() - a.date.getTime());
      if (!cancelled) {
        setRows(out);
        setCities(Array.from(new Set(Array.from(cityByOrderId.values()))).sort());
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const { start, end } = periodRange(period);
  const filtered = useMemo(() => {
    if (!rows) return [];
    return rows.filter(
      (r) => r.date >= start && r.date < end && (tipo === "Todos" || r.tipo === tipo) && (city === "Todas" || r.city === city)
    );
  }, [rows, start, end, tipo, city]);

  const totals = useMemo(() => {
    const comissao = filtered.filter((r) => r.tipo === "Comissão").reduce((s, r) => s + r.liquido, 0);
    const estorno = filtered.filter((r) => r.tipo === "Estorno").reduce((s, r) => s + r.liquido, 0);
    const saque = filtered.filter((r) => r.tipo === "Saque").reduce((s, r) => s + r.liquido, 0);
    const liquido = filtered.reduce((s, r) => s + r.liquido, 0);
    return { comissao, estorno, saque, liquido };
  }, [filtered]);

  function exportCsv() {
    const header = "Data,Tipo,Descrição,Cidade,Valor bruto,Comissão,Valor líquido\n";
    const body = filtered
      .map((r) => [formatDate(r.date), r.tipo, r.descricao, r.city ?? "", r.bruto ?? "", r.comissao ?? "", r.liquido].join(","))
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financeiro-${period.replace(/\s/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`CSV de ${period.toLowerCase()} exportado`, "success");
  }

  function exportPdf() {
    showToast("Abrindo impressão — escolha \"Salvar como PDF\" no destino", "info");
    setTimeout(() => window.print(), 150);
  }

  return (
    <AdminShell>
      <div className="mb-5 flex items-center justify-between print:hidden">
        <h1 className="text-[28px] font-bold text-ink">Financeiro</h1>
        <div className="flex gap-2">
          <button
            onClick={exportCsv}
            className="flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            <Download size={16} className="text-brand" />
            <span>CSV</span>
          </button>
          <button
            onClick={exportPdf}
            className="flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            <FileText size={16} className="text-brand" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-3 print:hidden">
        <FilterDropdown label="Período" value={period} options={PERIOD_OPTIONS} onChange={setPeriod} />
        <FilterDropdown label="Cidade" value={city} options={["Todas", ...cities]} onChange={setCity} />
        <FilterDropdown label="Tipo" value={tipo} options={["Todos", "Comissão", "Estorno", "Saque"]} onChange={setTipo} />
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <SummaryCard label="Total comissionado" value={formatMoney(totals.comissao)} colorClass="text-brand" iconBg="bg-brand-tint-strong" iconColor="text-brand" Icon={ArrowUpFromLine} loading={rows === null} />
        <SummaryCard label="Total estornos" value={formatMoney(totals.estorno)} colorClass="text-danger" iconBg="bg-danger-bg" iconColor="text-danger" Icon={RotateCcw} loading={rows === null} />
        <SummaryCard label="Total saques processados" value={formatMoney(totals.saque)} colorClass="text-muted" iconBg="bg-gray-100" iconColor="text-faint" Icon={Download} loading={rows === null} />
        <SummaryCard label="Resultado líquido" value={formatMoney(totals.liquido)} colorClass="text-ink" iconBg="bg-gray-100" iconColor="text-ink-soft" Icon={FileText} loading={rows === null} />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="grid grid-cols-[1.1fr_1.2fr_2fr_1fr_1fr_1fr] border-b border-border bg-surface px-4">
          {["Data", "Tipo", "Descrição", "Valor bruto", "Comissão", "Valor líquido"].map((h, i) => (
            <span key={h} className={`flex h-10 items-center text-sm font-medium text-muted ${i >= 3 ? "justify-end" : ""}`}>
              {h}
            </span>
          ))}
        </div>

        {rows === null && <p className="p-5 text-sm text-faint">Carregando...</p>}
        {rows !== null && filtered.length === 0 && <p className="p-10 text-center text-sm text-muted">Nenhuma movimentação neste período.</p>}

        {filtered.map((r, i) => (
          <div
            key={r.key}
            className={`grid min-h-[42px] grid-cols-[1.1fr_1.2fr_2fr_1fr_1fr_1fr] items-center gap-2 border-b border-gray-100 px-4 ${i % 2 === 1 ? "bg-surface" : "bg-white"}`}
          >
            <span className="text-xs text-muted">{formatDate(r.date)}</span>
            <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TIPO_STYLE[r.tipo]}`}>{r.tipo}</span>
            <span className="text-xs text-ink">{r.descricao}</span>
            <span className="text-right text-xs text-ink">{r.bruto != null ? formatMoney(r.bruto) : "—"}</span>
            <span className="text-right text-xs font-medium text-brand">{r.comissao != null ? formatMoney(r.comissao) : "—"}</span>
            <span className={`text-right text-xs font-bold ${r.liquido < 0 ? "text-danger" : "text-ink"}`}>{formatMoney(r.liquido)}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

function SummaryCard({
  label,
  value,
  colorClass,
  iconBg,
  iconColor,
  Icon,
  loading,
}: {
  label: string;
  value: string;
  colorClass: string;
  iconBg: string;
  iconColor: string;
  Icon: LucideIcon;
  loading: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon size={16} className={iconColor} />
        </div>
        <div className="text-xs font-medium text-muted">{label}</div>
      </div>
      {loading ? <div className="h-[22px] w-[70%] animate-moppy-pulse rounded bg-gray-200" /> : <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>}
    </motion.div>
  );
}
