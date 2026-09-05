# Moppy — Guia de Implementação de Pagamento

**Projeto:** Moppy — Marketplace de Faxina
**Última atualização:** 2026-09-04
**Status:** ✅ Aprovado — Gate 3 (Jehu, 2026-09-04) — corrigido contra o sandbox real

> **Este documento estava errado em pontos críticos até 2026-09-04.** As correções abaixo vieram de testes ao vivo contra o sandbox do Asaas, não de leitura de documentação:
>
> | Estava | É |
> |---|---|
> | `Authorization: Bearer <chave>` | **`access_token: <chave>`** — `Bearer` devolve 401 |
> | `POST /payments` com `authorizeOnly: true` | **Não existe.** Cobrança com `creditCardToken` volta `CONFIRMED` na hora |
> | `POST /payments/{id}/capture` | **Não existe** neste modelo — não há hold para capturar |
> | `POST /creditCard` (tokenizar) | **`POST /v3/creditCard/tokenizeCreditCard`** |
> | `POST /accounts` (subconta por faxineira) | **Fora do modelo** — nunca foi usado no código |
> | `POST /dict/transferValue` (saque) | **`POST /v3/transfers`** com `pixAddressKey` |
>
> Contexto completo da mudança de arquitetura: `PAYMENT-PROFILE.md` §0.

---

## 1. Pré-implementação

### 1.1 Variáveis de ambiente

Todas server-side, na Vercel. Nenhuma no app mobile.

```bash
# Asaas
ASAAS_API_KEY=$aact_hmlg_...            # sandbox começa com $aact_hmlg_, produção com $aact_prod_
ASAAS_BASE_URL=https://sandbox.asaas.com/api/v3
ASAAS_WEBHOOK_TOKEN=<token que você define ao cadastrar o webhook>

# Crons
CRON_SECRET=<segredo forte>

# Firebase (já configurado)
FIREBASE_PROJECT_ID=moppy-4ae68
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
```

**Removida:** `ASAAS_WALLET_ID` — só fazia sentido no modelo com subconta/split, que foi descartado.

**Sobre a base URL:** `https://sandbox.asaas.com/api/v3` está **confirmado ao vivo**. A URL de produção **não foi testada** — a documentação e a skill `pagamento-asaas` divergem entre `https://api.asaas.com/v3` e `https://api.asaas.com/api/v3`. Confirmar com uma chamada real antes do go-live; chave de sandbox contra URL de produção (ou o contrário) dá `401 invalid_environment`.

Checklist:
- [ ] `.env.local` fora do git (`.gitignore`)
- [ ] `.env.example` sem valores reais
- [ ] Chaves só na Vercel (Project Settings → Environment Variables)
- [ ] `ASAAS_API_KEY` real no sandbox (hoje `.env.local` tem `mock`)

### 1.2 Coleções do Firestore

Nomes reais, como o código já usa — o desenho antigo citava `payment_events` e `cleaner_wallets`, que não existem.

```javascript
// payments/{orderId}          ← o doc id É o order id (chave natural de idempotência)
{
  payment_id: string,          // = orderId
  order_id: string,
  client_id: string,
  cleaner_id: string,

  card: { token, last_four, brand },     // NUNCA número, CVV ou validade

  amount: {
    gross: number,             // o que o cliente é cobrado (base + taxa dele + urgência)
    split_base: number,        // base elegível a comissão (sem a taxa de urgência)
  },

  status: string,              // enum em PAYMENT-FLOW.md §2
  status_history: [{ status, timestamp }],

  asaas: {
    customer_id: string,
    payment_id: string,        // id da cobrança (era "preauth_id")
    refund_id: string | null,
  },

  charge_attempt: number,      // 0..3   (era "preauth_attempt")
  next_retry_at: Timestamp | null,

  split: { ...computeSplit(), split_executed_at },
  release_at: Timestamp,       // confirmação + 15 dias
  balance_released: boolean,

  created_at, updated_at,
}

// payments/{orderId}/events/{autoId}    ← subcoleção, idempotência do webhook
{
  type: string,                // charge_attempt | charge_success | refund | webhook | chargeback
  status: string,              // success | failed | pending
  actor: string,               // "system" | "client" | "admin:{uid}"
  asaas_event_id: string|null, // chave de idempotência do webhook
  asaas_response: object|null,
  error: string|null,
  timestamp,
}

// wallets/{cleanerId}
{
  wallet_id: string,
  balance: {
    total: number,
    pending_release: number,   // "a liberar"
    available: number,         // "disponível"
    pending_release_date: Timestamp,
  },
  updated_at,
}

// wallets/{cleanerId}/transactions/{autoId}
{ type: "credit"|"withdraw"|"debit", amount, balance_after, order_id, reason, release_at, timestamp }
```

Índices necessários: `payments` por `(status, next_retry_at)` e por `(status)`; `orders` por `(status, scheduled_at)`.

---

## 2. Endpoints do Asaas

### 2.1 Autenticação (CORRIGIDA)

Todo request:

```
POST https://sandbox.asaas.com/api/v3/payments
Content-Type: application/json
User-Agent: moppy-admin
access_token: $aact_hmlg_...
```

**Não é `Authorization: Bearer`.** Confirmado com curl: `Bearer` → **401**, `access_token` → **200**.

`User-Agent` é obrigatório para contas criadas a partir de 13/06/2024.

### 2.2 Criar cliente — `POST /v3/customers`

```json
{ "name": "Maria Silva", "cpfCnpj": "12345678901", "email": "maria@x.com", "mobilePhone": "11999999999" }
```

Resposta: `{ "id": "cus_000005113026", ... }` → guardar em `users/{id}.asaas_customer_id` e **reutilizar sempre**. O Asaas permite duplicar cliente sem avisar.

### 2.3 Tokenizar cartão — `POST /v3/creditCard/tokenizeCreditCard`

Nome exato do endpoint (não é `/v3/creditCard/tokenize`).

```json
{
  "customer": "cus_000005113026",
  "creditCard": {
    "holderName": "MARIA SILVA",
    "number": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2027",
    "ccv": "123"
  },
  "creditCardHolderInfo": {
    "name": "Maria Silva", "email": "maria@x.com", "cpfCnpj": "12345678901",
    "postalCode": "01310000", "addressNumber": "100", "phone": "11999999999"
  },
  "remoteIp": "<ip do cliente>"
}
```

Resposta: `{ "creditCardToken": "a1b2c3...", "creditCardNumber": "1111", "creditCardBrand": "VISA" }`

Guardar **só** `creditCardToken`, `last_four` e `brand` em `users/{id}/cards/{cardId}`.

### 2.4 Cobrar — `POST /v3/payments`  ⚠️ COBRA NA HORA

```json
{
  "customer": "cus_000005113026",
  "billingType": "CREDIT_CARD",
  "value": 152.53,
  "dueDate": "2026-09-05",
  "description": "Faxina Moppy - pedido ORD-abc123",
  "externalReference": "ORD-abc123",
  "creditCardToken": "a1b2c3..."
}
```

Resposta de sucesso: `{ "id": "pay_080225913252", "status": "CONFIRMED", "value": 152.53, "netValue": 147.46, ... }`

**`status: "CONFIRMED"` significa que o dinheiro saiu do cartão do cliente.** Não existe `authorizeOnly`, não existe `chargeType: "DEBIT"` para segurar sem cobrar, e a pré-autorização estendida (`POST /v3/creditCard/preAuthorization/config`) é **rejeitada** para a atividade econômica da Moppy.

Recusa vem como HTTP 400 com `{ "errors": [{ "code": "...", "description": "..." }] }`.

**Não usar `split[]`.** Existe e funciona, mas dividiria o dinheiro em D-1, antes do serviço — ver `PAYMENT-FLOW.md` §3.4.

**Antes de criar, sempre:** `GET /v3/payments?externalReference={orderId}` — se voltar cobrança, adotar o id em vez de criar outra. Cobrança duplicada agora é dinheiro real fora da conta do cliente.

### 2.5 Consultar — `GET /v3/payments/{id}`

Usado pelo cron de reconciliação. `status` possíveis relevantes: `PENDING`, `CONFIRMED`, `RECEIVED`, `REFUNDED`, `CHARGEBACK_REQUESTED`.

### 2.6 Estorno — `POST /v3/payments/{id}/refund`

Total: body vazio ou sem `value`. Parcial: `{ "value": 107.53, "description": "Cancelamento com menos de 12h" }`.

Existe também `DELETE /v3/payments/{id}`, que cancela/estorna a cobrança inteira. **Preferir `/refund`**: o comportamento é explícito e o parcial usa o mesmo endpoint.

**A taxa da transação não é devolvida no estorno** (confirmar o valor exato no sandbox). É custo absorvido pelo app — ver `PAYMENT-PROFILE.md` §3.

### 2.7 Saque PIX — `POST /v3/transfers`

```json
{
  "value": 124.97,
  "pixAddressKey": "11999999999",
  "pixAddressKeyType": "PHONE",
  "description": "Saque Moppy"
}
```

`pixAddressKeyType`: `CPF` | `EMAIL` | `PHONE` | `EVP`. Transfere da conta principal da Moppy direto para a chave da faxineira — sem subconta.

### 2.8 Webhook — `POST /v3/webhooks`

```json
{
  "name": "moppy-payments",
  "url": "https://<dominio>/api/webhooks/asaas",
  "email": "jehuneto17@gmail.com",
  "authToken": "<ASAAS_WEBHOOK_TOKEN>",
  "sendType": "SEQUENTIALLY",
  "events": ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED", "PAYMENT_REFUNDED",
             "PAYMENT_CHARGEBACK_REQUESTED", "PAYMENT_DELETED"]
}
```

O Asaas devolve o `authToken` no header **`asaas-access-token`** de cada notificação. Validar antes de processar.

Assinar só os eventos processados: fila com falhas repetidas é pausada pelo Asaas e para de notificar.

---

## 3. Idempotência

Três chaves distintas, todas obrigatórias:

| Risco | Chave | Onde |
|---|---|---|
| Cobrar o cliente duas vezes | doc `payments/{orderId}` + `externalReference` consultado antes de criar | cron de cobrança |
| Processar o mesmo webhook duas vezes | `asaas_event_id` em `payments/{orderId}/events` | `isEventProcessed()` (já implementado) |
| **Estornar duas vezes** | checar `status` antes de chamar o Asaas | **`runRefund` — hoje NÃO checa. Corrigir** |

```javascript
// Guarda que falta em runRefund (lib/payments.ts)
if (["refunded", "partial_refund", "refund_pending"].includes(payment.status)) {
  throw new Error(`pagamento já estornado (status: ${payment.status})`);
}
```

Crédito na carteira sempre dentro de `runTransaction` (já é assim em `creditWallet`).

---

## 4. O que muda no código existente

Inventário do que a sessão principal precisa mexer ao implementar `lib/asaas.ts` de verdade.

| Arquivo | Mudança |
|---|---|
| `lib/asaas.ts` | Hoje é `export * from "@moppy/shared/mocks/asaas"` — e o import **nem resolve** (`npx tsc --noEmit` já falha). Vira o cliente HTTP real: `createCustomer`, `tokenizeCard`, `createCharge`, `getPayment`, `findByExternalReference`, `refundPayment`, `createPixTransfer` |
| `shared/mocks/asaas.ts` | `preauthorize` / `capturePayment` somem. Entram `createCharge` e `getPayment`, com a mesma assinatura do cliente real, para manter o caminho de teste offline |
| `app/api/cron/preauth/route.ts` | Renomear para `charge`. `asaas.preauthorize` → `asaas.createCharge`. Estados `preauth_*` → `charge_*`. Adicionar a consulta por `externalReference` antes de criar |
| Confirmação do pedido (C19) | **Novo:** se `scheduled_at − agora < 24h`, cobrar na hora. Sem isso o pedido nunca é cobrado (o cron só olha "amanhã") |
| `lib/payments.ts` → `runCapture` | Renomear para `settleOrder`. **Não chama mais o Asaas** — só calcula o split e credita a carteira. Guarda de status: `charge_success` (era `preauth_success`) |
| `lib/payments.ts` → `runRefund` | Chamar o estorno real; usar `payment.asaas.payment_id` (era `preauth_id`, campo que deixa de existir); **adicionar guarda contra estorno duplicado** |
| `lib/split.ts` | `app_total` deve **subtrair** a antecipação, não somar; a taxa incide sobre `amount.gross`, não sobre `split_base` |
| `app/api/webhooks/asaas/route.ts` | Header `asaas-access-token` (não `authorization: Bearer`); payload real (`{id, event, payment}`); achar o pedido por `payment.externalReference`; tratar `PAYMENT_CHARGEBACK_REQUESTED` |
| `app/api/wallets/withdraw/route.ts` | `asaas.createTransfer({subaccountId})` → `createPixTransfer({value, pixAddressKey, pixAddressKeyType})` com a chave real da faxineira |
| **Novo** `app/api/cron/reconcile/route.ts` | A cada 2h, sincroniza pagamentos pendentes com `GET /v3/payments/{id}` |
| **Novo** cancelamento com estorno | Hoje o cancelamento no admin (`app/pedidos/page.tsx`) só escreve `status: "cancelled"` no Firestore, **sem tocar no pagamento**. Com dinheiro real isso deixa o cliente cobrado por um pedido cancelado. Precisa virar endpoint que aplica as regras de `PAYMENT-FLOW.md` §5 |
| `vercel.json` | Renomear o cron `preauth` → `charge`, adicionar `reconcile` |

---

## 5. Testes no sandbox

### 5.1 Cartões

| Cartão | Resultado |
|---|---|
| 5162306219378829 | Aprovado (Mastercard) |
| 4000000000000010 | Recusado |

Validade futura, CVV qualquer. **Confirmar a lista atual no painel do sandbox** — o Asaas mudou esses números no passado, e a lista da versão anterior deste documento (4111…, 4000000000000002) não foi verificada.

### 5.2 Cenários obrigatórios

| # | Cenário | Passa quando |
|---|---|---|
| 1 | Fim a fim feliz | pedido → cron cobra (`CONFIRMED`) → webhook → `charge_success` → cliente confirma → `settled` → carteira "a liberar" com o líquido certo → D+15 → "disponível" → saque cai por PIX |
| 2 | Cartão recusado | 3 tentativas com intervalo, `charge_failed`, push de troca de cartão, cancelamento em 6h, agenda liberada |
| 3 | Troca de cartão dentro das 6h | cobrança dispara na hora da troca, contador zera, pedido segue |
| 4 | Webhook duplicado | mesmo `event_id` 2×, um único evento gravado, nenhum crédito duplicado |
| 5 | Cron rodando 2× | uma única cobrança no Asaas para o mesmo `externalReference` |
| 6 | Cancelamento ≥12h | estorno total, cliente recebe 100% do cobrado, carteira intocada |
| 7 | Cancelamento <12h | R$45 na carteira da faxineira, R$107,53 estornados, `partial_refund` |
| 8 | Disputa parcial | estorno de X, crédito do resto, um único estorno mesmo clicando 2× |
| 9 | Auto-confirmação em 24h | cron fecha o pedido, credita, registra `actor: system` |
| 10 | Pedido confirmado com <24h | cobrado na confirmação, não fica esperando o cron |
| 11 | Chargeback | `chargeback_requested`, saldo do pedido congelado, alerta no admin |
| 12 | Taxa real | `value − netValue` do Asaas comparado com `computeSplit`; ajustar as constantes se divergir |

**Cenário 12 é bloqueante para o Gate:** as taxas de `lib/split.ts` (R$0,49 + 3%, antecipação 0,65%) são **estimativas**. Precisam ser trocadas pelos números reais antes da produção.

### 5.3 Reconciliação manual

Depois da bateria, comparar o extrato do Asaas do sandbox com a coleção `payments`. Toda linha do extrato tem que ter um `externalReference` que aponta para um pedido. Se sobrar linha, a idempotência furou.

---

## 6. Segurança — checklist

- [ ] `access_token` só server-side; nunca no bundle do mobile
- [ ] Nunca gravar PAN, CVV ou validade — só token, últimos 4 e bandeira
- [ ] Webhook valida `asaas-access-token`; 401 se não bater
- [ ] Crons validam `CRON_SECRET`; 401 se não bater
- [ ] Endpoints do app validam Firebase ID token; do admin, session cookie + `admin_whitelist`
- [ ] Valor **sempre** recalculado no servidor a partir de `orders/{id}.pricing`
- [ ] `payments/{id}/events` imutável por regra do Firestore (sem update, sem delete)
- [ ] Logs sem dado sensível
- [ ] HTTPS em toda URL de webhook
- [ ] Rate limit na criação de pedido e na solicitação de saque

---

## 7. Ida para produção

Pré-requisitos: CNPJ, conta Asaas de produção aprovada, os 12 cenários passando no sandbox, taxas reais substituídas, auditoria de segurança (`fab-seguranca`) sem achado crítico.

```bash
# 1. Chaves de produção na Vercel (nunca em arquivo)
vercel env add ASAAS_API_KEY production
vercel env add ASAAS_BASE_URL production      # CONFIRMAR a URL correta primeiro
vercel env add ASAAS_WEBHOOK_TOKEN production

# 2. Cadastrar o webhook de produção apontando para o domínio real
# 3. Deploy
# 4. Um pedido real de valor mínimo, ponta a ponta, com estorno no fim
# 5. Monitorar 24h antes de abrir para clientes
```

**Rollback:** desabilitar os crons na Vercel (para a cobrança), remover o webhook no painel do Asaas, tratar os pagamentos pendentes na mão. Com dinheiro real, é melhor parar de cobrar do que cobrar errado.

**Verificar na conta de produção antes do go-live:** a restrição de pré-autorização é ligada à atividade econômica cadastrada, então a conta de produção provavelmente terá a mesma limitação — mas confirmar, porque se por algum motivo a pré-autorização for liberada, vale reavaliar o modelo (o hold é melhor para o cliente que o par cobrança+estorno).

---

## PRÓXIMO PASSO

1. **A autenticação é `access_token` no header**, a base do sandbox é `https://sandbox.asaas.com/api/v3`, e a de produção precisa ser confirmada com uma chamada antes do go-live.
2. **Não existe captura:** `POST /v3/payments` com `creditCardToken` cobra na hora; a volta é sempre `POST /v3/payments/{id}/refund`. As seções de pré-autorização, captura e subconta foram removidas por não se aplicarem a esta conta.
3. **§4 lista arquivo por arquivo o que muda no código** — incluindo três buracos que já existem hoje e ficam perigosos com dinheiro real: estorno sem guarda de duplicidade, cancelamento no admin que não toca no pagamento, e pedido confirmado com menos de 24h que o cron nunca cobra.

**Gate 3 aprovado em 2026-09-04.** Implementação liberada.
