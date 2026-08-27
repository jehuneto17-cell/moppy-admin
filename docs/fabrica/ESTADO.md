# Estado do Projeto — Moppy

**Projeto:** Moppy — Marketplace de Faxina  
**Cliente:** Moppy  
**Data de Início:** 2026-08-23  
**Status:** 🟡 Estrutura Inicial

## Progresso

| Etapa | Status | Responsável | Data |
|-------|--------|-------------|------|
| 1. Descoberta | ✅ Completo | fab-briefing | 2026-08-23 |
| 2. Validação Mercado | ⏭️ Pulado | — | — |
| 3. Produto & Specs | ✅ Completo | fab-produto | 2026-08-23 |
| 4. Fluxos de Pagamento | ✅ Completo | fab-pagamentos | 2026-08-23 |
| 5. UX & User Flows | ✅ Completo (redesenhado) | fab-ux | 2026-08-23 |
| 6. Design System | ✅ Aprovado (Gate 5 — UI-SPEC) | fab-ui + Jehu | 2026-08-24 |
| 7. Arquitetura Técnica | ✅ Completo | fab-arquiteto | 2026-08-23 |
| 8. Implementação | ⏳ Pronto | Jehu | — |
| 9. QA & Testes | ⏳ Aguardando | fab-qa | — |
| 10. Segurança | ⏳ Aguardando | fab-seguranca | — |

## Próximos Passos

1. ✅ Telas aprovadas (UI-SPEC.md)
2. ⏳ `/fabrica rodar` — Etapa 8 (Implementação) com Jehu
3. ⏳ Renderizar 54 telas em Claude Designer (paralelo com código)
4. ⏳ QA & Segurança (Etapas 9 e 10)

---

**Decisões Principais:**
- Stack: Expo + Next.js 14 + Firebase + Vercel + Asaas
- Banco: Firestore com 9 collections
- Deployment: EAS (mobile), Vercel (web), Firebase (db)

**Bloqueadores:** Nenhum  

**Notas:** 
- Etapa 7 aprovada por Jehu em 2026-08-23
- Arquitetura ARCHITECTURE.md e DATABASE.md prontos
- 2026-08-24: USER-FLOWS.md redesenhado por fab-ux com referências Mobbin (40/54 telas com match direto)
- 2026-08-24: UI-SPEC.md gerado + fab-revisor + correções aplicadas:
  - ✅ Preços base R$90 (C11/C12/C14/F07)
  - ✅ Cores primárias roxo #7C3AED (20 linhas de DESIGN SYSTEM)
  - ✅ Tab bar definido (Cliente: Home|Perfil, Faxineira: Buscar|Agenda|Carteira|Perfil)
  - ✅ C25 separada em C25 (Avaliação) + C26 (Perfil)
  - ✅ 55 prompts prontos (26 Cliente + 20 Faxineira + 9 Admin)
- **Gate 5 (UI-SPEC) aprovado por Jehu em 2026-08-24**
  - 55 prompts prontos (26 Cliente + 20 Faxineira + 9 Admin)
  - Cores primárias roxo #7C3AED, preços base R$90 com taxa R$1,82
  - Tab bar definido (Cliente: Home|Perfil, Faxineira: Buscar|Agenda|Carteira|Perfil)
  - Todas as telas têm ponto de entrada claro
- **Etapa 8 (Implementação) liberada**
