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
2. 🟡 Etapa 8 (Implementação) — Blocos 1-7 + 4.5 + 8 completos (ver IMPLEMENTATION-PLAN.md), próximo é Bloco 9 (Contas Reais)
3. ⏳ Renderizar 54 telas em Claude Designer (paralelo com código)
4. ⏳ Bloco 9 (Contas Reais) — Firebase Blaze, Cloudinary, Asaas, Vercel Deploy, EAS Build
5. ⏳ QA & Segurança (Etapas 9 e 10)

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
- 2026-08-27: Bloco 7 (Pagamentos) completo — cron D-1 + retries, webhook idempotente, captura+split via admin, wallet com liberação D+15, saque, Carteira/Saque reais no mobile (F16/F17). Testado ponta a ponta contra o emulador. C19-C25 (ciclo do pedido pós-candidatura) continuam pendentes — pagamento foi testado com pedidos seedados direto no emulador.
- 2026-08-27: Bloco 4.5 (Ciclo do Pedido) completo — C19 (escolher candidata), C20 (timeline real), C21 (código), C22/F18 (chat), C23 (confirmação → captura automática), C24/F14 (disputa), C25/F15 (avaliação), F06 (filtros), F11 (confirmar chegada), F12 (cronômetro), F13 (aguardando confirmação), A05 (disputas admin real). Testado com o SDK cliente autenticado (não só Admin SDK) — pegou um bug real: C19 usava `new Date()` em vez de `serverTimestamp()` e violava a regra do Firestore. Agora o pedido fecha o ciclo inteiro pelo próprio app, sem precisar de script pra simular estado.

**2026-08-28 — Firebase Setup + Google Login:**
- Projeto real `moppy-4ae68` criado, chaves do app Web em `.env.local`
- ✅ Auth (Email/Senha + Google) ativado
- ✅ Firestore ativado, rules + índices publicados via `firebase deploy`
- ✅ Service Account gerado (seguro em `.env.local`)
- ⏳ Storage bloqueado (precisa upgrade Blaze com cartão)
- ✅ Login com Google implementado (mobile pronto, web mobile-only)
- ✅ Cloudinary: pasta "Moppy" isolada, chaves extraídas
- ✅ Asaas sandbox: conta criada, API Key configurada
- ⏳ Google Maps e Vercel: deixados pra depois

**2026-08-29 — Bloco 8 Completo (Notificações FCM):**
- ✅ Hook `useNotifications.ts` — registra dispositivo, guarda token no Firestore
- ✅ Endpoint `POST /api/notifications/send` — dispara via Expo Push API
- ✅ Firestore Rules atualizada — permite guardar `fcm_token`
- ✅ Integração no app (`app/index.tsx`) — hook chamado ao iniciar
- ✅ `expo-notifications` instalado, TypeScript limpo
- ⏳ Testes: web bloqueado (Google auth mobile-only), emulador precisa EAS
- **Próximo:** Bloco 9 (contas reais, quando tiver cartão)
