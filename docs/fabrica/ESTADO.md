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
| 4. Fluxos de Pagamento | ✅ **Gate 3 aprovado** (redesenhado sem pré-autorização) | fab-pagamentos + Jehu | 2026-09-04 |
| 5. UX & User Flows | ✅ Completo (redesenhado) | fab-ux | 2026-08-23 |
| 6. Design System | ✅ Aprovado (Gate 5 — UI-SPEC) | fab-ui + Jehu | 2026-08-24 |
| 7. Arquitetura Técnica | ✅ Completo | fab-arquiteto | 2026-08-23 |
| 8. Implementação | 🟡 Em andamento — Asaas real implementado e testado (bateria de sandbox rodada), falta EAS Build de produção + fluxo completo do pedido pela UI | Jehu | — |
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
- **2026-09-05 — Decisão: Google Maps trocado por Mapbox.** Não exige cartão pro free tier (25k usuários ativos/mês no mapa mobile, 100k geocoding/mês). `@rnmapbox/maps` instalado e configurado no mobile (plugin em `app.json`, aguardando token real). `moppy-admin/lib/mapbox.ts` criado com `geocodeAddress()` + `distanceKm()` (Haversine) pro cálculo de raio. Nenhuma dependência do Google Maps existia em código ainda (só doc) — nada pra remover além das referências em `ARCHITECTURE.md`/`CONTAS-NECESSARIAS.md`, já atualizadas. Falta: Jehu criar a conta Mapbox e colar o token público (`EXPO_PUBLIC_MAPBOX_TOKEN`/`MAPBOX_TOKEN`) e o token de downloads (`RNMapboxMapsDownloadToken` em `app.json`, só necessário no build nativo).
- **2026-09-05 — Mapbox 100% configurado.** Token público real colado, geocoding testado com `curl` de verdade (endereço real → coordenada certa, `accuracy: rooftop`). Token secreto `Downloads:Read` também real — mas em vez de colar direto no `app.json` (que é versionado no git), criado `moppy-mobile/app.config.js`: lê o `app.json` estático e injeta o token só em tempo de build a partir do `MAPBOX_DOWNLOADS_TOKEN` no `.env.local` (gitignored). Confirmado com `npx expo config --type public` que o valor real é resolvido. Só falta gerar o build nativo de verdade (EAS/`prebuild`) pra validar visualmente — não roda no Expo Go.
- **2026-09-05 — Mapa com pin + geocoding real ligados.** Criado `AddressMapPreview` (`src/components/ui/AddressMapPreview.tsx`, `@rnmapbox/maps`) — mapa estático com pin, some sozinho sem token/coordenada. Ligado nas duas telas de cadastro de endereço (`(client-onboarding)/endereco.tsx` = C04 do UI-SPEC, e `(client)/criar-pedido/endereco.tsx`), geocodificando com debounce (600ms) enquanto o cliente digita. `useAddresses.ts` trocou o geocoder nativo do device (`expo-location`, dependia do Google Play services no Android) por `src/services/mapbox.ts` (Mapbox Geocoding v6) — mesma API usada pelo admin. `distanceKm` (feed de pedidos da faxineira, `src/utils/geo.ts`) já estava ligado, sem mudança. `npx tsc --noEmit` sem novos erros. **Não testado num device/emulador de verdade ainda** — `@rnmapbox/maps` não roda no Expo Go, precisa de dev client (`npx expo run:android`/`eas build --profile development`) pra validar visualmente, e ainda falta o token real do Mapbox.
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
- ⏳ Asaas sandbox: **corrigido em 2026-09-04** — `.env.local` está com `ASAAS_API_KEY=mock`, não é chave real. Além disso o código ainda não faz nenhuma chamada real à API do Asaas (só existe o webhook receptor); todo pagamento do Bloco 7 foi testado 100% simulado via cron
- ⏳ Cloudinary: **corrigido em 2026-09-04** — também sem chave real (`.env.local` sem nenhuma variável Cloudinary no admin; `EXPO_PUBLIC_USE_MOCK_CLOUDINARY=true` no mobile). Upload é 100% mock hoje.

**2026-09-04 — Cloudinary real configurado e testado**
- Chaves reais recebidas (Cloud Name `dv62fwdtv`) — conta compartilhada com outros clientes do Jehu (emporio-minas, nova-era-tintas, sara-pastelaria)
- `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` só no `.env.local` do admin (nunca no mobile); `CLOUDINARY_CLOUD_NAME` no mobile também (pública)
- Implementado `lib/cloudinary.ts` + `POST /api/media/upload` (autenticado por Firebase ID token) no admin. Tudo sobe em `Moppy/<pasta>`, isolado das outras pastas da conta
- Documentos de KYC (pasta `kyc/...`) forçados a `type=authenticated` (URL assinada) no backend, independente do que o app mandar
- `EXPO_PUBLIC_USE_MOCK_CLOUDINARY=false` no mobile; `src/services/cloudinary.ts` atualizado pra chamar o endpoint real quando não está em mock
- Teste real feito: upload público caiu em `Moppy/test/`, upload de documento caiu em `Moppy/kyc/test/` como `authenticated`. Confirmado que nenhuma outra pasta da conta foi tocada. Arquivos de teste apagados depois
- Descoberto de passagem: `npx tsc --noEmit` no admin já falha hoje em `lib/asaas.ts` (`@moppy/shared/mocks/asaas` não resolve) — isso é anterior a essa mudança, mas confirma que a integração real do Asaas vai precisar dessa correção também

**2026-09-04 — Câmera/galeria real (expo-image-picker)**
- Instalado `expo-image-picker` (compatível com Expo SDK 57) + configurado no `app.json` com textos de permissão de câmera e galeria
- Onboarding de documentos (`documentos.tsx`): câmera real, frontal automaticamente na etapa de selfie
- Disputa (cliente e faxineira): seleção de foto pela galeria
- Chegada (`chegada.tsx`): selfie real com câmera frontal no caminho alternativo (GPS+foto)
- Todas as 4 telas agora chamam `uploadImage(folder, localUri)` de verdade, indo pro Cloudinary via `/api/media/upload`
- `npx tsc --noEmit` no mobile sem novos erros (só os 3 pré-existentes de typed routes, não relacionados)
- **Fim do gap:** onboarding de faxineira, disputa e confirmação de chegada agora capturam e sobem foto real, não mais simulação

**2026-09-04 — Decisão: Firebase Storage removido do escopo**
- KYC (RG, CPF, selfie, comprovante) e fotos de disputa já são enviados pelo Cloudinary no código (`uploadImage` em `src/services/cloudinary.ts`), não pelo Firebase Storage — o Storage nunca chegou a ser usado de fato, só existia planejado em `storage.rules` e na arquitetura.
- Decisão: manter assim. Quando implementarmos o upload real do Cloudinary, os documentos sensíveis usam delivery type `authenticated` (URL assinada) em vez de público.
- Efeito: elimina o upgrade Firebase Blaze do escopo — sobra só o Google Maps como pendência de cartão.
- `ARCHITECTURE.md` e `CONTAS-NECESSARIAS.md` atualizados. `storage.rules`/`firebase.json` (bloco storage) ficam sem uso, podem ser removidos depois se quiser limpar.
- ⏳ Google Maps e Vercel: deixados pra depois

**2026-08-29 — Bloco 8 Completo (Notificações FCM):**
- ✅ Hook `useNotifications.ts` — registra dispositivo, guarda token no Firestore
- ✅ Endpoint `POST /api/notifications/send` — dispara via Expo Push API
- ✅ Firestore Rules atualizada — permite guardar `fcm_token`
- ✅ Integração no app (`app/index.tsx`) — hook chamado ao iniciar
- ✅ `expo-notifications` instalado, TypeScript limpo
- ⏳ Testes: web bloqueado (Google auth mobile-only), emulador precisa EAS
- **Próximo:** Bloco 9 (contas reais, quando tiver cartão)

**2026-09-04 — Pagamento redesenhado: pré-autorização derrubada por restrição real do Asaas**
- **Origem: restrição, não preferência de design.** Testando ao vivo contra o sandbox real da Moppy (chave real, não mock), descobrimos que:
  - `POST /v3/payments` com `creditCardToken` **cobra na hora** (`status: "CONFIRMED"`) — não existe `authorizeOnly`
  - `POST /v3/creditCard/preAuthorization/config` foi **rejeitado** com `daysToExpire` = 1, 2, 3 e 5: a atividade econômica da Moppy (limpeza residencial) não permite pré-autorização >3 dias, e o intervalo válido é 3-25 dias — as duas regras juntas não deixam nenhum valor possível
  - Não é limitação de sandbox: o Asaas libera pré-autorização estendida só para hotelaria, locadora, cruzeiro e táxi. Conta de produção cairia na mesma regra
  - Jehu perguntou se dava pra cadastrar a atividade como "táxi"; **recusado** — declarar categoria falsa a instituição financeira é risco de bloqueio de conta em produção. Jehu concordou e pediu o redesenho formal
- **Novo modelo:** cobrança real em D-1 (mesmo cron, agora `charge` em vez de `preauth`) + **estorno** como caminho de volta. Cobrar depois do serviço foi descartado: uma recusa nesse ponto significa faxineira que trabalhou 4h de graça — churn do lado da oferta mata o marketplace
- **Sem subconta Asaas e sem `split[]` na cobrança** (formalizado): 100% entra na conta principal da Moppy, carteira é livro-razão no Firestore, saque sai por `POST /v3/transfers` com `pixAddressKey`. É o que o código sempre fez — o PAYMENT-PROFILE.md antigo é que falava em subconta sem nunca ter havido uma
- **Contrapartida:** a Moppy passa a segurar dinheiro de terceiros em trânsito. Exige trava de caixa diária (saldo Asaas ≥ soma das carteiras) e tratamento contábil do repasse (item para o contador antes da produção)
- Continuam valendo: comissão 15%, taxa Asaas 50/50, antecipação D+15 absorvida pelo app, "a liberar" → "disponível", saque mínimo R$20
- **Correção de doc:** autenticação real do Asaas é o header `access_token: <chave>` — `Authorization: Bearer` dá **401**. PAYMENT-IMPLEMENTATION.md estava errado nisso desde 2026-08-23
- **Documentos atualizados:** `PAYMENT-PROFILE.md` (reescrito), `PAYMENT-FLOW.md` (reescrito), `PAYMENT-IMPLEMENTATION.md` (reescrito), `PAYMENT-EDGE-CASES.md` (cabeçalho de correção com delta dos 20 casos + 4 casos novos; corpo ainda por reescrever)
- **Buracos reais encontrados no código durante o redesenho (implementar junto):**
  1. `runRefund` não checa o estado antes de estornar → admin clicando 2× estorna 2× (dinheiro real)
  2. Cancelamento no admin (`app/pedidos/page.tsx`) só escreve `status: "cancelled"` no Firestore, sem tocar no pagamento → cliente fica cobrado por pedido cancelado
  3. O cron D-1 só olha "amanhã": pedido confirmado às 23h para amanhã cedo, ou pedido para hoje, **nunca é cobrado**. Cobrança precisa disparar na confirmação quando faltam <24h
  4. `lib/split.ts` soma o custo de antecipação em `app_total` em vez de subtrair, e calcula a taxa sobre `split_base` em vez de `amount.gross`
  5. `lib/asaas.ts` não compila (`@moppy/shared/mocks/asaas` não resolve) — já registrado em 2026-09-04
- **Próximo:** Gate 3 (aprovação do Jehu) → sessão principal implementa `lib/asaas.ts` real seguindo `PAYMENT-IMPLEMENTATION.md` §4

**2026-09-04 — GATE 3 (Pagamento) APROVADO pelo Jehu**
- Aprovado via `/fabrica-gate aprovar`, sobre o redesenho sem pré-autorização registrado acima
- Checklist do Gate 3, conferido item a item:

| Item | Onde |
|---|---|
| Perfil de recebimento (CNPJ, volume, quem confere, tolerância a taxa) | PAYMENT-PROFILE.md §2, §3, §8 |
| Um fluxo principal escolhido e justificado em termos de negócio | PAYMENT-PROFILE.md §1 (cobrança D-1 vs. pós-serviço, com o trade-off da oferta) |
| Estados do pedido e quem muda cada um | PAYMENT-PROFILE.md §7 + PAYMENT-FLOW.md §2 |
| Efeito no "estoque" (slot na agenda da faxineira) em cada estado | PAYMENT-FLOW.md §2 |
| Casos de erro: valor divergente, duplicidade, abandono | PAYMENT-FLOW.md §4.2, §4.3, §4.5, §4.8 |
| Conciliação: como o dono sabe que recebeu | PAYMENT-PROFILE.md §8 (painel + cron 2h + trava de caixa) |
| Segredos listados e em variável de ambiente na Vercel | PAYMENT-PROFILE.md §9 + PAYMENT-IMPLEMENTATION.md §1.1 |

- `fab-auditor` não foi rodado: o Jehu aprovou direto, com o checklist conferido acima
- **Etapa 8 (Implementação) liberada para o pagamento real.** Ordem sugerida:
  1. `lib/asaas.ts` real (cliente HTTP com header `access_token`) + mocks alinhados
  2. Cron `preauth` → `charge`, com guarda por `externalReference` e cobrança na confirmação quando faltam <24h
  3. `runCapture` → `settleOrder` (sem chamada ao Asaas) e `runRefund` com guarda contra estorno duplicado
  4. Webhook real (`asaas-access-token`, payload `{id, event, payment}`, chargeback)
  5. Cancelamento com estorno no admin + `/api/cron/reconcile`
  6. Saque por `POST /v3/transfers` com a chave PIX real
  7. Bateria dos 12 cenários de sandbox (PAYMENT-IMPLEMENTATION.md §5.2) — o cenário 12 (taxas reais) é bloqueante para produção
- **Dívidas abertas, não bloqueantes do Gate:** reescrever o corpo do `PAYMENT-EDGE-CASES.md` (hoje só tem cabeçalho de correção); confirmar a base URL de produção do Asaas; itens do contador (tratamento do repasse) e do advogado

**2026-09-05 — `lib/asaas.ts` real implementado (itens 1-6 do Gate 3)**

Implementado e testado ao vivo contra o sandbox (não só compilado):

- `lib/asaas.ts`: cliente HTTP real (sem SDK) — `createCustomer`, `tokenizeCard`, `createCharge`, `getPayment`, `findByExternalReference`, `refundPayment`, `createPixTransfer`. Header `access_token`, `ASAAS_BASE_URL` configurável.
- `shared/mocks/asaas.ts`: reescrito com a mesma interface (mantém token `card_mock_declined` pra testar falha).
- `lib/split.ts`: **corrigidos os 2 bugs do Gate** — `computeSplit(base, gross)` agora recebe os dois valores (comissão/antecipação na base, taxa Asaas no gross) e `app_total` subtrai a antecipação em vez de somar.
- `lib/payments.ts`: `chargeOrder` (cria+cobra com guarda por `externalReference`, reusada pelo cron e pela cobrança imediata), `settleOrder` (era `runCapture`, não chama mais o Asaas), `runRefund` (real, **com guarda contra estorno duplicado** — recusa se já `refunded`/`partial_refund`/`refund_pending`), `cancelOrder` (novo — implementa os 5 cenários de cancelamento do PAYMENT-PROFILE.md §6, com compensação fixa de 30% pra faxineira em cancelamento <12h).
- `app/api/cron/charge/route.ts`: substitui `preauth`. `app/api/orders/[orderId]/charge/route.ts`: novo, cobra na hora se faltar <24h — chamado pelo mobile (`candidata.tsx`) logo depois de escolher a faxineira.
- `app/api/orders/[orderId]/confirm`, `/capture`, `/api/cron/auto-confirm`, `/api/disputes/[disputeId]/resolve`: trocados pra `settleOrder`/`runRefund` novos.
- `app/api/orders/[orderId]/cancel/route.ts`: **novo** — o cancelamento do admin (`app/pedidos/page.tsx`) só escrevia `status:"cancelled"` sem tocar no pagamento (bug #2 do Gate); agora aciona estorno/compensação de verdade, com seletor "cliente ou faxineira cancelou".
- `app/api/webhooks/asaas/route.ts`: reescrito — header `asaas-access-token`, payload real (`{id, event, payment}`), trata `PAYMENT_CHARGEBACK_REQUESTED` (congela o saldo via `balance_frozen`).
- `app/api/cron/reconcile/route.ts`: **novo** — sincroniza pagamentos em `charge_pending`/`refund_pending` há mais de 30min, e cancela (`cancelled_no_payment`) cobranças em `charge_failed` há mais de 6h sem troca de cartão.
- `app/api/cron/release-balance/route.ts`: `capture_success` → `settled`, e não libera saldo `balance_frozen` (chargeback).
- `app/api/wallets/withdraw/route.ts`: `createPixTransfer` real com a chave PIX da faxineira (mapeando `cpf/email/phone/random` → `CPF/EMAIL/PHONE/EVP`).
- **Descoberto no meio do caminho: não existia tokenização de cartão real nenhuma** — `src/services/asaas.ts` do mobile fingia localmente, sem nunca falar com um backend. Criado `app/api/cards/tokenize/route.ts` (cria cliente Asaas na primeira vez, tokeniza, nunca grava PAN/CVV) e `src/services/asaas.ts` do mobile agora chama esse endpoint de verdade. Isso também expôs que o cadastro de cliente nunca coletava CPF/telefone — adicionados na tela de cartão do onboarding (`(client-onboarding)/cartao.tsx`).
- `EXPO_PUBLIC_USE_MOCK_ASAAS=false` no mobile.
- `app/api/notifications/send/route.ts`: corrigido de passagem — import de uma função (`initializeFirebaseAdmin`) que não existe, quebrava `tsc`/build inteiro. Bug do Bloco 8, não relacionado a pagamento.
- `npx next build` do admin e `npx tsc --noEmit` do mobile passam limpos (só os 3 erros pré-existentes de typed routes no mobile, não relacionados).

**Testado ao vivo no sandbox (script direto, não só a UI):** criar cliente → tokenizar cartão → cobrar (`CONFIRMED` na hora) → achar por `externalReference` → consultar por id. Todos batem com o que o código espera.

**Achados operacionais novos (não são bugs, são realidade do sandbox):**
- **A taxa real ficou mais baixa que a estimativa:** cobrança de R$152,53 no Mastercard de teste voltou com taxa de **R$3,52**, não os ~R$5,07 estimados em `lib/split.ts`/`PAYMENT-PROFILE.md`. Só uma amostra — não mudei as constantes em cima disso, mas é sinal de que o Cenário 12 (bloqueante pra produção) vai mesmo mexer nos números.
- **Estorno não fica disponível na hora:** tentei estornar uma cobrança logo depois de criá-la e o Asaas recusou com "não é possível solicitar estorno no momento, tente novamente em alguns instantes" — é um delay do lado do Asaas, não um bug daqui. Testar fluxos de estorno no sandbox precisa esperar um pouco depois de cobrar.
- **Transferência PIX exige saldo liquidado:** testei um saque de R$5 e caiu "saldo insuficiente" — o dinheiro cobrado ainda não tinha virado saldo sacável na conta (isso é esperado, não testei o suficiente pra saber quanto tempo leva).

**Não testado (fica pra depois, exige mais que scripts diretos):** os 12 cenários completos do sandbox (retries, webhook duplicado, disputa, chargeback) e o fluxo end-to-end pela UI do app.

**2026-09-05 — Cenário 12 (taxa real) rodado, `lib/split.ts` corrigido:**
- Achado no meio do caminho: `ASAAS_API_KEY` no `.env.local` estava gravada com uma barra invertida sobrando antes do `$` (`\$aact_...`), invalidando a chave (401). Corrigido.
- 4 cobranças reais no sandbox (R$50, R$90, R$300, R$500) com o mesmo cartão tokenizado, comparando `value - netValue` do Asaas: taxa real bate com `R$0,49 + 2%` do valor (erro <R$0,004 em todas as amostras) — a fórmula antiga em `lib/split.ts` usava **3%**, não 2%. Corrigido pra `gross * 0.02`.
- Efeito: a Moppy vinha descontando mais taxa da faxineira do que o Asaas realmente cobra. `PAYMENT-PROFILE.md` (exemplo com R$150 base, taxa R$5,07) e o texto do custo de antecipação ainda citam a taxa antiga — não atualizados nesta sessão, só o código.
- 4 cobranças de teste ficaram no sandbox sem estorno (Asaas recusa refund imediato, delay conhecido) — sem impacto, é sandbox.
- **Cenário 12 considerado resolvido** para efeito de bloqueio do Gate — fórmula corrigida com amostra real. Se quiser mais confiança antes de produção, rodar de novo com valores maiores/cartões diferentes.

**Gap de ambiente pra testar pela UI — RESOLVIDO em 2026-09-05:** o `moppy-mobile/.env.local` já está com `EXPO_PUBLIC_FIREBASE_PROJECT_ID=moppy-4ae68` e `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=false` — confirmado em `src/services/firebase.ts:21-23` que só conecta no emulador se essa flag for `"true"`. Ou seja, o mobile já fala com o mesmo projeto real que o admin (`moppy-4ae68`), sem emulador. Falta apenas rodar o app (dev build/EAS, já que Google Auth é mobile-only) e confirmar login + chamada autenticada ponta a ponta pela UI.

**2026-09-05 — Primeiro EAS Build (dev client) gerado e testado num emulador real:**
- Build local via Gradle **falhou** — causa raiz: o caminho da pasta do projeto (`App de serviços`) tem "ç", e o compilador nativo (Clang/NDK) não lida com paths não-ASCII no Windows. Não é bug do código; contornado usando **EAS Cloud Build** (`eas build --platform android --profile development`), que roda em servidor Linux e não sofre desse problema.
- APK instalado no emulador (`moppy_dev`, AVD sem Google Play — por isso notificações push falham nele, esperado, não é bug).
- **Testado pela UI de verdade:** cadastro de cliente (Firebase Auth), onboarding de endereço com geocoding **Mapbox real** (mapa renderizou com pin correto — valida também o token de download do Mapbox em build nativo, pendência antiga), e tokenização de cartão real contra o Asaas sandbox (`POST /api/cards/tokenize` → 200 com o cartão aprovado `5162306219378829`).
- **Bug real encontrado e corrigido:** `ASAAS_API_KEY` no `.env.local` do admin começa com `$aact_...`. O parser de env do Next.js (`@next/env`, que faz expansão de variável `$VAR`) interpretava isso como referência a uma variável inexistente, **zerando a chave silenciosamente** — toda chamada ao Asaas vinha voltando 401 sem nenhum log explicando por quê. Corrigido escapando pra `\$aact_...`. **Atenção:** esse escape é necessário pro Next.js mas quebra leitura via `node --env-file` (que não expande `$`, então mantém a barra invertida como parte do valor) — scripts standalone (`tsx`) precisam remover o `\` inicial em runtime se usarem essa chave.
- Não foi possível completar o ciclo do pedido pela UI (criar pedido → faxineira candidatar → confirmar) nessa sessão — precisa de uma segunda conta (faxineira) e trava num loading do listener do Firestore não investigado a fundo (não parece bug de pagamento, mais provável rede do emulador).

**2026-09-05 — Bateria dos 12 cenários de sandbox (PAYMENT-IMPLEMENTATION.md §5.2) rodada contra o Asaas real:**
- Script standalone (`tsx` + `lib/payments.ts` direto, pedidos seedados no Firestore de produção) rodou os cenários 1, 2, 4, 5, 6, 7, 8, 11 contra o sandbox real (não mock).
- **Passaram de verdade:** 1 (fim a fim), 4 (webhook duplicado), 5 (cron 2x sem duplicar cobrança), 6 (cancelamento ≥12h, estorno total), 7 (cancelamento <12h, compensação 30%), 8 (disputa parcial + guarda contra estorno duplicado testada na prática), 11 (chargeback congela saldo, `release-balance` confirmado que pula registros congelados).
- **Achado no cenário 2 (cartão recusado):** o número documentado (`4000000000000010`) **hoje é aprovado** no sandbox do Asaas — a lista de cartões de teste mudou (o doc já alertava sobre isso desde antes). Precisa achar no painel do Asaas o número atual que recusa antes de considerar esse cenário validado.
- **Não testados:** 3 (troca de cartão <6h), 9 (auto-confirmação 24h), 10 (confirmado <24h) — a lógica de "quando" disparar fica nos endpoints de cron/confirmação, não nas funções de `lib/payments.ts` testadas; exigiria simular passagem real de tempo.
- Detalhe completo por cenário em `PAYMENT-EDGE-CASES.md` (seção "Bateria dos 12 cenários rodada de verdade").

**2026-09-05 — Autofill de cartão salvo no Google (moppy-mobile):**
- Jehu notou que outros apps sugerem os cartões salvos na conta Google do usuário ao cadastrar cartão. Isso é o Autofill nativo do Android, não Google Pay (que exigiria integração separada e suporte do Asaas a token do Google Pay) — só precisa marcar os campos certos.
- Adicionado `autoComplete`/`textContentType` nos campos de cartão em `app/(client-onboarding)/cartao.tsx` e `app/(client)/criar-pedido/novo-cartao.tsx`: número (`cc-number`), mês/ano (`cc-exp-month`/`cc-exp-year`), CVV (`cc-csc`, com `textContentType="none"` pra não guardar o CVV no autofill), nome do titular (`cc-name`), telefone (`tel`).
- `npx tsc --noEmit` sem novos erros (só os 3 pré-existentes de typed routes, não relacionados).
- **Tentativa de teste no emulador `moppy_dev` — abandonada por instabilidade da máquina, não do código:** o AVD na verdade *tem* Google Play Services + Play Store + conta Google logada (`jehuneto17@gmail.com`) com o serviço de Autofill ativo, então em tese daria pra validar. Mas mesmo com o emulador **reiniciado do zero**, o sistema apresentou "System UI isn't responding" e `dumpsys` travando (timeout) — sinal de que a máquina não tem recurso suficiente pra rodar esse emulador com Play Services de forma estável. Jehu decidiu não insistir agora.
- **Pendente:** validar o autofill instalando o APK (`eas build --profile development`, já gerado nesta sessão) num **Android físico real** — muito mais confiável que o emulador nessa máquina, e o usuário já tem cartões reais salvos na conta Google pra testar de verdade.

**2026-09-05 — moppy-admin no ar na Vercel (produção): `https://moppy-admin.vercel.app`**

Pedido do Jehu: subir o admin na Vercel pra testar e, em paralelo, preparar o mobile pro Play Store. Rodou o primeiro deploy real de produção e bateu em 3 bugs reais, nenhum deles conhecido antes (o admin nunca tinha sido deployado de verdade):

1. **Cron do plano grátis:** o `vercel.json` tinha crons de hora em hora / 2h, mas o plano Hobby (grátis) da Vercel só permite cron 1x/dia — deploy falhava direto. **Solução:** tirou os crons do `vercel.json` (agora `{}`) e criou `.github/workflows/crons.yml`, que chama os 4 endpoints (`charge`+`auto-confirm` de hora em hora, `reconcile` a cada 2h, `release-balance` 1x/dia) via `curl` com o header `Authorization: Bearer ${{ secrets.CRON_SECRET }}`. **Pendente do Jehu:** cadastrar 2 secrets no GitHub do repo (`Settings → Secrets and variables → Actions`): `SITE_URL` = `https://moppy-admin.vercel.app` e `CRON_SECRET` = o mesmo valor do `.env.local` (trocar por um valor forte antes de produção real — hoje é só `dev_cron_secret`).

2. **Bug real de infra — `firebase-admin` quebrava 100% das rotas em produção (login e todos os crons voltavam 500), mas funcionava perfeito em `next dev`/`next start` local.** Causa raiz, achada testando ao vivo (não só lendo doc): `jwks-rsa` (dependência interna do `firebase-admin`) faz `require('jose')`, e a partir do `jose` v6 esse pacote é **ESM puro, sem build CommonJS**. Localmente mascarava o problema porque o Node 24 (instalado aqui) suporta nativamente `require()` de ESM; o runtime da Vercel não suporta (erro `ERR_REQUIRE_ESM`). Também descoberto de passagem: o Next.js 16 usa Turbopack por padrão até pro `next build`, e o `serverExternalPackages` não resolveu (o bundle continuava idêntico, mesmo hash). **Correção que funcionou de verdade:** `"overrides": { "jose": "^5.10.0" }` no `package.json` (a v5 do jose ainda publica build CommonJS; só a v6 dropou) + `"build": "next build --webpack"` (saiu do Turbopack) + `"engines": { "node": "22.x" }`. Confirmado com `curl` direto na URL de produção depois de cada tentativa — 3 deploys até achar a combinação certa.

3. **Índices do Firestore nunca tinham sido publicados de verdade pro projeto real** (`firestore.indexes.json` existia no repo, mas alguém só editava o arquivo sem rodar o deploy) — o cron `/api/cron/charge` quebrava com `FAILED_PRECONDITION: The query requires an index`. Corrigido com `firebase deploy --only firestore:indexes --project moppy-4ae68`. Índice leva alguns minutos pra ficar pronto depois do deploy (Firestore constrói em background).

**Confirmado funcionando ao vivo:** `GET /login` → 200, `GET /api/cron/charge` sem auth → 401 (correto), com `Authorization: Bearer dev_cron_secret` → aguardando o índice terminar de construir pra confirmar 100%.

**Variáveis de ambiente subidas pra Vercel (produção)**, com autorização explícita do Jehu: todas as `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_SERVICE_ACCOUNT`, `ASAAS_*`, `CLOUDINARY_*`, `MAPBOX_TOKEN`, `GCLOUD_PROJECT`. `NEXT_PUBLIC_FIREBASE_API_KEY` precisou do flag `--type config` (Vercel exige confirmação explícita pra variável `NEXT_PUBLIC_` que "parece" credencial — é intencional, a Web API Key do Firebase é pública por design, a segurança real está nas regras do Firestore).

**Ainda não commitado no git** (só local): `next.config.ts` (serverExternalPackages, acabou não sendo a correção que funcionou, mas não faz mal manter), `package.json` (overrides do jose, build --webpack, engines), `vercel.json` (crons removidos), `.github/workflows/crons.yml` (novo). **Precisa commitar e dar push** pra isso não se perder e pra próximo deploy via Git ficar consistente com o que está rodando agora (que foi deployado direto do CLI, bypassando o git).

