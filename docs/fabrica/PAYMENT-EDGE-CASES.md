# Moppy — Casos de Borda do Fluxo de Pagamento

> ## ⚠️ CORREÇÃO 2026-09-04 — LER ANTES DO RESTO DESTE DOCUMENTO
>
> O corpo abaixo foi escrito em 2026-08-23 assumindo **pré-autorização de cartão**, que **não está disponível** para a atividade econômica da Moppy no Asaas (restrição real, confirmada ao vivo no sandbox — ver `PAYMENT-PROFILE.md` §0). O modelo agora é **cobrança real em D-1 + estorno**.
>
> Onde o texto abaixo disser "pré-autorização", leia "cobrança"; onde disser "captura", leia "confirmação do serviço" (que não chama o Asaas — o dinheiro já está na conta da Moppy). Este documento ainda **não foi reescrito** — é a próxima dívida de documentação depois do Gate 3.
>
> ### Delta por caso
>
> | Caso | Situação |
> |---|---|
> | 1. Cartão vencido | ✅ Vale. Só troque `preauth_failed` por `charge_failed` |
> | 2. Limite insuficiente | ✅ Vale, mesma troca de nome |
> | 3. Bloqueio de fraude | ✅ Vale, mesma troca de nome |
> | 4. Webhook não chega | ✅ Vale. O cron de reconciliação passa a se chamar `/api/cron/reconcile` |
> | 5. Webhook duplicado | ✅ Vale integralmente |
> | 6. Cancelamento durante a captura | ⚠️ Vira "cancelamento durante a cobrança". O risco de corrida agora é entre **cancelar e cobrar**, e o pior caso é cobrar um pedido já cancelado (resolve-se com estorno imediato) |
> | 7. Faxineira cancela antes de D-1 | ✅ Vale (nada cobrado ainda) |
> | 8. Faxineira cancela +12h antes | ⚠️ Se a cobrança já saiu, é **estorno total**, não "desfazer hold". App absorve a taxa perdida |
> | 9. Faxineira cancela −12h | ⚠️ Idem: estorno total ao cliente + penalidade de score |
> | 10. Cliente cancela −12h | ⚠️ Regra nova: retém 30% da base **integrais** para a faxineira (sem comissão, sem rateio de taxa) e estorna o resto. Ver `PAYMENT-FLOW.md` §5.3 |
> | 11. Faxineira não aparece (no-show) | ⚠️ Agora exige **estorno total** de dinheiro já cobrado, não apenas "não capturar" |
> | 11b. Chegada bloqueada (GPS falha) | ✅ Vale (é fluxo operacional, não financeiro) |
> | 12. Captura falha | ❌ **Morto.** Não existe captura. O equivalente é "cobrança recusada em D-1", já coberto pelos casos 1-3 |
> | 13. Estorno falha | 🔺 **Ganhou importância.** Antes era raro; agora é o caminho de volta de todo cancelamento e disputa. Ver `PAYMENT-FLOW.md` §4.4 |
> | 14. Cliente cancela após a captura | ⚠️ Reescrever: qualquer cancelamento **após a cobrança** é possível, mas vira estorno (total ou parcial). Só depois do serviço executado é que vira disputa |
> | 15. Disputa com dinheiro já sacado | ✅ Vale. Fica mais provável, porque agora existe também chargeback bancário |
> | 16. Chave PIX inválida | ✅ Vale. Só troque `POST /dict/transferValue` por `POST /v3/transfers` |
> | 17. Pré-autorização expira | ❌ **Morto.** Não há hold para expirar |
> | 18. Split falha (subconta) | ❌ **Morto.** Não há subconta nem `split[]` — a divisão é contábil no Firestore |
> | 19. Faxineira suspensa antes do saque | ✅ Vale integralmente |
> | 20. Múltiplas pré-autorizações no mesmo cartão | ⚠️ Vira "múltiplas cobranças no mesmo cartão". Mais simples: cada cobrança é um débito definitivo, não um bloqueio de limite. O risco novo é **cobrança duplicada do mesmo pedido**, coberto em `PAYMENT-FLOW.md` §4.3 |
> | **21. Chargeback (NOVO)** | 🆕 Não existia neste documento. Cliente contesta no banco. Ver `PAYMENT-FLOW.md` §4.7 |
> | **22. Cobrança duplicada (NOVO)** | 🆕 Cron rodando 2× cobra o cliente 2×. Três barreiras de idempotência em `PAYMENT-IMPLEMENTATION.md` §3 |
> | **23. Estorno duplicado (NOVO)** | 🆕 Admin clica 2× em "reembolso total". `runRefund` hoje **não tem guarda** — correção obrigatória |
> | **24. Pedido confirmado com <24h (NOVO)** | 🆕 O cron D-1 nunca o alcança. Cobrança tem que sair na confirmação |

> ### 2026-09-05 — Bateria dos 12 cenários (PAYMENT-IMPLEMENTATION.md §5.2) rodada de verdade
>
> Rodada contra o sandbox real do Asaas (não mock), chamando `lib/payments.ts` direto contra pedidos seedados no Firestore de produção.
>
> | # | Cenário | Resultado |
> |---|---|---|
> | 1 | Fim a fim feliz | ✅ Passou — cobrança real, confirmação, split, carteira creditada |
> | 2 | Cartão recusado | ⚠️ **Achado**: `4000000000000010` (cartão "recusado" desta tabela e de `PAYMENT-IMPLEMENTATION.md` §5.1) hoje é **aprovado** no sandbox. A lista de cartões de teste do Asaas mudou — precisa achar o número atual que recusa antes de considerar esse cenário validado |
> | 3 | Troca de cartão <6h | ⏳ Não testado — depende de simular passagem real de tempo (`next_retry_at`), não só da função de cobrança |
> | 4 | Webhook duplicado | ✅ Passou — `isEventProcessed` detecta a duplicidade |
> | 5 | Cron rodando 2x | ✅ Passou — 2ª chamada não gera cobrança nova (`outcome: skipped`) |
> | 6 | Cancelamento ≥12h | ✅ Passou — estorno total |
> | 7 | Cancelamento <12h | ✅ Passou — compensação de 30% pra faxineira, estorno do resto |
> | 8 | Disputa parcial | ✅ Passou — split do resto credita a faxineira, e a guarda contra estorno duplicado bloqueou a 2ª tentativa de verdade |
> | 9 | Auto-confirmação 24h | ⏳ Não testado — a decisão de "quando" fica no cron `auto-confirm`, não em `settleOrder` |
> | 10 | Confirmado <24h | ⏳ Não testado — idem, decisão fica no endpoint de confirmação, não em `chargeOrder` |
> | 11 | Chargeback | ✅ Passou — `balance_frozen` gravado, `release-balance` confirmado (por leitura do código) que pula registros congelados |
> | 12 | Taxa real | ✅ Já resolvido em 2026-09-05 (ver ESTADO.md) |
>
> **Pendência:** achar no painel do sandbox do Asaas o número de cartão que realmente recusa hoje, pra validar o cenário 2 (recusa) e, por consequência, o 3 (troca de cartão).

---


---

## 1. Cartão Vencido

**Trigger:** Cliente tenta criar pedido com cartão vencido.

**Estado esperado:** Pré-autorização falha (status `preauth_failed`).

**Ação do app:**
1. Cron D-1 tenta pré-autorizar
2. Asaas retorna erro: `card_expired`
3. Backend registra falha, agenda retry em 1h
4. Retry 1: ainda falha
5. Retry 2: ainda falha
6. Push ao cliente: "Cartão vencido. Atualize o cartão em até 6h"
7. Se cliente não atua em 6h: pedido cancelado

**Notificações:**
- Cliente: push "Seu cartão expirou. Atualize aqui → [link]"
- Faxineira (se selecionada): notificação "Pedido foi cancelado, seu agendamento foi liberado"

**Saldo afetado:**
- Cliente: nada (nenhuma cobrança)
- Faxineira: nada (nenhum crédito)
- App: nada

**Score:**
- Cliente: −5 (pré-auth falha por culpa do cartão)
- Faxineira: nada (não é culpa dela)

---

## 2. Limite de Crédito Insuficiente

**Trigger:** Cartão tem limite menor que o valor do serviço.

**Estado esperado:** Pré-autorização falha (status `preauth_failed`).

**Ação do app:**
1. Cron dispara pré-autorização
2. Asaas retorna erro: `insufficient_credit_limit`
3. Backend agenda retry em 1h (caso cliente pague uma fatura no meio tempo)
4. Retry 1 + Retry 2 falham
5. Push ao cliente: "Limite do cartão insuficiente. Solicite aumento ao seu banco ou use outro cartão"
6. Se não resolvido em 6h: cancelamento automático

**Notificações:**
- Cliente: push com sugestão de ações
- Faxineira: notificação de cancelamento

**Saldo:**
- Nenhum movimento

**Score:**
- Cliente: −5 (falha no cartão)

---

## 3. Bloqueio de Fraude pelo Banco

**Trigger:** Banco detecta transação suspeita (ex: cliente do RJ tentando charge em SP).

**Estado esperado:** Pré-autorização falha (status `preauth_failed`).

**Ação do app:**
1. Cron tenta pré-autorizar
2. Asaas retorna erro: `blocked_by_fraud_detection` ou `declined_by_issuer`
3. Backend agenda retry em 1h (para que cliente possa desbloquear no app do banco)
4. Retry 1 + Retry 2 falham
5. Push ao cliente: "Transação bloqueada por segurança. Verifique seu app do banco e tente novamente"
6. Se não resolvido em 6h: cancelamento automático

**Notificações:**
- Cliente: push informando bloqueio de fraude + instruções
- Faxineira: notificação de cancelamento

**Saldo:**
- Nenhum movimento

**Score:**
- Cliente: −5 (falha no cartão, não é culpa dele, mas afeta score)

---

## 4. Webhook Cai e Não Chega

**Trigger:** Asaas dispara webhook, mas rede falha antes de chegar ao app.

**Estado esperado:** Payment fica em `preauth_pending` indefinidamente.

**Ação do app:**
1. Webhook tentou chegar mas falhou
2. Asaas retry (tenta 5x em 24h)
3. **Cron de sincronização** roda a cada 2h: `verificar_pagamentos_pendentes()`
4. Cron consulta Asaas: `GET /payments/{asaas_id}`
5. Asaas retorna status real (ex: `authorized`)
6. Cron atualiza BD: `payment.status = preauth_success`
7. Notifica cliente normalmente

**Notificações:**
- Cliente: notificação pode chegar até 2h depois (aceito)
- Faxineira: notificação normal

**Saldo:**
- Nenhum impacto (apenas delay de notificação)

**Score:**
- Nenhum impacto

---

## 5. Webhook Duplicado

**Trigger:** Asaas dispara webhook 2x com mesmo `event_id` (ex: por retry de rede).

**Estado esperado:** Sistema ignora 2ª tentativa.

**Ação do app:**
1. Primeiro webhook chega: `{ id: 'webhook_123', data: { status: 'authorized' } }`
2. Backend registra em `payment_events`: `asaasEventId = webhook_123`
3. Atualiza payment: `status = preauth_success`
4. Notifica cliente
5. Segundo webhook chega: mesmo `id: webhook_123`
6. Backend busca em `payment_events` por `asaasEventId == webhook_123`
7. Encontra registro existente
8. **Retorna 200 OK e ignora** (idempotência)
9. Nenhuma duplicação de notificação ou crédito

**Notificações:**
- Cliente: recebe apenas 1 notificação

**Saldo:**
- Nenhuma duplicação

**Score:**
- Nenhum impacto

---

## 6. Cliente Cancela Durante Captura

**Trigger:** Cliente clica "Cancelar pedido" enquanto backend está processando captura no Asaas.

**Estado esperado:** Race condition: captura ou cancelamento ganha.

**Ação do app:**
1. Cliente confirmou serviço → backend inicia captura
2. Simultaneamente, cliente clica "Cancelar"
3. Dois requests chegam quase juntos

**Resolução:**
- Backend usa lock pessimista (Firestore transaction):
  ```javascript
  await db.runTransaction(async (transaction) => {
    const paymentRef = db.collection('payments').doc(paymentId);
    const payment = await transaction.get(paymentRef);
    
    if (payment.data().status !== 'capture_pending') {
      throw new Error('Payment already being processed or cancelled');
    }
    
    // Processa captura OU cancelamento
    transaction.update(paymentRef, { status: 'capture_in_progress' });
  });
  ```
- Se captura ganhar: valor é capturado, faxineira recebe
- Se cancelamento ganhar: retorna erro "pedido já estava sendo cancelado"

**Notificações:**
- Cliente: "Sua solicitação chegou tarde. O pagamento foi processado" OU "Cancelamento confirmado"
- Faxineira: correspondente

**Saldo:**
- Ou faxineira recebe, ou cliente recebe reembolso (nunca ambos, nunca nenhum)

**Score:**
- Nenhum impacto (não é culpa de ninguém)

---

## 7. Faxineira Cancela Antes de D-1

**Trigger:** Faxineira clica "Cancelar este serviço" antes de Cron rodar (antes da noite).

**Estado esperado:** Cancelamento gratuito, nenhuma cobrança.

**Ação do app:**
1. Backend marca pedido: `status = cancelled`
2. Pré-autorização ainda não foi feita
3. Cliente notificado: "Sua faxineira cancelou. Pedido está disponível novamente"
4. Pode candidatar novamente se quiser
5. **Zero custo**
6. Faxineira: score cai (−5, por cancelamento de agenda)

**Notificações:**
- Cliente: push "Sua faxineira cancelou"
- Faxineira: "Você cancelou este pedido"

**Saldo:**
- Nenhum movimento

**Score:**
- Faxineira: −5

---

## 8. Faxineira Cancela +12h Antes

**Trigger:** Faxineira cancela com mais de 12h de antecedência.

**Estado esperado:** Estorno total, faxineira penalizada.

**Ação do app:**
1. Backend calcula: distância de agora até D_serviço
2. Se ≥12h: classificar como "cancelamento com aviso"
3. Backend chama Asaas: `void(preauth_id)` (desfazer pré-auth)
4. Cliente recebe reembolso total
5. **Faxineira: score cai (−5)**
6. Pedido fica disponível novamente para outras candidaturas

**Notificações:**
- Cliente: "Sua faxineira cancelou. Reembolso será processado em até 2 dias"
- Faxineira: "Você cancelou com penalidade (−5 pontos)"

**Saldo:**
- Cliente: +reembolso
- Faxineira: nada

**Score:**
- Faxineira: −5

---

## 9. Faxineira Cancela −12h (Last-Minute)

**Trigger:** Faxineira cancela com menos de 12h de antecedência.

**Estado esperado:** Penalidade severa (−10 pontos), cliente pode abrir disputa ou reportar.

**Ação do app:**
1. Backend calcula: distância
2. Se <12h: cancelamento last-minute
3. Backend chama Asaas: `void(preauth_id)` (desfazer)
4. Cliente recebe reembolso total (pré-auth é desfeita, sem captura)
5. **Faxineira: score cai (−10, penalidade severa)**
6. Faxineira pode receber bloqueio automático se score cair muito

**Notificações:**
- Cliente: "Sua faxineira cancelou de última hora. Reembolso processado"
- Faxineira: "Cancelamento com menos de 12h. Penalidade (−10 pontos)"

**Saldo:**
- Cliente: +reembolso
- Faxineira: nada

**Score:**
- Faxineira: −10

---

## 10. Cliente Cancela −12h (Last-Minute)

**Trigger:** Cliente cancela com menos de 12h de antecedência.

**Estado esperado:** Captura parcial 30% para faxineira, estorno 70% para cliente.

**Ação do app:**
1. Backend calcula: tempo até D_serviço
2. Se <12h e pré-auth ativa:
3. Backend chama Asaas: `capture(preauth_id, 0.30 * amount)`
4. Asaas captura 30% (~R$45), taxa processamento ~R$1,50-4,00 descontada
5. Faxineira recebe líquido: ~R$41 (30% − taxa)
6. Backend chama Asaas: `refund(preauth_id, 0.70 * amount + customerFeeShare)`
7. Asaas estorna 70% + metade da taxa (~R$111,50)
8. Faxineira recebe notificação (não é culpa dela, mas seu score desce por contexto)
9. Cliente recebe notificação do reembolso (em 2 dias)

**Notificações:**
- Cliente: "Cancelamento com menos de 12h. Faxineira receberá R$41 como compensação. Seu reembolso: R$111,50 (até 2 dias)"
- Faxineira: "Cliente cancelou de última hora, mas você recebe R$41 como compensação"

**Saldo:**
- Cliente: +R$111,50 (reembolso)
- Faxineira: +R$41 (compensação 30%)
- App: +R$0

**Score:**
- Cliente: −2 (cancelamento last-minute)
- Faxineira: −5 (indireto, contexto de cancelamento)

---

## 11. Faxineira Não Aparece (No-Show)

**Trigger:** Faxineira não confirma chegada até 30 min após hora agendada.

**Estado esperado:** Bloqueio automático após 30 min de espera.

**Ação do app:**
1. Hora agendada: D 10:00h
2. Cliente confirma estar em casa
3. Faxineira não clica "Cheguei"
4. 10:30h: app marca como "não compareceu"
5. Backend chama Asaas: `void(preauth_id)` (desfazer pré-auth)
6. Cliente recebe reembolso total
7. **Faxineira: score cai (−15, penalidade severa por no-show)**
8. Se score fica muito baixo: suspensão automática

**Notificações:**
- Cliente: "Sua faxineira não apareceu. Reembolso será processado"
- Faxineira: "Você foi marcado como não comparecido. Penalidade (−15 pontos)"

**Saldo:**
- Cliente: +reembolso
- Faxineira: nada

**Score:**
- Faxineira: −15

---

## 11. Confirmação de Chegada Bloqueada (GPS Falha)

**Trigger:** Faxineira clica "Cheguei", mas GPS está desligado ou fora do raio.

**Estado esperado:** Bloqueado, pedindo ajuda de suporte.

**Ação do app:**
1. Faxineira clica "Cheguei"
2. App verifica cliente (disponível em 10 min?)
3. Cliente não responde
4. App pede: "Tire uma foto + permita GPS"
5. Faxineira tira foto
6. GPS está desligado OU fora do raio de 50m
7. App bloqueia: "Não consegui validar sua localização. Contate suporte"
8. **Chegada NÃO é confirmada**
9. Serviço não pode começar
10. Cronômetro não inicia

**Ação esperada:**
- Faxineira contacta suporte (WhatsApp Business)
- Suporte pode:
  - Pedir para ligar GPS + tentar novamente
  - Validar manualmente se GPS está muito ruim na região
  - Acionar cliente para confirmar presença por código
  - Cancelar pedido se impossível validar

**Notificações:**
- Faxineira: "GPS não validado, fale com suporte"
- Suporte: notificação de suporte necessário

**Saldo:**
- Pedido fica em `capture_pending` indefinidamente (até resolução)
- Cliente e faxineira podem combinar resolução manual se necessário

**Score:**
- Faxineira: −5 (bloqueio de confirmação de chegada)

---

## 12. Captura Falha Raramente

**Trigger:** Após cliente confirmar, app tenta capturar no Asaas, e Asaas retorna erro raro (ex: timeout, erro de servidor).

**Estado esperado:** Payment fica em `capture_failed`.

**Ação do app:**
1. Cliente clica "Sim, está tudo certo"
2. Backend chama Asaas: `POST /payments/{id}/capture`
3. Asaas responde com erro: `500 Internal Server Error` ou `timeout`
4. Backend registra em BD: `status = capture_failed`
5. Backend agenda retry automático em 1h
6. Retry 1: sucesso OU ainda falha
7. Se falha persiste: log de erro, notificação manual para admin

**Resolução:**
- Admin acessa dashboard
- Vê payment em `capture_failed`
- Opções:
  - Retry manual (botão)
  - Confirmar com cliente que será reprocessado
  - Se Asaas está down: aguardar retorno, retry automático
  - Se impossível: reembolsar e investigar

**Notificações:**
- Cliente: "Estamos processando seu pagamento. Pode demorar um pouco"
- Admin: alerta de falha de captura

**Saldo:**
- Pré-auth continua ativo (valor retido)
- Se captura conseguir depois: valor é capturado
- Se cancelar: valor é estornado

**Score:**
- Nenhum impacto (é falha do sistema, não de ninguém)

---

## 13. Estorno Falha

**Trigger:** App tenta estornar (ex: após disputa resultou em reembolso), mas Asaas recusa.

**Estado esperado:** Payment fica em `refund_failed`.

**Ação do app:**
1. Admin decidiu reembolsar cliente
2. Backend chama Asaas: `POST /payments/{id}/refund`
3. Asaas retorna erro: `issuer_declined_refund` ou erro de rede
4. Backend registra: `status = refund_failed`
5. Log de erro, notificação para admin

**Resolução:**
- Admin faz retry manual
- Se persistir: contactar Asaas support
- Escalonação: possível necessidade de resolução manual via banco
- Cliente: notificado que reembolso está sendo processado manualmente

**Notificações:**
- Admin: alerta de falha de estorno
- Cliente: "Seu reembolso está sendo processado manualmente. Pode demorar até 5 dias"

**Saldo:**
- Valor fica retido até resolução
- Se resolvido: volta ao cliente
- Se impossível: escalação legal (raro)

**Score:**
- Nenhum impacto

---

## 14. Cliente Cancela Após Captura Bem-Sucedida

**Trigger:** Cliente tenta cancelar depois que valor já foi capturado.

**Estado esperado:** Não é mais cancelável. Precisa de disputa.

**Ação do app:**
1. Cliente clica "Cancelar pedido"
2. Backend valida: `if (status == 'capture_success') { error }`
3. App mostra: "Não posso cancelar pedidos já pagos. Abra uma disputa se tiver problema"
4. Cliente é redirecionado para formulário de disputa

**Resolução:**
- Cliente abre disputa normalmente (texto + fotos)
- Admin decide reembolso total/parcial/mantém

**Notificações:**
- Cliente: "Pedido já foi pago. Use a disputa se houver problema"

**Saldo:**
- Nenhuma alteração

**Score:**
- Nenhum impacto

---

## 15. Disputa com Dinheiro Já Sacado

**Trigger:** Cliente abre disputa após faxineira já ter sacado dinheiro (D+15+).

**Estado esperado:** Admin precisa reembolsar Cliente, faxineira pode responder com "já recebi".

**Ação do app:**
1. Serviço aconteceu em D
2. Captura em D
3. D+15: faxineira solicitou e processou saque (PIX)
4. D+17: cliente abre disputa: "Serviço não foi bem feito"
5. Backend marca: `status = disputa_aberta`
6. Faxineira é notificada

**Dilema:**
- Cliente pode ter razão e merecer reembolso
- Mas faxineira já gastou o dinheiro

**Resolução:**
1. Admin analisa evidência (fotos, chat)
2. Se cliente tem razão (fotos de má qualidade):
   - Admin reembolsa cliente (captura do pré-auth que já passou? Não.)
   - **Admin precisa fazer transfer reverso:** transferir de volta de `cleaner_wallet` para app, então reembolsar cliente de app funds
   - Faxineira recebe notificação: "Disputa foi perdida. Seu saldo foi debitado"
   - Faxineira não pode sacar se saldo ficar negativo
   - Faxineira pode depositar de volta ou contestar com evidência melhor

3. Se faxineira tem razão (trabalho foi bem feito):
   - Admin aprova, faxineira mantém dinheiro

**Notificações:**
- Cliente: "Disputa aberta. Você pode reembolso se comprovado"
- Faxineira: "Disputa aberta. Você tem 24h para responder"
- Ambas: resultado da análise admin

**Saldo:**
- Potencialmente faxineira recebe debit (se perder)
- Cliente recebe reembolso (se ganhar)

**Score:**
- Faxineira: −10 (disputa perdida)
- Cliente: −3 (abriu disputa, mesmo que ganhou)

---

## 16. Chave PIX Inválida

**Trigger:** Faxineira tenta sacar via PIX, mas chave está incorreta.

**Estado esperado:** Transferência falha, faxineira é notificada.

**Ação do app:**
1. Faxineira clica "Solicitar saque" em D+15
2. Backend chama Asaas: `POST /dict/transferValue` com chave PIX
3. Asaas tenta transferir: chave não existe ou está fora do padrão
4. Asaas retorna erro: `invalid_pix_key` ou `transfer_failed`
5. Backend registra falha em `cleaner_wallets`: `lastWithdrawalStatus = failed`
6. Contador de falhas: `withdrawalAttempts++`

**Comportamento por tentativa:**
1. **1ª falha:** notificação para faxineira "Chave PIX inválida. Corrija no perfil"
2. **2ª falha:** notificação repetida + sugestão de suporte
3. **3ª falha:** **suspensão de saques** até corrigir chave (faxineira pode editar no perfil e tentar novamente)

**Resolução:**
- Faxineira edita chave no perfil (Configurações → Chave PIX)
- Backend reseta `withdrawalAttempts = 0`
- Faxineira pode solicitar saque novamente

**Notificações:**
- Faxineira (1ª falha): "Chave PIX inválida. Edite na seção Configurações"
- Faxineira (3ª falha): "Suas tentativas de saque foram bloqueadas. Corrija a chave para continuar"

**Saldo:**
- Continua em `balanceAvailable`, bloqueado para saque até correção

**Score:**
- Nenhum impacto

---

## 17. Pré-autorização Expira

**Trigger:** Pré-autorização tem validade (geralmente 30 dias no Asaas) e cliente não confirma a tempo.

**Estado esperado:** Pré-auth expira antes da captura.

**Ação do app:**
1. Pré-auth feita em D-1
2. Cliente confirmou serviço em D (dentro de prazos)
3. Backend tenta capturar em D+1
4. Asaas retorna erro: `preauth_expired` (raro, pois 30 dias é longo)
5. Backend registra falha: `status = capture_failed`

**Resolução:**
- Se pré-auth expirou, app pode:
  - Pedir nova pré-autorização (nova cobrança no cartão?)
  - Ou reembolsar (pré-auth já foi desativada)
  - Melhor: prevenir com validação de data_expiracao

**Prevenção:**
- Backend calcula: `expiresAt = preauth_date + 30 dias`
- Se `capture_request_date > expiresAt`: error "Pré-autorização expirou, faça nova"
- Notifica cliente se pré-auth está para expirar (lembrete em D+25)

**Notificações:**
- Cliente (lembrete em D+25): "Sua pré-autorização expira em 5 dias. Confirme o serviço"
- Cliente (após expiração): "Pré-autorização expirou. Faça uma nova"

**Saldo:**
- Nenhuma captura = nenhuma cobrança
- Nenhum crédito à faxineira

**Score:**
- Nenhum impacto (é prazo técnico)

---

## 18. Split Falha (Asaas Não Transfere para Subconta)

**Trigger:** Captura bem-sucedida, mas transferência para subconta da faxineira falha.

**Estado esperado:** Valor fica em app wallet, precisa de transferência manual.

**Ação do app:**
1. Captura bem-sucedida: R$150 capturado
2. Backend chama Asaas: `POST /transfers` (transferir R$125 para subconta faxineira)
3. Asaas retorna erro: `recipient_account_inactive` ou erro de rede
4. Backend registra falha em BD: `splitData.status = transfer_failed`
5. Valor fica retido no app wallet

**Resolução:**
- Admin vê em dashboard: "Transfers pending" lista
- Admin faz retry manual
- Se persistir: investigar subconta (pode estar inativa, documentação inválida)
- Pode contactar Asaas support

**Notificações:**
- Admin: alerta de split falha
- Faxineira: "Seu pagamento está sendo processado" (sem precisar mostrar erro)

**Saldo:**
- Faxineira: não recebe até split bem-sucedido
- App: fica com valor (absorve custo)

**Score:**
- Nenhum impacto

---

## 19. Faxineira Suspensa Antes de Saque

**Trigger:** Faxineira tem score <20 antes de solicitar saque.

**Estado esperado:** Saque não pode ser processado.

**Ação do app:**
1. Faxineira tem múltiplos cancelamentos, score cai para <20
2. Faxineira é suspensa (não pode mais candidatar)
3. Faxineira tenta sacar dinheiro em D+15
4. Backend valida: `if (score < 20) { error: suspended }`
5. App mostra: "Sua conta está suspensa. Complete serviços OK para recuperar"

**Resolução:**
- Faxineira não pode sacar enquanto suspensa
- Saldo continua em `balanceAvailable`
- Para recuperar:
  1. Completar 5 serviços sem problema (score sobe)
  2. Score sobe acima de 35 (desbloqueado de "risco")
  3. Score sobe acima de 50 (suspensão levantada)
  4. Faxineira pode sacar novamente

**Notificações:**
- Faxineira (ao tentar sacar): "Sua conta está suspensa. Recupere-se completando serviços"
- Faxineira (quando recuperar): "Sua conta foi desbloqueada"

**Saldo:**
- Bloqueado para saque

**Score:**
- Já está <20 (é por isso que está suspensa)

---

## 20. Múltiplas Pré-autorizações no Mesmo Cartão

**Trigger:** Cliente tem 2 pedidos agendados para dias diferentes (D e D+7).

**Estado esperado:** Duas pré-autorizações no mesmo cartão, ambas ativas.

**Ação do app:**
1. Cron D-1: pré-autoriza pedido 1 (R$150)
2. Cron D+6: pré-autoriza pedido 2 (R$120)
3. Ambas ativas no cartão simultaneamente
4. Limite do cliente é R$300
5. Ambas pré-autorizações ocupam R$270 do limite
6. Cliente tenta usar cartão: R$30 disponível

**Comportamento:**
- **Esperado:** ambas capturas funcionam (em dias diferentes)
- **Risco:** se cliente cancelar pedido 1 depois de captura, mas antes de saque, pode ter problema de duplicação de limites

**Validação:**
- Backend pode verificar: quantas pré-autorizações ativas no mesmo cartão?
- Se >2: avisar cliente (contexto: pode estar usando cartão para outras coisas também)
- Não rejeita automaticamente, apenas informação

**Notificações:**
- Cliente (contexto): nenhuma (isso é normal)

**Saldo:**
- Múltiplas bloqueios no cartão
- Quando capturadas: múltiplos débitos em dias diferentes
- Quando estornadas: desbloqueios em dias diferentes

**Score:**
- Nenhum impacto

---

## Resumo: Triagem de Severidade

### Severidade Alta (Requer Intervenção Imediata)
- Webhook não chega (2h)
- Captura falha
- Estorno falha
- Cliente cancela durante captura
- Disputa com dinheiro já sacado

### Severidade Média (Requer Ação Manual em 24h)
- Pré-auth falha (retries automáticos, depois escala)
- Confirmação de chegada bloqueada
- Chave PIX inválida (após 3 tentativas)
- Split falha

### Severidade Baixa (Resolvido Automaticamente)
- Webhook duplicado (idempotência)
- Webhook chega atrasado (sincronização)
- Pré-auth expira (prevenção)
- Múltiplas pré-autorizações
- Score baixo antes de saque (bloqueio, recuperável)
- Faxineira cancela (penalidade, continuável)

---

## Checklist de Testes para Cada Caso

- [ ] Caso 1: Cartão vencido → retry automático → push cliente → cancelamento após 6h
- [ ] Caso 2: Limite insuficiente → retry → push → cancelamento
- [ ] Caso 3: Bloqueio fraude → retry → push específica → cancelamento
- [ ] Caso 4: Webhook não chega → sincronização 2h → atualiza BD
- [ ] Caso 5: Webhook duplicado → idempotência → sem duplicação
- [ ] Caso 6: Cancelamento durante captura → lock pessimista → race resolvida
- [ ] Caso 7-10: Vários cancelamentos → score → penalidades corretas
- [ ] Caso 11: GPS falha → bloqueio → suporte manual
- [ ] Caso 12: Captura falha → retry automático → admin manual se persistir
- [ ] Caso 13: Estorno falha → log → admin retry
- [ ] Caso 14: Cancelamento pós-captura → error → redireciona para disputa
- [ ] Caso 15: Disputa após saque → transfer reverso → faxineira debitada
- [ ] Caso 16: Chave PIX inválida → 3 tentativas → suspensão → corrigir → desbloqueado
- [ ] Caso 17: Pré-auth expira → prevenção com lembrete → validação antes de capturar
- [ ] Caso 18: Split falha → retry manual → admin intervention
- [ ] Caso 19: Faxineira suspensa → saque bloqueado → recuperação via serviços OK
- [ ] Caso 20: Múltiplas pré-autorizações → ambas ativas → captura independente
