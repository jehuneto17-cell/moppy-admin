# Contas e Credenciais Necessárias — Moppy (Bloco 9)

Checklist do que precisa ser criado/coletado antes de conectar o app aos serviços reais. Hoje tudo roda em emulador/mock localmente. Pode ir preenchendo aos poucos — não precisa ser tudo de uma vez.

## 🚀 Pendências por Ordem de Urgência

### AGORA (bloqueadores pra testar):
- [ ] **Nenhuma!** ✅ Pode testar com Cloudinary + Asaas sandbox

> **Decisão 2026-09-05:** Google Maps **não vai ser usado** — trocado por Mapbox. Não exige cartão pra começar (free tier: 25k usuários ativos/mês no mapa mobile, 100k geocoding/mês, muito acima do que o Moppy vai usar no início). Ver seção 4 abaixo.

> **Decisão 2026-09-04:** Firebase Storage **não vai ser usado**. KYC (RG, CPF, selfie, comprovante) e fotos de disputa passam a ir 100% pelo Cloudinary — documentos sensíveis com delivery type `authenticated` (URL assinada, não pública). Isso elimina a necessidade do upgrade Firebase Blaze só por causa de Storage. Ver seção 3 abaixo.

### Bloco 9.2-9.3 (paralelo com código):
- Cloudinary ✅ **feito** — chaves reais em ambos os `.env.local` (admin: `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET`; mobile: `EXPO_PUBLIC_USE_MOCK_CLOUDINARY=false` + `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`). Upload real implementado e testado (ver seção 3).
- Asaas API Key ⏳ **ainda não** — `.env.local` está com `ASAAS_API_KEY=mock`. Falta pegar a chave real no painel Asaas e colar. O código também ainda não faz nenhuma chamada real à API do Asaas (só existe o endpoint receptor de webhook, o pagamento em si roda 100% simulado via cron)

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

## 1. Firebase (Auth + Firestore)

- [x] Criar projeto no [Firebase Console](https://console.firebase.google.com) — `moppy-4ae68`
- [x] Copiar as chaves do app Web — já estão em `.env.local` (não fica exposto aqui no doc)
- [x] Ativar **Authentication** → método Email/Senha (e Telefone, se for usar)
- [x] Ativar **Authentication** → método **Google** (necessário pro login social que estamos adicionando agora)
- [x] Ativar **Firestore** (modo produção)
- [x] ~~Ativar Storage~~ — **não é mais necessário** (decisão 2026-09-04: mídia sensível vai pelo Cloudinary, ver seção 3)
- [x] Gerar **Service Account** (Configurações → Contas de Serviço → Gerar nova chave privada) — já foi feito, está em `.env.local`
- [x] Publicar `firestore.rules` e `firestore.indexes.json` — **FEITO em 2026-08-28** via `firebase deploy --only firestore:rules,firestore:indexes`
  - ✅ Firestore rules publicadas com sucesso
  - ✅ Índices compostos publicados
  - `storage.rules` fica sem uso — pode ser removido do projeto
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

- [ ] Confirmar se a conta Asaas sandbox foi mesmo criada (ESTADO.md registrava "FEITO em 2026-08-29", mas o `.env.local` está com valor mock — precisa checar no painel Asaas)
- [ ] Pegar **API Key** (sandbox) real e colar em `.env.local` — hoje está `ASAAS_API_KEY=mock`
- [ ] Implementar as chamadas reais à API do Asaas (criar cobrança, capturar, split) — hoje só existe o endpoint receptor de webhook (`app/api/webhooks/asaas/route.ts`); todo o processamento de pagamento roda simulado via cron, sem tocar a API real
- [ ] ⏳ **Configurar Webhook** — deixa pra **Bloco 9.4 (Vercel Deploy)**, depois de ter a integração real
  - Precisa de URL pública do Vercel (tipo `https://moppy.vercel.app/api/webhooks/asaas`)
  - Vai em Asaas Console → Integrações → Webhooks
  - Nome: `Moppy`
  - URL: `https://[seu-dominio-vercel].vercel.app/api/webhooks/asaas`
  - Clica "Gerar Token" → copia o **Webhook Secret**
  - Coloca em `.env.local`: `ASAAS_WEBHOOK_SECRET=wh_...`
- [ ] Para produção: **CNPJ** (obrigatório — sandbox funciona sem) — pra depois

## 3. Cloudinary (upload de fotos E documentos — inclui KYC) ✅

- [x] Conta confirmada — Cloud Name `dv62fwdtv` (conta compartilhada, já tem outras pastas: emporio-minas, nova-era-tintas, sara-pastelaria)
- [x] Chaves reais em `.env.local` — `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` só no admin (server-side), `CLOUDINARY_CLOUD_NAME` também no mobile (pública, sem segredo)
- [x] **FEITO em 2026-09-04** — implementado `lib/cloudinary.ts` + rota `POST /api/media/upload` no admin (autenticada via Firebase ID token). Tudo sobe dentro de `Moppy/<pasta>` — nunca toca as outras pastas da conta
- [x] Fotos públicas (perfil, serviço, arrival, disputa) → `type=upload`, URL pública normal
- [x] **Documentos sensíveis (KYC: RG, CPF, selfie, comprovante)** → forçado no backend pra `type=authenticated` (URL assinada) sempre que a pasta começa com `kyc/`, mesmo que o app mande outra coisa — decisão de privacidade não depende do cliente
- [x] **Teste real feito e confirmado:** upload público caiu em `Moppy/test/...`, upload de documento caiu em `Moppy/kyc/test/...` com `type=authenticated` (URL exige assinatura pra abrir). Nenhuma outra pasta da conta foi tocada. Os dois arquivos de teste foram apagados depois de confirmar.
- [x] **Câmera/galeria real implementada em 2026-09-04** (`expo-image-picker`): onboarding de documentos (câmera, frontal na selfie), disputa cliente e faxineira (galeria), chegada/selfie de check-in (câmera frontal). Permissões configuradas no `app.json`. `npx tsc --noEmit` passou sem novos erros.

## 4. Mapbox (mapa + geocoding — substitui o Google Maps) ✅

- [x] Conta criada, **Default public token** real colado em `moppy-mobile/.env.local` (`EXPO_PUBLIC_MAPBOX_TOKEN`) e `moppy-admin/.env.local` (`MAPBOX_TOKEN`)
- [x] Geocoding testado de verdade (`curl` na Geocoding v6) — endereço real virou coordenada certa (`accuracy: rooftop`)
- [x] Token secreto `Downloads:Read` real em `moppy-mobile/.env.local` (`MAPBOX_DOWNLOADS_TOKEN`) — **não fica no `app.json`** (versionado no git). Criado `app.config.js` que lê o `app.json` e injeta o token só em tempo de build, a partir do `.env.local` (gitignored). Confirmado com `npx expo config` que o valor real é resolvido certinho.
- [x] Free tier: 25k usuários ativos/mês no mapa mobile + 100k requisições de geocoding/mês — cobre o Moppy com folga no início, **sem billing/cartão**

**Onde entra no código:**
- `moppy-admin/lib/mapbox.ts` — `geocodeAddress()` (endereço → coordenada) e `distanceKm()` (raio/distância, calculado local, sem API)
- `moppy-mobile` — `@rnmapbox/maps` instalado e configurado (plugin no `app.json`), pronto pra renderizar mapa com pinos quando as telas forem implementadas

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
| **Firebase** | ✅ 100% (pro que vamos usar) | Projeto criado, Auth (Email+Google) ativado, Firestore + rules publicadas. Storage não é mais necessário |
| **Cloudinary** | ✅ 100% | Chaves reais configuradas, upload real implementado e testado. Falta só ligar câmera/galeria real nas telas (item separado) |
| **Asaas** | ⏳ 20% | Endpoint de webhook existe, mas `.env.local` está com valor mock e o código não faz nenhuma chamada real à API do Asaas ainda. Falta: API Key real + implementar integração real + Webhook |
| **Mapbox** | ✅ 100% | Sem Google Maps — Mapbox não exige cartão. Token público e token de downloads reais, geocoding testado |
| **Vercel** | ⏳ Deixa pra depois | Precisa de domínio real (será gerado depois) |
| **EAS/Lojas** | ⏳ Bloco 9.5 | Apple Developer ($99/ano) + Google Play ($25) |

---

## ✅ Resumo 2026-08-29

**Pronto pra testar localmente:**
- ✅ Firebase (Auth + Firestore)
- ✅ Cloudinary real (chaves configuradas, upload testado — pasta `Moppy/`, KYC como `authenticated`)
- ✅ Pagamento simulado (mock via cron — não é o Asaas real)

**Faltam (mas não bloqueiam desenvolvimento):**
- ⏳ Mapbox — só falta criar a conta e colar o token (não depende de cartão)
- ⏳ **Asaas API Key real + integração real** (hoje é mock — precisa antes do Asaas Webhook)
- ⏳ Asaas Webhook (Vercel deploy)
- ⏳ OAuth iOS/Android (EAS build)

~~Storage Firebase (Blaze upgrade)~~ — removido do escopo em 2026-09-04, mídia sensível vai pelo Cloudinary.

---

**Como usar:** quando tiver as chaves de um serviço, me manda aqui. Configuro direto no `.env.local` (gitignored, seguro). Nada disso vai pra `.env.example` — esse fica como referência vazia.
