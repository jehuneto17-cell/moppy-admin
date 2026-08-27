# Moppy — Arquitetura Técnica

## 1. Stack Técnico Geral

### Plataformas & Tecnologias

| Componente | Stack | Versão | Razão |
|-----------|-------|--------|-------|
| **Mobile (Cliente + Faxineira)** | Expo + React Native | 51+ | Código compartilhado iOS/Android, deploy rápido via EAS |
| **Web Admin** | Next.js 14 + React | 14+ | SSR, API routes, deploy simples na Vercel |
| **Backend Serverless** | Node.js em `/api` (Vercel) | 18+ | Pagamentos, webhooks, jobs agendados (Cron) |
| **Autenticação** | Firebase Auth | — | Email/senha, suporte a OAuth (futuro) |
| **Banco de Dados** | Firestore (Firebase) | — | NoSQL tempo real, segurança rule-based, escalável |
| **Armazenamento Mídia** | Cloudinary (imagens públicas) | — | Otimização automática, CDN global |
| **Armazenamento Sensível** | Firebase Storage (documentos KYC) | — | Seguro, chave privada, não expõe URLs |
| **Gateway de Pagamento** | Asaas | — | PIX/Cartão, split automático, webhooks confiáveis |
| **Notificações Push** | Firebase Cloud Messaging (FCM) | — | Integrado com Firebase Auth, suporte iOS/Android |
| **Hosting Mobile** | EAS Build (Expo) | — | CI/CD gerenciado, TestFlight/Play Store |
| **Hosting Web** | Vercel | — | Deploy automático via GitHub, serverless functions |
| **CI/CD** | GitHub Actions | — | Testes, builds, deploy automático |
| **Monitoring** | Firebase Analytics + Sentry | — | Crashes, eventos de negócio, performance |

---

## 2. Estrutura de Pastas (Monorepo)

```
moppy/
├── apps/
│   ├── mobile/                          # Expo (Cliente + Faxineira)
│   │   ├── app.json                     # Config Expo (bundle, splash, icon)
│   │   ├── eas.json                     # Build profiles (development, production)
│   │   ├── app/                         # Navigation structure (Expo Router ou React Navigation)
│   │   │   ├── (auth)/                  # Stack autenticação (login, cadastro)
│   │   │   ├── (role-choice)/           # Escolha cliente/faxineira
│   │   │   ├── (client)/                # Stack cliente (home, criar pedido, candidatas)
│   │   │   ├── (cleaner)/               # Stack faxineira (buscar trabalho, agenda)
│   │   │   └── (shared)/                # Abas compartilhadas (chat, perfil)
│   │   ├── src/
│   │   │   ├── components/              # Componentes reutilizáveis (Button, Card, Input)
│   │   │   ├── screens/                 # Telas (Home, CreateOrder, CandidateList)
│   │   │   ├── services/                # Firebase Auth, Firestore queries, Asaas API
│   │   │   ├── hooks/                   # useAuth, useOrder, useWallet, useLocation
│   │   │   ├── utils/                   # Helpers (formatting, validation, geo)
│   │   │   ├── theme.js                 # Design tokens (cores, tipografia, espaçamento)
│   │   │   ├── types.ts                 # TypeScript types (User, Order, Payment)
│   │   │   └── store.ts                 # State management (Zustand ou Redux)
│   │   ├── assets/
│   │   │   ├── images/                  # Logo, splash, icons
│   │   │   └── fonts/                   # Inter (Google Fonts downloadada)
│   │   └── package.json
│   │
│   ├── web-admin/                       # Next.js (Admin Dashboard)
│   │   ├── app/
│   │   │   ├── layout.tsx               # Root layout com Provider
│   │   │   ├── dashboard/               # /dashboard (home admin)
│   │   │   ├── approvals/               # /approvals (fila faxineiras)
│   │   │   ├── orders/                  # /orders (acompanhamento pedidos)
│   │   │   ├── disputes/                # /disputes (análise disputas)
│   │   │   ├── financial/               # /financial (relatórios)
│   │   │   ├── pricing/                 # /pricing (tabelas por cidade)
│   │   │   ├── settings/                # /settings (admin)
│   │   │   └── api/
│   │   │       ├── webhooks/asaas.ts    # POST webhook Asaas
│   │   │       ├── cron/preauth.ts      # GET cron pré-autorização D-1
│   │   │       ├── cron/sync-payments.ts # GET sync pagamentos 2h
│   │   │       ├── admin/approvals.ts   # POST aprovar faxineira
│   │   │       └── admin/disputes.ts    # POST decidir disputa
│   │   ├── src/
│   │   │   ├── components/              # Layout (Sidebar, Header), Tables, Forms
│   │   │   ├── lib/
│   │   │   │   ├── firebase-admin.ts    # Firebase Admin SDK
│   │   │   │   ├── asaas-api.ts         # Cliente Asaas (setup)
│   │   │   │   └── auth.ts              # Validação token, middleware
│   │   │   ├── types.ts
│   │   │   └── theme.js                 # Mesmos tokens que mobile
│   │   ├── public/
│   │   │   └── favicon.ico
│   │   └── package.json
│   │
│   └── docs/                             # Documentação (este projeto)
│       ├── fabrica/                      # Documentos fabrica (PRODUCT-SPEC, etc)
│       ├── api/                          # OpenAPI/Swagger dos endpoints
│       └── DEPLOYMENT.md                 # Step-by-step deploy
│
├── shared/                               # Código compartilhado (monorepo packages)
│   ├── types/                            # Tipos TypeScript compartilhados
│   │   ├── user.ts
│   │   ├── order.ts
│   │   ├── payment.ts
│   │   └── index.ts
│   ├── utils/                            # Funções compartilhadas (formatação, validação)
│   │   ├── price.ts                      # Cálculo de preço (cliente + faxineira)
│   │   ├── scoring.ts                    # Score confiabilidade
│   │   ├── validation.ts                 # CPF, PIX, email
│   │   └── index.ts
│   └── package.json
│
├── .github/
│   └── workflows/
│       ├── mobile-build.yml              # EAS build + TestFlight/Play Store
│       ├── web-deploy.yml                # Next.js deploy Vercel
│       └── tests.yml                     # Unit + integration tests
│
├── .env.example                          # Template de variáveis (sem valores)
├── .env.local                            # LOCAL DEVELOPMENT ONLY (nunca commitar)
├── firebase.json                         # Config Firebase (deploy rules, storage)
├── .gitignore                            # node_modules, .env*, build/
├── package.json                          # Root workspace (lerna ou npm workspaces)
├── README.md                             # Getting started
└── DEPLOYMENT.md                         # Instruções deploy (EAS, Vercel, Firestore)
```

**Monorepo Tool:** npm workspaces (nativo) ou Turborepo (performance)

---

## 3. Fluxo de Dados End-to-End

### A. Cliente Cria Pedido (Checkout)

```
[Mobile App - Cliente]
  1. Preenche form (endereço, tipo, tamanho, data)
  2. Valida preço localmente (via /api/price)
  3. Salva cartão → Asaas tokeniza → recebe token
  4. POST /api/orders (cliente_id, endereço, tipo, amount, card_token, etc)
       ↓ [Vercel Serverless]
  5. Firebase Admin verifica cliente autenticado
  6. Cria document em /orders com status="pending"
  7. Cria document em /payments com status="pending"
  8. Responde 200 com order_id
       ↓ [Mobile App - Cliente]
  9. Mostra "Pedido criado! Pré-autorização em D-1 22h"
       ↓ [Vercel Cron - D-1 22h]
 10. `GET /api/cron/preauth` (Vercel dispara)
     → Busca /payments com service_date=D e status="pending"
     → Para cada: chama Asaas /authorize (pré-autorização)
     → Atualiza /payments com status="preauth_pending"
       ↓ [Asaas Webhook]
 11. POST /api/webhooks/asaas (Asaas notifica resultado)
     → Atualiza /payments com status="preauth_success" ou "preauth_failed"
     → FCM notifica cliente
       ↓ [Mobile App - Cliente]
 12. Cliente vê "Pagamento aprovado"
```

### B. Faxineira Se Candidata

```
[Mobile App - Faxineira]
  1. Abre feed (lista /orders com status="open", na região)
  2. Clica "Me candidatar"
  3. POST /api/orders/{order_id}/apply (cleaner_id)
       ↓ [Vercel Serverless]
  4. Firebase Admin valida:
     - Faxineira aprovada?
     - Horário não tem double-booking?
  5. Cria document em /orders/applications/{cleaner_id}
  6. FCM notifica cliente "nova candidata"
       ↓ [Mobile App - Cliente]
  7. Cliente vê candidata, clica "Escolher"
  8. POST /api/orders/{order_id}/select (cleaner_id)
       ↓ [Vercel Serverless]
  9. Atualiza /orders com cleaner_id, status="confirmed"
 10. Deleta outras applications
 11. FCM notifica faxineira selecionada
```

### C. Dia do Serviço

```
[Mobile App - Faxineira]
  1. Clica "Cheguei"
  2. POST /api/orders/{order_id}/confirm-arrival (cleaner_id, location, photo)
       ↓ [Vercel Serverless]
  3. Valida GPS (±50m do endereço)
  4. Atualiza /orders com status="in_progress"
  5. FCM notifica cliente "faxineira chegou"
       ↓ [Mobile App - Cliente]
  6. Chat aberto (Firestore /chats/{order_id})
  7. Faxineira executa, clica "Concluído"
  8. POST /api/orders/{order_id}/complete (cleaner_id)
       ↓ [Vercel Serverless]
  9. Atualiza /orders com status="completed"
 10. FCM notifica cliente "está tudo certo?"
       ↓ [Mobile App - Cliente]
 11. ├─ Cliente confirma "Sim"
     │  POST /api/orders/{order_id}/confirm-quality
     │  → Asaas capture (pagamento)
     │  → /payments status="capture_success"
     │  → Split (comissão, faxineira)
     │  → /cleaner_wallets balance_pending += amount
     │  → FCM ambos: "passe para avaliação"
     │
     └─ Cliente reporta problema
        POST /api/orders/{order_id}/dispute (description, photos)
        → /disputes criado, status="open"
        → /payments status="disputa_aberta"
        → Faxineira tem 24h para responder
        → Admin analisa em 48h
```

### D. Saque (D+15)

```
[Cron Diário - D+15]
  1. Busca /cleaner_wallets com pending_release_date ≤ hoje
  2. Atualiza balance_available += balance_pending
  3. Atualiza balance_pending = 0
       ↓ [Mobile App - Faxineira]
  4. Vê saldo "Disponível"
  5. Clica "Solicitar Saque" (mínimo R$20)
  6. POST /api/wallet/{cleaner_id}/withdraw (amount, pix_key)
       ↓ [Vercel Serverless]
  7. Asaas processa PIX (DICT)
  8. /cleaner_wallets balance_available -= amount
  9. /wallet_transactions cria record
 10. FCM notifica "dinheiro transferido" (1-2 dias)
```

---

## 4. Camadas de Autenticação & Autorização

### Mobile

```
┌─ App Load
├─ Verifica `getAuth().currentUser` (localStorage)
├─ Se sim: Valida com Firebase (refresh token se expirado)
├─ Se não: Redireciona para tela de login
│
├─ Login Form
│  └─ Firebase.auth().signInWithEmailAndPassword(email, password)
│     └─ Retorna `idToken` (JWT válido por 1h, refresh token 30 dias)
│
├─ Cadastro Form
│  └─ Firebase.auth().createUserWithEmailAndPassword(email, password)
│     └─ Cria user, auto-login
│
├─ Cada requisição à API
│  └─ Header: Authorization: Bearer {idToken}
│  └─ Backend valida no Firebase Admin SDK
```

### Web Admin

```
┌─ Admin Login
├─ Firebase.auth().signInWithEmailAndPassword(email, password)
├─ Obter `idToken`
│
├─ Cada requisição ao /api
│  └─ Header: Authorization: Bearer {idToken}
│  └─ Middleware Firebase Admin valida
│  └─ Verifica se email está em /admin_whitelist (Firestore)
│  └─ Se não: 403 Forbidden
│
├─ Se token expirado
│  └─ Cliente refresh automaticamente com refresh token
│  └─ Ou redireciona para login
```

### Vercel Cron & Webhooks

```
┌─ Cron Requests
├─ Header: Authorization: Bearer {CRON_SECRET}
├─ Backend valida contra env.CRON_SECRET
│
├─ Webhooks Asaas
├─ Header: Authorization: Bearer {ASAAS_WEBHOOK_SECRET}
├─ Backend valida assinatura
├─ Confere idempotência (event_id)
```

---

## 5. Deployment

### Mobile (iOS + Android via Expo)

**CI/CD Workflow:**

```yaml
trigger: push to main
  1. npm install (root)
  2. npm run build:mobile
  3. eas build --platform all --auto-submit
     (TestFlight + Play Store Internal Testing)
  4. Notifica no Slack: build concluído
```

**Configuração EAS (`eas.json`):**

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "keystore": "moppy.jks"
      },
      "ios": {
        "buildType": "archive"
      }
    },
    "development": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "track": "internal"
      },
      "ios": {
        "testflightProfile": "production"
      }
    }
  }
}
```

**Secrets (no EAS Cloud):**
- FIREBASE_PROJECT_ID
- FIREBASE_API_KEY
- ASAAS_API_KEY (somente para requests ao backend, nunca no mobile)
- SENTRY_DSN

### Web Admin (Next.js na Vercel)

**CI/CD Workflow:**

```yaml
trigger: push to main
  1. npm install
  2. npm run build:web
  3. npm run test (opcional)
  4. Vercel deploy automático
  5. Notifica: ✓ Deploy concluído
```

**Configuração Vercel (`vercel.json`):**

```json
{
  "buildCommand": "cd apps/web-admin && npm run build",
  "outputDirectory": "apps/web-admin/.next",
  "installCommand": "npm install --legacy-peer-deps",
  "env": {
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "@firebase_project_id",
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase_api_key",
    "FIREBASE_SERVICE_ACCOUNT": "@firebase_service_account_json",
    "ASAAS_API_KEY": "@asaas_api_key",
    "ASAAS_WEBHOOK_SECRET": "@asaas_webhook_secret",
    "CRON_SECRET": "@cron_secret"
  },
  "crons": [
    {
      "path": "/api/cron/preauth",
      "schedule": "0 22 * * *"
    },
    {
      "path": "/api/cron/sync-payments",
      "schedule": "0 */2 * * *"
    },
    {
      "path": "/api/cron/release-wallets",
      "schedule": "0 6 * * *"
    }
  ]
}
```

**Environment Variables (Vercel Settings):**

```
# Firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=moppy-prod-xxxxx
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=moppy-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://moppy-prod.firebaseio.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=moppy-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Firebase Admin (Node.js side only, nunca NEXT_PUBLIC_)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Asaas
ASAAS_API_KEY=asaas_api_xxxxx
ASAAS_WEBHOOK_SECRET=webhook_secret_xxxxx

# Cron
CRON_SECRET=super_secret_token_xxxxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=moppy-cloud

# Sentry
SENTRY_DSN=https://xxxx@yyyy.ingest.sentry.io/zzzz

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Firestore (Database + Storage)

**Deploy Rules:**

```bash
# Local
firebase init (escolher Firestore, Storage)
firebase deploy --only firestore:rules,firestore:indexes

# CI/CD
# GitHub Actions roda: firebase deploy automaticamente após web deploy
```

**Backup Automático:**
- Ativar no Firebase Console → Backup e Restore
- Daily 2am UTC

---

## 6. Variáveis de Ambiente

### `.env.example` (commitar, sem valores)

```bash
# MOBILE (Expo) — expostas no bundle, OK público
EXPO_PUBLIC_FIREBASE_PROJECT_ID=moppy-prod-xxxxx
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=moppy-prod.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://moppy-prod.firebaseio.com
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=moppy-prod.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=moppy-cloud
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...

EXPO_PUBLIC_API_URL=https://moppy-admin.vercel.app

# WEB ADMIN (Next.js) — NEXT_PUBLIC_ expostas no cliente
NEXT_PUBLIC_FIREBASE_PROJECT_ID=moppy-prod-xxxxx
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=moppy-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://moppy-prod.firebaseio.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=moppy-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# BACKEND / VERCEL (Node.js, secreto)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"moppy-prod-xxxxx",...}
ASAAS_API_KEY=asaas_api_xxxxx
ASAAS_WEBHOOK_SECRET=webhook_secret_xxxxx
CRON_SECRET=super_secret_cron_token

CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=yyyyy

SENTRY_DSN=https://xxxx@yyyy.ingest.sentry.io/zzzz
SENTRY_AUTH_TOKEN=sntrys_xxxx

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Desenvolvimento Local (`.env.local`, nunca commitar)

```bash
# Use emuladores Firebase localmente
FIREBASE_EMULATOR_HOST=localhost:9099
FIRESTORE_EMULATOR_HOST=localhost:8080
```

---

## 7. Diagrama de Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                          MOPPY ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Mobile + Web)                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Mobile - Expo]              [Web Admin - Next.js]                 │
│  ├─ Cliente App                ├─ Dashboard                         │
│  │  ├─ Home                     ├─ Approvals                        │
│  │  ├─ Create Order             ├─ Orders                          │
│  │  ├─ Candidates               ├─ Disputes                        │
│  │  ├─ Chat                     ├─ Financial                       │
│  │  └─ Payments                 ├─ Pricing                         │
│  │                              └─ Settings                        │
│  ├─ Cleaner App                                                    │
│  │  ├─ Work Feed                                                   │
│  │  ├─ Agenda                                                      │
│  │  ├─ Wallet                                                      │
│  │  └─ Profile                                                     │
│  │                                                                  │
│  ├─ Firebase Auth SDK           ├─ Firebase Auth SDK               │
│  ├─ Firestore SDK               ├─ Firestore SDK                   │
│  └─ FCM SDK                     └─ FCM SDK                         │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST
                                    │
┌────────────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER (Vercel Serverless)               │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  /api/
│  ├─ /orders/*                   ← POST create, GET list, PUT select │
│  ├─ /payments/*                 ← GET status, POST capture, refund  │
│  ├─ /wallet/*                   ← GET balance, POST withdraw        │
│  ├─ /disputes/*                 ← POST create, PUT respond, decide  │
│  ├─ /approvals/*                ← GET pending, POST approve/reject  │
│  ├─ /webhooks/asaas             ← Asaas notifications               │
│  ├─ /cron/preauth               ← D-1 pré-autorização              │
│  ├─ /cron/sync-payments         ← 2h verificação pagamentos        │
│  └─ /cron/release-wallets       ← D+15 libera saldo                │
│                                                                      │
│  Middleware:                                                        │
│  ├─ Firebase Admin Auth Validation                                 │
│  ├─ Role Check (admin, client, cleaner)                            │
│  ├─ Cron Secret Validation                                         │
│  └─ Error Handling + Sentry                                        │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
┌───────────────────┴──┐   ┌────────┴──────┐   ┌───┴─────────────────┐
│  FIREBASE LAYER      │   │ PAYMENT LAYER │   │  EXTERNAL SERVICES  │
├──────────────────────┤   ├───────────────┤   ├─────────────────────┤
│                      │   │               │   │                     │
│ Firestore (NoSQL)    │   │ Asaas API     │   │ Cloudinary          │
│ ├─ Users             │   │ ├─ Authorize  │   │ (Image Optimization)│
│ ├─ Orders            │   │ ├─ Capture    │   │                     │
│ ├─ Payments          │   │ ├─ Refund     │   │ Google Maps API     │
│ ├─ Cleaners          │   │ ├─ Transfers  │   │ (Geocoding)         │
│ ├─ Disputes          │   │ └─ Webhooks   │   │                     │
│ ├─ Chat              │   │               │   │ FCM                 │
│ └─ Wallets           │   │               │   │ (Push Notifications)│
│                      │   │               │   │                     │
│ Firebase Auth        │   │               │   │ Sentry              │
│ ├─ Email/Password    │   │               │   │ (Error Tracking)    │
│ └─ Sessions          │   │               │   │                     │
│                      │   │               │   │                     │
│ Firebase Storage     │   │               │   │ GitHub              │
│ ├─ KYC Docs          │   │               │   │ (Code + CI/CD)      │
│ └─ Dispute Photos    │   │               │   │                     │
│                      │   │               │   │                     │
└──────────────────────┘   └───────────────┘   └─────────────────────┘
```

---

## 8. Checklist de Tecnologias

- [x] **Linguagem:** JavaScript/TypeScript
- [x] **Mobile:** Expo + React Native
- [x] **Web:** Next.js 14
- [x] **Backend:** Vercel Serverless (Node.js)
- [x] **DB:** Firestore (NoSQL)
- [x] **Auth:** Firebase Auth
- [x] **Pagamento:** Asaas (com webhook)
- [x] **Cron:** Vercel Cron
- [x] **Push:** Firebase Cloud Messaging
- [x] **Mídia:** Cloudinary + Firebase Storage
- [x] **Geo:** Google Maps API
- [x] **Logging:** Sentry + Firebase Analytics
- [x] **CI/CD:** GitHub Actions + Vercel

---

## 9. Fluxo de Desenvolvimento Local

```bash
# 1. Clone & Setup
git clone <repo>
npm install
cd apps/mobile && npm install
cd ../web-admin && npm install

# 2. Firebase Emulator (opcional, para dev local)
npm install -g firebase-tools
firebase emulators:start

# 3. Mobile Dev
cd apps/mobile
npm run start
# EAS simulator ou device via Expo Go

# 4. Web Dev
cd apps/web-admin
npm run dev
# Acessa localhost:3000

# 5. Backend (local)
# Vercel CLI para testar funções
npm i -g vercel
vercel dev
# Acessa localhost:3000/api/*

# 6. Environment
cp .env.example .env.local
# Preencher com valores de dev/sandbox
```

---

## 10. Performance & Escalabilidade

### Mobile
- Code splitting automático (Expo)
- Lazy load screens (React Navigation)
- Image optimization (Cloudinary)
- Caching local (SQLite/Realm para offline)

### Web Admin
- Next.js SSR/SSG
- Incremental Static Regeneration (ISR) para tabelas
- API Route caching (headers)
- Client-side pagination

### Backend
- Serverless auto-scale (Vercel)
- Firestore índices para queries rápidas
- Batch writes (até 500 docs)
- Transações para consistência

### Database
- Firestore regional (nearest to server location)
- Snapshots listeners para real-time
- Offline persistence (Expo + Firestore SDK)

---

## 11. Próximas Etapas

1. **DATABASE.md** — Collections Firestore, campos, índices, security rules
2. **API.md** — Documentação OpenAPI de cada endpoint
3. **DEPLOYMENT.md** — Step-by-step deploy (EAS, Vercel, Firebase)
4. **TESTING.md** — Estratégia de testes (unit, integration, E2E)
5. **SECURITY.md** — Revisão de segurança (OWASP, secrets, CORS)
