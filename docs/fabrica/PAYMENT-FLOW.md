# Moppy — Fluxo de Pagamento Detalhado

---

## 1. Diagrama Sequencial Completo

```
DIA D-1 (NOITE)
├─ Vercel Cron dispara automaticamente
├─ Para cada serviço agendado para D:
│  ├─ Backend chama Asaas: pré-autorizar(customer_id, amount, card_token)
│  ├─ Asaas responde: preauth_id + status (pending / success / failed)
│  ├─ Backend registra em BD: payment.status = preauth_pending
│  └─ Webhook do Asaas confirma resultado (idempotência: event_id + timestamp)
│
├─ Cliente recebe notificação (com base no webhook):
│  ├─ Se sucesso: "Pagamento aprovado, será cobrado após o serviço"
│  └─ Se falha: "Cartão recusado. Tentaremos novamente." (retry em 1h)
│
└─ Se falha após 2 retries (intervalo 1h cada):
   ├─ Push ao cliente: "Cartão recusado. Troque de cartão em até 6h" (link para editar)
   ├─ Se cliente não resolve em 6h: pedido cancelado, faxineira notificada
   └─ Penalidade registrada no score do cliente

DIA D (SERVIÇO)
├─ Faxineira clica "Cheguei"
├─ Confirmação de chegada:
│  ├─ Opção A (cliente responde em ≤10min): gera código 4 dígitos → faxineira digita
│  ├─ Opção B (cliente não responde em >10min): faxineira tira foto + GPS → valida raio 50m
│  └─ Opção C (GPS falha): bloqueado, aciona suporte
│
├─ Serviço é executado
├─ Faxineira clica "Concluído"
│
└─ Cliente recebe notificação: "Está tudo certo?" com Sim / Tive um problema

ATÉ 24h APÓS "CONCLUÍDO"
├─ Cenário A: CLIENTE CONFIRMA (clica "Sim")
│  ├─ Backend chama Asaas: capturar(preauth_id, amount)
│  ├─ Asaas processa captura: capture_id + status
│  ├─ Webhook do Asaas confirma captura (idempotência)
│  ├─ Backend processa split automático:
│  │  ├─ 15% comissão → conta principal app (payments_commission)
│  │  ├─ 50% taxa processamento → app (payments_fees_app)
│  │  ├─ ~0,65% custo antecipação D+15 → app (payments_anticipation_cost)
│  │  └─ Restante (verifica se vai para faxineira) → subconta Asaas via split_config
│  ├─ Saldo da faxineira: marcado como "a_liberar" (D até D+14)
│  └─ Ambos notificados: "Pagamento processado. Avalie a outra parte"
│
├─ Cenário B: CLIENTE REPORTA PROBLEMA (clica "Tive um problema")
│  ├─ Cliente descreve + anexa fotos (até 3)
│  ├─ Disputa entra em status "aberta"
│  ├─ Valor continua pré-autorizado (não é capturado ainda)
│  ├─ Faxineira recebe notificação + tem 24h para responder
│  ├─ Admin analisa em até 48h (vê timeline + fotos de ambos)
│  ├─ Admin decide: reembolso total / reembolso parcial / libera captura
│  │  ├─ Reembolso total: Asaas estorna integralmente → cartão cliente
│  │  ├─ Reembolso parcial: captura parte, estorna parte → cliente recebe X, faxineira recebe Y
│  │  └─ Libera captura: processa split normal, faxineira recebe
│  └─ Ambos notificados da decisão
│
└─ Cenário C: CLIENTE NÃO RESPONDE (≥24h)
   ├─ Lembrete enviado em 12h: "Confirme a conclusão do serviço"
   ├─ Se passou 24h sem resposta: app confirma automaticamente
   ├─ Backend chama Asaas: capturar (processamento normal)
   ├─ Log registra: "confirmação automática" (clareza para auditoria)
   └─ Saldo da faxineira marcado como "a_liberar"

DIA D+15
├─ Saldo da faxineira muda de "a_liberar" para "disponível"
├─ Faxineira vê botão "Solicitar saque"
├─ Faxineira clica, confirma valor ≥ R$20
├─ Backend chama Asaas: processar saque via PIX (chave cadastrada no onboarding)
├─ Asaas transfere para PIX da faxineira
└─ Faxineira recebe em 1-2 dias úteis

CANCELAMENTO (4 CENÁRIOS)
├─ CENÁRIO 1: Antes do D-1
│  ├─ Pré-autorização ainda não foi feita
│  ├─ Cancelamento total e GRATUITO
│  └─ Faxineira notificada para liberar agenda
│
├─ CENÁRIO 2: +12h de antecedência (ex: D-1 10h para D 10h)
│  ├─ Pré-autorização já feita (valor reservado)
│  ├─ Backend chama Asaas: estornar(preauth_id)
│  ├─ Valor volta integralmente ao cartão do cliente
│  ├─ Status do payment: refunded
│  └─ Faxineira notificada
│
├─ CENÁRIO 3: −12h (ex: D 10h para D-1 22h)
│  ├─ Pré-autorização já feita
│  ├─ Cliente vê: "Cancelar custará 30% de compensação à faxineira" (com botão confirmar)
│  ├─ Backend chama Asaas: capturar 30% do valor (vai para faxineira)
│  ├─ Taxa Asaas é descontada do valor da faxineira (não do app)
│  ├─ Backend chama Asaas: estornar 70% restante (volta ao cliente)
│  ├─ Status do payment: partial_refund
│  └─ Ambos notificados
│
└─ CENÁRIO 4: Faxineira cancela
   ├─ Backend chama Asaas: estornar pré-autorização integralmente
   ├─ Status do payment: refunded
   ├─ Penalidade: score da faxineira cai (−5 a −10, conforme antecedência)
   └─ Cliente notificado

WEBHOOK DO ASAAS (IDEMPOTÊNCIA)
├─ Evento chega: POST /api/webhooks/asaas
├─ Backend verifica:
│  ├─ Token secreto no header (Authorization: Bearer {token})
│  ├─ Confere se event_id já foi processado (busca em BD na coleção payment_events)
│  └─ Se SIM: retorna 200 OK (ignora repetição) → sem reprocessamento
├─ Se NÃO (primeiro evento):
│  ├─ Processa: atualiza status do payment
│  ├─ Registra event em payment_events (event_id, timestamp, tipo, resposta Asaas)
│  └─ Retorna 200 OK imediatamente (não bloqueia com processamento)
│
└─ Retry do Asaas: se não receber 200 em 5 segundos, tenta de novo (até 5x em 24h)

VERIFICAÇÃO PARALELA (CRON REDUNDANTE)
├─ A cada 2h, backend roda: verificar_pagamentos_pendentes()
├─ Para cada payment em status preauth_pending ou capture_pending:
│  ├─ Chama Asaas: consultStatus(asaas_payment_id)
│  ├─ Se status mudou mas webhook não chegou: atualiza BD
│  └─ Loga divergência (auditoria)
└─ Garante que nenhum pagamento fica "órfão"
```

---

## 2. Estados de Pagamento (Máquina de Estados)

```
        pending
          ↓ (Vercel Cron D-1 noite)
    preauth_pending ←→ preauth_retry_1 ←→ preauth_retry_2
          ↓ (webhook OK)
    preauth_success
          ↓ (cliente confirma ou 24h passam)
    capture_pending
          ↓ (webhook de captura)
      ├→ capture_success → pagamento_processado → saldo_a_liberar
      │   ↓ (D+15)
      │   saldo_disponivel → (faxineira pode sacar)
      │
      └→ capture_failed → suporte_manual
      
    preauth_success (ramo disputa)
          ↓ (cliente clica "Tive um problema")
      disputa_aberta (valor retido)
          ↓ (admin decide em 48h)
          ├→ disputa_reembolso_total → estorno integralmente → refunded
          ├→ disputa_reembolso_parcial → captura parte, estorna parte → partial_refund
          └→ disputa_liberado → captura integralmente → payment_processado
      
    preauth_success (ramo cancelamento ±12h)
          ├→ cancelamento_antes_d_minus_1 (gratuito) → cancelled_free
          ├→ cancelamento_plus_12h → refunded
          ├→ cancelamento_minus_12h → partial_refund (30% vai para faxineira)
          └→ faxineira_cancela → refunded + penalidade
      
    preauth_failed (após 2 retries)
          ↓ (cliente não toca em 6h)
      pedido_cancelado → cancelled_no_payment (faxineira notificada, sem compensação)
```

**Estados de transação (campos em payment):**

```javascript
status: enum [
  "pending",                    // pedido criado, Vercel não rodou ainda
  "preauth_pending",           // Cron disparou, aguardando resposta Asaas
  "preauth_retry_1",           // 1ª tentativa falhou, agendado retry em 1h
  "preauth_retry_2",           // 2ª tentativa falhou, agendado retry em 1h
  "preauth_success",           // pré-autorização OK, aguardando confirmação/disputa
  "preauth_failed",            // todas as tentativas falharam, pedido será cancelado
  "capture_pending",           // cliente confirmou, Asaas processando captura
  "capture_success",           // captura confirmada, split executado
  "capture_failed",            // captura falhou (raro), suporte manual
  "disputa_aberta",            // cliente reportou problema, valor retido
  "disputa_reembolso_total",   // admin decidiu reembolsar 100%
  "disputa_reembolso_parcial", // admin decidiu reembolsar parcialmente
  "disputa_liberado",          // admin decidiu liberar valor para faxineira
  "refunded",                  // estorno processado, valor voltou ao cliente
  "partial_refund",            // estorno parcial (ex: −12h scenario)
  "refund_pending",            // estorno em processamento, aguardando Asaas
  "refund_failed",             // estorno falhou, requer ação manual
  "cancelled_free",            // cancelamento antes D-1, gratuito
  "cancelled_no_payment",      // pré-auth falha 2x, cliente não resolve, pedido cancelado
  "payment_processado"         // split executado, saldo da faxineira em "a_liberar"
]
```

---

## 3. Integrações Obrigatórias

### 3.1 Vercel Cron (D-1, Noite)

**Trigger:**
- Executa diariamente em horário fixo (ex: 22h UTC)
- Busca todos os pedidos com data = D (amanhã) e status não "cancelado"
- Para cada pedido: dispara pré-autorização

**Pseudocódigo:**

```javascript
// /api/cron/preauth.js
export default async function handler(req, res) {
  // Verificar token de segurança (env.CRON_SECRET)
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const payments = await db.collection('payments')
    .where('service_date', '>=', tomorrow)
    .where('service_date', '<', new Date(tomorrow.getTime() + 86400000))
    .where('status', '==', 'pending')
    .get();

  const results = [];
  for (const doc of payments.docs) {
    try {
      const payment = doc.data();
      
      // Chamar Asaas API
      const preauth = await asaas.authorizeOnly({
        customer: payment.customer_asaas_id,
        billingType: 'CREDIT_CARD',
        chargeType: 'DEBIT',
        value: payment.amount,
        description: `Pré-autorização - Pedido ${payment.order_id}`,
        card: payment.card_token,
      });

      // Registrar tentativa
      await db.collection('payments').doc(doc.id).update({
        status: 'preauth_pending',
        asaas_preauth_id: preauth.id,
        preauth_attempt_count: 1,
        preauth_timestamp: new Date(),
      });

      // Registrar evento
      await db.collection('payment_events').add({
        payment_id: doc.id,
        order_id: payment.order_id,
        type: 'preauth_attempt',
        attempt: 1,
        status: 'pending',
        asaas_response: preauth,
        timestamp: new Date(),
      });

      results.push({ order_id: payment.order_id, status: 'started' });
    } catch (error) {
      // Tentar de novo em 1h (via backend scheduler)
      results.push({ order_id: payment.order_id, error: error.message });
      
      // Log para auditoria
      console.error(`Preauth failed for order ${payment.order_id}:`, error);
    }
  }

  return res.status(200).json({ processed: results.length, results });
}

// Configurar no vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/preauth",
//     "schedule": "0 22 * * *"  // 22h UTC todo dia
//   }]
// }
```

**Segurança:**
- Vercel fornece token automático em header `authorization`
- Backend valida token contra `process.env.CRON_SECRET`
- Sem acesso direto a dados sensíveis (só IDs de tokens)

### 3.2 Webhook do Asaas

**Endpoint:**
- `POST /api/webhooks/asaas`

**Headers de autenticação:**
```
Authorization: Bearer {asaas_webhook_secret}
Content-Type: application/json
X-Asaas-Webhook-Id: {event_id}
X-Asaas-Webhook-Timestamp: {timestamp}
```

**Payload esperado:**
```json
{
  "id": "webhook_event_id_12345",
  "event": "payment_status_changed",
  "data": {
    "id": "pay_asaas_id",
    "status": "pending | pending_authorization | authorized | captured | cancelled | refunded | failed",
    "value": 150.00,
    "authorizationCode": "123456",
    "description": "Pré-autorização - Pedido MOX-00123",
    "customer": "cust_asaas_id",
    "billingType": "CREDIT_CARD",
    "confirmedDate": "2025-08-24T14:30:00Z"
  }
}
```

**Pseudocódigo de processamento (idempotência):**

```javascript
export default async function handler(req, res) {
  const { id, event, data } = req.body;

  // 1. Verificar token webhook
  const signature = req.headers['authorization'];
  if (!signature || signature !== `Bearer ${process.env.ASAAS_WEBHOOK_SECRET}`) {
    console.error('Invalid webhook signature');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Buscar se já processamos esse event_id
  const existingEvent = await db.collection('payment_events')
    .where('asaas_event_id', '==', id)
    .limit(1)
    .get();

  if (!existingEvent.empty) {
    console.log(`Event ${id} already processed, ignoring`);
    return res.status(200).json({ status: 'already_processed' });
  }

  // 3. Registrar evento (idempotência)
  const eventRef = await db.collection('payment_events').add({
    asaas_event_id: id,
    asaas_webhook_event: event,
    asaas_payment_id: data.id,
    status: data.status,
    timestamp: new Date(),
    received_at: new Date(),
  });

  // 4. Buscar payment associado
  const payments = await db.collection('payments')
    .where('asaas_preauth_id', '==', data.id)
    .limit(1)
    .get();

  if (payments.empty) {
    console.error(`No payment found for asaas_id ${data.id}`);
    return res.status(404).json({ error: 'Payment not found' });
  }

  const paymentDoc = payments.docs[0];
  const payment = paymentDoc.data();

  // 5. Processar status e atualizar BD
  let newStatus = payment.status;
  switch (data.status) {
    case 'authorized':
      newStatus = 'preauth_success';
      // Notificar cliente
      await notifyClient(payment.customer_id, {
        title: 'Pagamento Aprovado',
        body: 'Pagamento aprovado, será cobrado após o serviço',
      });
      break;

    case 'captured':
      newStatus = 'capture_success';
      // Processar split (vide seção 3.3)
      await processSplit(payment);
      // Notificar ambos
      await notifyClient(payment.customer_id, 'Pagamento capturado');
      await notifyFaxineira(payment.cleaner_id, 'Saldo será liberado em D+15');
      break;

    case 'refunded':
      newStatus = 'refunded';
      // Notificar cliente que recebeu estorno
      await notifyClient(payment.customer_id, 'Valor estornado ao seu cartão');
      break;

    case 'failed':
      newStatus = 'preauth_failed';
      // Agendar retry automático (via scheduler)
      await scheduleRetry(paymentDoc.id, payment);
      break;

    default:
      newStatus = payment.status;
  }

  // 6. Atualizar payment
  await db.collection('payments').doc(paymentDoc.id).update({
    status: newStatus,
    last_webhook_status: data.status,
    last_webhook_timestamp: new Date(),
  });

  // 7. Responder com 200 OK (não bloquear)
  return res.status(200).json({ 
    status: 'processed',
    payment_id: paymentDoc.id,
    new_status: newStatus
  });
}
```

**Retry do Webhook:**
- Asaas tenta até 5x em 24h se não receber 200
- Backend responde com 200 imediatamente (processamento é assíncrono)
- Proteção de idempotência garante que repetições não causam duplicação

### 3.3 Split Automático (Asaas)

**Quando:** após captura bem-sucedida

**Configuração (uma única vez, no onboarding da faxineira):**

```javascript
// Criar subconta Asaas para faxineira
const subaccount = await asaas.createSubaccount({
  name: `Faxineira - ${cleaner.name}`,
  email: cleaner.email,
  loginEmail: cleaner.email,
  phone: cleaner.phone,
  document: cleaner.cpf,
  wallet: true,
});

// Salvar subconta ID
await db.collection('cleaners').doc(cleaner_id).update({
  asaas_subaccount_id: subaccount.id,
});
```

**Divisão (pseudocódigo):**

```javascript
async function processSplit(payment) {
  const { order_id, amount, cleaner_id, asaas_payment_id } = payment;

  // Valores
  const commission = amount * 0.15; // 15% app
  const processingFeeTotal = ~5.00; // ~R$0.49 + 3% (confirmar no sandbox)
  const appFeeShare = processingFeeTotal / 2; // 50%
  const cleanerFeeShare = processingFeeTotal / 2; // 50%
  const anticipationCost = amount * 0.0065; // ~0,65% app absorve

  const cleanerGross = amount - commission - cleanerFeeShare; // ~R$125
  const appTotal = commission + appFeeShare + anticipationCost; // ~R$26

  // Registrar divisão
  await db.collection('payments').doc(payment_id).update({
    split_data: {
      app_commission: commission,
      app_processing_fee: appFeeShare,
      app_anticipation_cost: anticipationCost,
      app_total: appTotal,
      cleaner_processing_fee: cleanerFeeShare,
      cleaner_gross: cleanerGross,
      cleaner_net: cleanerGross - cleanerFeeShare, // Já descontado
    },
  });

  // Transferir para subconta da faxineira (via Asaas API)
  // Asaas faz split automático se configurado na subaccount
  // Alternativamente, transferir manualmente:
  
  const transfer = await asaas.transfer({
    walletId: process.env.ASAAS_WALLET_ID,
    subAccountId: payment.cleaner_asaas_subaccount_id,
    value: cleanerGross,
    description: `Pagamento do pedido ${order_id}`,
  });

  // Crédito no saldo da faxineira (status: "a_liberar")
  await db.collection('cleaner_wallets').doc(cleaner_id).update({
    balance_pending: firebase.firestore.FieldValue.increment(cleanerGross),
    pending_release_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // D+15
    last_credit: new Date(),
  });
}
```

---

## 4. Tratamento de Falhas por Etapa

### 4.1 Pré-Autorização Falha (D-1)

| Tentativa | Intervalo | Ação |
|-----------|-----------|------|
| 1 (noite D-1) | — | Cron Vercel dispara, Asaas recusa |
| Retry 1 | +1h | Automaticamente agendado, falha de novo |
| Retry 2 | +1h | Automaticamente agendado, falha de novo |
| Escalar | Após falhas 2 | Push ao cliente: "Cartão recusado. Troque em até 6h" |
| Cancelar | Após 6h sem ação | Pedido cancelado, faxineira notificada, sem compensação |

**Status na BD:** `preauth_retry_1` → `preauth_retry_2` → `preauth_failed`

**Notificações:**
- Tentativa 1 (silenciosa, log apenas)
- Tentativa 2 (silenciosa)
- Escalar (push urgente + SMS opcional)
- Cancelar (notificação cancelamento)

### 4.2 Captura Falha (Após Confirmação)

| Cenário | Ação |
|---------|------|
| Asaas recusa captura (erro raro) | Backend tenta 1x mais em 1h (agendado) |
| Falha persiste | Log de erro, manual via admin dashboard |
| Resolução manual | Admin: re-tentar, reembolsar pré-auth, ou contatar cliente |

**Status na BD:** `capture_pending` → `capture_failed` (requer ação manual)

### 4.3 Estorno Falha

| Cenário | Ação |
|---------|------|
| Banco recusa estorno | Log de erro, suporte escalado |
| Pendência indefinida | Admin contacta cliente + suporte Asaas |
| Resolução | Manual (raro) |

**Status na BD:** `refund_pending` → `refund_failed` (requer ação manual)

### 4.4 Webhook Não Chega ou Duplicado

**Se não chegar:**
- Cron de sincronização roda a cada 2h: `verificar_pagamentos_pendentes()`
- Confere com Asaas se status mudou
- Se mudou: atualiza BD, notifica usuários
- Log de divergência para auditoria

**Se chega 2x (duplicado):**
- Backend encontra `event_id` já processado em `payment_events`
- Ignora 2ª tentativa, retorna 200 OK
- Asaas marca como entregue, sem retry

---

## 5. Cancelamento em 4 Cenários

### 5.1 Cliente Cancela Antes do D-1

**Pré-requisito:** Pré-autorização ainda não foi feita (Cron não rodou).

**Fluxo:**
1. Cliente clica "Cancelar"
2. Backend marca pedido como "cancelado"
3. Faxineira (se selecionada) recebe notificação
4. **Zero custo para cliente**

**Pagamento:** nenhum
**Status:** `cancelled_free`

### 5.2 Cliente Cancela +12h Antes (Ex: D-1 10h para D-1 22h)

**Pré-requisito:** Pré-autorização já foi feita.

**Fluxo:**
1. Cliente clica "Cancelar"
2. Backend valida antecedência ≥12h
3. Backend chama Asaas: `void(preauth_id)` (desfazer pré-auth)
4. Asaas desativa a reserva
5. Valor volta ao cartão em até 2 dias úteis
6. Faxineira recebe notificação
7. **Zero custo para cliente**

**Pagamento:** estorno total
**Status:** `refunded`

### 5.3 Cliente Cancela −12h (Ex: D-1 22h para D 10h)

**Pré-requisito:** Pré-autorização já foi feita, faxineira tem agenda reservada.

**Fluxo:**
1. Cliente clica "Cancelar"
2. Backend valida antecedência <12h
3. Cliente vê: **"Esta ação custará 30% de compensação à faxineira (~R$45). Confirmar?"**
4. Se confirmar:
   - Backend chama Asaas: `capture(preauth_id, amount * 0.30)`
   - Asaas captura 30%
   - Taxa de processamento (~R$1,50) é descontada do valor da faxineira
   - Faxineira recebe: ~R$41 (bruto R$45 − taxa ~R$4)
   - Backend chama Asaas: `refund(preauth_id, amount * 0.70 + customerFeeShare)`
   - Asaas estorna 70% + metade da taxa do cliente
   - Cliente recebe: ~R$111,50 (pagou R$152,50, faxineira fica com ~R$41)

**Exemplo (Serviço R$150 com −12h):**

| Item | Valor |
|------|-------|
| Serviço (cliente paga com taxa) | R$ 152,50 |
| Capturado (30%) | R$ 45,00 |
| Taxa Asaas sobre captura | ~R$ 4,00 |
| Faxineira recebe (líquido) | ~R$ 41,00 |
| Estorno ao cliente (70% + sua taxa) | R$ 111,50 |

**Pagamento:** captura 30%, estorno 70%
**Status:** `partial_refund`

### 5.4 Faxineira Cancela

**Fluxo:**
1. Faxineira clica "Cancelar este serviço"
2. Backend marca como cancelado
3. Backend chama Asaas: `void(preauth_id)` (desfazer pré-auth)
4. Cliente recebe **reembolso total** (nada foi capturado)
5. **Penalidade:** score da faxineira cai (−5 a −10, conforme antecedência)
6. Cliente notificado

**Pagamento:** estorno total
**Status:** `refunded` + penalidade registrada

---

## 6. Reembolsos (Disputas)

### 6.1 Cliente Reporta Problema

**Fluxo:**
1. Cliente clica "Tive um problema" após "Concluído"
2. Descreve problema (texto obrigatório) + anexa fotos (até 3, opcional)
3. Disputa entra em status "aberta"
4. **Valor continua pré-autorizado** (não é capturado ainda)
5. Faxineira recebe notificação

### 6.2 Defesa da Faxineira

**Fluxo:**
1. Faxineira vê versão do cliente (texto + fotos)
2. Tem **24h para responder** (cronômetro visível)
3. Campo: sua resposta (texto obrigatório) + fotos (até 3, opcional)
4. Se não responder em 24h: admin analisa só com versão do cliente

### 6.3 Análise do Admin

**Timeline disponível:**
- Criação do pedido
- Candidatura e seleção
- Confirmação de chegada (código/GPS+foto)
- Conclusão
- Chat entre partes
- Versão do cliente (texto + fotos)
- Versão da faxineira (se respondeu)

**Decisão do admin (3 opções):**

**Opção A: Reembolso Total (100%)**
- Cliente: pagamento estornado integralmente
- Faxineira: recebe R$0
- Backend chama Asaas: `refund(preauth_id, full_amount)`
- Status: `disputa_reembolso_total`

**Opção B: Reembolso Parcial**
- Cliente: recebe parte X estornada
- Faxineira: recebe parte Y capturada
- Backend chama Asaas: `capture(preauth_id, Y)` + `refund(preauth_id, X)`
- Status: `disputa_reembolso_parcial`

**Exemplo:** Cliente reclama de "quarto mal feito", admin aprova reembolso de R$30 (20% do serviço):
- Capturado para faxineira: R$120 (bruto)
- Reembolso ao cliente: R$32,50 (bruto)
- Taxa Asaas: ~R$5,00 (50/50)
- Faxineira recebe (líquido): ~R$115
- Cliente recebe (de volta): ~R$32,50

**Opção C: Libera Captura (0% reembolso)**
- Cliente: nenhum reembolso
- Faxineira: recebe valor integral
- Backend chama Asaas: `capture(preauth_id, full_amount)` → split normal
- Status: `disputa_liberado`

### 6.4 Notificações

**Ambas partes notificadas:**
- Motivo da decisão (texto do admin)
- Valor processado
- Prazo de recebimento (se há transferência)

**Limite:** máximo ressarcimento via app = valor da faxina original (ex: R$150). Danos acima desse valor ficam entre as partes.

---

## 7. Operações Suportadas no Asaas

| Operação | Endpoint | Quando |
|----------|----------|--------|
| **Criar Subconta** | `POST /accounts` | Onboarding faxineira |
| **Tokenizar Cartão** | `POST /creditCard` | Cadastro ou edição de cartão |
| **Pré-Autorizar** | `POST /payments/authorize` | D-1, Vercel Cron |
| **Capturar** | `POST /payments/{id}/capture` | Após confirmação cliente |
| **Estorno Total** | `POST /payments/{id}/refund` | Cancelamento ou disputa |
| **Estorno Parcial** | `POST /payments/{id}/refund?value=X` | Disputa com reembolso parcial |
| **Consultar Status** | `GET /payments/{id}` | Sincronização paralela (2h) |
| **Transferir para Subconta** | `POST /transfers` | Split para faxineira |
| **Saque via PIX** | `POST /dict/transferValue` | D+15, faxineira solicita |

---

## 8. Segurança

### 8.1 Dados Sensíveis

- **Nunca guardar:** número completo do cartão, CVV, data de validade
- **Sempre tokenizar:** Asaas retorna token (ex: `card_xyz123`)
- **Armazenar:** apenas token + últimos 4 dígitos + bandeira

### 8.2 Autenticação

- **Vercel Cron:** token em header `authorization` (validar contra `env.CRON_SECRET`)
- **Webhook Asaas:** token em header `authorization` (validar contra `env.ASAAS_WEBHOOK_SECRET`)
- **API Asaas:** chave de API em header `Authorization: Bearer {api_key}`

### 8.3 Logs e Auditoria

- **Cada transação registrada:**
  - timestamp, usuario, ordem, pagamento_id, asaas_id, status, erro
  - resposta completa do Asaas (sem dados sensíveis visíveis)
- **Webhooks:** registrar event_id, timestamp, payload, status de processamento
- **Cron:** log de cada tentativa (sucesso/falha)

### 8.4 Proteção Contra Fraude

- **Idempotência:** event_id + timestamp previnem processamento duplo
- **Verificação paralela:** Cron de 2h detecta webhooks faltantes
- **Signature verification:** token secreto no webhook valida autenticidade

---

## Próximos Passos

1. **Implementar Vercel Cron** com retry automático
2. **Implementar Webhook** com tratamento de idempotência
3. **Testar fluxo completo** no sandbox Asaas (pré-auth → captura → split → saque)
4. **Validar taxas reais** (processamento + antecipação D+15)
5. **Deploy em produção** (com CNPJ + conta Asaas produção)
