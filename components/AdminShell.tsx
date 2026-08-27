"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS: Record<string, string> = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  check: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  alert: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01",
  dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
};

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/aprovacoes", label: "Aprovações", icon: "check" },
  { href: "/pedidos", label: "Pedidos", icon: "list" },
  { href: "/disputas", label: "Disputas", icon: "alert" },
  { href: "/financeiro", label: "Financeiro", icon: "dollar" },
  { href: "/precos", label: "Preços", icon: "tag" },
  { href: "/usuarios", label: "Usuários", icon: "users" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F9FAFB", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: 240, background: "#1F2937", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 20px 12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#A78BFA" }}>Moppy</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Admin</span>
        </div>
        <div style={{ flex: 1, padding: "12px 0", display: "flex", flexDirection: "column" }}>
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 20px",
                  borderLeft: `3px solid ${active ? "#A78BFA" : "transparent"}`,
                  background: active ? "rgba(167,139,250,0.18)" : "transparent",
                  color: active ? "#fff" : "#9CA3AF",
                  fontSize: 14,
                  fontWeight: active ? 700 : 400,
                  textDecoration: "none",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9CA3AF"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d={ICONS[item.icon]} />
                </svg>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 32, boxSizing: "border-box" }}>{children}</div>
    </div>
  );
}
