"use client";

import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { db } from "@/lib/firebase";

type Kpis = {
  ordersToday: number;
  ordersYesterday: number;
  revenueMonth: number;
  revenuePrevMonth: number;
  cancelledMonth: number;
  cancelledPrevMonth: number;
  activeCleaners: number;
};

function formatMoney(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function trendOf(current: number, previous: number): { pct: string; up: boolean } | null {
  if (previous === 0) return null;
  const diff = ((current - previous) / previous) * 100;
  return { pct: `${diff >= 0 ? "+" : ""}${diff.toFixed(0)}%`, up: diff >= 0 };
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [cityRevenue, setCityRevenue] = useState<{ city: string; value: number }[]>([]);
  const [daily, setDaily] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfYesterday = new Date(startOfDay.getTime() - 86400000);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const dayMs = 86400000;
      const start30 = new Date(startOfDay.getTime() - 29 * dayMs);

      const [ordersSnap, cleanersSnap] = await Promise.all([
        getDocs(query(collection(db, "orders"))),
        getDocs(query(collection(db, "cleaners"), where("approval_status", "==", "approved"))),
      ]);

      let ordersToday = 0;
      let ordersYesterday = 0;
      let revenueMonth = 0;
      let revenuePrevMonth = 0;
      let cancelledMonth = 0;
      let cancelledPrevMonth = 0;
      const cityMap = new Map<string, number>();
      const dailyCounts = new Array(30).fill(0);

      ordersSnap.docs.forEach((d) => {
        const o = d.data();
        const createdAt: Date = o.created_at?.toDate ? o.created_at.toDate() : new Date(o.created_at);
        if (createdAt >= startOfDay) ordersToday += 1;
        else if (createdAt >= startOfYesterday) ordersYesterday += 1;

        if (createdAt >= start30) {
          const idx = Math.floor((createdAt.getTime() - start30.getTime()) / dayMs);
          if (idx >= 0 && idx < 30) dailyCounts[idx] += 1;
        }

        if (createdAt >= startOfMonth) {
          if (o.status === "completed") {
            revenueMonth += o.pricing?.gross_total ?? 0;
            const city = o.address?.city ?? "—";
            cityMap.set(city, (cityMap.get(city) ?? 0) + (o.pricing?.gross_total ?? 0));
          }
          if (o.status === "cancelled") cancelledMonth += 1;
        } else if (createdAt >= startOfPrevMonth) {
          if (o.status === "completed") revenuePrevMonth += o.pricing?.gross_total ?? 0;
          if (o.status === "cancelled") cancelledPrevMonth += 1;
        }
      });

      setKpis({
        ordersToday,
        ordersYesterday,
        revenueMonth,
        revenuePrevMonth,
        cancelledMonth,
        cancelledPrevMonth,
        activeCleaners: cleanersSnap.size,
      });
      setCityRevenue(Array.from(cityMap.entries()).map(([city, value]) => ({ city, value })).sort((a, b) => b.value - a.value));
      setDaily(dailyCounts);
    }
    load();
  }, []);

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const maxCity = Math.max(1, ...cityRevenue.map((c) => c.value));
  const maxDaily = Math.max(1, ...daily);
  const linePoints = daily
    .map((v, i) => `${(i / Math.max(1, daily.length - 1)) * 600},${200 - (v / maxDaily) * 180}`)
    .join(" ");
  const lineArea = `0,200 ${linePoints} 600,200`;

  return (
    <AdminShell>
      <div className="flex items-end justify-between">
        <h1 className="text-[28px] font-bold text-ink">Olá, Admin</h1>
        <span className="text-sm text-faint">{today.charAt(0).toUpperCase() + today.slice(1)}</span>
      </div>

      {!kpis && <p className="mt-6 text-sm text-faint">Carregando...</p>}

      {kpis && (
        <>
          <div className="mt-6 grid grid-cols-4 gap-4">
            <KpiCard label="Pedidos hoje" value={String(kpis.ordersToday)} trend={trendOf(kpis.ordersToday, kpis.ordersYesterday)} />
            <KpiCard label="Receita do mês (concluídos)" value={formatMoney(kpis.revenueMonth)} trend={trendOf(kpis.revenueMonth, kpis.revenuePrevMonth)} />
            <KpiCard label="Cancelamentos do mês" value={String(kpis.cancelledMonth)} trend={trendOf(kpis.cancelledMonth, kpis.cancelledPrevMonth)} invertTrendColor />
            <KpiCard label="Faxineiras aprovadas" value={String(kpis.activeCleaners)} trend={null} />
          </div>

          <div className="mt-4 grid grid-cols-[3fr_2fr] gap-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="text-sm font-bold text-ink">Pedidos por dia (últimos 30 dias)</div>
              <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="mt-3 h-[220px] w-full">
                <polyline points={linePoints} fill="none" stroke="#7C3AED" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={lineArea} fill="#7C3AED" fillOpacity={0.08} stroke="none" />
              </svg>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="text-sm font-bold text-ink">Receita por cidade</div>
              <div className="mt-5 flex flex-col gap-3">
                {cityRevenue.length === 0 && <span className="text-[13px] text-faint">Nenhum pedido concluído este mês ainda.</span>}
                {cityRevenue.map((c) => (
                  <div key={c.city}>
                    <div className="mb-1 flex justify-between">
                      <span className="text-xs text-muted">{c.city}</span>
                      <span className="text-xs font-bold text-ink">{formatMoney(c.value)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.value / maxCity) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full rounded-full bg-brand"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function KpiCard({
  label,
  value,
  trend,
  invertTrendColor,
}: {
  label: string;
  value: string;
  trend: { pct: string; up: boolean } | null;
  invertTrendColor?: boolean;
}) {
  const isGood = trend ? (invertTrendColor ? !trend.up : trend.up) : true;
  const trendColorClass = isGood ? "text-success" : "text-danger";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg bg-white p-5 shadow-sm">
      <div className="text-xs text-faint">{label}</div>
      <div className="mt-3 text-[32px] font-bold text-ink">{value}</div>
      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={trendColorClass}>
            <path d={trend.up ? "M12 19V5M5 12l7-7 7 7" : "M12 5v14M5 12l7 7 7-7"} />
          </svg>
          <span className={`text-xs font-bold ${trendColorClass}`}>{trend.pct}</span>
          <span className="text-xs text-faint">vs. mês anterior</span>
        </div>
      )}
    </motion.div>
  );
}
