
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
**Status:** ⏳ Pendente

- [ ] **6.1** Dashboard, Approvals, Orders, Financial (Next.js + Firestore emulator)

**Checkpoint:** Admin aprova faxineira, vê pedidos.

---

### BLOCO 7 — PAGAMENTOS
**Status:** ⏳ Pendente

- [ ] **7.1** Webhook Asaas (mock) + cron pré-autorização (lógica completa, dispara contra mock)

**Checkpoint:** Fluxo de pagamento simula D-1 → confirmação.

---

### BLOCO 8 — NOTIFICAÇÕES
**Status:** ⏳ Pendente

- [ ] **8.1** FCM — estrutura pronta, teste local via Expo (push real precisa de conta Firebase real, testar quando conectar)

**Checkpoint:** Lógica de disparo pronta.

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

Iniciar **BLOCO 6 — Admin** (A01-A09: Login Admin, Dashboard, Aprovações Pendentes, Pedidos, Disputas, Financeiro, Preços por Cidade, Usuários, Score de Confiabilidade), lendo cada `.dc.html` real via `DesignSync`. É aqui que a aprovação de faxineiras deixa de ser manual (script) e vira um fluxo de verdade — o Bloco 5 ficou testado com aprovação simulada.

**Atenção:** o Bloco 2 (Auth web admin) foi feito ANTES do hand-off do Claude Design chegar — a tela de login atual usa Tailwind genérico, não os tokens/componentes reais (`A01 - Login Admin.dc.html`). Corrigir isso junto com o Bloco 6, já que os componentes do `_ds_bundle.js` são React puro e portam quase 1:1 pro Next.js.
