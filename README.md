# Moppy Admin — Painel Admin

Painel administrativo (Next.js) do Moppy — marketplace de faxina. Repositório irmão: [`moppy-mobile`](https://github.com/jehuneto17-cell/moppy-mobile), mesmo projeto Firebase.

## Estrutura

```
app/                # Rotas e páginas (App Router)
lib/                # Firebase Admin, Asaas, split de pagamento
shared/              # Tipos e utils compartilhados (cópia local, também existe em moppy-mobile)
docs/fabrica/        # Documentação completa do projeto (specs, arquitetura, estado, etc)
firebase.json        # Config do projeto Firebase (regras, emulators) — fonte única
firestore.rules
firestore.indexes.json
storage.rules
```

Este repo é o "dono" da configuração do Firebase (regras, índices, emulators) — as duas apps (mobile e admin) apontam pro mesmo projeto Firebase, mas o deploy de regras/índices só acontece a partir daqui.

## Rodando local

```bash
npm install
npm run emulators   # Firebase emulators (Auth + Firestore + Storage)
npm run dev          # Next.js dev server
```

Precisa de `.env.local` (não commitado) com as chaves do Firebase — ver `.env.example`.

## Deploy

- **App:** Vercel (produção)
- **Regras/índices do Firestore:** `firebase deploy --only firestore:rules,firestore:indexes,storage` a partir deste repo

## Status

Ver `docs/fabrica/ESTADO.md`.
