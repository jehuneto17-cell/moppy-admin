"use client";

import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { db } from "@/lib/firebase";

type Kpis = { ordersToday: number; revenueMonth: number; cancelledMonth: number; activeCleaners: number };

function formatMoney(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [cityRevenue, setCityRevenue] = useState<{ city: string; value: number }[]>([]);

  useEffect(() => {
    async function load() {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [ordersSnap, cleanersSnap] = await Promise.all([
        getDocs(query(collection(db, "orders"))),
        getDocs(query(collection(db, "cleaners"), where("approval_status", "==", "approved"))),
      ]);

      let ordersToday = 0;
      let revenueMonth = 0;
      let cancelledMonth = 0;
      const cityMap = new Map<string, number>();

      ordersSnap.docs.forEach((d) => {
        const o = d.data();
        const createdAt = o.created_at?.toDate ? o.created_at.toDate().toISOString() : o.created_at;
        if (createdAt >= startOfDay) ordersToday += 1;
        if (createdAt >= startOfMonth) {
          if (o.status === "completed") {
            revenueMonth += o.pricing?.gross_total ?? 0;
            const city = o.address?.city ?? "—";
            cityMap.set(city, (cityMap.get(city) ?? 0) + (o.pricing?.gross_total ?? 0));
          }
          if (o.status === "cancelled") cancelledMonth += 1;
        }
      });

      setKpis({ ordersToday, revenueMonth, cancelledMonth, activeCleaners: cleanersSnap.size });
      setCityRevenue(Array.from(cityMap.entries()).map(([city, value]) => ({ city, value })).sort((a, b) => b.value - a.value));
    }
    load();
  }, []);

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const maxCity = Math.max(1, ...cityRevenue.map((c) => c.value));

  return (
    <AdminShell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1F2937", margin: 0 }}>Olá, Admin</h1>
        <span style={{ fontSize: 14, color: "#9CA3AF" }}>{today.charAt(0).toUpperCase() + today.slice(1)}</span>
      </div>

      {!kpis && <p style={{ marginTop: 24, color: "#9CA3AF", fontSize: 14 }}>Carregando...</p>}

      {kpis && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 24 }}>
            <KpiCard label="Pedidos hoje" value={String(kpis.ordersToday)} />
            <KpiCard label="Receita do mês (concluídos)" value={formatMoney(kpis.revenueMonth)} />
            <KpiCard label="Cancelamentos do mês" value={String(kpis.cancelledMonth)} />
            <KpiCard label="Faxineiras aprovadas" value={String(kpis.activeCleaners)} />
          </div>

          <div style={{ background: "#fff", borderRadius: 8, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Receita por cidade (pedidos concluídos este mês)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
              {cityRevenue.length === 0 && <span style={{ fontSize: 13, color: "#9CA3AF" }}>Nenhum pedido concluído este mês ainda.</span>}
              {cityRevenue.map((c) => (
                <div key={c.city}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>{c.city}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1F2937" }}>{formatMoney(c.value)}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "#F3F4F6", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: "#A78BFA", width: `${(c.value / maxCity) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <div style={{ fontSize: 12, color: "#9CA3AF" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#1F2937", marginTop: 12 }}>{value}</div>
    </div>
  );
}
