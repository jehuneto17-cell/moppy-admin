import { AdminShell } from "@/components/AdminShell";

export default function DisputasPage() {
  return (
    <AdminShell>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1F2937", margin: "0 0 12px 0" }}>Disputas</h1>
      <p style={{ fontSize: 14, color: "#6B7280" }}>
        Nenhuma disputa pode ser aberta ainda — a tela de "Abrir Disputa" (C24) do app do cliente fica pro próximo passo. Esta tela funciona quando houver disputas reais pra gerenciar.
      </p>
    </AdminShell>
  );
}
