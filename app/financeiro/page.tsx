import { AdminShell } from "@/components/AdminShell";

export default function FinanceiroPage() {
  return (
    <AdminShell>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1F2937", margin: "0 0 12px 0" }}>Financeiro</h1>
      <p style={{ fontSize: 14, color: "#6B7280" }}>
        Relatórios financeiros detalhados (splits, antecipação, saques) ficam pro Bloco 7 — é onde os pagamentos de verdade (mesmo que via Asaas mock) entram. O Dashboard já mostra receita por cidade dos pedidos concluídos.
      </p>
    </AdminShell>
  );
}
