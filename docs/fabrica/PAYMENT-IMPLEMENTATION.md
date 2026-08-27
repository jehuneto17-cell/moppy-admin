# Moppy — Checklist e Guia de Implementação de Pagamento

---

## 1. Checklist Técnico Pré-Implementação

### 1.1 Configuração Asaas

- [ ] Conta Asaas criada (sandbox)
- [ ] API key obtida e armazenada em `.env` → `ASAAS_API_KEY`
- [ ] Webhook secret configurado → `ASAAS_WEBHOOK_SECRET`
- [ ] Wallet ID configurado → `ASAAS_WALLET_ID`
- [ ] Modo sandbox ativado em código
- [ ] Testar endpoint básico: `GET /api` com autenticação

### 1.2 Banco de Dados (Firebase)

**Coleções necessárias:**

- [ ] `payments` — registro de cada transação
  - [ ] Índices: `(service_date, status)`, `(order_id)`, `(customer_id, created_at)`

- [ ] `payment_events` — log de eventos (pré-auth, captura, webhook, etc.)
  - [ ] Índices: `(payment_id, timestamp)`, `(asaas_event_id)`

- [ ] `cleaner_wallets` — saldo de cada faxineira
  - [ ] Índices: `(cleaner_id)`

**Estrutura de documentos:**

```javascript
// payments/{paymentId}
{
  orderId: string,
  customerId: string,
  cleanerId: string,
  
  amount: number,           // valor do serviço (sem taxa do cliente)
  amountWithClientFee: number,  // valor que cliente paga (com sua 50% da taxa)
  currency: string,         // "BRL"
  
  status: enum, // pending | preauth_pending | ... (vide PAYMENT-FLOW.md)
  
  asaasPaymentId: string,   // ID externo (pré-auth ou captura)
  asaasCustomerId: string,  // cliente no Asaas
  asaasSubAccountId: string, // subconta da faxineira
  cardToken: string,        // token (sem dados brutos)
  cardLast4: string,
  cardBrand: string,
  
  preMtegory_at: timestamp,
  preAuthExpiresAt: timestamp,
  captureAt: timestamp,
  
  preAuthRetryCount: number,  // quantas vezes tentou pré-auth
  lastRetryAt: timestamp,
  
  splitData: {
    appCommission: number,
    appProcessingFee: number,
    appAnticipationCost: number,
    appTotal: number,
    cleanerProcessingFee: number,
    cleanerGross: number,
  },
  
  webhookEvents: [
    {
      eventId: string,
      type: string,  // preauth | capture | refund | webhook
      status: string,
      timestamp: timestamp,
    }
  ],
  
  createdAt: timestamp,
  updatedAt: timestamp,
}

// payment_events/{eventId}
{
  paymentId: string,
  orderId: string,
  customerId: string,
  
  type: string,  // preauth_attempt | preauth_success | capture_pending | capture_success | refund | webhook_received
  attempt: number,  // para retries
  
  asaasEventId: string,    // webhook event ID (idempotência)
  asaasPaymentId: string,
  
  status: string,  // pending | success | failed
  
  asaasResponse: object,   // resposta completa (sem dados sensíveis)
  errorMessage: string,    // se falha
  errorCode: string,
  
  timestamp: timestamp,
  receivedAt: timestamp,  // quando webhook chegou (se aplicável)
}

// cleaner_wallets/{cleanerId}
{
  cleanerId: string,
  asaasSubAccountId: string,
  
  balanceTotal: number,
  balancePending: number,      // "a_liberar" (D até D+14)
  balanceAvailable: number,    // "disponível" (D+15+)
  
  lastCreditAt: timestamp,
  lastWithdrawalAt: timestamp,
  
  withdrawalAttempts: number,  // tracking falhas de saque
  lastWithdrawalStatus: string,  // success | failed | pending
  lastWithdrawalError: string,
  
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

### 1.3 Variáveis de Ambiente

```bash
# .env (ou .env.local para dev)

# Asaas
ASAAS_API_KEY=xyzabc123...
ASAAS_WEBHOOK_SECRET=webhook_secret_xyz...
ASAAS_WALLET_ID=wallet_id_xyz...
ASAAS_MODE=sandbox  # ou production

# Cron Security
CRON_SECRET=cron_token_very_secret...

# Firebase
FIREBASE_PROJECT_ID=moppy-dev
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# Notificações (para alertas de pagamento)
SENDGRID_API_KEY=...  # opcional, para emails
NOTIFICATION_SERVICE_URL=...
```

### 1.4 Segredos Não Devem Estar em Repositório

- [ ] `.env` adicionado a `.gitignore`
- [ ] `.env.example` criado (sem valores reais)
- [ ] Chaves armazenadas apenas em:
  - Vercel (Project Settings → Environment Variables)
  - Firebase (Firestore rules podem usar secrets)
  - CI/CD (GitHub Actions Secrets, se necessário)

---

## 2. Endpoints Asaas Mapeados

### 2.1 Autenticação

Todos os requests incluem header:
```
Authorization: Bearer {ASAAS_API_KEY}
Content-Type: application/json
```

Base URL sandbox: `https://sandbox.asaas.com/api/v3`
Base URL production: `https://api.asaas.com/api/v3`

### 2.2 Operações Obrigatórias

#### A. Pré-Autorizar

**Requisição:**
```
POST /payments
```

**Body:**
```json
{
  "customer": "cust_asaas_id_xyz",
  "billingType": "CREDIT_CARD",
  "chargeType": "DEBIT",
  "value": 150.00,
  "dueDate": "2025-08-24",
  "description": "Pré-autorização - Pedido MOX-00123",
  "card": {
    "token": "card_token_xyz"
  },
  "authorizeOnly": true
}
```

**Resposta (sucesso):**
```json
{
  "id": "pay_asaas_id_12345",
  "status": "pending_authorization",
  "value": 150.00,
  "authorizationCode": "123456",
  "creditCardData": {
    "last4": "1111",
    "brand": "Mastercard"
  }
}
```

**Resposta (falha):**
```json
{
  "errors": [
    {
      "code": "invalid_payment_method",
      "message": "Cartão recusado",
      "description": "Verifique dados do cartão"
    }
  ]
}
```

#### B. Capturar

**Requisição:**
```
POST /payments/{payment_id}/capture
```

**Body:**
```json
{
  "value": 150.00
}
```

**Resposta (sucesso):**
```json
{
  "id": "pay_asaas_id_12345",
  "status": "captured",
  "value": 150.00,
  "netValue": 145.00,
  "transactionReceiptUrl": "..."
}
```

#### C. Estorno Total

**Requisição:**
```
DELETE /payments/{payment_id}
```

**Resposta:**
```json
{
  "id": "pay_asaas_id_12345",
  "status": "cancelled",
  "cancellationReason": "customer_request"
}
```

#### D. Estorno Parcial

**Requisição:**
```
POST /payments/{payment_id}/refund
```

**Body:**
```json
{
  "value": 45.00
}
```

**Resposta:**
```json
{
  "id": "pay_asaas_id_12345",
  "status": "refunded",
  "refundedValue": 45.00
}
```

#### E. Consultar Status

**Requisição:**
```
GET /payments/{payment_id}
```

**Resposta:**
```json
{
  "id": "pay_asaas_id_12345",
  "status": "captured",
  "value": 150.00,
  "dueDate": "2025-08-24",
  "confirmedDate": "2025-08-25T14:30:00Z"
}
```

#### F. Transferir para Subconta (Split)

**Requisição:**
```
POST /transfers
```

**Body:**
```json
{
  "walletId": "{ASAAS_WALLET_ID}",
  "subAccountId": "acc_subconta_faxineira",
  "value": 125.00,
  "description": "Pagamento - Pedido MOX-00123"
}
```

**Resposta:**
```json
{
  "id": "trans_xyz123",
  "status": "pending",
  "value": 125.00,
  "expectedDate": "2025-08-26"
}
```

#### G. Criar Subconta

**Requisição:**
```
POST /accounts
```

**Body:**
```json
{
  "name": "Faxineira - Maria Silva",
  "email": "maria@example.com",
  "loginEmail": "maria@example.com",
  "phone": "11999999999",
  "document": "12345678901",
  "wallet": true,
  "accountType": "INDIVIDUAL"
}
```

**Resposta:**
```json
{
  "id": "acc_subconta_xyz",
  "name": "Faxineira - Maria Silva",
  "email": "maria@example.com",
  "status": "active",
  "wallet": {
    "enabled": true,
    "id": "wallet_xyz"
  }
}
```

#### H. Saque via PIX (Dict)

**Requisição:**
```
POST /dict/transferValue
```

**Body:**
```json
{
  "walletId": "wallet_faxineira",
  "value": 125.00,
  "pixKey": "12345678901",  // ou email, ou telefone, ou chave aleatória
  "description": "Saque - Moppy"
}
```

**Resposta:**
```json
{
  "id": "transfer_pix_xyz",
  "status": "pending",
  "value": 125.00,
  "expectedDate": "2025-08-27"
}
```

---

## 3. Implementação: Idempotência no Webhook

### 3.1 Armazenar event_id (Chave de Idempotência)

Sempre que webhook chega:

```javascript
// 1. Buscar se já processamos
const existingEvent = await db.collection('payment_events')
  .where('asaasEventId', '==', req.body.id)
  .limit(1)
  .get();

if (!existingEvent.empty) {
  // Já foi processado, retornar 200 imediatamente
  return res.status(200).json({ status: 'already_processed' });
}

// 2. Registrar atomicamente (criar documento)
const newEvent = await db.collection('payment_events').add({
  asaasEventId: req.body.id,
  asaasPaymentId: req.body.data.id,
  type: req.body.event,
  receivedAt: new Date(),
  payload: req.body,  // guardar completo para auditoria
});

// 3. AGORA processar a transação (com evento registrado)
// ... resto do código ...
```

### 3.2 Transações Atômicas

Para garantir que evento + atualização de payment acontecem juntos:

```javascript
// Usar transação do Firestore
const batch = db.batch();

// 1. Registrar evento
const eventRef = db.collection('payment_events').doc();
batch.set(eventRef, {
  asaasEventId: req.body.id,
  asaasPaymentId: req.body.data.id,
  receivedAt: new Date(),
  // ...
});

// 2. Atualizar payment
const paymentRef = db.collection('payments').doc(paymentId);
batch.update(paymentRef, {
  status: newStatus,
  lastWebhookAt: new Date(),
});

// 3. Commit atomicamente
await batch.commit();
```

### 3.3 Retornar 200 Imediatamente

Não bloquear o Asaas com processamento síncrono:

```javascript
// Responder ANTES de fazer processamento pesado
res.status(200).json({ status: 'received' });

// Depois, processar assincronamente
setImmediate(async () => {
  try {
    await notifyClient(customerId, message);
    await updateWallet(cleanerId, amount);
  } catch (error) {
    console.error('Async processing failed:', error);
    // Log para auditoria, não falha o webhook
  }
});
```

---

## 4. Logging e Auditoria

### 4.1 O Que Logar

**Cada transação:**
```javascript
logger.info('Payment flow', {
  timestamp: new Date().toISOString(),
  orderId: payment.order_id,
  paymentId: payment.id,
  customerId: payment.customer_id,
  cleanerId: payment.cleaner_id,
  amount: payment.amount,
  action: 'preauth_attempt',  // preauth_attempt | capture | refund | webhook
  status: 'pending',  // pending | success | failed
  asaasResponse: { /* objeto completo, sem dados brutos */ },
  errorMessage: error?.message || null,
  duration_ms: end - start,
});
```

**Dados que NUNCA logar:**
- Número completo do cartão
- CVV
- Data de validade
- PIN PIX
- Senhas

**Dados que podem logar com segurança:**
- Últimos 4 dígitos do cartão
- Bandeira
- Token (é seguro)
- IDs do Asaas
- Timestamps
- Status
- Valores monetários

### 4.2 Estrutura de Logs

Usar plataforma centralizada (Vercel Analytics, Datadog, Sentry, ou simples console com timestamp):

```javascript
// Base para todos os logs de pagamento
const logPaymentEvent = async (eventData) => {
  const logEntry = {
    level: 'info', // info | warn | error
    service: 'payment',
    timestamp: new Date().toISOString(),
    environment: process.env.ASAAS_MODE, // sandbox | production
    ...eventData,
  };

  // Enviar para logger centralizado
  if (process.env.LOG_SERVICE_URL) {
    await fetch(process.env.LOG_SERVICE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry),
    });
  }

  // Também logar localmente (Vercel logs)
  console.log(JSON.stringify(logEntry));
};
```

### 4.3 Exemplo: Fluxo Completo com Logs

```javascript
async function handlePreauth(orderId, customerId, amount) {
  const startTime = Date.now();
  const paymentId = generateId();

  try {
    await logPaymentEvent({
      paymentId,
      orderId,
      action: 'preauth_start',
      status: 'pending',
      amount,
    });

    // Chamar Asaas
    const asaasResponse = await asaas.authorize({
      customer: customer.asaasId,
      value: amount,
      card: { token: cardToken },
      authorizeOnly: true,
    });

    await logPaymentEvent({
      paymentId,
      orderId,
      action: 'preauth_success',
      status: 'success',
      asaasPaymentId: asaasResponse.id,
      authCode: asaasResponse.authorizationCode,
      duration_ms: Date.now() - startTime,
    });

    // Registrar no BD
    await db.collection('payments').doc(paymentId).set({
      orderId,
      customerId,
      status: 'preauth_pending',
      asaasPaymentId: asaasResponse.id,
      createdAt: new Date(),
    });

    return { success: true, paymentId };
  } catch (error) {
    await logPaymentEvent({
      paymentId,
      orderId,
      action: 'preauth_failed',
      status: 'failed',
      errorCode: error.code,
      errorMessage: error.message,
      duration_ms: Date.now() - startTime,
    });

    throw error;
  }
}
```

---

## 5. Testes no Sandbox

### 5.1 Configuração Sandbox

```bash
# .env.test
ASAAS_API_KEY=<sandbox_api_key>
ASAAS_WEBHOOK_SECRET=<sandbox_webhook_secret>
ASAAS_MODE=sandbox
```

### 5.2 Cartões de Teste

Asaas fornece cartões de teste:

| Cartão | Status | Uso |
|--------|--------|-----|
| 4111111111111111 | Sucesso | Testes normais |
| 5555555555554444 | Sucesso | Mastercard |
| 378282246310005 | Sucesso | Amex |
| 4000000000000002 | Recusado | Teste de falha |
| 4000002500003155 | Limite excedido | Teste de limite |
| 4000003560013336 | Fraude suspeita | Teste de bloqueio |

CVV: qualquer 3-4 dígitos
Validade: qualquer futura (ex: 12/27)

### 5.3 Cenários de Teste Obrigatórios

#### Cenário 1: Fluxo Bem-Sucedido (Pré-auth → Captura → Saque)

```javascript
test('End-to-end: criar pedido → pré-auth → cliente confirma → captura → saque', async () => {
  // 1. Criar pedido
  const order = await createOrder({
    customerId: 'test_customer_123',
    cleanerId: 'test_cleaner_456',
    amount: 150.00,
    serviceDate: tomorrow(),
  });

  // 2. Pré-autorizar (simular Cron)
  const preauth = await handlePreauth(order.id, order.customerId, order.amount);
  expect(preauth.success).toBe(true);
  expect(preauth.paymentId).toBeDefined();

  // 3. Simular webhook de sucesso
  const webhookPayload = {
    id: 'webhook_event_123',
    event: 'payment_status_changed',
    data: {
      id: preauth.asaasPaymentId,
      status: 'authorized',
      authorizationCode: '123456',
    },
  };
  await handleWebhook(webhookPayload);

  // 4. Verificar status
  const payment = await db.collection('payments').doc(preauth.paymentId).get();
  expect(payment.data().status).toBe('preauth_success');

  // 5. Cliente confirma
  const capture = await handleCapture(preauth.paymentId);
  expect(capture.success).toBe(true);

  // 6. Verificar split
  const wallet = await db.collection('cleaner_wallets').doc(order.cleanerId).get();
  expect(wallet.data().balancePending).toBe(125.00); // R$150 - 15% comissão - etc

  // 7. Simular D+15 (change status)
  await simulateDateChange(15);
  
  // 8. Faxineira solicita saque
  const withdrawal = await handleWithdrawal(order.cleanerId, 125.00);
  expect(withdrawal.status).toBe('pending');
});
```

#### Cenário 2: Falha de Pré-Autorização com Retry

```javascript
test('Pré-auth falha 2x, cliente é notificado para trocar cartão', async () => {
  // 1. Criar pedido com cartão recusado
  const order = await createOrder({
    customerId: 'test_customer_bad_card',
    amount: 150.00,
  });

  // 2. Primeira tentativa falha
  const preauth1 = await handlePreauth(order.id, order.customerId, order.amount);
  expect(preauth1.success).toBe(false);
  expect(preauth1.error).toBe('card_declined');

  // 3. Registrar retry
  const retry1 = await scheduleRetry(order.id, 1, 3600000); // 1h
  expect(retry1.scheduled).toBe(true);

  // 4. Simular passage de 1h
  await simulateTimePass(3600000);

  // 5. Executar retry 1 (ainda falha)
  const preauth2 = await handlePreauth(order.id, order.customerId, order.amount);
  expect(preauth2.success).toBe(false);

  // 6. Registrar retry 2
  const retry2 = await scheduleRetry(order.id, 2, 3600000);
  expect(retry2.scheduled).toBe(true);

  // 7. Simular passage de 1h + execução
  await simulateTimePass(3600000);
  const preauth3 = await handlePreauth(order.id, order.customerId, order.amount);
  expect(preauth3.success).toBe(false);

  // 8. Verificar notificação foi enviada
  const notifications = await db.collection('notifications')
    .where('customerId', '==', order.customerId)
    .where('type', '==', 'payment_change_card')
    .get();
  expect(notifications.size).toBeGreaterThan(0);

  // 9. Simular passage de 6h + cliente não resolve
  await simulateTimePass(6 * 3600000);
  await handleOrderCancellation(order.id, 'payment_timeout');

  // 10. Verificar order foi cancelada
  const cancelledOrder = await db.collection('orders').doc(order.id).get();
  expect(cancelledOrder.data().status).toBe('cancelled');
});
```

#### Cenário 3: Webhook Duplicado

```javascript
test('Webhook duplicado é ignorado (idempotência)', async () => {
  const webhookPayload = {
    id: 'webhook_event_123',  // event_id duplicado
    event: 'payment_status_changed',
    data: { id: 'pay_xyz', status: 'captured' },
  };

  // 1. Primeiro webhook processa
  const result1 = await handleWebhook(webhookPayload);
  expect(result1.status).toBe('processed');

  // 2. Segundo webhook com mesmo event_id é ignorado
  const result2 = await handleWebhook(webhookPayload);
  expect(result2.status).toBe('already_processed');

  // 3. Verificar que não houve duplicação
  const events = await db.collection('payment_events')
    .where('asaasEventId', '==', 'webhook_event_123')
    .get();
  expect(events.size).toBe(1); // Exatamente um evento registrado
});
```

#### Cenário 4: Cancelamento −12h

```javascript
test('Cancelamento −12h: 30% vai para faxineira, 70% para cliente', async () => {
  // 1. Criar pedido pré-autorizado
  const order = await createOrderAndPreauth(150.00);

  // 2. Simular chegada perto de D-1 22h (−12h do D 10h)
  await simulateDateChange(-0.5); // meio dia antes

  // 3. Cliente cancela
  const cancellation = await handleOrderCancellation(order.id, 'customer_request');
  expect(cancellation.status).toBe('partial_refund');

  // 4. Verificar divisão
  expect(cancellation.capturedForCleaner).toBe(45.00); // 30%
  expect(cancellation.refundToCustomer).toBe(107.50); // 70% − taxa

  // 5. Verificar saldo da faxineira
  const wallet = await db.collection('cleaner_wallets')
    .doc(order.cleanerId).get();
  expect(wallet.data().balancePending).toBe(41.00); // R$45 − R$4 taxa
});
```

#### Cenário 5: Disputa com Reembolso Parcial

```javascript
test('Cliente abre disputa, admin aprova reembolso parcial', async () => {
  // 1. Criar pedido confirmado
  const order = await createOrderAndCaptured(150.00);

  // 2. Cliente reporta problema
  const dispute = await handleDispute({
    orderId: order.id,
    customerId: order.customerId,
    description: 'Quarto mal feito',
    photos: ['photo1.jpg'],
  });
  expect(dispute.status).toBe('opened');

  // 3. Valor continua retido
  const payment = await db.collection('payments').doc(order.paymentId).get();
  expect(payment.data().status).toBe('disputa_aberta');

  // 4. Faxineira responde
  await handleDisputeResponse({
    disputeId: dispute.id,
    cleanerId: order.cleanerId,
    response: 'Fiz o trabalho conforme pedido',
    photos: ['photo_evidence.jpg'],
  });

  // 5. Admin aprova reembolso de R$30
  await handleDisputeResolution({
    disputeId: dispute.id,
    adminId: 'admin_123',
    decision: 'partial_refund',
    refundAmount: 30.00,
  });

  // 6. Verificar captures
  const events = await db.collection('payment_events')
    .where('paymentId', '==', order.paymentId)
    .where('type', '==', 'capture')
    .get();
  expect(events.docs.length).toBeGreaterThan(0);

  // 7. Verificar split
  const cleanerWallet = await db.collection('cleaner_wallets')
    .doc(order.cleanerId).get();
  expect(cleanerWallet.data().balancePending).toBe(120.00); // R$150 − R$30
});
```

### 5.4 Teste de Taxas

Confirmar que taxas Asaas estão corretas:

```javascript
test('Taxas Asaas refletem corretamente na split', async () => {
  const order = await createOrderAndCaptured(150.00);

  // 1. Capturar (deve descontar taxa)
  const capture = await asaas.getPayment(order.asaasPaymentId);
  
  // 2. Taxa deve ser ~R$5,00 (R$0,49 fixo + 3%)
  const expectedFee = 0.49 + (150.00 * 0.03);
  expect(Math.abs(capture.value - capture.netValue - expectedFee)).toBeLessThan(0.10);

  // 3. Split correto
  const expectedCleanerFee = expectedFee / 2;
  const payment = await db.collection('payments').doc(order.paymentId).get();
  expect(payment.data().splitData.cleanerProcessingFee).toBeCloseTo(expectedCleanerFee, 1);
});
```

---

## 6. Segurança: Checklist

### 6.1 Dados Sensíveis

- [ ] Nunca guardar PAN (número completo do cartão)
- [ ] Nunca guardar CVV
- [ ] Nunca guardar data de validade
- [ ] Sempre tokenizar via Asaas (obter `card.token`)
- [ ] Guardar apenas token + últimos 4 dígitos + bandeira
- [ ] Validar que BD nunca retorna dados sensíveis

Teste:
```javascript
test('Dados sensíveis nunca aparecem em BD ou logs', async () => {
  const payment = await db.collection('payments').doc(paymentId).get();
  const data = JSON.stringify(payment.data());
  
  expect(data).not.toContain('4111111111111111'); // PAN completo
  expect(data).not.toContain('123'); // CVV
  expect(data).toContain('1111'); // OK: últimos 4
  expect(data).toContain('card_token_xyz'); // OK: token
});
```

### 6.2 Autenticação de Webhook

- [ ] Validar token secreto em header `authorization`
- [ ] Validar que requisição vem realmente do Asaas (IP whitelisting opcional)
- [ ] Retornar 401 se token inválido

```javascript
const validateWebhookAuth = (req) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${process.env.ASAAS_WEBHOOK_SECRET}`) {
    throw new Error('Invalid webhook signature');
  }
};
```

### 6.3 Autenticação de Cron

- [ ] Validar token em header `authorization`
- [ ] Retornar 401 se token inválido
- [ ] Limitar execução por IP (Vercel publica IPs)

```javascript
const validateCronAuth = (req) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    throw new Error('Invalid cron token');
  }
};
```

### 6.4 Proteção contra Replay

- [ ] Verificar timestamp do webhook (não aceitar eventos muito antigos)
- [ ] Usar event_id para idempotência

```javascript
const validateWebhookTimestamp = (webhook) => {
  const maxAge = 5 * 60 * 1000; // 5 minutos
  const webhookAge = Date.now() - new Date(webhook.timestamp).getTime();
  if (webhookAge > maxAge) {
    throw new Error('Webhook timestamp too old');
  }
};
```

### 6.5 Validação de Entrada

- [ ] Validar tipos de campo (amount deve ser number, status deve ser enum, etc.)
- [ ] Validar ranges (amount ≥ R$20 para saque, etc.)
- [ ] Escapar strings que vão para BD

```javascript
const validatePaymentInput = (data) => {
  if (typeof data.amount !== 'number' || data.amount <= 0) {
    throw new Error('Invalid amount');
  }
  if (!['CREDIT_CARD', 'PIX'].includes(data.billingType)) {
    throw new Error('Invalid billing type');
  }
  if (data.description && typeof data.description !== 'string') {
    throw new Error('Invalid description');
  }
};
```

### 6.6 Rate Limiting

- [ ] Limitar requisições por cliente (ex: máx 10 criações de pedido/min)
- [ ] Limitar requisições por IP
- [ ] Usar Vercel middleware ou Firebase Cloud Functions com rate limit

```javascript
const rateLimit = {};

const checkRateLimit = (customerId, limit = 10, window = 60000) => {
  const key = customerId;
  const now = Date.now();

  if (!rateLimit[key]) {
    rateLimit[key] = [];
  }

  // Remover eventos fora da janela
  rateLimit[key] = rateLimit[key].filter(t => now - t < window);

  if (rateLimit[key].length >= limit) {
    throw new Error('Rate limit exceeded');
  }

  rateLimit[key].push(now);
};
```

### 6.7 HTTPS Obrigatório

- [ ] Todas as URLs de webhook usam HTTPS
- [ ] Certificados válidos (Let's Encrypt)
- [ ] Testar com `curl -I https://api.moppy.app/webhooks/asaas`

### 6.8 Auditoria e Logs

- [ ] Logar todos os eventos (sem dados sensíveis)
- [ ] Manter logs por mínimo 6 meses
- [ ] Logs imutáveis (no Firestore, usar regras de segurança para impedir deleção)

---

## 7. Deployment em Produção

### 7.1 Pré-Requisitos

- [ ] CNPJ obtido (Moppy é empresa)
- [ ] Conta Asaas produção criada
- [ ] API key produção gerada
- [ ] Testes completos passando no sandbox
- [ ] Revisão de segurança concluída

### 7.2 Migração Sandbox → Produção

```bash
# 1. Backup de todos os dados sandbox (Firebase export)
gcloud firestore export gs://moppy-backup/sandbox-backup-$(date +%s)

# 2. Atualizar .env (chaves produção)
ASAAS_API_KEY=<production_key>
ASAAS_WEBHOOK_SECRET=<production_secret>
ASAAS_MODE=production

# 3. Atualizar Vercel environment variables
vercel env add ASAAS_API_KEY
vercel env add ASAAS_WEBHOOK_SECRET

# 4. Deploy em staging (before main)
vercel deploy --prod --target=staging

# 5. Testar com transações pequenas (R$1.00, etc.)
# 6. Monitor logs por 24h
# 7. Deploy em produção completa
vercel deploy --prod
```

### 7.3 Rollback Plan

Se algo der errado em produção:

1. Parar Vercel Cron imediatamente
2. Desabilitar webhook do Asaas (remover endpoint)
3. Notificar clientes: "Será impossível criar novos pedidos por X min"
4. Revisar logs e BD
5. Fixar em staging
6. Testar
7. Re-ativar

---

## Checklist Final

- [ ] Endpoints Asaas testados (pré-auth, captura, estorno)
- [ ] Webhook implementado com idempotência
- [ ] Vercel Cron configurado
- [ ] Logging completo (sem dados sensíveis)
- [ ] BD preparada (coleções + índices)
- [ ] Testes sandbox: 5 cenários obrigatórios passando
- [ ] Validação de entrada implementada
- [ ] Rate limiting implementado
- [ ] Tratamento de erros em cada etapa
- [ ] Notificações de cliente/faxineira funcionando
- [ ] Documentação atualizada (PAYMENT-FLOW.md)
- [ ] Revisão de segurança realizada
- [ ] Deploy em produção aprovado
