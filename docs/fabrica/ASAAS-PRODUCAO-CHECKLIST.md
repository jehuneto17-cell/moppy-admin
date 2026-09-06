# Checklist — Migrar o Asaas do sandbox pra produção

Pra usar assim que o cliente (dono da Moppy) criar a conta de produção no Asaas. Tudo que está marcado
"pegar com o cliente" precisa vir dele — não dá pra gerar isso por fora.

---

## 0. Pré-requisito pro cliente criar a conta

- **CNPJ** — obrigatório, o Asaas não abre conta de produção pra pessoa física recebendo como empresa
- **Conta bancária** vinculada ao CNPJ, pra onde o saldo vira saque de verdade

## 1. Ao criar a conta, o cliente precisa declarar a **atividade econômica correta**

- Declarar como **limpeza residencial / serviços domésticos** (ou categoria mais próxima que o Asaas oferecer)
- **Não declarar outra atividade pra tentar liberar algum recurso** (ex: já testamos isso pra tentar habilitar
  pré-autorização estendida — o Asaas só libera pra hotelaria/locação de veículo/cruzeiro/táxi, e declarar
  falso é risco real de bloqueio de conta). O Moppy já foi desenhado pra funcionar sem pré-autorização, então
  isso não é um bloqueio de verdade — só não tentar contornar.

## 2. O que pegar com o cliente assim que a conta existir

- [ ] **API Key de produção** (Asaas Console → Integrações → Chaves de API — gerar uma nova, é diferente da
  do sandbox)
- [ ] Confirmação de que a **conta bancária pra saque** está cadastrada e validada no painel Asaas dele

## 3. O que fazer no código/infra depois de ter a API Key

- [ ] Trocar `ASAAS_BASE_URL` de `https://sandbox.asaas.com/api/v3` pra `https://api.asaas.com/v3` — no
  `.env.local` **e** na Vercel (`vercel env add ASAAS_BASE_URL production`, ou editar direto na dashboard)
- [ ] Trocar `ASAAS_API_KEY` pela chave de produção — mesmo processo (local + Vercel)
- [ ] **Recriar o webhook** — o token de produção é diferente do sandbox, precisa gerar de novo:
  - Asaas Console (conta de produção) → Integrações → Webhooks
  - Nome: `Moppy`
  - URL: `https://moppy-admin.vercel.app/api/webhooks/asaas`
  - Eventos: pagamento confirmado, falhou, estornado, chargeback (os mesmos que já usamos no sandbox)
  - Gerar token → colar em `ASAAS_WEBHOOK_TOKEN` (local + Vercel)
- [ ] Redeployar (`vercel --prod`) depois de trocar as env vars — mudança de env só aplica em builds novos

## 4. Depois de trocar pra produção — reconfirmar com dinheiro de verdade

- [ ] **Rodar de novo o Cenário 12** (taxa real) com um cartão de verdade e valor pequeno (R$10-20) — a taxa
  cobrada em produção pode ser diferente da sandbox. Comparar `value - netValue` com o que `lib/split.ts`
  calcula, e corrigir a fórmula se divergir (foi corrigida uma vez no sandbox, ver `ESTADO.md` 2026-09-05 —
  pode não valer igual em produção)
- [ ] Fazer **um pedido de teste ponta a ponta de verdade** (cliente real paga, faxineira real recebe, saque
  real via PIX) antes de anunciar o app pro público
- [ ] Confirmar que o **webhook de produção está mesmo chegando** (o cron de reconciliação a cada 2h cobre
  isso, mas vale conferir manualmente na primeira cobrança real)

## 5. Trava de segurança que já existe (não precisa fazer nada)

O modelo do Moppy não usa subconta nem `split[]` do Asaas — 100% do dinheiro entra na conta principal do
cliente, e a carteira de cada faxineira é só um livro-razão no Firestore (ver `PAYMENT-PROFILE.md`). Isso
significa que a Moppy segura dinheiro de terceiros em trânsito — o cliente (dono da Moppy) precisa ter ciência
disso com o contador dele antes de operar de verdade (tratamento contábil do repasse), mas isso é decisão de
negócio do cliente, não algo que o código resolve.

---

**Resumo do que só o Jehu (ou o cliente dele) resolve:** CNPJ, conta Asaas de produção, conta bancária vinculada,
API Key de produção. O resto (trocar env vars, recriar webhook, redeployar, re-testar) eu faço assim que tiver
a API Key em mãos.
