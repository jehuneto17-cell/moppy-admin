import { AdminShell } from "@/components/AdminShell";

export default function PrecosPage() {
  return (
    <AdminShell>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1F2937", margin: "0 0 12px 0" }}>Preços por Cidade</h1>
      <p style={{ fontSize: 14, color: "#6B7280" }}>
        Hoje os preços em <code>apps/mobile/src/utils/price.ts</code> são fixos (mesmo valor em qualquer cidade). Tornar isso configurável por cidade aqui exige mover essa tabela pro Firestore — fica pro Bloco 7, junto com o resto de pagamentos.
      </p>
    </AdminShell>
  );
}
