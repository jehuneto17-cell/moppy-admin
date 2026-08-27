# Moppy — Database Design (Firestore)

## 1. Visão Geral

**Banco:** Firestore (NoSQL, document-oriented)
**Região:** us-central1 (padrão, alterar conforme latência)
**Modo:** Modo nativo (não Datastore)
**Backup:** Daily 2am UTC

**Princípios:**
- Desnormalização controlada (evitar múltiplos reads)
- IDs públicos vs IDs privados (endereços, chaves PIX)
- Soft deletes para auditoria
- Timestamps em UTC

---

## 2. Collections & Documents

### 2.1. `users` — Usuários (Cliente + Faxineira)

**Descrição:** Qualquer usuário autenticado (pode ser cliente, faxineira ou ambos)

**Documento exemplo:**
```javascript
{
  "user_id": "firebase_uid",  // Gerado por Firebase Auth
  "email": "cliente@example.com",
  "name": "Maria Silva",
  "phone": "+55 11 98765-4321",
  "role": ["client", "cleaner"],  // Array, pode ter ambos
  "profile_photo_url": "https://res.cloudinary.com/...",
  "is_active": true,
  "trust_score": 65,  // 0-100, começa em 65
  "created_at": "2025-08-23T10:00:00Z",
  "updated_at": "2025-08-23T10:00:00Z",
  
  // Cliente
  "client_profile": {
    "addresses_count": 2,
    "orders_total": 5,
    "orders_completed": 4,
    "rating_average": 4.8,
    "rating_count": 4
  },
  
  // Faxineira (quando papel = "cleaner")
  "cleaner_profile": {
    "approval_status": "approved",  // pending, approved, rejected, rejected_can_retry
    "approval_rejection_reason": null,  // "doc_illegible", "selfie_mismatch", "cpf_invalid", "underage"
    "approval_date": "2025-08-21T14:30:00Z",
    "rejection_date": null,
    "rejection_attempts": 0,
    "is_suspended": false,
    "suspension_reason": null,
    "services_completed": 12,
    "services_cancelled": 1,
    "rating_average": 4.7,
    "rating_count": 12
  },
  
  // LGPD
  "gdpr_accepted": true,
  "gdpr_accepted_at": "2025-08-23T10:00:00Z",
  "terms_accepted": true,
  "terms_accepted_at": "2025-08-23T10:00:00Z",
  
  // Notificações
  "notifications_enabled": true,
  "notification_preferences": {
    "new_order_nearby": true,
    "new_candidate": true,
    "selected_as_candidate": true,
    "service_reminder": true,
    "dispute_updates": true
  },
  
  "deleted_at": null  // Soft delete
}
```

**Índices:**
- `(role, is_active, created_at)` — Listar clientes/faxineiras ativos
- `(trust_score, is_active)` — Filtrar por confiabilidade

**Security Rules:**
```javascript
// Leitura
- Próprio usuário: pode ler seus dados completos
- Admin: pode ler todos os usuários (exceto campos sensíveis)
- Outro cliente/faxineira: pode ler só name, rating_average, profile_photo_url

// Escrita
- Apenas o próprio usuário pode editar seu documento
- Admin pode atualizar trust_score, is_suspended
- Email é imutável (definido por Firebase Auth)
```

---

### 2.2. `cleaners` — Perfil Faxineira (Estendido)

**Descrição:** Dados KYC e operacionais da faxineira (subcoleção de users com foco em doc + saque)

**Documento exemplo:**
```javascript
{
  "cleaner_id": "firebase_uid",  // Referência para users/{user_id}
  
  // KYC Documents
  "documents": {
    "id_document": {
      "type": "rg",  // ou "cnh"
      "storage_url": "gs://moppy-prod.appspot.com/kyc/xxx/id.jpg",
      "submitted_at": "2025-08-21T10:00:00Z",
      "verified": true
    },
    "cpf_document": {
      "storage_url": "gs://moppy-prod.appspot.com/kyc/xxx/cpf.jpg",
      "submitted_at": "2025-08-21T10:00:00Z",
      "verified": true,
      "cpf_number": "xxx.xxx.xxx-xx",  // Criptografado em produção (Firestore Encryption)
      "cpf_hash": "sha256(cpf_number)"  // Para validação sem expor CPF
    },
    "selfie": {
      "storage_url": "gs://moppy-prod.appspot.com/kyc/xxx/selfie.jpg",
      "submitted_at": "2025-08-21T10:00:00Z",
      "verified": true
    },
    "address_proof": {
      "type": "utility_bill",  // ou "bank_statement", "rental_agreement"
      "storage_url": "gs://moppy-prod.appspot.com/kyc/xxx/address.jpg",
      "submitted_at": "2025-08-21T10:00:00Z",
      "verified": true,
      "proof_date": "2025-07-21"  // Menos de 90 dias
    }
  },
  
  // PIX
  "pix": {
    "key_type": "cpf",  // "cpf", "email", "phone", "random"
    "key_value": "xxx.xxx.xxx-xx",  // Criptografado
    "bank_code": "001",  // Banco Central ISPB
    "bank_name": "Banco do Brasil",
    "account_holder": "Maria Silva",
    "updated_at": "2025-08-21T10:00:00Z",
    "is_valid": true,
    "validation_error": null
  },
  
  // Operacional
  "service_radius_km": 15,  // 5, 10, 15, 20
  "service_area_cities": ["São Paulo", "Santo André"],
  "service_availability": {
    "monday": [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],  // Horários disponíveis
    "tuesday": [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    // ... restante dos dias
  },
  
  // Asaas Integration
  "asaas_customer_id": "cust_asaas_xxxxx",  // Para pré-auth
  "asaas_subaccount_id": "sub_asaas_yyyyy",  // Para split automático
  
  // Contato Asaas
  "asaas_bank_account": {
    "account_holder_name": "Maria Silva",
    "account_number": "xxxxx",
    "account_digit": "x",
    "bank_code": "001",
    "account_type": "checking"
  },
  
  "created_at": "2025-08-21T10:00:00Z",
  "updated_at": "2025-08-21T10:00:00Z",
  "deleted_at": null
}
```

**Subcoleção:** `cleaners/{cleaner_id}/withdraw_history`
```javascript
{
  "withdraw_id": "w_123456",
  "amount": 150.00,
  "pix_key": "xxx.xxx.xxx-xx",  // Criptografado
  "status": "success",  // "pending", "success", "failed"
  "asaas_transfer_id": "transfer_xxxxx",
  "error": null,
  "requested_at": "2025-08-23T10:00:00Z",
  "processed_at": "2025-08-25T14:30:00Z"
}
```

**Índices:**
- `(approval_status, created_at)` — Fila de aprovação
- `(service_radius_km, service_area_cities)` — Busca geográfica (com raio)

**Security Rules:**
```javascript
// Leitura
- Próprio cleaner: pode ler seus documentos e PIX
- Admin: pode ler tudo
- Cliente: pode ler só dados públicos (score, avaliações)

// Escrita
- Próprio cleaner: pode editar PIX, disponibilidade, raio
- Admin: pode editar approval_status, documents.verified
```

---

### 2.3. `orders` — Pedidos de Limpeza

**Descrição:** Cada pedido do cliente (ciclo completo até avaliação)

**Documento exemplo:**
```javascript
{
  "order_id": "ORD-20250823-001",  // Formato legível (humano-friendly)
  
  // Partes envolvidas
  "client_id": "firebase_uid",
  "cleaner_id": "firebase_uid",  // Null até escolha do cliente
  
  // Localização
  "address": {
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 45",
    "neighborhood": "Vila Mariana",
    "city": "São Paulo",
    "state": "SP",
    "postal_code": "01234-567",
    "lat": -23.589242,
    "lng": -46.660721,
    "place_id": "ChIJ..."  // Google Places ID
  },
  
  // Serviço
  "service": {
    "type": "standard",  // "standard", "heavy", "laundry"
    "size": "2q",  // "studio", "1q", "2q", "3q", "4q+"
    "extras": [
      {"id": "extra_bathrooms", "count": 2, "unit_price": 50.00},
      {"id": "external_area", "count": 1, "unit_price": 80.00}
    ],
    "products_included": false
  },
  
  // Agendamento
  "scheduled_at": "2025-08-25T10:00:00Z",
  "duration_minutes": 120,  // Estimado
  "timezone": "America/Sao_Paulo",
  
  // Preços
  "pricing": {
    "base_price": 150.00,  // Base + tipo + tamanho
    "extras_price": 130.00,  // Soma de adicionais
    "subtotal": 280.00,
    "urgency_fee": 0.00,  // Se aplicável: 3.50, 4.50, 5.50
    "gross_total": 280.00,  // subtotal + urgency
    "asaas_fee": ~8.40,  // Taxa Asaas estimada (~3%)
    "net_total_client": 288.40,  // Quanto cliente paga (gross + sua taxa)
    "net_total_cleaner": 237.72  // Quanto faxineira recebe (gross - comissão - sua taxa)
  },
  
  // Status do pedido
  "status": "completed",  // Estados: draft, open, confirmed, in_progress, completed, disputed, cancelled
  "status_history": [
    {"status": "draft", "timestamp": "2025-08-23T10:00:00Z"},
    {"status": "open", "timestamp": "2025-08-23T10:05:00Z"},
    {"status": "confirmed", "timestamp": "2025-08-24T14:00:00Z"},
    // ... demais transições
  ],
  
  // Confirmação de chegada
  "arrival_confirmation": {
    "method": "code",  // "code", "gps_photo", "none"
    "code": "1234",  // Se code
    "confirmed_at": "2025-08-25T10:15:00Z",
    "verified": true
  },
  
  // Conclusão
  "completion": {
    "completed_by_cleaner_at": "2025-08-25T12:00:00Z",
    "confirmed_by_client_at": "2025-08-25T12:30:00Z",
    "confirmation_type": "manual",  // "manual", "auto" (após 24h)
    "auto_confirmation_reminder_sent_at": "2025-08-26T00:30:00Z"
  },
  
  // Cancelamento
  "cancellation": {
    "cancelled_by": null,  // "client", "cleaner", "system"
    "cancelled_at": null,
    "cancellation_reason": null,
    "cancellation_scenario": null  // "free", "refund_100", "refund_70", "last_minute"
  },
  
  // Timestamps
  "created_at": "2025-08-23T10:00:00Z",
  "updated_at": "2025-08-25T12:30:00Z",
  "deleted_at": null
}
```

**Subcoleção:** `orders/{order_id}/applications`
```javascript
{
  "cleaner_id": "firebase_uid",
  "cleaner_name": "Maria Silva",
  "cleaner_rating": 4.7,
  "cleaner_distance_km": 2.3,
  "applied_at": "2025-08-24T10:00:00Z",
  "status": "declined",  // "pending", "selected", "declined"
  "declined_at": "2025-08-24T14:00:00Z"
}
```

**Índices:**
- `(client_id, status, scheduled_at)` — Meus pedidos (cliente)
- `(cleaner_id, status, scheduled_at)` — Meus serviços (faxineira)
- `(status, scheduled_at, city)` — Admin filtro
- `(city, scheduled_at)` + filtro de status — Feed faxineira por região

**Security Rules:**
```javascript
// Leitura
- Client: pode ler seus próprios pedidos (completo)
- Cleaner: pode ler pedidos confirmados (completo), abertos (sem endereço completo)
- Admin: pode ler todos

// Escrita
- Client: pode criar, atualizar até confirmação, pode confirmar/disputar
- Cleaner: pode aplicar, pode marcar concluído (se selecionado)
- Admin: pode atualizar status em disputas/cancelamentos
```

---

### 2.4. `payments` — Transações de Pagamento

**Descrição:** Rastreamento de cada transação (pré-auth, captura, estorno, split)

**Documento exemplo:**
```javascript
{
  "payment_id": "pay_20250823_001",
  "order_id": "ORD-20250823-001",
  
  // Partes
  "client_id": "firebase_uid",
  "cleaner_id": "firebase_uid",
  
  // Cartão & Tokenização
  "card": {
    "token": "card_xxx",  // Token Asaas (nunca guardar número completo)
    "last_four": "4242",
    "brand": "visa",
    "holder_name": "Maria Silva",
    "expiry_month": 12,
    "expiry_year": 2027
  },
  
  // Valores
  "amount": {
    "gross": 288.40,  // O que cliente paga
    "asaas_fee_estimated": ~8.40,
    "net": 280.00  // O que de fato é cobrado
  },
  
  // Status & Máquina de Estados
  "status": "capture_success",  // Vide Estados em PAYMENT-FLOW.md
  "status_history": [
    {"status": "pending", "timestamp": "2025-08-23T10:00:00Z"},
    {"status": "preauth_pending", "timestamp": "2025-08-24T22:00:00Z"},
    {"status": "preauth_success", "timestamp": "2025-08-24T22:05:00Z"},
    {"status": "capture_pending", "timestamp": "2025-08-25T12:30:00Z"},
    {"status": "capture_success", "timestamp": "2025-08-25T12:35:00Z"}
  ],
  
  // Asaas
  "asaas": {
    "customer_id": "cust_asaas_xxxxx",
    "preauth_id": "pay_asaas_preauth_xxxxx",  // Pré-autorização
    "capture_id": "pay_asaas_capture_xxxxx",  // Captura (pode ser diferente)
    "refund_id": null,
    "transfer_id": "transfer_asaas_xxxxx"  // Transferência para subconta (split)
  },
  
  // Split (Divisão)
  "split": {
    "gross_total": 280.00,
    "app_commission_percent": 15,
    "app_commission_amount": 42.00,
    "app_processing_fee_share": 4.20,  // 50% da taxa Asaas (~8.40)
    "app_anticipation_cost": 1.82,  // 0.65% de antecipação D+15
    "app_total": 48.02,
    "cleaner_processing_fee_share": 4.20,  // 50% restante
    "cleaner_gross": 231.98,  // 280 - 42 (comissão) - 4.20 (sua taxa) - 1.82 (antecipação)
    "cleaner_net": 231.98,  // Já descontado
    "split_executed_at": "2025-08-25T12:35:00Z"
  },
  
  // Tentativas (retry automático)
  "preauth_attempt": 1,  // Qual tentativa (1, 2, 3...)
  "capture_attempt": 1,
  "next_retry_at": null,  // Agendado para tentar de novo (se falha)
  
  // Disputa (se aplicável)
  "dispute_id": null,
  "dispute_status": null,  // Vira "open" se cliente reportar problema
  
  // Webhook
  "last_webhook_status": "captured",
  "last_webhook_timestamp": "2025-08-25T12:35:00Z",
  "asaas_webhook_events": ["preauth_pending", "preauth_success", "captured"],  // Histórico de webhooks recebidos
  
  "created_at": "2025-08-23T10:00:00Z",
  "updated_at": "2025-08-25T12:35:00Z",
  "deleted_at": null
}
```

**Subcoleção:** `payments/{payment_id}/events`
```javascript
{
  "event_id": "evt_xxx",
  "type": "preauth_attempt",  // "preauth_attempt", "webhook_received", "capture_attempt", etc
  "status": "success",  // "success", "failed", "pending"
  "asaas_event_id": "webhook_event_xxx",  // Se foi webhook
  "asaas_response": {...},  // Payload completo Asaas (log auditoria)
  "error": null,
  "timestamp": "2025-08-24T22:05:00Z"
}
```

**Índices:**
- `(order_id)` — Busca pagamento por pedido (único)
- `(client_id, status, created_at)` — Histórico cliente
- `(status, created_at)` — Dashboard admin (pagamentos pendentes)
- `(cleaner_id, status, created_at)` — Saque (faxineira, "a_liberar" vs "disponível")

**Security Rules:**
```javascript
// Leitura
- Client: pode ler seu próprio pagamento
- Cleaner: pode ler pagamentos de seus pedidos
- Admin: pode ler todos

// Escrita
- Backend /api: pode escrever status, split, asaas_*
- Webhook Asaas: pode escrever (validado por token secreto)
- Cliente NÃO pode escrever (segurança crítica)
```

---

### 2.5. `disputes` — Conflitos & Mediação

**Descrição:** Registro de disputas (cliente reporta problema)

**Documento exemplo:**
```javascript
{
  "dispute_id": "disp_20250825_001",
  "order_id": "ORD-20250823-001",
  "payment_id": "pay_20250823_001",
  
  "client_id": "firebase_uid",
  "cleaner_id": "firebase_uid",
  
  // Reclamação do Cliente
  "client_claim": {
    "description": "Quarto mal limpo, móvel arranhado",
    "photos": [
      "gs://moppy-prod.appspot.com/disputes/disp_xxx/photo1.jpg",
      "gs://moppy-prod.appspot.com/disputes/disp_xxx/photo2.jpg"
    ],
    "submitted_at": "2025-08-25T13:00:00Z"
  },
  
  // Defesa da Faxineira (24h)
  "cleaner_response": {
    "description": "O móvel já estava arranhado, cliente confirmou no chat",
    "photos": [
      "gs://moppy-prod.appspot.com/disputes/disp_xxx/response1.jpg"
    ],
    "submitted_at": "2025-08-25T15:30:00Z",
    "response_deadline": "2025-08-26T13:00:00Z",
    "responded_on_time": true
  },
  
  // Análise do Admin
  "admin_decision": {
    "decided_by": "admin_uid",
    "decision": "refund_partial",  // "refund_total", "refund_partial", "approve_cleaner"
    "refund_percent": 20,  // Se refund_partial
    "refund_amount": 56.00,  // Client: 56, Cleaner: 224
    "justification": "Cliente tem razão sobre quarto, mas móvel já estava danificado. Reembolso de 20%.",
    "decided_at": "2025-08-25T18:00:00Z"
  },
  
  // Status
  "status": "resolved",  // "open", "responded", "decided"
  "status_history": [
    {"status": "open", "timestamp": "2025-08-25T13:00:00Z"},
    {"status": "responded", "timestamp": "2025-08-25T15:30:00Z"},
    {"status": "decided", "timestamp": "2025-08-25T18:00:00Z"}
  ],
  
  // Processamento da Decisão
  "decision_executed": true,
  "decision_executed_at": "2025-08-25T18:05:00Z",
  "execution_error": null,
  
  "created_at": "2025-08-25T13:00:00Z",
  "updated_at": "2025-08-25T18:05:00Z",
  "deleted_at": null
}
```

**Índices:**
- `(status, created_at)` — Fila admin (disputas abertas/respondidas)
- `(order_id)` — Busca disputa por pedido

**Security Rules:**
```javascript
// Leitura
- Client: pode ler suas próprias disputas
- Cleaner: pode ler disputas de seus pedidos
- Admin: pode ler todas

// Escrita
- Client: pode criar disputa (status="open"), pode ver resposta faxineira
- Cleaner: pode responder (status="responded")
- Admin: pode decidir (status="decided")
```

---

### 2.6. `reviews` — Avaliações (Ratings)

**Descrição:** Avaliação de cliente para faxineira e vice-versa

**Documento exemplo:**
```javascript
{
  "review_id": "rev_20250825_001",
  "order_id": "ORD-20250823-001",
  
  "from_user_id": "firebase_uid",  // Quem está avaliando
  "from_user_name": "Maria Silva",
  "from_user_role": "client",  // ou "cleaner"
  
  "to_user_id": "firebase_uid",  // Quem está sendo avaliado
  "to_user_name": "João Limpador",
  "to_user_role": "cleaner",  // ou "client"
  
  // Avaliação
  "rating": 5,  // 1-5 stars
  "comment": "Excelente trabalho! Muito cuidadoso.",
  "submitted_at": "2025-08-25T13:30:00Z",
  
  // Visibilidade (proteção contra retaliação)
  "visible": false,  // Fica invisível até ambos avaliarem ou 72h
  "visibility_reason": "waiting_mutual",  // "waiting_mutual", "mutual_reviewed", "timeout_72h"
  "visible_from": "2025-08-28T13:30:00Z",  // Quando fica visível
  "made_visible_at": null,
  
  "created_at": "2025-08-25T13:30:00Z",
  "deleted_at": null
}
```

**Índices:**
- `(to_user_id, visible, submitted_at)` — Avaliações visíveis de um usuário
- `(order_id)` — Avaliações de um pedido específico

**Security Rules:**
```javascript
// Leitura
- Autor: pode ler sua própria avaliação
- Avaliado: pode ler sua avaliação (mas só vê conteúdo se visible=true)
- Admin: pode ler todas

// Escrita
- Cliente/Faxineira: pode criar uma avaliação por pedido (se completado)
- Ninguém pode editar/deletar (só soft-delete por admin se abuso)
```

---

### 2.7. `chats` — Conversas (Cliente ↔ Faxineira)

**Descrição:** Chat entre cliente e faxineira (aberto após seleção)

**Documento exemplo:**
```javascript
{
  "chat_id": "chat_ord_20250823_001",  // ORD_ID + partes
  "order_id": "ORD-20250823-001",
  
  "participants": {
    "client_id": "firebase_uid",
    "client_name": "Maria Silva",
    "cleaner_id": "firebase_uid",
    "cleaner_name": "João Limpador"
  },
  
  // Metadata
  "created_at": "2025-08-24T14:00:00Z",  // Quando cliente escolheu faxineira
  "last_message_at": "2025-08-25T11:00:00Z",
  "is_active": true,
  
  "created_at": "2025-08-24T14:00:00Z",
  "updated_at": "2025-08-25T11:00:00Z",
  "deleted_at": null
}
```

**Subcoleção:** `chats/{chat_id}/messages`
```javascript
{
  "message_id": "msg_xxx",
  "sender_id": "firebase_uid",
  "sender_name": "Maria Silva",
  "sender_role": "client",
  
  "text": "Qual é a sua disponibilidade? Pode chegar um pouco mais cedo?",
  "media": [  // Opcional: fotos, documentos
    {
      "type": "image",
      "url": "gs://moppy-prod.appspot.com/chats/chat_xxx/img1.jpg"
    }
  ],
  
  "is_system": false,  // True se mensagem do sistema (ex: "pedido confirmado")
  "system_type": null,  // "order_selected", "arrival_confirmed", etc
  
  "read_by": {
    "client_id": "2025-08-25T11:05:00Z",  // Quando cliente leu
    "cleaner_id": "2025-08-25T11:01:00Z"   // Quando faxineira leu
  },
  
  "created_at": "2025-08-25T11:00:00Z",
  "deleted_at": null
}
```

**Índices:**
- `(participants, created_at)` — Listar chats de um usuário

**Security Rules:**
```javascript
// Leitura
- Participants: podem ler mensagens do seu chat
- Admin: pode ler chats (moderação)

// Escrita
- Participants: podem postar mensagens (após pedido confirmado)
```

---

### 2.8. `wallets` — Carteira de Faxineira

**Descrição:** Saldo e rastreamento de créditos (a liberar vs disponível)

**Documento exemplo:**
```javascript
{
  "wallet_id": "wallet_cleaner_uid",  // ID = cleaner_id
  
  "balance": {
    "total": 987.50,  // Soma de tudo
    "pending_release": 450.00,  // "a liberar" (D até D+14)
    "available": 537.50,  // "disponível" (D+15+)
    "pending_release_date": "2025-09-07T00:00:00Z"  // Quando tudo fica disponível
  },
  
  // Histórico de créditos
  "credits": [
    {
      "credit_id": "credit_xxx",
      "order_id": "ORD-20250823-001",
      "amount": 231.98,
      "status": "pending_release",  // "pending_release", "available"
      "earned_at": "2025-08-25T12:35:00Z",
      "will_be_available_at": "2025-09-09T00:00:00Z",
      "made_available_at": null
    }
  ],
  
  "updated_at": "2025-08-25T12:35:00Z"
}
```

**Subcoleção:** `wallets/{wallet_id}/transactions`
```javascript
{
  "transaction_id": "txn_xxx",
  "type": "credit",  // "credit", "withdraw", "refund"
  "amount": 231.98,
  "balance_after": 987.50,
  "order_id": "ORD-20250823-001",  // Se credit ou refund
  "withdraw_id": "w_123456",  // Se withdraw
  "reason": "Service completed and confirmed",
  "timestamp": "2025-08-25T12:35:00Z"
}
```

**Índices:**
- `(balance.available >= 20)` — Faxineiras com saldo para sacar

**Security Rules:**
```javascript
// Leitura
- Própria faxineira: pode ler sua carteira
- Admin: pode ler todas

// Escrita
- Backend: atualiza balance e cria transactions
- Faxineira NÃO pode escrever (segurança)
```

---

### 2.9. `admin_whitelist` — Admins Autorizados

**Descrição:** Lista de emails com acesso ao dashboard admin

**Documento exemplo:**
```javascript
{
  "admin_id": "firebase_uid",
  "email": "admin@moppy.com",
  "name": "Gestor Moppy",
  "role": "super",  // "super", "moderator", "analyst"
  "permissions": {
    "approve_cleaners": true,
    "manage_disputes": true,
    "manage_pricing": true,
    "view_financial": true,
    "ban_users": true
  },
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

**Security Rules:**
```javascript
// Leitura
- Próprio admin: pode ler seu documento
- Super admin: pode ler todos

// Escrita
- Super admin: pode adicionar/remover admins
```

---

## 3. Índices Compostos Necessários

**Para melhorar performance de queries comuns:**

```javascript
// orders
Índice 1: (client_id, status, scheduled_at DESC)
Índice 2: (cleaner_id, status, scheduled_at DESC)
Índice 3: (status, scheduled_at DESC, city)
Índice 4: (city, scheduled_at DESC) filtrado por status

// cleaners
Índice 5: (approval_status, created_at DESC)
Índice 6: (service_area_cities, is_active, service_radius_km)

// payments
Índice 7: (status, created_at DESC)
Índice 8: (cleaner_id, status, created_at DESC)

// disputes
Índice 9: (status, created_at DESC)
Índice 10: (order_id)

// reviews
Índice 11: (to_user_id, visible, submitted_at DESC)
```

**Criar via Firebase CLI:**
```bash
firebase deploy --only firestore:indexes
```

Ou manualmente: Firebase Console → Firestore → Índices → Criar índice composto

---

## 4. Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============ HELPER FUNCTIONS ============
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() &&
        exists(/databases/$(database)/documents/admin_whitelist/$(request.auth.uid));
    }
    
    function isOwnUser(userId) {
      return request.auth.uid == userId;
    }
    
    function isOwnerOrAdmin(field) {
      return isOwnUser(resource.data[field]) || isAdmin();
    }
    
    // ============ COLLECTIONS ============
    
    // users
    match /users/{userId} {
      allow read: if isAuthenticated() && 
        (isOwnUser(userId) || isAdmin());
      
      allow create: if isAuthenticated() && 
        isOwnUser(userId) &&
        request.data.email == request.auth.token.email &&
        request.data.created_at == request.time;
      
      allow update: if isOwnUser(userId) && 
        request.data.email == resource.data.email &&  // Email imutável
        request.data.created_at == resource.data.created_at &&  // created_at imutável
        request.data.updated_at == request.time;
      
      // Admin pode atualizar trust_score, is_suspended
      allow update: if isAdmin() &&
        (request.data.trust_score != null ||
         request.data.is_suspended != null);
    }
    
    // cleaners
    match /cleaners/{cleanerId} {
      allow read: if isAuthenticated() && 
        (isOwnUser(cleanerId) || isAdmin());
      
      allow create: if isAuthenticated() && 
        isOwnUser(cleanerId);
      
      allow update: if isOwnUser(cleanerId) &&
        (request.data.service_radius_km != null ||
         request.data.pix != null ||
         request.data.service_availability != null);
      
      // Admin pode atualizar approval_status, documents
      allow update: if isAdmin() &&
        (request.data.approval_status != null ||
         request.data.documents != null);
      
      // withdraw_history
      match /withdraw_history/{withdrawId} {
        allow read: if isOwnUser(cleanerId) || isAdmin();
        allow create: if isOwnUser(cleanerId);
      }
    }
    
    // orders
    match /orders/{orderId} {
      allow read: if isAuthenticated() && 
        (resource.data.client_id == request.auth.uid ||
         resource.data.cleaner_id == request.auth.uid ||
         isAdmin());
      
      allow create: if isAuthenticated() &&
        request.data.client_id == request.auth.uid &&
        request.data.cleaner_id == null &&
        request.data.status == "draft" &&
        request.data.created_at == request.time;
      
      allow update: if isAuthenticated() && 
        (isOwnerOrAdmin("client_id") || isOwnerOrAdmin("cleaner_id")) &&
        request.data.client_id == resource.data.client_id &&  // Partes imutáveis
        request.data.created_at == resource.data.created_at &&
        request.data.updated_at == request.time;
      
      // applications (candidaturas)
      match /applications/{cleanerId} {
        allow read: if isAuthenticated() &&
          (parent.resource.data.client_id == request.auth.uid ||
           cleanerId == request.auth.uid ||
           isAdmin());
        
        allow create: if isAuthenticated() &&
          cleanerId == request.auth.uid;
      }
    }
    
    // payments (crítico: cliente NÃO pode escrever)
    match /payments/{paymentId} {
      allow read: if isAuthenticated() &&
        (resource.data.client_id == request.auth.uid ||
         resource.data.cleaner_id == request.auth.uid ||
         isAdmin());
      
      allow create, update: if isAdmin() || 
        request.auth.uid == null;  // Apenas backend (não autenticado, validado por token)
      
      // events (webhook)
      match /events/{eventId} {
        allow read: if isAuthenticated() && isAdmin();
        allow create: if request.auth == null;  // Webhook (sem autenticação)
      }
    }
    
    // disputes
    match /disputes/{disputeId} {
      allow read: if isAuthenticated() &&
        (resource.data.client_id == request.auth.uid ||
         resource.data.cleaner_id == request.auth.uid ||
         isAdmin());
      
      allow create: if isAuthenticated() &&
        request.data.client_id == request.auth.uid;
      
      allow update: if isAuthenticated() &&
        ((request.data.cleaner_response != null && 
          isOwnUser("cleaner_id")) ||
         (request.data.admin_decision != null && isAdmin()));
    }
    
    // reviews
    match /reviews/{reviewId} {
      allow read: if isAuthenticated() &&
        (request.auth.uid == resource.data.from_user_id ||
         (request.auth.uid == resource.data.to_user_id && resource.data.visible == true) ||
         isAdmin());
      
      allow create: if isAuthenticated() &&
        request.data.from_user_id == request.auth.uid;
    }
    
    // chats
    match /chats/{chatId} {
      allow read: if isAuthenticated() &&
        (request.auth.uid in resource.data.participants ||
         isAdmin());
      
      allow create: if isAuthenticated();
      
      // messages
      match /messages/{messageId} {
        allow read: if isAuthenticated() &&
          (request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants ||
           isAdmin());
        
        allow create: if isAuthenticated() &&
          request.data.sender_id == request.auth.uid &&
          request.data.created_at == request.time;
        
        allow update: if isAuthenticated() &&
          request.data.read_by[request.auth.uid] != null;
      }
    }
    
    // wallets
    match /wallets/{walletId} {
      allow read: if isAuthenticated() &&
        (isOwnUser(walletId) || isAdmin());
      
      allow create, update: if isAdmin() || 
        request.auth == null;  // Backend only
      
      // transactions
      match /transactions/{transactionId} {
        allow read: if isAuthenticated() &&
          (isOwnUser(walletId) || isAdmin());
      }
    }
    
    // admin_whitelist
    match /admin_whitelist/{adminId} {
      allow read: if isAuthenticated() && isAdmin();
      allow create, update, delete: if isAuthenticated() && 
        get(/databases/$(database)/documents/admin_whitelist/$(request.auth.uid)).data.role == "super";
    }
  }
}
```

---

## 5. Triggers Serverless (Firebase Functions)

**Deployment:**
```bash
npm install -D firebase-functions firebase-admin
firebase init functions
# Escrever funções em functions/src/
firebase deploy --only functions
```

**Funções implementadas:**

### 5.1. Notificações Push

```javascript
// functions/src/notifications.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Quando cliente escolhe faxineira
exports.onCleanerSelected = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    if (before.cleaner_id == null && after.cleaner_id != null) {
      // Notificar faxineira selecionada
      await admin.messaging().sendToDevice(
        [after.cleaner_fcm_token],
        {
          notification: {
            title: 'Você foi selecionada!',
            body: `${after.client_name} escolheu você para o serviço de ${after.service.type}`
          },
          data: {
            orderId: context.params.orderId,
            action: 'order_selected'
          }
        }
      );
      
      // Notificar outras que foram recusadas
      const applicationsSnap = await admin.firestore()
        .collection('orders').doc(context.params.orderId)
        .collection('applications')
        .where('status', '==', 'pending')
        .get();
      
      applicationsSnap.docs.forEach(doc => {
        const cleanerId = doc.data().cleaner_id;
        // Notificar "Você não foi selecionada"
      });
    }
  });

// Quando pagamento é capturado
exports.onPaymentCaptured = functions.firestore
  .document('payments/{paymentId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    if (before.status != 'capture_success' && after.status == 'capture_success') {
      // Notificar cliente: "Pagamento capturado, avalie a faxineira"
      // Notificar faxineira: "Saldo será liberado em D+15"
    }
  });

// Lembrete confirmação (cliente tem 24h)
exports.reminderConfirmation24h = functions.pubsub
  .schedule('every 12 hours')
  .onRun(async (context) => {
    const ordersSnap = await admin.firestore()
      .collection('orders')
      .where('status', '==', 'completed')
      .where('completion.confirmed_by_client_at', '==', null)
      .where('completion.completed_by_cleaner_at', '<', new Date(Date.now() - 12 * 60 * 60 * 1000))
      .get();
    
    ordersSnap.docs.forEach(doc => {
      const order = doc.data();
      // Notificar cliente com lembrete
    });
  });
```

### 5.2. Auto-Confirmação (24h)

```javascript
exports.autoConfirmCompletion = functions.pubsub
  .schedule('every 1 hour')
  .onRun(async (context) => {
    const ordersSnap = await admin.firestore()
      .collection('orders')
      .where('status', '==', 'completed')
      .where('completion.confirmed_by_client_at', '==', null)
      .where('completion.completed_by_cleaner_at', '<', new Date(Date.now() - 24 * 60 * 60 * 1000))
      .get();
    
    // Para cada pedido, chamar /api/orders/{id}/confirm (automático)
    // Backend processa: captura pagamento, libera faxineira para saque
  });
```

### 5.3. Liberação de Saldo (D+15)

```javascript
exports.releaseWalletBalance = functions.pubsub
  .schedule('every day 06:00')
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    const walletsSnap = await admin.firestore()
      .collection('wallets')
      .where('balance.pending_release_date', '<=', new Date())
      .get();
    
    walletsSnap.docs.forEach(async (doc) => {
      const wallet = doc.data();
      await doc.ref.update({
        'balance.available': wallet.balance.available + wallet.balance.pending_release,
        'balance.pending_release': 0
      });
      
      // Notificar faxineira: "Saldo já está disponível!"
    });
  });
```

### 5.4. Score de Confiabilidade

```javascript
exports.updateTrustScore = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Se pedido foi cancelado
    if (before.status != 'cancelled' && after.status == 'cancelled') {
      const cleaner = await admin.firestore()
        .collection('cleaners').doc(after.cleaner_id).get();
      
      let scoreChange = 0;
      if (after.cancellation.cancelled_by == 'cleaner') {
        // Penalidade faxineira
        scoreChange = after.cancellation.cancellation_scenario == 'last_minute' ? -10 : -5;
      }
      
      await admin.firestore()
        .collection('users').doc(after.cleaner_id)
        .update({ trust_score: admin.firestore.FieldValue.increment(scoreChange) });
    }
  });
```

### 5.5. Limpeza de Dados Antigos

```javascript
exports.cleanupOldChats = functions.pubsub
  .schedule('every month on the 1st 02:00')
  .onRun(async (context) => {
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const chatsSnap = await admin.firestore()
      .collection('chats')
      .where('updated_at', '<', cutoff)
      .get();
    
    const batch = admin.firestore().batch();
    chatsSnap.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  });
```

---

## 6. Backup & Recovery

**Backups automáticos:**
- Firebase Console → Firestore → Backup and restore → Daily 2am UTC

**Recovery:**
```bash
firebase firestore:delete --all-collections
firebase firestore:restore gs://moppy-backup-xxxxx/...
```

---

## 7. Migração de Dados (Caso Necessário)

**Preparação:**
```bash
# Export dados de produção
gcloud firestore export gs://moppy-backups/export-20250823
gcloud firestore import gs://moppy-backups/export-20250823
```

---

## 8. Monitoramento & Alertas

**Quotas Firestore:**
- Reads: ~100k por dia (MVP)
- Writes: ~10k por dia
- Delete: ~5k por dia
- Indexing: ~500 índices (limite 500, OK)

**Alertas em:** Firebase Console → Project Settings → Notifications

---

## Checklist de Deployment

- [ ] Todas as collections criadas
- [ ] Índices compostos deployados
- [ ] Security rules ativadas
- [ ] Triggers serverless deployados
- [ ] Backup automático configurado
- [ ] Backups testados (restore)
- [ ] Monitoramento ativado
- [ ] Documentação completada
