# Contas e Credenciais Necessárias — Moppy (Bloco 9)

Checklist do que precisa ser criado/coletado antes de conectar o app aos serviços reais. Hoje tudo roda em emulador/mock localmente. Pode ir preenchendo aos poucos — não precisa ser tudo de uma vez.

## 🚀 Pendências por Ordem de Urgência

### AGORA (bloqueadores pra testar):
- [ ] **Nenhuma!** ✅ Pode testar com Cloudinary + Asaas sandbox

### Bloco 9.1 (quando tiver cartão):
1. **Fazer upgrade Firebase Blaze** (vai pedir cartão, mas gratuito até 5GB/mês)
   - https://console.firebase.google.com/project/moppy-4ae68/overview → "Fazer upgrade"
   - Ativa **Storage**
   - Roda: `firebase deploy --only storage`

2. **Google Maps API Key** (também precisa upgrade Google Cloud)
   - https://console.cloud.google.com → projeto moppy-4ae68
   - APIs & Services → Library → "Maps JavaScript API" → Enable
   - Credentials → + Create Credentials → API Key
   - Coloca em `.env.local`: `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=...`

### Bloco 9.2-9.3 (paralelo com código):
- Cloudinary ✅ já configurado
- Asaas API Key ✅ já configurado

### Bloco 9.4 (depois que deployar Vercel):
- **Asaas Webhook** (precisa de domínio público do Vercel)
  - Volta em Asaas Console → Integrações → Webhooks
  - Adiciona webhook apontando pra `https://[dominio-vercel].vercel.app/api/webhooks/asaas`
  - Gera token e coloca em `.env.local`

### Bloco 9.5 (EAS Build):
- **OAuth Client IDs iOS/Android** (precisa do bundle ID do app)
  - Google Cloud Console → OAuth 2.0 credentials
  - iOS: bundle ID `com.moppy.app` (define depois)
  - Android: package name `com.moppy` + SHA-1 do keystore (EAS gera)

---

## 1. Firebase (Auth + Firestore + Storage)

- [x] Criar projeto no [Firebase Console](https://console.firebase.google.com) — `moppy-4ae68`
- [x] Copiar as chaves do app Web — já estão em `.env.local` (não fica exposto aqui no doc)
- [x] Ativar **Authentication** → método Email/Senha (e Telefone, se for usar)
- [x] Ativar **Authentication** → método **Google** (necessário pro login social que estamos adicionando agora)
- [x] Ativar **Firestore** (modo produção)
- [ ] Ativar **Storage** — **BLOQUEADO**: precisa fazer upgrade do plano pra Blaze (vai pedir cartão de crédito pra verificação, mas é grátis até 5GB/mês)
- [x] Gerar **Service Account** (Configurações → Contas de Serviço → Gerar nova chave privada) — já foi feito, está em `.env.local`
- [x] Publicar `firestore.rules` e `firestore.indexes.json` — **FEITO em 2026-08-28** via `firebase deploy --only firestore:rules,firestore:indexes`
  - ✅ Firestore rules publicadas com sucesso
  - ✅ Índices compostos publicados
  - ⏳ Storage rules ainda faltam (depende de ativar Storage → precisa upgrade Blaze)
- [x] Firebase CLI autenticado — `firebase login` OK

### 1.1 Login com Google — OAuth Client IDs

**Status:** Provider Google já ativado (2026-08-28). Mobile app já tem o código pronto (`loginWithGoogle` em `useAuth.ts`).

- [ ] Copiar o **Web Client ID** (Authentication → Sign-in method → Google → expandir) → `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` no `.env.local`
  - Só necessário se quiser login com Google no web admin também (opcional)
  
- [ ] Criar **OAuth Client ID (iOS)** no [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  - Vai precisar do **bundle ID** do app (ex: `com.moppy.app`)
  - Deixa pra quando chegarmos no **Bloco 9.5 (EAS build)**
  
- [ ] Criar **OAuth Client ID (Android)** no Google Cloud Console
  - Vai precisar do **package name** (ex: `com.moppy`) + **SHA-1 do keystore** do EAS
  - Deixa pra quando chegarmos no **Bloco 9.5 (EAS build)**

## 2. Asaas (pagamentos)

- [x] Criar conta Asaas sandbox — **FEITO em 2026-08-29**
- [x] Pegar **API Key** (sandbox) — já está em `.env.local`
- [ ] ⏳ **Configurar Webhook** — deixa pra **Bloco 9.4 (Vercel Deploy)**
  - Precisa de URL pública do Vercel (tipo `https://moppy.vercel.app/api/webhooks/asaas`)
  - Vai em Asaas Console → Integrações → Webhooks
  - Nome: `Moppy`
  - URL: `https://[seu-dominio-vercel].vercel.app/api/webhooks/asaas`
  - Clica "Gerar Token" → copia o **Webhook Secret**
  - Coloca em `.env.local`: `ASAAS_WEBHOOK_SECRET=wh_...`
- [ ] Para produção: **CNPJ** (obrigatório — sandbox funciona sem) — pra depois

## 3. Cloudinary (upload de fotos/documentos)

- [ ] Criar conta em [cloudinary.com](https://cloudinary.com)
- [ ] Pegar do Dashboard: Cloud Name, API Key, API Secret

## 4. Google Maps

- [ ] **BLOQUEADO**: Google Cloud pede pré-pagamento (cartão de crédito) mesmo pra tier gratuito — deixa pra **Bloco 9.3/9.4** quando tiver cartão
- [ ] Criar chave de API no [Google Cloud Console](https://console.cloud.google.com) com **Maps SDK** habilitado (Android/iOS conforme o app usar)
- [ ] Restringir a chave por app/bundle ID depois que os apps existirem

**Por enquanto:** usando `USE_MOCK_CLOUDINARY` local — tira o mock quando tiver a chave real

## 5. Vercel (deploy do admin web)

- [ ] Conta Vercel conectada ao repositório do projeto
- [ ] (As env vars vão as mesmas do `.env` — configuro isso quando tivermos as chaves acima)

## 6. EAS / Lojas (build mobile)

- [ ] Conta Expo (para `eas build`)
- [ ] Conta **Apple Developer** (US$ 99/ano) — necessária pra build iOS e publicar na App Store
- [ ] Conta **Google Play Console** (US$ 25 taxa única) — necessária pra publicar na Play Store
- [ ] Ícone do app e splash screen em alta resolução (se ainda não tiver, aviso quando chegar nessa etapa)

## 7. Opcionais (não bloqueiam o Bloco 9)

- [ ] Sentry (monitoramento de erro) — DSN + Auth Token
- [ ] Google Analytics — Measurement ID

## 8. Gerado por nós, não precisa de conta externa

- `CRON_SECRET` — eu gero uma string aleatória quando formos configurar o cron de pagamento

---

## 📊 Resumo do Progresso (2026-08-28)

| Serviço | Status | Notas |
|---------|--------|-------|
| **Firebase** | 80% ✅ | Projeto criado, Auth (Email+Google) ativado, Firestore + rules publicadas. Falta: Storage (precisa Blaze) |
| **Cloudinary** | ✅ 100% | Conta criada, pasta "Moppy" isolada, chaves no `.env.local` |
| **Asaas** | ✅ 95% | Conta sandbox criada, API Key no `.env.local`. Falta: Webhook (depois quando deployar Vercel) |
| **Google Maps** | ❌ Bloqueado | Google Cloud exige pré-pagamento — Bloco 9.1 quando tiver cartão |
| **Vercel** | ⏳ Deixa pra depois | Precisa de domínio real (será gerado depois) |
| **EAS/Lojas** | ⏳ Bloco 9.5 | Apple Developer ($99/ano) + Google Play ($25) |

---

## ✅ Resumo 2026-08-29

**Pronto pra testar localmente:**
- ✅ Cloudinary (fotos)
- ✅ Asaas sandbox (pagamentos teste)
- ✅ Firebase (Auth + Firestore)

**Faltam (mas não bloqueiam desenvolvimento):**
- ⏳ Storage Firebase (Blaze upgrade)
- ⏳ Google Maps (cartão Google Cloud)
- ⏳ Asaas Webhook (Vercel deploy)
- ⏳ OAuth iOS/Android (EAS build)

---

**Como usar:** quando tiver as chaves de um serviço, me manda aqui. Configuro direto no `.env.local` (gitignored, seguro). Nada disso vai pra `.env.example` — esse fica como referência vazia.
