
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

## Blocos de Implementação

### BLOCO 1 — SETUP INICIAL
**Status:** ✅ Completo

- [x] **1.1** Git init + estrutura monorepo (apps/mobile, apps/web-admin, shared/) — commit `8443890`
- [x] **1.2** Firebase Emulator Suite configurado local (Auth + Firestore + Storage) + mocks de Asaas/Cloudinary em `shared/mocks/` — testado com sucesso (Java 21 instalado via winget)

**Checkpoint:** ✅ `firebase emulators:start` sobe Auth+Firestore+UI sem erro. Rules e índices carregados do DATABASE.md (Gate 6).

---

### BLOCO 2 — AUTENTICAÇÃO
**Status:** ⏳ Pendente

- [ ] **2.1** Firebase Auth (emulator) + tela C02 mobile (login/cadastro)
- [ ] **2.2** Firebase Auth (emulator) + login web admin

**Checkpoint:** Login/cadastro funcionando contra o emulator.

---

### BLOCO 3 — NAVEGAÇÃO BASE
**Status:** ⏳ Pendente

- [ ] **3.1** Expo Router + tabs (Cliente: Home\|Perfil / Faxineira: Buscar\|Agenda\|Carteira\|Perfil)

**Checkpoint:** Todos os fluxos navegáveis.

---

### BLOCO 4 — FEATURES CLIENTE
**Status:** ⏳ Pendente

- [ ] **4.1** Home (C08), Ver Candidatas (C16), Perfil (C23) — dados do Firestore emulator
- [ ] **4.2** Criar Pedido (C11-C14) — tipo, data, endereço, cálculo de preço
- [ ] **4.3** Checkout (C15) — mock de tokenização Asaas

**Checkpoint:** Cliente cria pedido até checkout (mock).

---

### BLOCO 5 — FEATURES FAXINEIRA
**Status:** ⏳ Pendente

- [ ] **5.1** Buscar Trabalho (F01), Minhas Candidaturas (F05)
- [ ] **5.2** Agenda (F08), Perfil + KYC (F20) — upload mock (sem Cloudinary real)

**Checkpoint:** Faxineira se candidata e gerencia agenda.

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

Iniciar **BLOCO 1.1 — Git + monorepo**.
