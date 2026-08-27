# Moppy — Regras de Negócio Críticas

Este documento consolida as regras de negócio obrigatórias, validações, estados e transições que governam o Moppy.

---

## 1. Preço & Financeiro

### 1.1 Definição de Preço

**Regra:** Preço é fixo, definido pelo app, não negociável.

- Tabela por tipo de limpeza (padrão / pesada / passar roupa)
- Tabela por tamanho (Studio / 1 / 2 / 3 / 4+ quartos)
- Adicionais opcionais (banheiros extras, área externa, faxineira leva produtos)
- Variação por cidade (tabela cadastrada manualmente)
- **App só opera em cidade com tabela ativa; sem cobertura → "Ainda não atendemos sua região"**

### 1.2 Comissão do App

**Regra:** 15% sobre valor base do serviço.

- Absorve custo de antecipação D+15 (~0,65%, não entra na conta da faxineira)
- Não incide sobre taxa de urgência (100% app)
- Calculada após pagamento capturado

### 1.3 Taxa de Processamento (Cartão)

**Regra:** Dividida 50/50 entre cliente e faxineira.

- Estimada em R$0,49 fixo + ~3% do valor (cartão à vista) = ~R$5 em serviço de R$150 *(confirmar no sandbox)*
- Cliente paga: valor base + 50% da taxa ≈ R$152,50 (no exemplo)
- Faxineira paga: 50% da taxa (descontada do valor bruto)
- App absorve custo de antecipação (não entra na conta da faxineira)

### 1.4 Taxa de Urgência (Destaque Pago)

**Regra:** Opcional, 100% para o app, não reembolsável.

- Valores fixos conforme demanda local:
  - Baixa: R$3,50
  - Média: R$4,50
  - Alta: R$5,50
- Cobrada separada do serviço (não é parte do valor base)
- Não reembolsável mesmo se ninguém aceitar o pedido
- **Cliente vê explicação clara no checkout (sem letra miúda)**
- **Pedido sem candidata por 48h → push sugerindo ativar taxa ou revisar pedido**

### 1.5 Remuneração da Faxineira

**Fórmula:**

```
Valor Líquido = Valor Base − Comissão (15%) − 50% Taxa Processamento − Antecipação D+15 absorvida pelo app
Exemplo (R$150): R$150 − R$22,50 − R$2,50 − (absorvida) = R$125,00
```

- Faxineira vê valor líquido ANTES de candidatar (transparência total)
- Recebe em D+15 (15 dias após conclusão)
- Saque via PIX automático (mínimo R$20)

---

## 2. Pagamento

### 2.1 Fluxo de Pagamento

**Estados do pagamento:**

```
pending (pedido criado)
  ↓
preauth_pending (D-1, Vercel Cron dispara)
  ↓
preauth_success ou preauth_failed
  ├→ preauth_success:
  │   ↓
  │   (D: serviço acontece)
  │   ↓
  │   capture_pending (cliente confirma ou 24h passam)
  │   ↓
  │   capture_success ou capture_failed
  │   ├→ capture_success: pagamento processado, split executado
  │   └→ capture_failed: suporte manual
  │
  └→ preauth_failed:
      (retry automático 2x com 1h intervalo)
      └→ ainda falhando: push cliente trocar cartão (6h antes)
         └→ não resolve: pedido cancelado, faxineira libera agenda
```

### 2.2 Pré-Autorização (D-1)

**Regra:** Vercel Cron dispara automaticamente na noite anterior.

- Não há cobrança, só reserva
- Tenta validar cartão do cliente
- Se OK: cliente vê notificação "Pagamento aprovado, será cobrado após o serviço"
- Se falhar: retry automático em 1h, depois mais 1 tentativa em 1h
- Se ainda falhando após 2 tentativas: push para cliente trocar cartão (prazo 6h antes do serviço)
- Se cliente não resolve: pedido é cancelado, faxineira recebe notificação para liberar agenda
- **Penalidade:** Cliente sofre penalidade no score (não é culpa da faxineira)
- **Webhook do Asaas confirma o resultado** (idempotência: não processar 2x)

### 2.3 Captura (Após Confirmação)

**Regra:** Só captura após cliente confirmar (ou app confirmar automaticamente em 24h).

- Se cliente confirma: app chama Asaas para capturar valor
- Asaas responde imediatamente; webhook confirma
- Split automático é executado:
  - 15% comissão → conta principal app
  - 50% taxa → app
  - Antecipação (~0,65%) → app
  - Restante → subconta da faxineira
- Saldo da faxineira entra como "a liberar" (D até D+14)
- Ambos são notificados para avaliar

### 2.4 Confirmação Automática

**Regra:** Se cliente não responde em 24h, app confirma sozinho.

- Lembrete em 12h ("Confirme a conclusão do serviço")
- Passados 24h sem resposta: confirmação automática (no log fica claro que foi automática)
- Valor é capturado normalmente
- Importante para fluxo rápido e justo para faxineira

---

## 3. Cancelamento

### 3.1 Cliente Cancela Antes do D-1

**Regra:** Gratuito (pré-autorização ainda não foi feita).

- Pedido desaparece da lista de candidatas
- Faxineira (se selecionada) recebe notificação para liberar agenda
- Zero taxa para cliente
- Faxineira não sofre penalidade (não há culpa)

### 3.2 Cliente Cancela Com +12h de Antecedência

**Regra:** Estorno total (pré-autorização desfeita).

- Pré-autorização foi feita (valor reservado)
- Cancelamento desativa a reserva
- Valor volta ao cartão do cliente em até 2 dias úteis (via Asaas)
- Faxineira recebe notificação e pode liberar agenda
- Zero taxa
- Ninguém sofre penalidade

### 3.3 Cliente Cancela Com −12h

**Regra:** Faxineira recebe 30% como compensação pela agenda reservada.

- Pré-autorização foi feita
- App captura 30% do valor base = compensação à faxineira
- Taxa Asaas é descontada do valor da faxineira (não do app)
  - Exemplo (R$150): 30% = R$45 bruto; taxa ~R$4; faxineira recebe ~R$41
- 70% é estornado para o cliente em até 2 dias
- **Cliente vê mensagem explícita da taxa antes de confirmar cancelamento**
- Regra desestimula cancelamento last-minute e protege faxineira

### 3.4 Faxineira Cancela

**Regra:** Estorno total + penalidade.

- Pré-autorização é desfeita
- Cliente recebe reembolso total
- **Faxineira sofre penalidade no score** (cai 5-10 pontos)
- Penaliza apenas cancelamento, não falta real (se não aparece, é bloqueio automático)

### 3.5 Faxineira Não Aparece

**Regra:** Bloqueio automático após 30 min de espera (verificar via GPS ou cliente marcando "não chegou").

- Após 30 min sem confirmação de chegada: app marca como "não compareceu"
- Estorno total para cliente
- Faxineira perde taxa do serviço (penalidade automática)
- Score cai significativamente

---

## 4. Execução do Serviço & Confirmação de Chegada

### 4.1 Confirmar Chegada — Opção 1: Código de 4 Dígitos

**Regra:** Se cliente disponível, usa código.

- Faxineira clica "Cheguei"
- App notifica cliente
- Cliente gera código de 4 dígitos
- Cliente passa código para faxineira (pessoalmente ou chat)
- Faxineira digita código no app
- App valida e confirma chegada
- Cronômetro começa
- **Impede fraude:** faxineira não tira foto de casa alheia

### 4.2 Confirmar Chegada — Opção 2: GPS + Foto (Cliente Ausente)

**Regra:** Se cliente não responde em 10 min, ativa GPS + foto.

- Faxineira clica "Cheguei"
- App notifica cliente
- Cliente não responde em 10 min
- App pede: faxineira tira foto da fachada + GPS é capturado automaticamente
- Validação: GPS deve estar dentro de 50m do endereço cadastrado
- Se validado: chegada confirmada, cronômetro começa
- Foto + GPS ficam guardados (evidência se houver disputa depois)
- **Segurança:** Foto e GPS são exigidos; sem GPS = bloqueado

### 4.3 Confirmar Chegada — Opção 3: Falha

**Regra:** Se GPS falha e cliente não responde, bloqueado.

- Faxineira tira foto mas GPS está desligado ou fora do raio
- "Não consegui validar sua localização. Fale com suporte"
- Chegada não é confirmada
- Serviço não pode começar
- Faxineira deve acionar suporte (WhatsApp Business)
- **Evita fraude:** ninguém pode confirmar chegada falsamente

---

## 5. Confirmação de Conclusão

### 5.1 Cliente Confirma (ou App Confirma Automaticamente)

**Regra:** Após faxineira marcar "Concluído", cliente tem até 24h.

- Faxineira clica "Concluído"
- App notifica cliente: "Está tudo certo?"
- Duas opções: "Sim" ou "Tive um problema"
- Se "Sim": valor é capturado, pagamento processado, ambos avaliam
- Se não responde em 24h: **app confirma automaticamente** (com lembrete em 12h)
- **Importante:** confirmação automática protege faxineira (ela não fica presa esperando)
- Se "Tive um problema": abre disputa (vide seção 6)

### 5.2 Sem Confirmação, Cliente Abre Disputa

**Regra:** Se cliente não confirma mas abre disputa depois, valor fica retido.

- Cliente clica "Tive um problema"
- Disputa entra em análise
- Valor continua pré-autorizado (não capturado ainda)
- Faxineira não recebe nada enquanto análise está aberta
- Admin decide

---

## 6. Disputa (Resolução de Conflitos)

### 6.1 Abrir Disputa

**Regra:** Cliente pode abrir disputa se não está satisfeito.

- Cliente clica "Tive um problema"
- Campo obrigatório: descrição do problema (texto)
- Opção de anexar até 3 fotos
- Botão "Reportar"
- Disputa entra em status "aberta"
- Faxineira recebe notificação

### 6.2 Defesa da Faxineira

**Regra:** Faxineira tem 24h para responder.

- Faxineira vê versão do cliente (texto + fotos)
- Campo: sua resposta (texto)
- Opção de anexar até 3 fotos (evidência)
- Cronômetro visível (24h)
- Se não responde em 24h: perdeu oportunidade de defesa (admin analisa só com versão do cliente)

### 6.3 Análise do Admin

**Regra:** Admin analisa em até 48h com direito de defesa de ambas partes.

- Admin vê timeline completa: criação, candidatura, seleção, chegada (código/GPS), conclusão, fotos, chat
- Admin vê versão do cliente (texto + fotos) + versão da faxineira (se respondeu)
- Admin decide: **reembolso total, reembolso parcial, ou libera pagamento para faxineira**
- Decisão obrigatória de justificativa (para auditoria)
- **Máximo ressarcimento via app = valor da faxina** (R$150 no exemplo)
- Qualquer coisa acima disso é entre as partes, fora do app
- Faxineira pode fornecer dados de contato (CPF, telefone) para resolução direta

### 6.4 Sem Recurso Formal (MVP)

**Regra:** Decisão do admin é final. Sem apelação formal no MVP.

- Ambas partes são notificadas (cliente e faxineira)
- Valor é processado (estorno ou captura) automaticamente
- **Importante para Fase 2:** implementar recurso formal se houver demanda

### 6.5 Casos Especiais de Disputa

**Dano/Furto Menor:** Admin pode reembolsar até valor da faxina (ex: R$150 faxina, cliente reclama de vidro quebrado = R$50; admin autoriza reembolso de R$50 extra).

**Dano/Furto Grave:** Fora do escopo do app. Ambas partes recebem dados de contato uma da outra para resolver entre si.

**Pagamento por Fora:** Cliente e faxineira combinam pagamento fora do app (via chat ou WhatsApp). App não intervém nessas disputas (aviso fixo no chat deixa claro).

---

## 7. Reputação: Nota & Score

### 7.1 Nota de Qualidade (1-5 Estrelas)

**Regra:** Dada pela outra parte, pública, oculta por 72h.

- Cliente avalia faxineira (nota + comentário opcional)
- Faxineira avalia cliente (nota + comentário opcional)
- Nota é pública (visível para futuros clientes/faxineiras)
- Oculta até ambos avaliarem OU 72h passarem
- **Evita retaliação:** se cliente dá 1 star, faxineira não pode responder com 1 star imediatamente
- Nota média é mostrada (ex: 4.8 em 25 serviços)
- Não pode editar depois de enviar (no MVP)

### 7.2 Score de Confiabilidade (0-100)

**Regra:** Automático, visível só para usuário + admin.

- **Começa em 65 para todos** (ponto neutro)
- Aumenta/diminui conforme comportamento
- Não é visível para terceiros (diferente da nota de qualidade)

### 7.3 Score da Faxineira

**Penalizações:**

- Cancelamento: −5 a −10 (conforme antecedência)
- Falta/não comparecimento: −15
- Atraso >30min: −5
- Disputa perdida: −10
- Confirmação de chegada bloqueada (GPS falha): −5

**Recompensas:**

- Serviço OK (sem problema): +2
- 10 serviços OK consecutivos: +5 bônus
- Rating ≥4.5: +1 (por serviço)

**Consequências por score:**

- Score 65-50: normal, nenhuma penalidade
- Score 50-35: pode perder notificações (só vê feed)
- Score 35-20: pode perder prioridade na ordem de candidatas
- Score <20: suspensão (não pode mais candidatar)
- Recuperação: completar serviços OK aumenta score

### 7.4 Score do Cliente

**Penalizações:**

- Pré-autorização falha por culpa do cartão (vencido, limite): −5
- Não confirmar conclusão em 24h: −2
- Disputa aberta (independente do resultado): −3
- Cancelamento com −12h: −2

**Recompensas:**

- Serviço OK (sem problema): +1
- 10 serviços OK consecutivos: +3 bônus
- Rating ≥4.5 para faxineira: +1 (por serviço)

**Consequências:**

- Similar à faxineira, mas menos severa (cliente tem menos "culpa" no marketplace)

---

## 8. Matching & Candidatura

### 8.1 Seleção de Faxineira (Cliente Escolhe)

**Regra:** Cliente escolhe, não há algoritmo de matching automático.

- Cliente vê lista de candidatas (foto, nome, nota, distância, histórico)
- Cliente escolhe uma
- Outras candidaturas caem automaticamente (viram "não selecionada")
- Candidatas não selecionadas recebem notificação discreta
- Pedido desaparece do feed (não está mais aberto)

### 8.2 Bloqueio de Double-Booking

**Regra:** Faxineira não pode se candidatar a 2 pedidos no mesmo horário.

- Faxineira tenta candidatar a pedido que conflita com serviço já agendado
- App bloqueia: "Você já tem serviço agendado nesse horário"
- Impede overbooking

### 8.3 Duração do Pedido Aberto

**Regra:** Pedido fica aberto indefinidamente até alguém candidatar.

- Sem expiração automática
- Se ninguém se candidata em 48h: push ao cliente sugerindo ativar taxa de urgência ou revisar critérios

---

## 9. Localização & Raio de Atuação

### 9.1 Raio de Atuação (Faxineira)

**Regra:** Faxineira define raio em km a partir de seu endereço.

- Opções: 5, 10, 15, 20 km (ou similar, conforme feedback)
- Feed mostra apenas pedidos no raio
- Notificações usam raio
- Pode editar depois (Configurações)
- **Crítico:** sem raio, faxineira vê todo pedido da cidade (ruído)

### 9.2 Visibilidade de Endereço

**Regra:** Endereço completo só é revelado após seleção.

- Feed mostra apenas bairro (ex: "Vila Nova")
- Distância em km (ex: "2.5 km")
- Após seleção: endereço completo é revelado para ambos
- Chat pode combinar detalhes
- **Privacidade:** cliente não quer publicar endereço completo antes de escolher

---

## 10. Notificações

### 10.1 Push Obrigatórias (Versão MVP)

- Novo pedido por perto (faxineira)
- Nova candidatura (cliente)
- Cliente escolheu você (faxineira)
- Lembrete 24h antes (ambos)
- Faxineira chegou (cliente)
- "Está tudo certo?" (cliente)
- Lembrete em 12h (cliente, se não confirmou)
- Pagamento liberado (faxineira, D+15)
- Disputa aberta / decidida (ambos)
- Cancelamento (ambos)
- Cadastro aprovado / reprovado (faxineira)
- Avaliação recebida (ambos)
- Nova mensagem no chat (ambos)

### 10.2 App Funciona 100% Sem Push

**Regra:** Push é bônus, não obrigatório.

- Feed de pedidos funciona mesmo sem notificações
- Faxineira pode negar permissão e ainda buscar trabalho
- Toda funcionalidade é acessível via UI (abas, botões)

---

## 11. Dados & Conformidade

### 11.1 Dados Sensíveis

**Regra:** Nunca guardar dados de cartão no app. Tokenizar via Asaas.

- Número completo, CVV, data validade: nunca no BD
- Asaas retorna token (ex: `card_12345xyz`)
- App guarda token, não dados brutos
- Mesmo para dados de cartão salvo

### 11.2 Documentos de Faxineira

**Regra:** Acesso restrito, armazenagem segura.

- RG, CPF, selfie, comprovante, chave PIX: armazenados com acesso restrito
- Admin e sistema de aprovação veem; terceiros não
- Auditoria de quem acessou (para rastreabilidade)
- Retenção conforme legislação

### 11.3 Localização

**Regra:** GPS é coletado apenas quando necessário (confirmação de chegada).

- Não é coleta contínua (tracking)
- Só quando faxineira marca "Cheguei"
- Coordenadas guardadas como evidência de disputa
- Usuário sabe por quê (aviso "Precisamos de sua localização para confirmar chegada")

### 11.4 LGPD & Termos

**Regra:** Consentimento explícito no cadastro.

- Aceite de termos de uso (obrigatório)
- Aceite de política de privacidade (obrigatório)
- Opção de deletar conta (direito ao esquecimento)
- Aceite no cadastro, revogável depois

---

## 12. Responsabilidade & Isenção

### 12.1 App é Mediador Puro

**Regra:** App não é empregador, não oferece seguro, não é responsável pelo serviço.

- Faxineira é autônoma (pessoa física, sem CNPJ, sem exclusividade)
- Liberdade de recusar pedidos (argumento legal de autonomia)
- Termos deixam explícito: "O app apenas conecta. Não é responsável pela qualidade, danos ou furtos"
- Defesa contra vínculo trabalhista

### 12.2 Danos & Furtos

**Regra:** Máximo ressarcimento via app = valor da faxina.

- Cliente reclama de dano/furto
- Admin analisa como disputa
- Se comprovado (fotos, evidência): pode reembolsar até valor da faxina (ex: R$150)
- Qualquer coisa acima (ex: R$500 em danos) é entre as partes, fora do app
- App fornece dados de contato (CPF, telefone) para resolução direta

### 12.3 Chat Externo (WhatsApp, SMS, etc.)

**Regra:** Se cliente e faxineira combinam pagamento por fora, app não intervém.

- Chat in-app tem aviso: "Pagamento fora do app não tem garantia"
- Se houver disputa sobre valor não pago fora: app não vai pagar a diferença
- É responsabilidade deles

---

## 13. Cidade & Cobertura

### 13.1 Operação por Cidade

**Regra:** App só funciona em cidade com tabela de preço ativa.

- Cada cidade tem tabela cadastrada manualmente
- Admin ativa/desativa cobertura por cidade
- Cliente vê "Ainda não atendemos sua região" se não há cobertura
- Faxineira vê mesmo aviso (raio não alcança zona sem cobertura)

### 13.2 Expansão de Cidade

**Pré-requisito:** Tabela de preço validada e ativa.

- Admin cria tabela (com base em população IBGE ou experiência)
- Admin ativa cidade
- Faxineiras daquela cidade recebem notificação
- Clientes daquela cidade podem criar pedidos

---

## 14. Casos Extremos & Automação

### 14.1 Serviço Confirmado Automaticamente (24h)

**Regra:** Se cliente não responde em 24h, app confirma.

- Proteção para faxineira (não fica suspensa indefinidamente)
- Lembrete em 12h
- Auto-confirmação após 24h
- Log registra que foi automática

### 14.2 Pré-Auth Falha Mais de 2x

**Regra:** Escalação automática para cliente trocar cartão.

- Tentativa 1 (D-1 noite)
- Tentativa 2 (+1h)
- Tentativa 3 (+1h)
- Se falha todas 3: push client "Cartão recusado. Troque em até 6h"
- Se não resolver: pedido cancelado, sem compensação para faxineira (app não tem culpa)
- Penalidade no score do cliente (culpa do cartão dele)

### 14.3 Faxineira Suspensa (Score <20)

**Regra:** Suspensão impede candidaturas até recuperação.

- Score cai abaixo de 20
- Faxineira recebe notificação: "Você foi temporariamente suspensa. Complete serviços OK para recuperar"
- Não pode mais candidatar
- Feed continua visível (ela pode ver, mas não candidatar)
- Recuperação: completar 5 serviços sem problema (score sobe, suspensão levantada)

### 14.4 Webhook Falha ou Chega 2x

**Regra:** Proteção de idempotência.

- Backend guarda `event_id` + timestamp de cada webhook
- Se webhook chega 2x com mesmo `event_id`: segunda tentativa é ignorada
- Se webhook não chega: cron de verificação (a cada 2h) sincroniza com Asaas
- Logging completo para auditoria

---

## 15. Transições de Estado (Pedido)

### 15.1 Estados Possíveis

```
RASCUNHO (cliente criando, pré-checkout)
  → ABERTO (pedido publicado, esperando candidatas)
  → CONFIRMADO (cliente escolheu faxineira)
  → EM_ANDAMENTO (faxineira confirmou chegada)
  → CONCLUIDO (faxineira marcou concluído)
  → AVALIADO (ambos avaliaram ou 72h passaram)
  
OU

  → CANCELADO (cliente ou faxineira cancelou)
  → DISPUTA_ABERTA (cliente reportou problema)
  → DISPUTA_FECHADA (admin decidiu)
  → REEMBOLSADO (se disputa resultou em reembolso)
  → PAGAMENTO_FALHA (se captura falhou)
```

### 15.2 Transições Obrigatórias

- Checkout deve ser feito antes de publicar (pode ficar em RASCUNHO indefinidamente se não publicar)
- Só muda para CONFIRMADO quando cliente escolhe
- Só muda para EM_ANDAMENTO quando chegada é validada
- Só muda para CONCLUIDO quando faxineira marca
- CONCLUIDO automaticamente muda para AVALIADO (em 72h ou antes se ambos avaliarem)

---

## Resumo: Validações Críticas

| Validação | Ponto | Ação |
|-----------|-------|------|
| Cartão válido | D-1 noite | Pré-autorização com retry 2x |
| Chegada confirmada | Chegada | Código OU GPS+foto, não ambos |
| Conclusão confirmada | Até 24h | Auto-confirmar se não responder |
| Disputa resolvida | Até 48h | Admin decide, ambos notificados |
| Score de faxineira | Contínuo | Atualizar com cada evento, suspender se <20 |
| Preço válido por cidade | Checkin | Rejeitar se sem tabela |
| Chave PIX válida | Saque | Retry 3x, suspender se falhar |
| Documentos legíveis | Aprovação | Critérios objetivos, sem vagueza |

---

## Próximos Passos (Validação com Terceiros)

- [ ] **Advogado:** confirmar que modelo (faxineira autônoma, liberdade de recusar, pessoa física) protege app de vínculo trabalhista
- [ ] **Contador:** confirmar tratamento tributário de comissão, retenções, nota fiscal
- [ ] **Asaas Sandbox:** validar taxas reais (processamento + antecipação), confirmar split automático
- [ ] **Testes:** ponta a ponta (pedido → pré-auth → captura → disputa → saque)
