# Moppy — Fluxo de Pagamento Detalhado

**Projeto:** Moppy — Marketplace de Faxina
**Última atualização:** 2026-09-04
**Status:** ✅ Aprovado — Gate 3 (Jehu, 2026-09-04) — modelo sem pré-autorização

> **Mudança de arquitetura (2026-09-04).** Este documento foi reescrito porque a pré-autorização de cartão **não está disponível** para a atividade econômica da Moppy no Asaas (restrição confirmada ao vivo no sandbox, ver `PAYMENT-PROFILE.md` §0). Não há mais "reservar em D-1 e capturar em D+1". Agora há **cobrança real em D-1** e **estorno** quando o serviço não acontece.

---

## 1. Caminho feliz

```
FECHAMENTO DO PEDIDO (D-n)
├─ Cliente escolhe a candidata (C19) → pedido vira "confirmed"
├─ Nenhuma cobrança acontece ainda
└─ EXCEÇÃO: se scheduled_at − agora < 24h, cobra AGORA
   (o cron de D-1 já passou ou não vai passar a tempo)

D-1, 19h BRT — CRON DE COBRANÇA
├─ Busca pedidos "confirmed" agendados para amanhã, sem cobrança criada
├─ Para cada um:
│  ├─ Guarda de idempotência: já existe payments/{orderId}? pula
│  ├─ Guarda de idempotência 2: GET /v3/payments?externalReference={orderId}
│  │  → se já existe cobrança no Asaas, adota o id dela e não cria outra
│  ├─ POST /v3/payments  { customer, billingType: "CREDIT_CARD",
│  │                       creditCardToken, value, dueDate, externalReference }
│  ├─ Asaas responde status "CONFIRMED" na hora — o dinheiro FOI cobrado
│  └─ payment.status = charge_pending; asaas.payment_id = <id>
│
├─ Webhook PAYMENT_CONFIRMED chega → payment.status = charge_success
│  (o status da resposta HTTP é indício; a confirmação é o webhook)
│
└─ Cliente recebe push: "Pagamento confirmado. Sua faxina é amanhã às HH:MM"

D — DIA DO SERVIÇO
├─ Faxineira clica "Cheguei" (F11)
│  ├─ A: cliente responde em ≤10min → código de 4 dígitos
│  ├─ B: cliente não responde → foto + GPS, valida raio de 50m
│  └─ C: GPS falha → bloqueado, aciona suporte
├─ Serviço é executado (F12, cronômetro)
├─ Faxineira clica "Concluído"
└─ Cliente recebe: "Está tudo certo?" → [Sim] [Tive um problema]

ATÉ 24h APÓS "CONCLUÍDO"
├─ A: CLIENTE CONFIRMA (C23) — ou o cron auto-confirm dispara em 24h
│  ├─ NENHUMA chamada ao Asaas: o dinheiro já está na conta da Moppy
│  ├─ computeSplit(amount.gross) → comissão, taxa 50/50, antecipação
│  ├─ creditWallet(cleaner_id, cleaner_net) com release_at = agora + 15 dias
│  ├─ payment.status = settled ; order.status = completed
│  └─ Ambos notificados para avaliar (C25 / F15)
│
└─ B: CLIENTE REPORTA PROBLEMA (C24)
   ├─ Descrição obrigatória + até 3 fotos
   ├─ payment.status = disputa_aberta — dinheiro fica parado na Moppy,
   │  carteira da faxineira NÃO é creditada
   ├─ Faxineira tem 24h para responder (F14)
   ├─ Admin decide em até 48h (A05) — ver §5
   └─ Ambos notificados da decisão

D+15 (contado da CONFIRMAÇÃO, não da cobrança)
├─ Cron release-balance move "a liberar" → "disponível"
└─ Faxineira vê o botão "Solicitar saque"

SAQUE
├─ Faxineira pede valor ≥ R$20 e ≤ saldo disponível
├─ POST /v3/transfers { value, pixAddressKey, pixAddressKeyType }
│  → direto da conta principal da Moppy para a chave PIX dela
└─ Cai em 1-2 dias úteis
```

---

## 2. Máquina de estados

```
                    pending
                       │  cron D-1 (ou confirmação com <24h)
                       ▼
                 charge_pending ──────────────┐
                       │                      │ recusa
                       │ PAYMENT_CONFIRMED    ▼
                       │              charge_retry_1 ──(+1h)──► charge_retry_2
                       │                                              │
                       │                                    3ª recusa │
                       ▼                                              ▼
              ┌── charge_success ──┐                            charge_failed
              │        │           │                                  │ 6h sem troca
              │        │           │                                  ▼
              │        │           │                         cancelled_no_payment
              │        │           │
   cancelamento│  confirma│    reclama│
   ou faxineira│  (ou 24h)│          │
      cancela  │        │            ▼
              │        │      disputa_aberta
              │        │            │ admin decide
              │        ▼            ├──► settled          (libera 100%)
              │     settled ◄───────┤
              │        │            ├──► partial_refund   (estorna X, credita o resto)
              │        │            └──► refunded         (estorna 100%)
              │        │
              │        │ D+15 (cron release-balance)
              │        ▼
              │   wallet.available  ──► saque PIX
              │
              ├──► refunded          (cancelou ≥12h, ou faxineira cancelou)
              └──► partial_refund    (cancelou <12h: 30% para a faxineira)

     qualquer estado pós-cobrança
              └──► chargeback_requested  (webhook do banco; congela o saldo do pedido)

     antes da cobrança
         pending ──► cancelled_free
```

**Enum de `payments/{orderId}.status`:**

```javascript
status: enum [
  "pending",               // pedido confirmado, cobrança ainda não criada
  "charge_pending",        // cobrança enviada ao Asaas, aguardando webhook
  "charge_retry_1",        // recusou, retry agendado (+1h)
  "charge_retry_2",        // recusou de novo, retry final agendado (+1h)
  "charge_success",        // dinheiro cobrado, na conta Asaas da Moppy
  "charge_failed",         // 3 recusas; cliente tem 6h para trocar o cartão
  "settled",               // serviço confirmado, split feito, carteira creditada
  "disputa_aberta",        // cliente reclamou; dinheiro parado, carteira não creditada
  "refunded",              // estorno total processado
  "partial_refund",        // estorno parcial + crédito parcial
  "refund_pending",        // estorno enviado, aguardando o Asaas
  "refund_failed",         // estorno recusado — ação manual do admin
  "cancelled_free",        // cancelado antes de qualquer cobrança
  "cancelled_no_payment",  // cobrança falhou definitivamente
  "chargeback_requested"   // contestado no banco
]
```

**O que NÃO é estado de pagamento:** `saldo_a_liberar` e `saldo_disponivel` saíram do enum. São campos de `wallets/{cleanerId}.balance` (`pending_release` e `available`), movidos pelo cron de D+15.

### Quem move cada transição

| Transição | Quem dispara |
|---|---|
| `pending` → `charge_pending` | Cron `/api/cron/charge` (D-1) ou a confirmação do pedido, se faltar <24h |
| `charge_pending` → `charge_success` | Webhook `PAYMENT_CONFIRMED` (ou o cron de reconciliação, se o webhook sumir) |
| `charge_pending` → `charge_retry_N` → `charge_failed` | Cron, na resposta de recusa |
| `charge_failed` → `cancelled_no_payment` | Cron, 6h depois, se o cliente não trocou o cartão |
| `charge_success` → `settled` | Cliente (C23), cron auto-confirm (24h), ou admin (disputa "libera") |
| `charge_success` → `disputa_aberta` | Cliente (C24) |
| `charge_success` → `refunded` / `partial_refund` | Cliente cancelando, faxineira cancelando, ou admin |
| `disputa_aberta` → `settled` / `partial_refund` / `refunded` | Admin (A05) |
| `settled` → carteira "disponível" | Cron `/api/cron/release-balance` (D+15) |
| qualquer → `chargeback_requested` | Webhook `PAYMENT_CHARGEBACK_REQUESTED` |

### Efeito na agenda da faxineira (o "estoque" da Moppy)

A Moppy não tem estoque de produto: o recurso finito é o **slot na agenda da faxineira**. A regra equivalente à baixa de estoque:

| Estado | Slot |
|---|---|
| `pending`, `charge_pending`, `charge_retry_*` | Reservado (bloqueia outros pedidos no mesmo horário) |
| `charge_failed` | Reservado, mas a faxineira é avisada de que pode cair |
| `charge_success` | **Firme** — a partir daqui a faxineira tem direito a compensação se o cliente sumir |
| `settled`, `disputa_aberta` | Consumido |
| `refunded`, `partial_refund`, `cancelled_free`, `cancelled_no_payment` | **Liberado** — volta para a agenda |

A reserva e a liberação do slot rodam dentro de `runTransaction`, junto com a mudança de estado do pedido. Duas confirmações concorrentes no mesmo horário não podem reservar o mesmo slot.

---

## 3. Integrações

### 3.1 Cron de cobrança (D-1) — `/api/cron/charge`

Substitui `/api/cron/preauth`. Autenticado por `authorization: Bearer ${CRON_SECRET}`. Agenda: `0 22 * * *` (19h BRT).

Duas partes, como hoje:

1. **Novos:** pedidos `confirmed` com `scheduled_at` amanhã e sem doc em `payments/{orderId}` → cria o pagamento e cobra.
2. **Retries:** pagamentos em `charge_retry_1` / `charge_retry_2` com `next_retry_at <= agora` → tenta de novo.

**Mudança obrigatória em relação ao código atual:** o cron só olha "amanhã". Pedido confirmado às 23h para amanhã de manhã, ou pedido para hoje, **nunca é cobrado**. A correção não é no cron — é na confirmação do pedido: se `scheduled_at − agora < 24h`, a cobrança é disparada na hora, pelo mesmo código.

**Idempotência (crítica agora que o dinheiro é real):**

```
chave natural  : payments/{orderId}   (doc id = order id, já é assim)
chave no Asaas : externalReference = orderId
antes de criar : GET /v3/payments?externalReference={orderId}
                 → se vier algo, adota o id e NÃO cria outra cobrança
```

Sem isso, um cron rodando duas vezes cobra o cliente duas vezes — o que com pré-autorização era um susto e agora é dinheiro fora da conta dele.

### 3.2 Webhook do Asaas — `/api/webhooks/asaas`

**Autenticação real:** o Asaas envia de volta, em todo POST, o header **`asaas-access-token`** com o valor configurado no cadastro do webhook. Validar contra `ASAAS_WEBHOOK_TOKEN`. *(O código atual valida `authorization: Bearer` e um payload inventado — precisa ser reescrito.)*

**Payload real:**

```json
{
  "id": "evt_05b708f06202eedb1a34865e8febb6b1",
  "event": "PAYMENT_CONFIRMED",
  "payment": {
    "id": "pay_080225913252",
    "customer": "cus_000005113026",
    "value": 152.53,
    "netValue": 147.46,
    "status": "CONFIRMED",
    "billingType": "CREDIT_CARD",
    "externalReference": "ORD-abc123"
  }
}
```

**Eventos assinados e o que cada um faz:**

| Evento | Ação |
|---|---|
| `PAYMENT_CONFIRMED` | `charge_pending` → `charge_success`. Notifica o cliente |
| `PAYMENT_RECEIVED` | Liquidação na conta (D+30 ou antecipado). Só registra — não muda o estado do pedido |
| `PAYMENT_REFUNDED` | `refund_pending` → `refunded` (ou confirma `partial_refund`) |
| `PAYMENT_CHARGEBACK_REQUESTED` | → `chargeback_requested`. Congela o saldo daquele pedido na carteira se ainda não sacado. Alerta o admin |
| `PAYMENT_DELETED` | Cobrança removida — reconcilia o estado |

Não assinar eventos que não são processados: fila com falha repetida é pausada pelo Asaas.

**Idempotência:** a entrega é *at least once*. Guardar o `id` do evento em `payments/{orderId}/events` e ignorar repetição (já implementado por `isEventProcessed`). Responder 2xx rápido.

**Conciliação pelo `externalReference`:** o webhook traz `payment.externalReference = orderId`. É por ele que se acha o documento, não por uma busca em `asaas.preauth_id`.

### 3.3 Cron de reconciliação (2h) — `/api/cron/reconcile`

Para cada pagamento em `charge_pending`, `refund_pending` ou `charge_retry_*` há mais de 30 minutos:

1. `GET /v3/payments/{asaas_payment_id}`
2. Se o status do Asaas divergir do Firestore, aplica o mesmo tratamento do webhook
3. Loga a divergência (auditoria: significa webhook perdido)

Nenhum pagamento pode ficar órfão. Este cron é o que garante que a resposta da criação da cobrança nunca é a única fonte de verdade.

### 3.4 Split e carteira — **sem subconta, sem `split[]` na cobrança**

Decisão formalizada em `PAYMENT-PROFILE.md` §2. O dinheiro é cobrado 100% para a conta principal da Moppy. A divisão é **contábil, no Firestore**:

```javascript
// Na confirmação do serviço (settled) — nenhuma chamada ao Asaas aqui.
const split = computeSplit(payment.amount.gross);   // atenção: gross, não split_base
await creditWallet(cleaner_id, orderId, split.cleaner_net, agora + 15 dias);
```

O `split[]` da cobrança **não pode** ser usado: ele dividiria o dinheiro em D-1, antes do serviço, quebrando o "a liberar → disponível" e transformando cada estorno em cobrança reversa contra a faxineira.

### 3.5 Saque — `POST /v3/transfers`

```json
{
  "value": 124.97,
  "pixAddressKey": "11999999999",
  "pixAddressKeyType": "PHONE",
  "description": "Saque Moppy"
}
```

Direto da conta principal para a chave PIX da faxineira. Sem subconta, sem `walletId`. O endpoint atual (`/api/wallets/withdraw`) já é modelado assim — só troca o mock pela chamada real e passa a chave PIX de verdade, em vez de `subaccountId: cleanerId`.

---

## 4. Casos de erro

### 4.1 Cobrança recusada (D-1)

| Tentativa | Quando | Ação |
|---|---|---|
| 1 | Cron D-1, 19h | Recusa registrada, `charge_retry_1`, `next_retry_at = +1h` |
| 2 | +1h | Recusa de novo → `charge_retry_2` |
| 3 | +1h | Recusa final → `charge_failed` |
| Escala | Imediato | Push urgente: "Cartão recusado. Troque em até 6h ou o pedido será cancelado" |
| Cancela | +6h sem ação | `cancelled_no_payment`. Faxineira notificada, agenda liberada, sem compensação. Cliente perde 5 de score |

Se o cliente **troca o cartão** dentro das 6h, a troca dispara a cobrança na hora (não espera cron nenhum) e o contador de tentativas zera.

### 4.2 Valor divergente

O servidor **sempre recalcula** o preço a partir de `orders/{id}.pricing`, nunca aceita o total vindo do app. Se o valor da cobrança criada no Asaas divergir do valor recalculado (comparação no cron de reconciliação), o pagamento é marcado para revisão do admin e o pedido não avança para `settled`.

### 4.3 Cobrança duplicada

Três barreiras, nessa ordem: doc `payments/{orderId}` já existente → `externalReference` consultado antes de criar → `PAYMENT_CREATED` duplicado ignorado pelo `event_id`. Se ainda assim duas cobranças existirem para o mesmo pedido, o cron de reconciliação detecta (duas cobranças com o mesmo `externalReference`) e **estorna a mais nova automaticamente**, alertando o admin.

### 4.4 Estorno falha

`refund_failed`. Nunca resolve sozinho. Vai para uma fila visível no painel do admin, com o motivo do Asaas. Enquanto está aí, a carteira da faxineira **não** é creditada e o pedido não fecha.

### 4.5 Estorno duplicado

Risco novo e caro: admin clicando duas vezes em "reembolso total" estorna duas vezes. `runRefund` **precisa** checar o estado antes de chamar o Asaas e recusar se já estiver em `refunded` / `partial_refund` / `refund_pending`. **Hoje o código não checa** — é a correção mais urgente da implementação real.

### 4.6 Webhook não chega / chega duplicado

Não chega → cron de reconciliação (2h) pega. Chega duplicado → `event_id` já registrado, responde 2xx e ignora. Nada é reprocessado.

### 4.7 Chargeback

Novo neste modelo — com pré-autorização quase não existia. Ao receber `PAYMENT_CHARGEBACK_REQUESTED`:

1. `chargeback_requested`, alerta imediato ao admin
2. Se o saldo daquele pedido ainda está em `pending_release`: **congela** (não deixa virar `available`)
3. Se já foi sacado: vira débito na carteira da faxineira (mesmo tratamento do caso "disputa com dinheiro já sacado")
4. A Moppy responde ao banco com a trilha: confirmação de chegada (código ou GPS+foto), chat, horário de conclusão, avaliação

### 4.8 Cliente sumiu (não confirma nem reclama)

24h após "Concluído", o cron auto-confirm fecha o pedido sozinho e credita a faxineira. Registra `confirmed_by: "system"` para auditoria. O dinheiro já estava cobrado — o silêncio do cliente não trava o pagamento da faxineira, que é exatamente a vantagem de cobrar em D-1.

### 4.9 Faxineira não aparece (no-show)

Cliente reporta no dia. Admin confirma pela ausência de confirmação de chegada → **estorno total** ao cliente (`refunded`), penalidade pesada de score na faxineira, custo da taxa de estorno absorvido pelo app.

---

## 5. Cancelamento — os 5 cenários

O corte é **a cobrança**, não mais "a pré-autorização".

### 5.1 Cliente cancela antes da cobrança

Nada foi cobrado. Cancelamento gratuito e imediato. `cancelled_free`. Faxineira notificada, agenda liberada.

### 5.2 Cliente cancela após a cobrança, com ≥12h de antecedência

`POST /v3/payments/{id}/refund` sem `value` (estorno total do que foi cobrado: R$152,53). Estado `refund_pending` → `refunded` no webhook. O cliente recebe de volta **100% do que pagou** — a taxa perdida (~R$5) é absorvida pelo app, porque devolver menos gera reclamação e chargeback.

### 5.3 Cliente cancela após a cobrança, com <12h

Tela de confirmação obrigatória: **"Cancelar agora custa R$45,00 de compensação à faxineira. Você recebe R$107,53 de volta."**

1. Retém 30% da base (R$45,00) → `creditWallet(cleaner_id, orderId, 45.00)`, **sem comissão do app e sem rateio de taxa**
2. `POST /v3/payments/{id}/refund` com `value: 107.53`
3. `partial_refund`

**Mudança em relação ao doc antigo:** ele entregava ~R$41 líquidos à faxineira, descontando taxa. Agora ela recebe os R$45 cheios. Ela é a parte prejudicada, a conta fica explicável em uma linha no app, e o custo extra para a Moppy é menor que o custo de uma faxineira achando que levou desconto num cancelamento que não foi culpa dela.

### 5.4 Faxineira cancela antes da cobrança

Nada cobrado. O pedido volta para `open` e recebe novas candidaturas, se ainda houver tempo; senão, `cancelled_free`. Penalidade de score (−5 a −10 conforme a antecedência). Cliente notificado.

### 5.5 Faxineira cancela após a cobrança

**Estorno total** ao cliente (o cliente não pode pagar por um cancelamento que não é dele). `refunded`. Penalidade de score, mais pesada quanto mais perto do horário. A taxa de estorno é absorvida pelo app — no MVP não há cobrança em dinheiro contra a faxineira; a penalidade é reputacional.

---

## 6. Disputas

### 6.1 Abertura

Cliente clica "Tive um problema" depois de "Concluído". Descrição obrigatória, até 3 fotos. `disputa_aberta`. **O dinheiro já está na conta da Moppy e continua lá** — a carteira da faxineira não é creditada.

### 6.2 Defesa

Faxineira tem 24h, com cronômetro visível. Texto obrigatório + até 3 fotos. Sem resposta, o admin decide só com a versão do cliente.

### 6.3 Decisão do admin (A05)

Timeline disponível: criação, candidatura, seleção, confirmação de chegada (código ou GPS+foto), conclusão, chat, versão do cliente, versão da faxineira.

| Decisão | Ação no Asaas | Carteira | Estado |
|---|---|---|---|
| **Libera** (0% reembolso) | Nenhuma — o dinheiro já é da Moppy | `computeSplit(gross)` credita normal | `settled` |
| **Reembolso parcial** | `POST /v3/payments/{id}/refund` com `value: X` | `computeSplit(base − X)` credita o resto | `partial_refund` |
| **Reembolso total** | `POST /v3/payments/{id}/refund` (sem `value`) | Nada creditado | `refunded` |

Justificativa escrita é obrigatória (mínimo 10 caracteres — já validado no código). Ambas as partes recebem o motivo e o valor.

**Teto:** o ressarcimento pelo app nunca passa do valor da faxina. Danos acima disso ficam entre as partes.

### 6.4 Disputa depois do saque

Se a faxineira já sacou, não há o que segurar. O estorno ao cliente sai do caixa da Moppy e vira **saldo negativo** na carteira da faxineira, que só volta a sacar depois de zerar. Notificação clara, direito de contestar com evidência.

---

## 7. Operações no Asaas — mapa rápido

| Operação | Endpoint | Quando |
|---|---|---|
| Criar cliente | `POST /v3/customers` | Primeiro pedido do cliente. Guardar `customerId`, nunca recriar |
| Tokenizar cartão | `POST /v3/creditCard/tokenizeCreditCard` | Cadastro/troca de cartão. Guardar só token, últimos 4 e bandeira |
| **Cobrar** | `POST /v3/payments` com `creditCardToken` | **D-1 (cron) ou na confirmação com <24h.** Cobra na hora |
| Consultar | `GET /v3/payments/{id}` | Cron de reconciliação (2h) |
| Buscar por pedido | `GET /v3/payments?externalReference={orderId}` | Guarda anti-duplicidade antes de cobrar |
| Estorno total | `POST /v3/payments/{id}/refund` (sem `value`) | Cancelamento ≥12h, faxineira cancela, disputa total |
| Estorno parcial | `POST /v3/payments/{id}/refund` com `value` | Cancelamento <12h, disputa parcial |
| Saque PIX | `POST /v3/transfers` com `pixAddressKey` | Faxineira solicita, D+15 |
| ~~Pré-autorizar~~ | — | **Indisponível para a atividade econômica da Moppy** |
| ~~Criar subconta~~ | — | **Fora do modelo** (§3.4) |

Detalhes de header, body e resposta: `PAYMENT-IMPLEMENTATION.md` §2.

---

## 8. Segurança

**Dados de cartão:** nunca guardar PAN, CVV ou validade. Só `creditCardToken`, últimos 4 dígitos e bandeira. A tokenização é sempre server-side, sobre HTTPS.

**Autenticação:**

| Superfície | Como |
|---|---|
| API do Asaas | Header `access_token: ${ASAAS_API_KEY}` — **não** `Authorization: Bearer` |
| Webhook do Asaas → Moppy | Header `asaas-access-token` validado contra `ASAAS_WEBHOOK_TOKEN` |
| Crons | `authorization: Bearer ${CRON_SECRET}` |
| Endpoints do app | Firebase ID token verificado no servidor |
| Endpoints do admin | Session cookie + `admin_whitelist` |

**Auditoria:** toda transição escreve em `payments/{orderId}/events` com tipo, quem disparou (`client` / `system` / `admin:{uid}`), resposta do Asaas e timestamp. Logs sem dado sensível. Nenhum evento pode ser apagado (regra do Firestore).

**Trava de caixa:** verificação diária de que o saldo na conta Asaas cobre a soma de todas as carteiras. É o que impede a Moppy de gastar dinheiro que é da faxineira.

---

## PRÓXIMO PASSO

1. **Cobrança real em D-1** pelo cron (renomeado de `preauth` para `charge`), com cobrança imediata quando o pedido é confirmado a menos de 24h do serviço — furo real do cron atual.
2. **Volta do dinheiro é sempre estorno:** total (cancelamento ≥12h, faxineira cancela, disputa total, no-show) ou parcial (cancelamento <12h retendo 30% para a faxineira, disputa parcial). Três correções obrigatórias no código: guarda contra estorno duplicado, `externalReference` como chave anti-cobrança-dupla, e webhook com o payload e o header reais do Asaas.
3. **Sem subconta e sem `split[]`:** cobra 100% na conta da Moppy, carteira é livro-razão no Firestore, saque sai por PIX direto — o que o código já faz.

**Gate 3 aprovado em 2026-09-04.** Liberada a implementação de `lib/asaas.ts` real.
