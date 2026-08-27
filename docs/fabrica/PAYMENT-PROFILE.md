# Moppy — Perfil de Pagamento

## Gateway Escolhido: Asaas

**Por quê:** 
- Cria subcontas para as faxineiras via API (sem exigir que cada uma abra conta e autorize por fora)
- Faz split automático (parte da faxineira vai pra conta dela, comissão fica com o app)
- Sem necessidade de app "segurar" dinheiro de terceiros (custódia é feita como pré-autorização no cartão do cliente)
- Suporta pré-autorização e estorno sem custo
- Cobra apenas percentual por transação capturada (sem mensalidade)

**Ambiente de testes (Sandbox):**
- Funciona sem CNPJ
- Permite testar toda a infraestrutura de pagamento e confirmar taxas reais
- CNPJ só é necessário para ir ao ar em produção

---

## Modelo Financeiro

### Comissão do App
- **15%** sobre o valor base do serviço

### Taxa de Processamento
- Taxa do Asaas (cartão de crédito à vista): estimada em **R$0,49 + ~3%** *(confirmar no sandbox)*
- Exemplo: R$150 de serviço = ~R$5,00 de taxa (R$0,49 fixo + R$4,50 percentual)
- **Dividida 50/50** entre cliente e faxineira (~R$2,50 cada)

### Custo de Antecipação D+15
- **Absorvido pelo app** (sai da comissão)
- Taxa de antecipação automática: ~1,15% ao mês, proporcional a ~17 dias ≈ **~0,65% do serviço**
- Exemplo: serviço de R$150 = ~R$1,00 de custo de antecipação
- **Por quê:** mantém o valor líquido da faxineira transparente e limpo

### Exemplo Completo (Serviço de R$150)

| Conceito | Valor |
|----------|-------|
| Valor base do serviço | R$ 150,00 |
| Comissão do app (15%) | -R$ 22,50 |
| Taxa de processamento (~R$5,00) | |
| — Cliente paga 50% | +R$ 2,50 |
| — Faxineira paga 50% | -R$ 2,50 |
| **Custo de antecipação D+15 (absorvido pelo app)** | **~-R$ 1,00** |
| | |
| **Cliente paga** | **R$ 152,50** |
| **Faxineira recebe (líquido, em D+15)** | **R$ 125,00** |
| **App fica com** | **R$ 22,50 (comissão) + R$ 2,50 (50% taxa) + R$ 1,00 (antecipação) = R$ 26,00** |

**Nota:** as estimativas de taxa devem ser confirmadas no sandbox do Asaas antes de ir ao ar.

---

## Tabela de Preços MVP (Por Tipo e Tamanho)

### Base (Limpeza Padrão — Manutenção)

| Tamanho | Preço |
|---------|-------|
| Studio / 1 quarto | R$ 90 |
| 2 quartos | R$ 120 |
| 3 quartos | R$ 150 |
| 4+ quartos | R$ 180 |

### Limpeza Pesada (Sujeira Acumulada) — +40% sobre base

| Tamanho | Preço |
|---------|-------|
| Studio / 1 quarto | R$ 126 |
| 2 quartos | R$ 168 |
| 3 quartos | R$ 210 |
| 4+ quartos | R$ 252 |

### Adicionais

| Adicional | Preço |
|-----------|-------|
| Cada banheiro além do primeiro | +R$ 15 |
| Área externa | +R$ 25 |
| Faxineira leva os produtos | +R$ 30 |
| Passar roupa (adicional) | +R$ 20 |

### Taxa de Urgência (Destaque Pago)

Valor fixo, calculado na hora conforme demanda local:

| Faixa de Demanda | Valor |
|-----------------|-------|
| Baixa | R$ 3,50 |
| Média | R$ 4,50 |
| Alta | R$ 5,50 |

- 100% fica com o app
- Não reembolsável (mesmo se ninguém aceitar)
- Cliente vê o valor e a explicação sem letra miúda no checkout

### Variação por Cidade

- Tabela acima é referência (interior)
- Cada cidade tem tabela própria cadastrada manualmente
- População do IBGE serve como sugestão de ponto de partida (mas valor final é revisado)
- App só opera em cidade com tabela cadastrada e ativa
- Em cidade sem cobertura: "ainda não atendemos sua região"

### Evolução de Preço em Três Fases

**Fase 1 (MVP):** preço fixo; app coleta métricas por cidade desde dia 1, mas não ajusta automaticamente; admin ajusta na mão com base nos dados

**Fase 2:** sistema sugere ajustes, admin aprova

**Fase 3:** auto-ajuste dentro de limites de segurança

---

## Fluxo de Pagamento

### Dia D-1 (Véspera do Serviço)

1. **Vercel Cron** dispara automaticamente à noite
2. App faz chamada à API do Asaas: pré-autorizar valor no cartão do cliente
3. Asaas responde imediatamente (sucesso ou falha)
4. Backend registra na BD: pré-autorização feita / falhou
5. **Webhook do Asaas** confirma o status (proteção de idempotência)
6. Cliente vê notificação: "Pagamento aprovado, será cobrado após o serviço"

**Se falhar:**
- Tentativa automática #1 (após 1h)
- Tentativa automática #2 (após 1h)
- Se ainda falhar: push para cliente trocar cartão (prazo até 6h antes do serviço)
- Se não resolver: pedido cancelado, faxineira recebe notificação para liberar agenda

### Dia D (Dia do Serviço)

1. Faxineira chega e confirma chegada (código ou GPS+foto)
2. Serviço é executado
3. Faxineira marca como "Concluído"
4. Cliente recebe notificação: "Está tudo certo?"

### Confirmação (Até 24h Após Conclusão)

**Cenário A: Cliente confirma ou app confirma automaticamente**

1. Cliente clica "Sim" (ou não responde em 24h e app confirma automaticamente)
2. App faz chamada à API do Asaas: capturar valor no cartão
3. Asaas confirma captura
4. **Webhook do Asaas** confirma captura (idempotência)
5. Backend processa split:
   - Comissão (15%) → conta principal do app
   - Taxa de processamento 50% → app
   - Antecipação (~0,65%) → app
   - Restante → conta da faxineira (via subconta Asaas)
6. Saldo da faxineira: marca como "a liberar" (D-1 a D+14) → "disponível" em D+15
7. Ambos são notificados para avaliar

**Cenário B: Cliente reporta problema**

1. Cliente clica "Tive um problema" + descreve + anexa fotos
2. Valor continua retido (pré-autorização mantida)
3. Faxineira é notificada, tem 24h para responder (texto + fotos)
4. Admin analisa em até 48h
5. Admin decide:
   - **Reembolso total:** estorna valor integralmente no cartão do cliente
   - **Reembolso parcial:** estorna parte, libera parte para faxineira
   - **Libera pagamento para faxineira:** captura integralmente
6. Ambos são notificados da decisão

### Dia D+15 (15 Dias Após Conclusão)

- Saldo da faxineira muda de "a liberar" para "disponível"
- Faxineira pode solicitar saque (mínimo R$20)
- App processa transferência PIX automaticamente (chave cadastrada no onboarding)
- Faxineira recebe na conta PIX em 1-2 dias úteis

---

## Tratamento de Falhas

### Pré-autorização Falha

| Cenário | Ação |
|---------|------|
| Cartão recusado (limite, vencido, banco bloqueia) | Tentativa automática em 1h, depois mais 1 tentativa em 1h |
| Após 2 falhas | Push para cliente trocar cartão (prazo 6h antes do serviço) |
| Cliente não toca | Pedido cancelado, faxineira libera agenda, sem compensação |
| Penalidade | Cliente sofre penalidade no score de confiabilidade |

### Captura Falha

| Cenário | Ação |
|---------|------|
| Asaas recusa captura (erro raro) | Backend tenta 1x mais em 1h, depois aciona suporte |
| Falha confirmada | Admin contata cliente e faxineira, resolve manualmente |
| Estorno | Se necessário, estorna pré-autorização de volta ao cartão |

### Estorno Falha

| Cenário | Ação |
|---------|------|
| Estorno é recusado pelo banco | Suporte manual (contato com cliente) |
| Pendência indefinida | Escalação a advogado (raro) |

### Webhook Falha ou Duplicado

- Proteção de idempotência: backend confere se evento já foi processado
- Se webhook chegar 2x: segunda tentativa é ignorada (sem reprocessar)
- Se webhook não chegar: cron paralelo (verificação a cada 2h) confirma status com Asaas e sincroniza BD

---

## Cancelamento

### Cliente Cancela Antes do D-1

- Pré-autorização ainda não foi feita
- **Cancelamento total e gratuito**
- Faxineira recebe notificação para liberar agenda

### Cliente Cancela Com +12h de Antecedência

- Pré-autorização já feita
- **Estorno total**
- Valor volta integralmente ao cartão do cliente
- Faxineira recebe notificação

### Cliente Cancela Com −12h

- Pré-autorização já feita
- **Captura 30%** como taxa de reserva (vai para faxineira)
- Taxa já desconta o Asaas (~R$41 num serviço de R$150, não R$45)
- **Estorno dos 70%** restantes ao cliente

**Exemplo (serviço de R$150 com −12h):**
- App captura: R$152,50 (cliente) com taxa já descontada
- Faxineira recebe: R$150 × 30% = R$45 (bruto)
- Taxa Asaas sobre esse valor: ~R$4
- Faxineira recebe: ~R$41 (líquido)
- Estorno ao cliente: R$152,50 − R$41 = ~R$111,50

### Faxineira Cancela

- **Estorno total** ao cliente (pré-autorização desfeita)
- **Penalidade no histórico da faxineira**
- Score cai

---

## Carteira e Saque

### Tela de Carteira (Faxineira)

**Saldo:**
- Total (todas as fontes)
- Breakdown por status:
  - **"A liberar"** (D-1 a D+14): serviços concluídos mas ainda não liberados para saque
  - **"Disponível"** (D+15+): pronto para sacar

**Extrato:**
- Tabela com data, pedido, valor, status
- Busca/filtro (opcional em Fase 2)

### Saque

- Botão "Solicitar saque"
- Mínimo: R$20
- Máximo: saldo disponível
- Transferência: PIX automática (chave cadastrada no onboarding)
- Confirmação no app + SMS na chave PIX
- Processamento: 1-2 dias úteis (via Asaas)

### Chave PIX Inválida

1. Primeiro saque falha: notificação para corrigir
2. Após 3 falhas: suspensão de saques até corrigir (pode editar chave no perfil)

---

## Métricas Financeiras (Coletar Desde Dia 1)

### Por Serviço
- Preço ofertado (base + adicionais)
- Tipo de limpeza
- Cidade
- Uso de taxa de urgência (qual faixa)
- Status: aceito / cancelado sem candidata

### Por Período (Diário, Semanal, Mensal)

**Demanda:**
- Total de pedidos criados (por cidade)
- Pedidos aceitos vs cancelados
- Tempo até 1ª candidatura
- Número de candidatas por pedido
- Uso de taxa de urgência (faixa + receita)

**Saúde do Marketplace:**
- Tempo até cliente escolher
- Pedidos sem candidata (24h / 48h)
- No-show / chegada não confirmada
- Disputas aberta (número, taxa de resolução)

**Financeiro:**
- Comissão arrecadada (total + por tipo de limpeza)
- Custo de antecipação absorvido
- Receita de taxa de urgência
- Estornos (por motivo)
- Saques processados (volume + quantidade)

**Qualidade:**
- Cancelamentos (por lado + antecedência)
- Taxa de resolução de disputa (reembolso total / parcial / liberado)
- Nota média (cliente + faxineira)
- Taxa de repetição (cliente pede novamente + faxineira aceita novamente)

---

## Infraestrutura de Pagamento (Obrigatória no MVP)

### Vercel Cron
- **O quê:** job agendado que dispara pré-autorização
- **Quando:** noite anterior (D-1)
- **Frequência:** diária (executa para todos os serviços do dia seguinte)
- **Retry:** automático em caso de falha temporária do Asaas
- **Logging:** todos os eventos registrados (sucesso, falha, tentativa)

### Webhook do Asaas
- **Endpoint:** `POST /api/webhooks/asaas`
- **Autenticação:** token secreto (verificar no header)
- **Eventos:** pré-autorização, captura, estorno, falha
- **Idempotência:** checar `event_id` + timestamp para não processar 2x
- **Resposta:** 200 OK imediato (não bloquear com processamento)
- **Retry do Asaas:** tenta 5x em 24h se não receber 200

### Banco de Dados

**Coleções Firebase:**

- **payments**
  - `paymentId` (chave)
  - `orderId`, `customerId`, `cleanerId`
  - `amount`, `currency`
  - `status` (pending / preauth_pending / preauth_success / preauth_failed / capture_success / capture_failed / refunded)
  - `preauth_date`, `capture_date`
  - `asaas_payment_id` (ID externo)
  - `asaas_subconta_id` (para split)
  - `webhook_events` (array de eventos do webhook, com timestamps)
  - `created_at`, `updated_at`

- **payment_events** (log de todos os eventos)
  - `eventId` (chave)
  - `paymentId`, `orderId`
  - `type` (preauth / capture / refund / split / webhook)
  - `status` (success / failed / pending)
  - `details` (JSON com resposta do Asaas)
  - `timestamp`

---

## Estados de Transação

| Status | Significado | Quando | Próximo Estado |
|--------|-------------|--------|----------------|
| `pending` | Pedido criado, Cron ainda não rodou | Criação | `preauth_pending` |
| `preauth_pending` | Cron disparou pré-autorização, aguardando resposta | D-1 | `preauth_success` ou `preauth_failed` |
| `preauth_retry_1` | 1ª tentativa falhou, retry agendado em 1h | Falha D-1 | `preauth_pending` (retry) |
| `preauth_retry_2` | 2ª tentativa falhou, retry final agendado | Falha +1h | `preauth_pending` (retry final) |
| `preauth_success` | Pré-autorização confirmada, valor reservado | Webhook OK | `capture_pending` ou `disputa_aberta` |
| `preauth_failed` | Todas as tentativas falharam, pedido será cancelado | 3ª falha | `cancelled_no_payment` |
| `capture_pending` | Cliente confirmou, captura em andamento | Confirmação | `capture_success` ou `capture_failed` |
| `capture_success` | Valor capturado, split executado | Webhook | `payment_processado` → `saldo_a_liberar` |
| `capture_failed` | Captura falhou (raro), requer suporte | Erro raro | Manual |
| `disputa_aberta` | Cliente reportou problema, análise em andamento | Cliente clica "problema" | `disputa_reembolso_total`, `disputa_reembolso_parcial`, `disputa_liberado` |
| `disputa_reembolso_total` | Admin decidiu reembolsar 100% | Admin | `refunded` |
| `disputa_reembolso_parcial` | Admin decidiu reembolsar parcialmente | Admin | `partial_refund` |
| `disputa_liberado` | Admin liberou pagamento para faxineira | Admin | `payment_processado` |
| `refunded` | Estorno processado, valor voltou ao cliente | Webhook | Cliente recebeu |
| `partial_refund` | Estorno parcial (ex: cancelamento −12h) | Webhook | Cliente + faxineira recebem |
| `refund_pending` | Estorno em processamento, aguardando Asaas | Admin disputa ou cancelamento −12h | `refunded` ou `refund_failed` |
| `refund_failed` | Estorno falhou, requer ação manual | Erro Asaas | Manual (admin suporte) |
| `cancelled_free` | Cancelamento antes D-1, gratuito | Cliente cancela antes D-1 | Fim |
| `cancelled_no_payment` | Pré-auth falha 2x, cliente não resolve, cancelado | 6h timeout | Fim |
| `payment_processado` | Split executado, saldo em "a_liberar" | Webhook | D+15 → `saldo_disponivel` |
| `saldo_a_liberar` | Faxineira: saldo bloqueado até D+15 | D → D+14 | `saldo_disponivel` |
| `saldo_disponivel` | Faxineira: pode sacar via PIX | D+15 | Saque processado |

**Diagrama resumido:** vide `PAYMENT-FLOW.md` seção 2 para máquina de estados completa.

---

## Operações Suportadas (Asaas)

| Operação | Tipo | Quando | Requisito |
|----------|------|--------|-----------|
| **Pré-Autorizar** | Preauth | D-1, Cron | Cartão válido, limite suficiente |
| **Capturar** | Charge | Confirmação cliente | Pré-auth ativa |
| **Estorno Total** | Refund | Cancelamento, disputa reembolso total | Captura ou pré-auth ativa |
| **Estorno Parcial** | Partial Refund | Cancelamento −12h, disputa reembolso parcial | Captura ativa |
| **Consultar Status** | Query | Sincronização 2h (fallback webhook) | Payment ID |
| **Transferir Subconta** | Transfer | Split (após captura) | Subconta ativa |
| **Saque PIX** | Withdrawal | D+15, cliente solicita | Chave PIX válida, saldo ≥R$20 |
| **Criar Subconta** | Account | Onboarding faxineira | Documentos válidos |

**Detalhes:** vide `PAYMENT-IMPLEMENTATION.md` seção 2 para endpoints completos.

---

## Limites e Constraints

### Limites de Valor

| Limite | Valor | Aplicável a |
|--------|-------|------------|
| **Mínimo por serviço** | R$ 20,00 | Todos |
| **Máximo por serviço** | Sem limite (validar com Asaas) | Todos |
| **Mínimo para saque** | R$ 20,00 | Faxineira |
| **Máximo diário de saques** | Sem limite formal (validar com Asaas) | Faxineira |
| **Máximo no cartão** | Limite do cliente (banco) | Cliente |

### Prazos

| Prazo | Duração | Descrição |
|-------|---------|-----------|
| **Pré-auth validade** | ~30 dias | Asaas padrão |
| **Retry pré-auth** | 1h entre tentativas (2 retries) | Total 2h |
| **Escala cliente** | 6h após falha 2x | Trocar cartão |
| **Confirmação cliente** | 24h + lembrete 12h | Auto-confirma após 24h |
| **Defesa faxineira** | 24h após disputa | Auto-análise sem defesa se não responder |
| **Análise admin** | Até 48h | Disputa |
| **Webhooks retry** | Até 5x em 24h | Asaas |
| **Sincronização fallback** | A cada 2h | Backend |
| **Estorno ao cliente** | Até 2 dias úteis | Asaas → banco |
| **Saque PIX** | 1-2 dias úteis | Asaas → PIX |
| **Saldo "a liberar"** | D até D+14 | Após captura |
| **Saldo "disponível"** | D+15+ | Pronto para saque |

### Taxa e Comissão

| Elemento | Valor | Quem paga | Notas |
|----------|-------|----------|-------|
| **Comissão app** | 15% | App (abate do serviço) | Não incide sobre taxa de urgência |
| **Taxa Asaas (cartão)** | ~R$0,49 fixo + 3% | 50/50 app + faxineira | Confirmar no sandbox |
| **Custo antecipação D+15** | ~0,65% ao mês | App (absorve) | Proporcional a ~17 dias |
| **Taxa urgência** | R$3,50-5,50 | App (100%) | Não reembolsável |
| **Taxa cancelamento −12h** | 30% (vai à faxineira) | Não há taxa, é compensação | Já descontada a taxa Asaas da faxineira |

### Validações Críticas

| Validação | Ponto | Ação se falhar |
|-----------|-------|----------------|
| Cartão válido (data, número, limite) | D-1 | Retry 2x, escala 6h, cancela |
| Chegada confirmada (código OU GPS) | Chegada | Bloqueado, suporte |
| Conclusão confirmada (manual OU 24h) | D até D+24 | Auto-confirma após 24h |
| Disputa resolvida | D até D+48 | Admin analisar |
| Saldo faxineira positivo | Sempre | Não permite saque negativo |
| Chave PIX válida | Saque | Retry 3x, suspende após |
| Documentos faxineira legíveis | Onboarding | Rejeita, pede reenviio |

### Conformidade

| Aspecto | Regra | Status |
|---------|-------|--------|
| **Dados de cartão** | Nunca guardar PAN/CVV/validade | ✓ Tokenizar via Asaas |
| **Webhook idempotência** | event_id + timestamp | ✓ Implementado |
| **HTTPS** | Todos endpoints | ✓ Obrigatório |
| **Logging** | Sem dados sensíveis | ✓ Log completo de transações |
| **Rate limiting** | Evitar abuso | *(TBD — implementar antes de Prod)* |
| **LGPD** | Consentimento, direito ao esquecimento | ✓ Termos no app |

---

### Segurança

- Dados de cartão nunca ficam no app (tokenizados pelo Asaas)
- Tokens de cartão armazenados com acesso restrito no Firebase
- Webhook do Asaas verificado por token secreto
- Todas as transações logadas (auditoria)
- Cron rodinhas com permissões restritas (só ler BD, chamar Asaas, escrever log)

---

## Checklist de Implementação

- [ ] Conta Asaas criada (sandbox)
- [ ] API key e token webhook configurados no .env
- [ ] Endpoints Asaas mapeados (tokenizar cartão, pré-autorizar, capturar, estornar, criar subconta)
- [ ] Vercel Cron configurado (job diário)
- [ ] Webhook do Asaas implementado (idempotência)
- [ ] BD preparada (coleções + índices)
- [ ] Testes de fluxo de pagamento (sucesso, falha, retry, webhook duplicado)
- [ ] Confirmação de taxas reais no sandbox (substituir estimativas)
- [ ] Deploy em produção (com CNPJ + conta Asaas produção)
- [ ] Testes de ponta a ponta (pedido → pré-auth → captura → split → saque)

---

## Próximos Passos

1. **Sandbox do Asaas:** confirmar taxa real de processamento (cartão à vista) e custo real de antecipação D+15; atualizar modelo financeiro
2. **Advogado:** responsabilidade por danos/furtos, termos de uso, privacidade, contrato de adesão da prestadora
3. **Contador:** nota fiscal sobre comissão, regime tributário, tratamento de prestadora pessoa física, retenções se houver
4. **CNPJ e conta Asaas produção:** necessários para ir ao ar (sandbox é suficiente para testes)
