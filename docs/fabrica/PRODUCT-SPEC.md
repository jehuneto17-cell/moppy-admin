# Moppy — Especificação do Produto

## O Que É o App

**Moppy** é um marketplace mobile (iOS/Android via Expo/React Native) onde:
1. **Clientes** publicam pedidos de limpeza para suas casas
2. **Faxineiras** recebem notificações e veem pedidos em um feed
3. **Faxineiras** se candidatam, **clientes** escolhem uma
4. **App** medeia pagamento, execução e resolução de conflitos
5. Os dois se avaliam ao fim

O app conecta duas partes; **não é empregador, não oferece seguro**. Mediação pura.

---

## Perfis de Usuário

### 1. Cliente
- **Quem:** dono de casa/imóvel que precisa de limpeza
- **O que faz:**
  - Cadastra endereços (e guarda para futuro)
  - Cria pedido (endereço, tipo de limpeza, data, tamanho da casa)
  - Recebe pré-autorização no cartão (D-1)
  - Compara candidatas (nota, distância, histórico)
  - Escolhe uma faxineira
  - Passa código de confirmação (ou autoriza por GPS+foto se ausente)
  - Confirma qualidade do serviço (ou reporta problema)
  - Avalia a faxineira (1-5 stars)
  - Chateia detalhes via app (não sai pelo WhatsApp)

### 2. Faxineira
- **Quem:** pessoa física que presta serviço de limpeza
- **O que faz:**
  - Faz cadastro com documentos (RG, CPF, selfie, comprovante de endereço, chave PIX)
  - Aguarda aprovação manual do admin (até 48h)
  - Define raio de atuação (5-20 km) e disponibilidade
  - Vê notificações de novos pedidos (e feed sem push)
  - Se candidata (pode ver valor líquido a receber antes)
  - Executa serviço
  - Confirma chegada (código ou GPS+foto)
  - Marca como concluído
  - Aguarda confirmação do cliente (24h automática se não responder)
  - Se houver disputa, apresenta versão dela (24h)
  - Avalia o cliente (1-5 stars)
  - Consulta carteira (saldo "a liberar" vs "disponível")
  - Solicita saque via PIX (mínimo R$20)

### 3. Admin
- **Quem:** dono/gestor da Moppy (acesso web)
- **O que faz:**
  - Aprova/reprova cadastro de faxineiras (critérios: doc legível, selfie bate, CPF OK, maior de idade)
  - Acompanha pedidos em tempo real
  - Medeia disputas (análise em até 48h, direito de defesa de ambos os lados)
  - Decide reembolso total, parcial ou libera pagamento para faxineira
  - Gerencia tabelas de preço por cidade
  - Acompanha financeiro (comissão, taxa de urgência, estornos)
  - Monitora score de confiabilidade (cliente e faxineira)

---

## Funcionalidades MVP (Fase 1)

### Onboarding e Cadastro

**Cliente:**
- Escolher papel (cliente / faxineira)
- Login/cadastro com email + senha (Firebase)
- Cadastrar endereço (rua, número, bairro, complemento, cidade)
- Salvar cartão de crédito (tokenizado via Asaas, sem dados sensíveis no app)

**Faxineira:**
- Cadastro com documentos: RG, CPF, selfie, comprovante de endereço, chave PIX
- Definir raio de atuação (km)
- Aceitar termos de uso + LGPD
- Aguardar aprovação (tela de "enviado para análise")
- Receber notificação de aprovação/reprovação (se reprovada, pode tentar 1 vez)

### Pedidos (Cliente)

- **Criar pedido:**
  - Escolher endereço (ou criar novo)
  - Tipo de limpeza: padrão / pesada / passar roupa
  - Tamanho: Studio / 1 / 2 / 3 / 4+ quartos
  - Adicionais: banheiros extras, área externa, faxineira leva produtos
  - Data e horário (próximo dia ou futuro)
  - Visualizar preço final (com taxa de serviço itemizada)
  - Opção: taxa de urgência (R$3,50 / R$4,50 / R$5,50 conforme demanda local)

- **Checkout/Pagamento:**
  - Escolher cartão ou cadastrar novo
  - Pré-autorização automática no D-1 (app mostra status)
  - "Pagamento aprovado, será cobrado após o serviço"

- **Listar candidatas:**
  - Mostrar faxineiras candidatas (foto, nome, nota média, distância, nº de serviços)
  - Ordenar por nota / distância / histórico
  - Escolher uma (outras candidaturas caem automaticamente)

- **Pedido em andamento:**
  - Mostrar status (aguardando / confirmação de chegada / em progresso / concluído)
  - Passar código de 4 dígitos (se cliente está disponível)
  - Autorizar chegada por GPS+foto (se não responde em 10 min)
  - Chat com faxineira (texto simples, aviso de "pagamento fora do app não tem garantia")
  - Receber notificação "está tudo certo?" com Sim / Tive um problema

- **Confirmação ou disputa:**
  - Se Sim: valor capturado, faxineira recebe em D+15, passe para avaliação
  - Se Tive um problema: descrever + fotos, admin analisa em 48h
  - Se não responder em 24h: app confirma automaticamente (com lembrete em 12h)

- **Avaliação:**
  - Dar 1-5 stars
  - Texto opcional
  - Avaliação oculta até ambos avaliarem ou 72h passarem

### Pedidos (Faxineira)

- **Feed de busca de trabalho:**
  - Listar todos os pedidos abertos na região (raio definido)
  - Filtrar por tipo de limpeza, tamanho, distância
  - Ver resumo: endereço (só bairro até ser selecionada), tipo, tamanho, valor, distância
  - Não pode se candidatar se já tem serviço agendado no mesmo horário (double-booking bloqueado)

- **Detalhe do pedido:**
  - Enderereço completo (só após candidatura)
  - Data/horário, tipo, tamanho, adicionais
  - Valor bruto, valor líquido a receber (com taxas descontadas)
  - Dados do cliente (nome, foto, nota média)
  - Botão "Me candidatar"

- **Candidaturas:**
  - Listar seus pedidos onde se candidatou
  - Status de cada um: "aguardando escolha" / "não selecionada" / "selecionada"
  - Notificação quando o cliente escolhe

### Execução do Serviço (Faxineira)

- **Agenda:**
  - Listar serviços confirmados (próximos dias)
  - Mostrar data, hora, cliente, endereço, tipo

- **Serviço em andamento:**
  - Botão "Cheguei" (abre fluxo de confirmação de chegada)
  - Se cliente disponível: recebe código de 4 dígitos pelo app, passa para faxineira, faxineira digita
  - Se cliente não responde em 10 min: faxineira tira foto da fachada + GPS confirma raio → registra chegada
  - Se GPS não confirma: "não posso iniciar" → aciona suporte
  - Cronômetro do serviço começa
  - Chat aberto
  - Botão "Concluído" ao terminar

### Carteira e Saque (Faxineira)

- **Tela de carteira:**
  - Saldo total
  - Breakdown: "a liberar" (D-1 a D+14) vs "disponível" (D+15+)
  - Extrato (tabela com data, pedido, valor)
  - Botão "Solicitar saque" (mínimo R$20)
  - Transferência via PIX automática (chave cadastrada no onboarding)

### Cancelamento

- **Cliente cancela antes do D-1:** gratuito (nada foi reservado)
- **Cliente cancela +12h antes:** estorno total
- **Cliente cancela −12h:** faxineira recebe 30% (já com taxa Asaas descontada)
- **Faxineira cancela:** estorno total, penalidade no histórico

### Chat

- Chat de texto simples entre cliente e faxineira
- Liberado só após cliente escolher faxineira
- Aviso fixo: "pagamento fora do app não tem garantia"
- Sem chamadas de voz ou vídeo (MVP)

### Reputação

**Nota de qualidade (1-5 stars):**
- Dado pela outra parte após serviço
- Pública
- Oculta até os dois avaliarem ou 72h passarem (evita retaliação)

**Score de confiabilidade (0-100):**
- Atribuído automaticamente pelo sistema
- Visível só para a pessoa + admin
- Começa em 65 para todos
- Faxineira: cai com cancelamentos, faltas, atrasos, disputas perdidas; sobe com serviços OK
- Cliente: sofre penalidade quando pré-autorização falha por culpa do cartão

### Disputa

- Cliente reporta problema (texto + fotos)
- Faxineira recebe notificação, tem 24h para responder (texto + fotos)
- Admin analisa em até 48h
- Decisão: reembolso total, reembolso parcial, ou libera pagamento para faxineira
- Valor retido até decisão
- Ambos são notificados da decisão (sem recurso formal no MVP)

### Notificações

App envia push em:
- Novo pedido por perto (faxineira)
- Nova candidatura (cliente)
- Cliente escolheu você (faxineira)
- Lembrete de serviço amanhã (ambos)
- Faxineira chegou (cliente)
- "Está tudo certo?" confirmação (cliente)
- Lembrete de confirmação (cliente, 12h)
- Pagamento liberado (faxineira, D+15)
- Disputa aberta / decidida (ambos)
- Cancelamento (ambos)
- Cadastro aprovado / reprovado (faxineira)
- Avaliação recebida (ambos)
- Nova mensagem no chat (ambos)

**Importante:** app funciona 100% sem push. Feed de pedidos funciona mesmo sem notificações.

### Perfil e Configurações

- Nome, foto, telefone
- Histórico de avaliações (nota média, número de serviços)
- Score de confiabilidade (cliente vê só a nota média, não o score numérico)
- Opção de deletar conta (conforme LGPD)
- Aceitar/revogar termos
- Gerenciar notificações

---

## Funcionalidades Pós-MVP

### Fase 2
- Limpeza pós-obra (fluxo de orçamento, aprovação, agendamento)
- PIX como opção de pagamento (além de cartão)
- Sugestão automática de ajuste de preço por cidade
- Carteira com busca/filtro de extrato
- Foto de antes/depois do serviço

### Fase 3
- Auto-ajuste de preço dentro de limites de segurança
- Sistema de rating mais sofisticado (útil, produto adequado, etc.)
- Agendamento recorrente (semanal, bi-semanal, mensal)
- Pacotes de desconto (5 serviços = 2% de desconto, etc.)
- Integração com aplicações de gestão (para clientes com múltiplos imóveis)

---

## Regras de Negócio Críticas

### Preço
- Definido pelo app (tabela fixa), não negociável
- Varia por cidade
- Cliente vê + taxa de serviço desagregada
- Faxineira vê valor líquido antes de se candidatar

### Pagamento
- Pré-autorização no D-1 (reserva, sem cobrança)
- Captura só após confirmação do cliente
- Faxineira recebe em D+15 (com 15 dias de antecipação parcial absorvida pelo app)
- Se cliente não confirma em 24h: app confirma automaticamente

### Comissão
- 15% sobre valor base do serviço
- Absorve custo de antecipação D+15 (~0,65%)
- Taxa de processamento (cartão): 50/50 entre cliente e faxineira

### Urgência
- Taxa opcional para destacar pedido (R$3,50 / R$4,50 / R$5,50)
- 100% para o app
- Não reembolsável (mesmo se ninguém aceitar)
- Pedido sem candidata por 48h → push sugerindo taxa de urgência ou revisar pedido

### Matching
- Cliente escolhe a faxineira (não é algoritmo)
- Faxineira não pode se candidatar a 2 pedidos no mesmo horário (double-booking bloqueado)
- Quando cliente escolhe: outras candidaturas caem automaticamente

### Confirmação de Chegada
1. Se cliente disponível: código de 4 dígitos
2. Se cliente não responde em 10 min: GPS+foto da fachada
3. Se GPS falha: bloqueado, aciona suporte

### Confirmação de Conclusão
1. Cliente confirma em 24h (ou app confirma automaticamente)
2. Se cliente reporta problema: faxineira tem 24h para responder
3. Admin analisa em 48h

### Pré-autorização Falha
1. 2 tentativas automáticas com 1h de intervalo
2. Se falhar: push pro cliente trocar cartão (prazo 6h antes do serviço)
3. Se não resolver: pedido cancelado (sem compensação para faxineira, penalidade recai no cliente, faxineira é notificada para liberar agenda)

### Score de Confiabilidade
- Começa em 65 para todos
- Faxineira: penalizada por cancelamentos, faltas, atrasos, disputas perdidas; recompensada por serviços OK
- Cliente: penalizado quando pré-autorização falha por culpa do cartão
- Conforme score: faxineira pode perder prioridade, notificações ou ser suspensa se cair muito
- Score baixo não = ban automático, permite recuperação

### Rating
- 1-5 stars (separado do score automático)
- Dado pela outra parte após serviço
- Pública (visível para futuros clientes/faxineiras)
- Oculta até ambos avaliarem ou 72h passarem (evita retaliação)

### Disputa
- Cliente descreve problema + fotos
- Faxineira tem 24h para responder
- Admin analisa em até 48h
- Opções: reembolso total, reembolso parcial, libera pagamento para faxineira
- Máximo ressarcimento via app = valor da faxina
- Qualquer coisa acima é entre as partes, fora do app
- Sem recurso formal no MVP

### Responsabilidade
- App é mediador puro
- Sem seguro, sem garantia de danos/furtos
- Dano/furto vira disputa analisada caso a caso
- Termos deixam claro que app não é responsável pela qualidade do serviço

---

## Casos de Borda

### Pagamento
- Cartão recusado na pré-autorização (falha, vencido, limite): 2 tentativas automáticas + push cliente
- Cartão recusado na captura: reembolso de taxas pagas até agora, faxineira recebe notificação de falha
- Estorno falha: suporte manual

### Confirmação de Chegada
- GPS não confirma mas cliente está disponível: usa código
- GPS falha e cliente não responde: bloqueia, aciona suporte
- Faxineira tira foto mas GPS está desligado: foto não é validada, bloqueia

### Confirmação de Conclusão
- Cliente não responde em 24h: app confirma automaticamente (com lembrete em 12h)
- Cliente não confirma mas abre disputa: entra em fluxo de disputa (valor retido)
- Faxineira não marca como concluído: cliente pode forçar conclusão em 6h (com evidência)

### Cancelamento
- Cliente cancela durante a execução: trata como disputa se houver reclamação
- Faxineira cancela 1h antes: faxineira perde a taxa de serviço como penalidade
- Faxineira não aparece: cancelamento automático após 30 min de espera, faxineira perde taxa (penalidade no score)

### Double-booking
- Faxineira tenta se candidatar a 2 pedidos no mesmo horário: app bloqueia com mensagem clara

### Sem Candidatas
- Pedido fica aberto indefinidamente
- Após 48h sem nenhuma candidata: push para cliente sugerindo taxa de urgência ou revisar pedido

### Score e Suspensão
- Score 65-50: normal, nenhuma penalidade
- Score 50-35: pode perder notificações (só vê feed)
- Score 35-20: pode perder prioridade na ordem de candidatas
- Score <20: suspensão (não pode mais candidatar)
- Recuperação: completar serviços OK aumenta score

### Chat e Pagamento por Fora
- Cliente e faxineira combinam pagamento fora do app no chat
- App mostra aviso fixo: "pagamento fora do app não tem garantia"
- Se houver disputa sobre pagamento externo: app não intervém

### Danos/Furtos Menores
- Cliente reporta dano/furto como disputa
- Admin analisa: pode reembolsar até valor da faxina
- Se cliente quer ressarcir mais: fora do app, entre as partes
- Faxineira pode fornecer dados de contato para resolução direta

### Faxineira Pessoa Física
- Sem MEI/CNPJ: termos deixam claro autonomia (pode recusar pedidos)
- Sem retenção na fonte (ou com, conforme contador): app não retém nada
- Saque via PIX direto (sem intermediários)

### Chave PIX Inválida
- Faxineira tenta sacar com chave PIX incorreta
- Primeiro saque falha: notificação para corrigir chave
- Após 3 falhas: suspensão de saques até corrigir

---

## Telas MVP (Resumo)

### Cliente
- Escolha de papel (cliente / faxineira)
- Login / Cadastro
- Home (próximos serviços, histórico)
- Criar pedido (endereço → tipo → tamanho → data → adicionais → preço → taxa de urgência → checkout)
- Checkout / Pagamento (cartão, pré-autorização)
- Lista de candidatas (foto, nome, nota, distância, histórico)
- Pedido em andamento (status, código, chat, "está tudo certo?" ou disputa)
- Confirmação / Disputa
- Avaliação
- Chat
- Endereços e cartões
- Perfil e avaliações

### Faxineira
- Escolha de papel
- Cadastro com documentos (RG, CPF, selfie, comprovante, PIX)
- Aguardando aprovação
- Home (próximos serviços, histórico)
- Buscar trabalho (feed de pedidos)
- Detalhe do pedido e candidatura
- Agenda (serviços confirmados)
- Serviço em andamento (confirmação de chegada, chat, "Concluído")
- Carteira (saldo, "a liberar" vs "disponível", extrato, sacar)
- Chat
- Avaliações e perfil

### Admin (Web)
- Login
- Aprovação de faxineiras (lista de pendentes, critérios objetivos)
- Pedidos (em tempo real, filtrar por status)
- Disputas (pendentes, com evidência de ambos os lados, decidir)
- Financeiro (comissão, taxa de urgência, estornos, por período/cidade)
- Usuários (faxineiras, clientes, histórico)
- Tabelas de preço (por cidade, ativar/desativar)

---

## Métricas a Coletar (Desde o Dia 1)

Com data/hora + cidade:
- Pedido criado (preço, tipo, tamanho, adicionais)
- Taxa de urgência acionada (faixa: baixa/média/alta)
- Candidatura recebida
- Cliente escolheu faxineira
- Pré-autorização feita / falhou
- Chegada confirmada (por código / GPS+foto / bloqueada)
- Serviço concluído
- Confirmação do cliente (manual / automática)
- Cancelamento (quem + antecedência)
- Disputa aberta / resultado
- Pagamento capturado
- Saque solicitado

**Por quê:** preço vai evoluir com base em dados. Não dá para coletar retroativamente.

---

## Jornadas Completas

### Jornada Cliente (Criar Pedido até Receber Serviço)

1. **Onboarding** — login → cadastrar endereço → salvar cartão → termos LGPD
2. **Criar pedido** — escolher endereço → tipo de limpeza → tamanho → adicionais → data/hora → revisar preço
3. **Checkout** — opção taxa de urgência → confirmar pagamento → pré-autorização automática (D-1)
4. **Candidaturas** — recebe notificação de novas candidatas → compara (nota, distância, histórico) → escolhe uma → outras caem
5. **Chat** — combina detalhes com faxineira (chat in-app)
6. **Dia do serviço** — recebe notificação de chegada → passa código ou confirma por GPS+foto → chat durante serviço
7. **Confirmação** — recebe "está tudo certo?" → confirma (ou reporta problema) → valor é capturado
8. **Avaliação** — dar nota 1-5, texto opcional → avaliação oculta até ambos avaliarem ou 72h passarem

### Jornada Faxineira (Cadastro até Saque)

1. **Onboarding** — escolher papel → enviar documentos (RG, CPF, selfie, comprovante, PIX) → aceitar termos → aguardar aprovação (até 48h)
2. **Aprovação/Reprovação** — recebe notificação → se reprovada, pode tentar 1x
3. **Buscar trabalho** — abre feed → vê pedidos na região (raio definido) → filtra por tipo/distância → vê valor líquido
4. **Candidatura** — clica "Me candidatar" → pedido entra em "aguardando escolha"
5. **Seleção** — recebe notificação se selecionada → outras candidaturas caem
6. **Chat** — combina detalhes com cliente antes do serviço
7. **Dia do serviço** — clica "Cheguei" → confirma chegada (código ou GPS+foto) → executa serviço → clica "Concluído"
8. **Confirmação** — aguarda cliente confirmar (até 24h, depois app confirma automaticamente)
9. **Se disputa** — recebe notificação → responde em 24h com versão dela → aguarda decisão do admin em até 48h
10. **Saque** — saldo muda para "disponível" em D+15 → clica "Solicitar saque" → PIX automático para conta dela

### Jornada Admin (Aprovação até Disputas)

1. **Dashboard** — login web → ver estatísticas (pedidos, receita, cancelamentos)
2. **Aprovação de faxineiras** — fila de documentos pendentes → revisar critérios (doc legível, selfie bate, CPF OK, maior de idade) → aprovar ou reprovar com motivo
3. **Acompanhamento de pedidos** — filtrar por status (aberto, confirmado, em andamento, concluído, cancelado) → ver detalhes em tempo real
4. **Resolução de disputas** — fila de disputas abertas → analisar evidência de ambos (até 48h) → decidir reembolso total/parcial ou liberar → notificar ambos
5. **Financeiro** — ver comissão arrecadada, taxa de urgência, estornos, saques → relatório por período/cidade
6. **Gerenciar preços** — ver métricas por cidade → sugerir ajustes (Fase 2) ou ajustar manualmente → ativar/desativar cobertura

---

## Checklist de Implementação MVP

### Autenticação & Onboarding
- [ ] Login/cadastro com email + senha (Firebase)
- [ ] Seleção de papel (cliente / faxineira)
- [ ] Cadastro de endereço (cliente)
- [ ] Cadastro de documentos (faxineira: RG, CPF, selfie, comprovante, PIX)
- [ ] Tokenização de cartão (Asaas)
- [ ] Aceite de termos + LGPD

### Pedidos
- [ ] Criar pedido (cliente)
- [ ] Listar pedidos em feed (faxineira)
- [ ] Candidatura (faxineira)
- [ ] Seleção de faxineira (cliente)
- [ ] Bloqueio de double-booking

### Pagamento
- [ ] Pré-autorização automática (Vercel Cron, D-1)
- [ ] Webhook do Asaas (idempotência)
- [ ] Captura após confirmação
- [ ] Split automático (comissão + taxa)
- [ ] Tratamento de falha (retry automático)

### Execução do Serviço
- [ ] Confirmação de chegada (código ou GPS+foto)
- [ ] Cronômetro
- [ ] Confirmação de conclusão (cliente ou automática)
- [ ] Fluxo de disputa (bilateral, análise admin)

### Carteira & Saque
- [ ] Tela de carteira (breakdown "a liberar" vs "disponível")
- [ ] Saque via PIX (mínimo R$20)
- [ ] Processamento automático (Asaas)

### Reputação
- [ ] Rating 1-5 stars (oculto até 72h)
- [ ] Score de confiabilidade (0-100, começa em 65)
- [ ] Histórico de avaliações

### Chat
- [ ] Chat texto simples (cliente ↔ faxineira)
- [ ] Aviso fixo de "pagamento fora do app não tem garantia"

### Notificações
- [ ] Push para key events
- [ ] Feed funciona sem push

### Admin (Web)
- [ ] Aprovação de faxineiras
- [ ] Acompanhamento de pedidos
- [ ] Resolução de disputas
- [ ] Financeiro
- [ ] Gerenciar preços por cidade

### Dados & Logs
- [ ] Coletar eventos (desde dia 1)
- [ ] Registrar métricas (demanda, qualidade, financeiro)
