
# Moppy — Plano de Implementação (Etapa 8)

**Projeto:** Moppy — Marketplace de Faxina
**Data:** 2026-08-26
**Status:** 🟢 Em andamento — Plan B (mock local, contas reais depois)
**Responsável:** Jehu (sessão Claude Code)

---

## Estratégia — Plan B

Jehu ainda não tem contas pagas em nenhum serviço (Firebase, Cloudinary, Asaas, Vercel, EAS). Para não travar a implementação:

1. **Agora:** código completo com **Firebase Emulator Suite** (Auth + Firestore + Storage rodando local, grátis, sem conta) e **mocks** para Asaas/Cloudinary.
2. **Depois:** quando Jehu criar as contas reais (todas têm tier grátis), trocamos as chaves de mock por chaves reais — sem reescrever código, só `.env`.

Isso significa que todo código já é escrito **contra a interface real** (mesmas chamadas, mesmo formato), só a implementação por trás é local/mock até a troca.

Checkpoint após cada bloco. Progresso registrado aqui + em `ESTADO.md`.

---

## Fonte de Design (Claude Design handoff)

Em 2026-08-27 o Jehu passou o **Hand off to Claude Code** do Claude Design — as 55 telas reais (não os prompts de texto do `UI-SPEC.md`, que ficaram desatualizados: cor primária mudou de `#7C3AED` para `#A78BFA`, por exemplo).

- **Projeto:** "Moppy splash screen", `projectId: 0ef402d5-9731-41a3-b17a-3b4d4f4fca6f` — acessar via `DesignSync` (`get_project`/`list_files`/`get_file`, sem precisar de `list_projects` já que não é um projeto tipo design-system).
- **Telas:** A01-A09 (admin), C01-C26 (cliente), F01-F20 (faxineira) — cada uma em `<Nome>.dc.html`, formato proprietário (DSL com `x-import`, `sc-if`, `{{ }}`) que referencia os 26 componentes do design system. Ler com `get_file` e traduzir manualmente — não dá pra copiar/colar.
- **Design system:** `_ds/moppy-design-system-.../` — tokens (`tokens/*.css`) e os 26 componentes (`_ds_bundle.js`, React.createElement puro, direto portável pro web admin).
- **Logo real** (`assets/moppy-logo.png`, gota d'água, 1254×1254px) **excede os 256KB do `get_file`** — baixa truncado/corrompido. Usando wordmark "Moppy" em Inter Bold roxo como fallback (convenção do próprio design system pra asset ausente). Se precisar do logo de verdade, Jehu precisa exportar em partes ou mandar o arquivo direto.
- **Componentes portados pro mobile** (`apps/mobile/src/components/ui/`): Icon (SVGs exatos), Button, Input, LabeledInput, Checkbox, Radio, Badge, Card, Avatar, Spinner, Alert, Rating. Faltam: Dropdown, ImageUpload, Modal, ProgressBar, Timer, Timeline, ChatBubble/TypingIndicator, ContactCard, OrderCard, CandidateCard, IconButton, TabBar — construir sob demanda, na tela que precisar (ver Blocos 4-6).
- **Tokens em `apps/mobile/src/theme.ts`**: cores, fontes (`Inter_400Regular/500Medium/700Bold` via `@expo-google-fonts/inter` — RN ignora `fontWeight` com fonte customizada, sempre usar `fontFamily` por peso), espaçamento, raios, sombras — tudo transcrito de `tokens/*.css`.
- **Web admin:** ainda não usa os tokens/componentes reais (Bloco 2 foi feito antes do handoff, com Tailwind genérico). Corrigir quando chegar no Bloco 6 (A01-A09) — os componentes do `_ds_bundle.js` são React puro, portam quase 1:1.

---

## Blocos de Implementação

### BLOCO 1 — SETUP INICIAL
**Status:** ✅ Completo

- [x] **1.1** Git init + estrutura monorepo (apps/mobile, apps/web-admin, shared/) — commit `8443890`
- [x] **1.2** Firebase Emulator Suite configurado local (Auth + Firestore + Storage) + mocks de Asaas/Cloudinary em `shared/mocks/` — testado com sucesso (Java 21 instalado via winget)

**Checkpoint:** ✅ `firebase emulators:start` sobe Auth+Firestore+UI sem erro. Rules e índices carregados do DATABASE.md (Gate 6).

---

### BLOCO 2 — AUTENTICAÇÃO
**Status:** ✅ Completo

- [x] **2.1** Expo scaffold real (template `tabs`, Expo Router, SDK 57) + Firebase Auth (emulator) + tela C02 (login/cadastro) — testado: cadastro, login e senha errada mapeados corretamente
- [x] **2.2** Next.js scaffold real (App Router + Tailwind) + login web admin + sessão via cookie httpOnly (Firebase Admin SDK, `verifySessionCookie`) + gate por `admin_whitelist` — testado: usuário não-admin recebe 403, admin acessa dashboard

**Checkpoint:** ✅ Login/cadastro funcionando contra o emulator (mobile + web). Web admin usa `proxy.ts` (convenção Next.js 16, sucessora de middleware.ts) rodando em runtime Node — verificação de sessão acontece ali mesmo, sem duplicar checagem.

**Notas técnicas:**
- Mobile: template `tabs` (não o `default` do SDK 57, que vem com NativeWind/glass-effect fora do escopo). Rota `app/login.tsx` fora dos grupos — reorganização em `(auth)/(client)/(cleaner)` fica pro Bloco 3.
- Web: `apps/web-admin/lib/firebase.ts` (client) + `firebase-admin.ts` (admin, detecta emulador via env vars automaticamente).
- Admin só acessa o painel se tiver doc em `admin_whitelist` — checado uma vez na criação da sessão (Firestore read), não a cada request. Se a Jehu revogar acesso, a sessão existente (5 dias) só cai via `revokeRefreshTokens` (não implementado ainda — ok pro estágio atual).

---

### BLOCO 3 — NAVEGAÇÃO BASE
**Status:** ✅ Completo

- [x] **3.1** Expo Router + grupos de rota reais: `(auth)` (login), `(role-choice)` (C03), `(client)` tabs (Home\|Perfil), `(cleaner)` tabs (Buscar\|Agenda\|Carteira\|Perfil) + `app/index.tsx` (C01 Splash + lógica de redirect por auth/role)
- [x] Biblioteca de componentes UI (`src/components/ui/`) construída a partir do design system real — ver seção acima
- [x] C01 (Splash), C02 (Login/Cadastro), C03 (Escolha de Papel) reconstruídas pixel-a-pixel a partir dos `.dc.html` reais (substituindo a versão anterior baseada no `UI-SPEC.md` desatualizado)

**Checkpoint:** ✅ Testado ponta a ponta contra o emulador: cadastro cria doc em `users` (regras respeitadas), escolha de papel atualiza `role` e redireciona pro grupo de tabs certo. `npx tsc --noEmit` limpo.

**2026-08-28 — Login com Google adicionado** (mudança de escopo, era "futuro" no `ARCHITECTURE.md`): botão "Entrar/Cadastrar com o Google" em `(auth)/login.tsx` via `expo-auth-session/providers/google`, `loginWithGoogle` em `useAuth.ts` (cria o doc em `users` só se `isNewUser`, mesmo shape do cadastro por e-mail — passa pela regra existente sem mudança no `firestore.rules`). `npx tsc --noEmit` limpo. Não testável ponta a ponta ainda: precisa do provider Google ativado no Firebase Console + OAuth Client IDs (iOS/Android) reais — ver `CONTAS-NECESSARIAS.md`.

---

### BLOCO 4 — FEATURES CLIENTE
**Status:** ✅ Completo (parcial — ver notas)

- [x] **4.1** Home (C08) com dados reais do Firestore (abas Próximos/Histórico/Cancelados, estados loading/vazio/erro/sucesso, FAB); Perfil (C26, não C23 — id real da tela) com acordeão de 5 seções (Dados Pessoais, Endereços, Cartões, Notificações, Mais) editando Firestore de verdade
- [x] **4.2** Wizard completo de Criar Pedido (C09-C15, 7 passos) com Zustand (`useCreateOrderStore`): Endereço → Tipo → Tamanho → Adicionais → Data/Hora → Revisão de Preço → Urgência
- [x] **4.3** Checkout (C16) com cartões salvos + tokenização mock do Asaas, gravação do pedido (`draft`→`open`, batendo com a regra do Firestore) e confirmação (C17)
- [x] C18 (Lista de Candidatas) — versão inicial em `(client)/pedido/[id].tsx`, lê `orders/{id}/applications` real (vazio até o Bloco 5 criar a candidatura)

**Checkpoint:** ✅ Testado ponta a ponta contra o emulador: criar pedido grava `draft`→`open` respeitando as regras, query da Home (client_id + orderBy scheduled_at) funciona sem índice composto extra, subcoleções `addresses`/`cards` funcionam.

**Extensão de schema (fora do Gate 6 original):** C09/C16 assumem um "livro" de endereços e cartões salvos que o `DATABASE.md` aprovado não tinha. Adicionadas duas subcoleções mínimas, dono-apenas: `users/{uid}/addresses` e `users/{uid}/cards` (regras em `firestore.rules`, comentado no próprio arquivo).

**Deixado para depois (fora do escopo do Bloco 4, mas mapeado):**
- C19 (Perfil da Candidata), C20 (Pedido em Andamento), C21 (Código de Confirmação), C22 (Chat), C23 (Está Tudo Certo), C24 (Abrir Disputa), C25 (Avaliação) — todo o ciclo de vida do pedido *depois* de uma faxineira se candidatar. `(client)/pedido/[id].tsx` hoje só mostra a lista de candidatas (se `status=open`) ou um resumo genérico (outros status) — sem isso, não tem como testar de ponta a ponta sem uma faxineira real candidatando (Bloco 5).
- `shared/mocks/asaas.ts` não está sendo usado pelo mobile — Metro (bundler do Expo) não resolve o workspace `shared/` sem config extra de monorepo (watchFolders/extraNodeModules). Criei uma cópia local em `apps/mobile/src/services/asaas.ts` só com `tokenizeCard`. Resolver de verdade (ou aceitar a duplicação) no Bloco 9.

---

### BLOCO 5 — FEATURES FAXINEIRA
**Status:** ✅ Completo

- [x] **5.1** Onboarding completo: F01 (mesma tela do C03), F02 (4 passos KYC — RG, CPF+número, selfie, comprovante — captura mockada, sem câmera/Cloudinary real), F03 (Termos + raio de atuação, chips 5/10/15/20km em vez do slider contínuo do design), F04 (Aguardando Aprovação, lê `cleaners/{uid}` em tempo real)
- [x] **5.2** F05+F09 (Buscar Trabalho com abas internas Feed/Minhas Candidaturas — confirmado no USER-FLOWS.md que são a mesma tela), F07 (Detalhe do Pedido + candidatar-se, com checagem de conflito de agenda), F08 (Candidatura Resultado), F10 (Agenda), F19 (Perfil + Documentos + PIX + raio), F20 (Histórico + Ganho total)

**Checkpoint:** ✅ Testado ponta a ponta contra o emulador: pedido criado pelo cliente aparece no feed da faxineira mesmo com `approval_status=pending` (regra é sobre papel, não aprovação), aprovação manual simulando Bloco 6, candidatura criada e visível tanto pra faxineira (Minhas Candidaturas) quanto pro cliente (C18), cliente seleciona a faxineira, checagem de conflito de agenda funciona.

**Bug real do Gate 6 corrigido:** `DATABASE.md` previa em prosa "faxineira pode ler pedidos abertos", mas a regra do Firestore que eu transcrevi no Bloco 1 só cobria dono/faxineira-designada — nenhuma faxineira conseguia ver o feed. Adicionado helper `isCleaner()` (lê `users/{uid}.role`) e branch `status=="open"` na regra de `orders`.

**Achado técnico (custou tempo, documentado pra não repetir):** o match aninhado `orders/{orderId}/applications/{cleanerId}` **não é respeitado por queries `collectionGroup`** neste emulador — testado com regra trivial `allow read: if isAuthenticated()` e mesmo assim caiu no deny padrão. Um `match /{path=**}/applications/{cleanerId}` explícito também deu erro (`Null value error`, causa não identificada). Solução adotada: ponteiro em `cleaners/{uid}/my_applications/{orderId}` (mesmo padrão de `addresses`/`cards`) + leitura individual do doc real em `orders/{orderId}/applications/{uid}` — evita `collectionGroup` inteiramente, sem índice composto extra.

**Deixado para depois:**
- Carteira (F16 Carteira, F17 Solicitar Saque) — adiado pro Bloco 7 (Pagamentos), já que saque é fundamentalmente uma transferência Asaas.
- Sincronização em tempo real de "quem foi selecionada" pras outras candidatas (status `declined` automático quando o cliente escolhe outra) — depende da tela de "Ver Perfil"/"Contratar" do lado cliente (C19), que também ficou de fora do Bloco 4.
- KYC real: câmera de verdade (`expo-image-picker`) e upload real no Cloudinary — hoje é um botão "Simular captura". Resolver no Bloco 9.

---

### BLOCO 6 — ADMIN
**Status:** ✅ Completo (escopo reduzido — ver notas)

- [x] **6.1** Login (A01, sem TOTP — ver nota), Dashboard (A02, KPIs reais + receita por cidade, sem gráfico de linha), Aprovações Pendentes (A03, real — substitui o script manual de aprovação usado nos Blocos 4/5), Pedidos (A04, tabela + painel + cancelar, sem sort/filtro dropdown), Usuários (A08, busca + suspender)

**Checkpoint:** ✅ Testado ponta a ponta contra o emulador (via script, autenticado como admin de verdade): lista pendentes, lista todos os pedidos, lista todos os usuários, aprova faxineira, suspende usuário, cancela pedido — todas as queries/regras passaram. Páginas confirmadas atrás do gate de sessão (307 sem cookie).

**Reduzido de propósito (não building do zero, decisão consciente):**
- **A05 Disputas, A06 Financeiro, A07 Preços por Cidade:** placeholders honestos explicando por quê (nada gera disputas ainda; financeiro detalhado é pagamento de verdade = Bloco 7; preço por cidade exigiria mover `price.ts` pro Firestore).
- **A09 Score de Confiabilidade:** o próprio design já marca como "(v2)" no nav — fora de escopo por definição do design, não decisão minha.
- **TOTP no login (A01):** o design mostra um segundo fator de 6 dígitos, mas não existe tela de enrollment no lote — implementar só a verificação sem enrollment real seria segurança de fachada. Login fica email+senha + cookie de sessão (já robusto: `verifySessionCookie` + gate por `admin_whitelist`).
- **Sort/filtro por dropdown em Pedidos (A04):** tabela mostra todos os pedidos ordenados por data de criação, sem os selects de Status/Cidade/Período do design.
- **Gráfico de linha "pedidos por dia" (A02):** mostrei só os KPIs + receita por cidade (bars simples), sem o polyline SVG de 30 dias.

**Nota de segurança:** o primeiro admin não pode se auto-cadastrar em `admin_whitelist` via client SDK (regra exige que um admin "super" já exista) — isso é intencional. Bootstrap do primeiro admin precisa do Admin SDK (server-side, bypassa regras), do jeito que fiz no Bloco 2.

**Escala:** Dashboard/Aprovações/Pedidos/Usuários fazem `getDocs`/`onSnapshot` na coleção INTEIRA sem paginação — ok pro volume de teste de agora, mas não escala. Resolver com paginação (`limit`/`startAfter`) ou Cloud Functions de agregação antes de produção real.

---

### BLOCO 7 — PAGAMENTOS
**Status:** ✅ Completo (backend + Carteira/Saque; sem UI de confirmação do cliente — ver notas)

- [x] **7.1** `lib/split.ts` (comissão 15% + taxa Asaas 50/50 + antecipação D+15, mesma fórmula de `apps/mobile/src/utils/price.ts::computeCleanerEarnings`)
- [x] **7.2** `POST /api/webhooks/asaas` — idempotência por `event_id` (evento duplicado é ignorado, testado)
- [x] **7.3** `GET /api/cron/preauth` — roda de hora em hora: pré-autoriza pedidos `confirmed` agendados pra amanhã (D-1) + reprocessa retries (1h entre tentativas, 2 retries, depois `preauth_failed` terminal)
- [x] **7.4** `POST /api/orders/[orderId]/capture` (admin) — captura + split + credita `wallets/{cleanerId}` ("a liberar" até D+15). Ação manual do admin (Pedidos → "Capturar pagamento") — normalmente seria automático via confirmação do cliente (C20-C25), fora do escopo deste bloco.
- [x] **7.5** `GET /api/cron/release-balance` — move saldo de "a liberar" pra "disponível" quando `release_at` (D+15) vence
- [x] **7.6** `POST /api/wallets/withdraw` — saque da faxineira: valida mínimo R$20, saldo disponível, chave PIX cadastrada; chama mock `createTransfer`
- [x] **7.7** F16 (Carteira) e F17 (Solicitar Saque) reais no mobile, substituindo os placeholders — lêem `wallets/{cleanerId}` de verdade

**Checkpoint:** ✅ Testado ponta a ponta contra o emulador (script E2E, apagado depois de rodar): pedido confirmado → cron pré-autoriza → falha de cartão gera 2 retries (1h cada) → `preauth_failed` terminal → webhook duplicado ignorado (idempotência) → admin captura → split correto (R$90 → comissão R$13,50 → taxa R$1,60 → líquido R$74,90, bate com o exemplo do F07) → saldo "a liberar" → cron de release move pra "disponível" → saque debita corretamente → saque abaixo de R$20 é rejeitado.

**Nota:** o `shared/mocks/asaas.ts::preauthorize` ganhou um token especial (`card_mock_declined`) só pra permitir testar o caminho de falha/retry de forma determinística — não muda o comportamento pra tokens reais/mockados normais.

**Deixado para depois (fora do escopo deste bloco):**
- ~~C20-C25 (confirmação do cliente "está tudo certo?", auto-confirmação em 24h, disputa)~~ — feito no Bloco 4.5, abaixo.
- Notificação + cancelamento automático após 6h de pré-auth falha (Bloco 8, depende de infra de notificações que ainda não existe)
- Vercel Cron real só roda 1x/dia no plano Hobby — o `schedule: "0 * * * *"` (hora em hora) do `vercel.json` é o intervalo correto pra spec, mas pode precisar de ajuste conforme o plano do Vercel quando o Jehu criar a conta (Bloco 9)

---

### BLOCO 4.5 — CICLO DO PEDIDO (C19-C25, F06, F11-F15, F18, A05)
**Status:** ✅ Completo

Fecha o buraco deixado pelos Blocos 4/5: até aqui nenhum pedido passava de `status="open"` porque a tela de escolha de faxineira e todo o ciclo pós-candidatura não existiam. Todas as 55 telas já estavam desenhadas no Claude Designer (handoff `projectId 0ef402d5-...`) — este bloco só traduziu as que faltavam pra código, igual foi feito com C01-C03 no Bloco 3.

**Cliente:**
- [x] C19 (Perfil da Candidata) — mostra avaliações reais (`reviews` onde `to_user_id`), "Escolher" marca a candidata `selected`, as demais `declined`, confirma o pedido (`status="confirmed"`), gera `arrival_code` (4 dígitos) e cria `chats/{orderId}`
- [x] `pedido/[id]/index.tsx` virou C20 de verdade — timeline (confirmado/em serviço/pendente de confirmação) derivada de `arrived_at`/`cleaner_completed_at`, modal de código (C21) inline, card da faxineira com atalho pro chat
- [x] C22 (Chat) e C25 (Avaliação) — componentes compartilhados `src/components/chat/ChatScreen.tsx` e `src/components/review/ReviewScreen.tsx`, usados também pelo lado faxineira (mesma UI dos dois lados, como F05/F09 já eram)
- [x] C23 ("Está tudo certo?") — chama `POST /api/orders/[id]/confirm` (idToken), que roda a mesma captura do Bloco 7
- [x] C24 (Abrir Disputa) — texto (mín. 50 char) + até 3 fotos (mock Cloudinary) → `POST /api/disputes`

**Faxineira:**
- [x] F06 (Filtros do Feed) — modal com tipo/tamanho/data (chips, sem slider contínuo — mesmo corte já feito em F03); sem filtro de distância porque o feed não tem distância real calculada (só as candidaturas têm, mockada)
- [x] F11 (Confirmação de Chegada) — código comparado a `order.arrival_code`; caminho alternativo (GPS+selfie) é mock igual ao KYC do F02, já que não há `lat/lng` confiável no pedido nem `expo-location` instalado
- [x] F12 (Serviço em Andamento) — cronômetro real a partir de `arrived_at`, "Concluído" seta `cleaner_completed_at` + `confirm_deadline_at` (D+24h)
- [x] F13 (Aguardando Confirmação) — countdown real, navega sozinho quando o cliente confirma ou abre disputa
- [x] F14 (Responder Disputa) — grava `cleaner_response` direto (regra já permitia)
- [x] F15/F18 — mesmos componentes compartilhados do lado cliente

**Backend (web-admin):**
- [x] `lib/payments.ts::runCapture/runRefund` — capture e refund viraram funções reutilizáveis (antes só a rota admin tinha a lógica)
- [x] `POST /api/orders/[id]/confirm` — confirmação do cliente (idToken), mesma captura do admin
- [x] `POST /api/disputes` — cliente abre disputa (idToken); grava a disputa, marca `order.status="disputed"` e `payment.status="disputa_aberta"` (payments só aceita escrita do backend)
- [x] `POST /api/disputes/[id]/resolve` (admin) — reembolso total, parcial (refund + split proporcional pro que sobrou), ou libera pagamento (reusa `runCapture`)
- [x] `GET /api/cron/auto-confirm` — captura sozinho pedidos com `confirm_deadline_at` vencido e cliente que nunca respondeu
- [x] A05 (Disputas) — real: lista + filtro por status, painel de decisão, chama `/resolve`
- [x] Regra nova em `firestore.rules`: cliente pode marcar `applications/{cleanerId}.status` como `selected`/`declined`, só no seu próprio pedido — testada com o SDK cliente (não só Admin SDK) pra garantir que a regra em si funciona, inclusive negando outra faxineira mexer numa candidatura alheia

**Checkpoint:** ✅ Testado ponta a ponta contra o emulador com o **client SDK autenticado** (não só Admin SDK, que ignora regras) pra validar a regra nova de verdade: cliente escolhe candidata → regra aceita, outsider tentando alterar candidatura alheia → regra nega → ciclo completo (chegada → concluído → cliente confirma → captura) → auto-confirmação via cron quando cliente não responde → disputa aberta → faxineira responde → admin resolve parcial (split proporcional ao valor liberado, bate com a fórmula do Bloco 7).

**Bug real pego pelo teste:** o primeiro rascunho de C19 escrevia `updated_at: new Date()` no pedido — a regra do Firestore exige `updated_at == request.time` (só `serverTimestamp()` bate com isso), então a escolha de faxineira falhava sempre. Corrigido antes de existir em produção porque o teste usou o SDK cliente de verdade, não Admin SDK.

**Deixado para depois:**
- Score/rating agregado (média de estrelas por faxineira/cliente) não é recalculado automaticamente — reviews são só gravadas, sem trigger de agregação (precisaria de Cloud Function, fora do Plan B)
- Janela de 72h escondendo avaliação até as duas partes avaliarem (SCREEN-MAP.md) não foi implementada — `visible: true` sempre
- "Estou terminando agora" (F12) grava `service_finishing_soon_at` no pedido mas não dispara nada (sem infra de notificação ainda)

---

### BLOCO 8 — NOTIFICAÇÕES
**Status:** ✅ Completo (2026-08-29)

- [x] **8.1** FCM setup — Server API Key, Sender ID copiados
- [x] **8.2** Mobile notificações — hook `useNotifications` registra dispositivo, guarda token no Firestore
- [x] **8.3** Backend endpoint — `POST /api/notifications/send` dispara via Expo Push API
- [x] **8.4** Firestore Rules — permite usuários guardar `fcm_token`

**Checkpoint:** ✅ Código pronto. Teste ponta a ponta pendente (mobile-only, Bloco 9.5).

**Notas técnicas:**
- Hook `useNotifications.ts` — registra ao abrir app, salva em `users/{uid}.fcm_token`
- Endpoint `/api/notifications/send` — recebe userId+título+body, busca token, envia via Expo
- Firestore Rules atualizada — nova regra `allow update: if isOwnUser(userId) && (request.resource.data.fcm_token != null || request.resource.data.fcm_token_updated_at != null);`
- Integração no app — `useNotifications()` chamado em `app/index.tsx`
- expo-notifications instalado e type-checked (sem erros TS)

---

### BLOCO 9 — CONECTAR CONTAS REAIS
**Status:** ⏳ Pendente (Jehu cria as contas quando o código estiver pronto)

- [ ] **9.1** Firebase real (Auth + Firestore + Storage) — trocar `.env`, deploy rules
- [ ] **9.2** Cloudinary real — trocar mock por SDK real
- [ ] **9.3** Asaas real (sandbox primeiro) — trocar mock por API real
- [ ] **9.4** Vercel — deploy web admin
- [ ] **9.5** EAS — build mobile

**Checkpoint:** App funcionando com serviços reais (sandbox).

---

### BLOCO 10 — QA & DEPLOY
**Status:** ⏳ Pendente

- [ ] **10.1** Testes P0, builds finais, deploy produção

**Checkpoint:** App pronto para beta testing.

---

## Retomada se Créditos Acabarem

1. Leia `docs/fabrica/ESTADO.md`
2. Leia este arquivo — os itens marcados `[x]` já estão prontos
3. Continue do primeiro item `[ ]` não marcado

---

## Próximo Passo

Iniciar **BLOCO 8 — Notificações** (FCM). Depois disso, Bloco 9 (contas reais) e Bloco 10 (QA + Deploy).

Com o Bloco 4.5 completo, o ciclo do pedido agora fecha de ponta a ponta pelo próprio app (sem precisar de script pra seedar estado) — é o que falta pra FCM fazer sentido: chegada, conclusão, confirmação e disputa são exatamente os pontos que precisam de notificação push.
