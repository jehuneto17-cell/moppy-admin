"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, DollarSign, LayoutGrid, ListChecks, LogOut, Tag, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutGrid },
  { href: "/aprovacoes", label: "Aprovações", Icon: CheckCircle2 },
  { href: "/pedidos", label: "Pedidos", Icon: ListChecks },
  { href: "/disputas", label: "Disputas", Icon: AlertTriangle },
  { href: "/financeiro", label: "Financeiro", Icon: DollarSign },
  { href: "/precos", label: "Preços", Icon: Tag },
  { href: "/usuarios", label: "Usuários", Icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="flex h-screen bg-surface">
      <div className="flex w-60 shrink-0 flex-col bg-sidebar print:hidden">
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
          <Image src="/logo.png" alt="Moppy" width={32} height={32} className="rounded-lg" />
          <span className="text-lg font-bold text-white">Admin</span>
        </div>

        <div className="flex flex-1 flex-col py-3">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link key={href} href={href} className="relative flex items-center gap-3 py-[11px] pl-5 pr-5 text-sm">
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 border-l-[3px] border-brand bg-brand/[0.18]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon size={18} strokeWidth={2} className={`relative shrink-0 ${active ? "text-white" : "text-faint"}`} />
                <span className={`relative ${active ? "font-bold text-white" : "font-normal text-faint"}`}>{label}</span>
              </Link>
            );
          })}
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          {user?.email && <p className="mb-2 truncate text-xs text-faint">{user.email}</p>}
          <button onClick={signOut} className="flex items-center gap-2 text-sm font-medium text-faint transition-colors hover:text-white">
            <LogOut size={16} strokeWidth={2} />
            Sair
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">{children}</div>
    </div>
  );
}
