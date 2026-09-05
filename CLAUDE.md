@AGENTS.md

# CLAUDE.md — Moppy Admin

Guidelines para Claude trabalhar neste repositório. Este é 1 de 2 repositórios do projeto Moppy — o outro é [`moppy-mobile`](https://github.com/jehuneto17-cell/moppy-mobile) (Expo/React Native). Os dois apontam pro mesmo projeto Firebase (`moppy-4ae68`) e são independentes entre si (sem dependência de build um do outro).

## Contexto do Projeto

**Nome:** Moppy
**Tipo:** Marketplace de faxina (mobile + web)
**Este repo:** Painel Admin (Next.js) + configuração/regras do Firebase
**Localização:** Itaú de Minas, MG

## Identidade Visual

```
Logo: Gota d'água branca
Cor Primária: Roxo #A78BFA
Tipografia: Inter
Estilo: Minimalista
```

## Stack

- Next.js (App Router) + TypeScript
- Firebase Admin SDK + Firestore/Auth/Storage
- Tailwind CSS + Shadcn/ui
- Asaas API (pagamentos)

## Documentação completa do projeto

Toda a documentação de produto, arquitetura, banco de dados, fluxo de pagamento e estado do projeto vive em `docs/fabrica/` **neste repositório** (é a cópia única — o moppy-mobile não duplica isso, só referencia daqui). Principais arquivos: `ESTADO.md`, `ARCHITECTURE.md`, `DATABASE.md`, `PAYMENT-FLOW.md`, `BUSINESS-RULES.md`.

## Firebase — este repo é o dono

`firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json` e `storage.rules` vivem aqui. Deploy de regras/índices sempre a partir deste repo (`firebase deploy --only firestore:rules,firestore:indexes,storage`), nunca do moppy-mobile.

## Fluxo de Pagamento

1. Cliente publica pedido
2. Faxineira se candidata
3. Cliente escolhe faxineira
4. Cliente paga via cartão (pré-autorização no Asaas)
5. Serviço executado
6. D+15: Faxineira recebe (Asaas transfere)
7. Moppy fica com X% (ver `docs/fabrica/PAYMENT-FLOW.md`)

## Guidelines para Claude

### Estilo de Trabalho
- Ponytail full: código mínimo, reutilizar, stdlib first
- Sem over-engineering
- Uma coisa por vez

### Ao Escrever Código
- TypeScript obrigatório
- Componentes pequenos e reutilizáveis
- Sem comentários óbvios
- Testes: só pras regras de negócio críticas

### Segurança
- Validar tudo em endpoints (não confiar no cliente)
- Regras Firestore rígidas (por role)
- Nunca commitar `.env.local` ou secrets
- Checkout sempre via backend (nunca expor keys do Asaas)

### Quando Pedir Confirmação
- Deletar código ou arquivos
- Mudar stack ou dependências
- Envolver novo vendor/API
- Deploy pra produção
- Mudar `firestore.rules` (afeta os dois apps)

### Permissões
- ✅ Ler e escrever código
- ✅ Criar branches e commits
- ✅ Rodar testes e lint
- ⚠️ Push pra main — confirmar sempre
- ⚠️ Criar issues/PRs — confirmar
- ❌ Force push
- ❌ Deletar branches sem avisar

## Requisitos Locais

- Node.js 18+
- Java 21+ (Firebase Emulator Suite — Firestore/Storage rodam em JVM)
- Firebase CLI (`npm i -g firebase-tools`)

## Histórico de Alterações

| Data | Mudança |
|------|---------|
| 2026-08-26 | Monorepo criado (apps/mobile, apps/web-admin, shared/) |
| 2026-08-26 a 2026-08-27 | Ver histórico completo de commits deste repo e do moppy-mobile para o desenvolvimento pré-split (Etapa 8, Blocos 1–7) |
| 2026-08-29 | Split do monorepo em 2 repositórios: `moppy-mobile` e `moppy-admin` (este). Firebase config, regras e `docs/fabrica/` centralizados aqui. `shared/` duplicado (era usado por 0 consumidores até aqui, custo do split é baixo) |
| 2026-09-04 | Arquitetura de pagamento redesenhada por `fab-pagamentos`: pré-autorização de cartão é indisponível para a atividade econômica da Moppy no Asaas (restrição real confirmada no sandbox), então o modelo virou cobrança real em D-1 + estorno, sem subconta e sem `split[]`. `PAYMENT-PROFILE.md`, `PAYMENT-FLOW.md` e `PAYMENT-IMPLEMENTATION.md` reescritos; `PAYMENT-EDGE-CASES.md` com cabeçalho de correção. Nenhum código alterado — aguardando Gate 3 |
| 2026-09-04 | **Gate 3 (Pagamento) aprovado pelo Jehu.** Etapa 8 liberada para a integração real do Asaas — ordem de implementação em `docs/fabrica/ESTADO.md` |

## Contatos & Referências

- **Cliente:** Moppy
- **Asaas Docs:** https://asaas.com/developers
- **Next.js Docs:** https://nextjs.org/docs
- **Firebase Docs:** https://firebase.google.com/docs
