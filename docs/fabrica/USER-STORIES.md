# Moppy — User Stories (Prioridade MVP)

## Convenção

Formato: **Como [role], quero [action], para [benefit]**

Campos:
- **Prioridade:** P0 = MVP, P1 = Fase 2, P2 = Fase 3
- **Critério de Aceitação:** checklist do que é "pronto"
- **Notas:** contexto, edge cases, dependências

---

## Cliente

### C1 — Cadastro e Onboarding
**Como cliente, quero fazer login com email e senha, para começar a usar o app.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Login com email/senha funciona
  - [ ] Cadastro com email válido, senha forte (≥8 char)
  - [ ] Firebase autentica
  - [ ] Usuário vê mensagem de bem-vindo
  - [ ] Próxima tela é escolha de papel (cliente / faxineira)
- **Notas:** Firebase Authentication. Validar email formato. Recuperação de senha com link (Fase 2).

---

### C2 — Cadastrar Endereço
**Como cliente, quero cadastrar meu endereço (rua, número, bairro, complemento, cidade), para receber serviços em casa.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Formulário com campos obrigatórios: rua, número, bairro, complemento (opcional), cidade
  - [ ] Validação: city deve ter tabela de preço ativa
  - [ ] Opção de salvar para futuro ("Meus endereços")
  - [ ] Cliente pode ter múltiplos endereços
  - [ ] Geocoding opcional (se disponível) para GPS
- **Notas:** Salvar coordenadas para validar GPS depois. "Cidade sem cobertura" mostra mensagem clara.

---

### C3 — Criar Pedido
**Como cliente, quero criar um pedido informando tipo de limpeza, tamanho da casa e data, para receber propostas de faxineiras.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Passo 1: escolher endereço (existente ou novo)
  - [ ] Passo 2: tipo de limpeza (padrão / pesada / passar roupa)
  - [ ] Passo 3: tamanho (Studio / 1 / 2 / 3 / 4+ quartos)
  - [ ] Passo 4: adicionais (banheiros extras, área externa, faxineira leva produtos)
  - [ ] Passo 5: data e hora (próximo dia ou futuro)
  - [ ] Passo 6: visualizar preço com taxa de serviço desagregada
  - [ ] Passo 7: opção de taxa de urgência (visualizar valor)
  - [ ] Passo 8: checkout (salvar cartão ou usar existente)
  - [ ] Pré-autorização automática agendada para D-1
  - [ ] Pedido entra em "aberto" e fica visível para faxineiras
- **Notas:** Preço é fixo, definido pelo app. Taxa de urgência é opcional. Cron dispara pré-auth automaticamente.

---

### C4 — Visualizar Candidatas
**Como cliente, quero comparar faxineiras candidatas (nota, distância, histórico), para escolher aquela que mais confio.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Lista de faxineiras candidatas aparece assim que primeira candidata se oferece
  - [ ] Mostrar: foto, nome, nota média (1-5), distância (km), número de serviços
  - [ ] Ordenar por: nota (padrão), distância, histórico
  - [ ] Clique em candidata mostra perfil completo (avaliações recentes, histórico)
  - [ ] Botão "Escolher" seleciona a faxineira
  - [ ] Outras candidaturas caem automaticamente (viram "não selecionada")
  - [ ] Faxineira selecionada recebe notificação
- **Notas:** Nota é pública. Score interno (0-100) não é mostrado. Avaliações ficam ocultas até 72h.

---

### C5 — Comunicar com Faxineira
**Como cliente, quero conversar com a faxineira (depois de selecioná-la) para combinar detalhes, sem sair do app.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Chat disponível apenas após seleção
  - [ ] Texto simples (sem vídeo, voz)
  - [ ] Aviso fixo: "Pagamento fora do app não tem garantia"
  - [ ] Mensagens aparecem em tempo real
  - [ ] Ambos veem notificação de nova mensagem
  - [ ] Histórico de mensagens persiste
- **Notas:** Evita WhatsApp (onde poderiam combinar pagamento por fora). Aviso é obrigatório em toda conversa.

---

### C6 — Confirmar Chegada (Cliente Disponível)
**Como cliente, quero receber um código de 4 dígitos quando a faxineira chega, para verificar presencialmente que é ela.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Faxineira clica "Cheguei"
  - [ ] App notifica cliente: "Faxineira chegou, responda para gerar código"
  - [ ] Cliente clica "Gerar código" → app gera 4 dígitos aleatórios
  - [ ] Cliente passa código para faxineira (pessoalmente ou chat)
  - [ ] Faxineira digita código no app → app valida e confirma chegada
  - [ ] Cronômetro do serviço começa
- **Notas:** Impede fraude (faxineira não tira foto de endereço alheio). Se cliente não responde em 10 min, ativa fluxo GPS+foto.

---

### C7 — Confirmar Chegada (Cliente Ausente)
**Como cliente ausente, quero que a faxineira confirme chegada por GPS + foto da fachada, para segurança.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Faxineira clica "Cheguei"
  - [ ] App notifica cliente
  - [ ] Cliente não responde em 10 min
  - [ ] App pede: faxineira tira foto da fachada + GPS confirma raio (ex: 50m)
  - [ ] Se GPS confirma: chegada validada, serviço começa
  - [ ] Se GPS falha: "Não consegui confirmar. Fale com suporte"
  - [ ] Foto e coordenadas guardadas (evidência se houver disputa depois)
- **Notas:** GPS precisa estar ligado. Foto não valida sem GPS. Suporte é WhatsApp Business do dono.

---

### C8 — Receber Confirmação de Conclusão
**Como cliente, quero ser perguntado "Está tudo certo?" após serviço, para confirmar qualidade ou reportar problema.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Faxineira marca "Concluído"
  - [ ] Cliente recebe notificação: "Faxineira finalizou. Está tudo certo?"
  - [ ] Duas opções: "Sim" ou "Tive um problema"
  - [ ] Se "Sim": valor é capturado, faxineira recebe em D+15, ambos avaliam
  - [ ] Se "Tive um problema": cliente descreve + pode anexar fotos, abre disputa
  - [ ] Se cliente não responde em 24h: app confirma automaticamente (com lembrete em 12h)
  - [ ] Se disputa: valor fica retido até admin decidir
- **Notas:** Confirmação automática é importante para fluxo rápido. Disputa é bilateral (faxineira tem 24h para responder).

---

### C9 — Reportar Problema / Abrir Disputa
**Como cliente insatisfeito com o serviço, quero descrever o problema e anexar fotos, para que o admin analise.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Clique em "Tive um problema"
  - [ ] Campo de texto livre (descrição do problema)
  - [ ] Opção de anexar até 3 fotos
  - [ ] Botão "Enviar"
  - [ ] Disputa entra em status "aberta"
  - [ ] Faxineira recebe notificação
  - [ ] Admin vê disputa na fila (prazo: 48h para analisar)
  - [ ] Faxineira tem 24h para anexar versão dela (texto + fotos)
  - [ ] Admin decide: reembolso total / parcial / libera pagamento
  - [ ] Ambos são notificados da decisão
- **Notas:** Máximo ressarcimento = valor da faxina. Dano/furto maior que isso é entre as partes (fora do app).

---

### C10 — Avaliar Faxineira
**Como cliente após serviço, quero dar uma nota 1-5 e um comentário opcional, para ajudar futuras faxineiras e manter qualidade.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Após confirmação de conclusão (ou decisão de disputa), tela de avaliação
  - [ ] Escala 1-5 stars (clicável)
  - [ ] Campo de texto opcional (comentário)
  - [ ] Botão "Enviar avaliação"
  - [ ] Avaliação é oculta até faxineira também avaliar OU 72h passarem
  - [ ] Não pode editar depois de enviar (no MVP)
- **Notas:** Avaliação é pública. Score interno não é mostrado. Oculto previne retaliação.

---

### C11 — Ver Cartão de Crédito
**Como cliente, quero salvar e gerenciar meus cartões de crédito, para agilizar checkout.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Tela "Meus Cartões"
  - [ ] Opção "Adicionar Cartão"
  - [ ] Formulário: número, validade, CVV, titular
  - [ ] App tokeniza (dados sensíveis não ficam no BD)
  - [ ] Salvar último 4 dígitos + bandeira (Visa, Mastercard, etc.)
  - [ ] Opção de deletar cartão
  - [ ] Checkout usa cartão padrão (can change)
  - [ ] Se cartão falha pré-autorização: push para trocar em até 6h
- **Notas:** Tokenização é via Asaas. Nunca guardar número completo. Segurança crítica.

---

### C12 — Ver Histórico de Serviços
**Como cliente, quero ver a lista de serviços que fiz (passados e agendados), para referência.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Home mostra próximos serviços (agendados)
  - [ ] Abas: "Agendados" / "Histórico" / "Cancelados"
  - [ ] Cada serviço mostra: data, faxineira, tipo, valor, status
  - [ ] Clique em serviço mostra detalhes completos (endereço, chat, avaliação)
- **Notas:** Tela de home importante. Filtragem por data é Fase 2.

---

### C13 — Cancelar Pedido (Antes do D-1)
**Como cliente que mudou de ideia, quero cancelar um pedido antes de ser pré-autorizado, sem pagar nada.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Botão "Cancelar" disponível até D-1 23:59
  - [ ] Cancelamento é gratuito (zero taxa)
  - [ ] Faxineira (se selecionada) recebe notificação para liberar agenda
  - [ ] Pedido desaparece da lista de candidatas
- **Notas:** Sem pré-autorização = sem custo. Limpa.

---

### C14 — Cancelar Pedido (Com +12h de Antecedência)
**Como cliente que cancela com mais de 12h, quero que o valor seja estornado para meu cartão.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Botão "Cancelar" disponível se cancelamento é +12h antes da data
  - [ ] Mensagem: "Você receberá reembolso total em até 2 dias úteis"
  - [ ] Pré-autorização é desfeita
  - [ ] Faxineira recebe notificação e pode liberar agenda
- **Notas:** Estorno é via Asaas. Sem taxa do app.

---

### C15 — Cancelar Pedido (Com −12h)
**Como cliente que cancela com menos de 12h, quero saber que haverá uma taxa (30%), mas entendo por quê.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Se cancelamento é −12h: mensagem explícita da taxa (30%)
  - [ ] "Faxineira receberá R$XX como compensação pela agenda reservada"
  - [ ] Cliente recebe reembolso de 70%
  - [ ] Faxineira recebe 30% (com taxa Asaas descontada)
- **Notas:** Justo: protege faxineira, desestimula cancelamento last-minute. Exemplo: R$150 → faxineira recebe ~R$41 (30% − taxa).

---

### C16 — Ver Score de Confiabilidade (Cliente)
**Como cliente, quero saber meu score de confiabilidade, para entender se estou em boas condições com a plataforma.**

- **Prioridade:** P1
- **Critério de Aceitação:**
  - [ ] Perfil mostra nota média (1-5, pública)
  - [ ] Score interno (0-100) não é mostrado a cliente (só ao admin)
  - [ ] Histórico mostra cancelamentos, disputas, avaliações
- **Notas:** Score cai quando pré-autorização falha por culpa do cartão. MVP mostra só nota pública.

---

### C17 — Editar/Gerenciar Endereços Salvos
**Como cliente, quero editar ou deletar endereços que já salvei, para manter minha lista atualizada.**

- **Prioridade:** P1
- **Critério de Aceitação:**
  - [ ] Tela "Meus Endereços" mostra lista de todos salvos
  - [ ] Botão "Editar" em cada endereço
  - [ ] Edição: alterar qualquer campo (rua, número, complemento, etc.)
  - [ ] Botão "Deletar" com confirmação
  - [ ] Marcação de endereço preferido (padrão em novo pedido)
  - [ ] Validação: não deletar se tem pedido ativo naquele endereço
- **Notas:** Melhora UX. Fase 1: deletar bloqueado se pedido ativo; Fase 2: permitir com aviso.

---

## Faxineira

### F1 — Cadastro com Documentos
**Como faxineira, quero enviar meus documentos (RG, CPF, selfie, comprovante de endereço, chave PIX) para me registrar na plataforma.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Tela de cadastro com 5 campos: RG (foto), CPF, selfie, comprovante endereço, chave PIX
  - [ ] Validação: arquivo legível, tamanho < 5MB, formatos aceitos (PNG, JPEG, PDF)
  - [ ] Selfie: rosto claro, visível, recente (IA pode detectar, mas MVP é manual)
  - [ ] CPF: validar formato e check digit
  - [ ] Chave PIX: validação básica (CPF, email, telefone, aleatória)
  - [ ] Comprovante endereço: últimos 90 dias (conta de água, luz, banco)
  - [ ] Botão "Enviar para Análise"
  - [ ] Status muda para "Enviado - Aguardando Análise"
  - [ ] Admin recebe notificação
- **Notas:** Pessoa física (sem MEI/CNPJ). Dados sensíveis armazenados com acesso restrito. Selfie previne fraude.

---

### F2 — Aguardar Aprovação
**Como faxineira, quero saber se fui aprovada ou não em até 48h.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Tela "Seu Cadastro Está Sendo Analisado"
  - [ ] Aguarda aprovação do admin (até 48h)
  - [ ] Se aprovada: notificação, status muda para "Ativo", pode começar a candidatar
  - [ ] Se reprovada: notificação com motivo (doc ilegível, selfie não bate, CPF irregular, menor de idade)
  - [ ] Se reprovada: opção de tentar novamente (1x apenas)
- **Notas:** Critérios objetivos. Sem vagar. Aprovação manual mas com checklist claro.

---

### F3 — Definir Raio de Atuação
**Como faxineira, quero definir o raio em km onde prefiro trabalhar (ex: 5, 10, 20 km a partir de casa), para receber pedidos perto.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Após aprovação, tela "Defina Sua Área de Atuação"
  - [ ] Campo: raio em km (ex: 5, 10, 15, 20)
  - [ ] Mapa mostra círculo visual a partir do endereço cadastrado
  - [ ] Pode editar depois (Configurações)
  - [ ] Notificações e feed usam esse raio
- **Notas:** Rádio define quais pedidos ela vê. Crítico para relevância.

---

### F4 — Buscar Trabalho (Feed)
**Como faxineira, quero ver uma lista de pedidos abertos na minha região, para escolher quais quero fazer.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Tela "Buscar Trabalho" (feed de pedidos)
  - [ ] Listar todos pedidos abertos no raio definido
  - [ ] Mostrar: tipo de limpeza, tamanho, endereço (só bairro até ser selecionada), valor bruto, distância
  - [ ] Filtros: tipo (padrão / pesada / roupa), tamanho, data
  - [ ] Ordenar por: data (padrão), distância, valor
  - [ ] Sem push: feed é a source de truth, mesmo sem notificações
  - [ ] Refresh manual (pull-to-refresh)
- **Notas:** Push é bônus, mas feed funciona sem. Endereço completo só após seleção.

---

### F5 — Visualizar Detalhe do Pedido
**Como faxineira, quero ver todos os detalhes de um pedido antes de me candidatar (endereço, cliente, valor líquido que vou receber).**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Clique em pedido do feed abre detalhe
  - [ ] Mostra: tipo, tamanho, adicionais, data, hora, bairro (ainda não endereço completo)
  - [ ] Valor bruto (preço base + adicionais)
  - [ ] **Valor líquido a receber** (após comissão 15% + 50% taxa de processamento + antecipação absorvida)
  - [ ] Informações do cliente: nome, foto, nota média, número de serviços
  - [ ] Chat não está ativo ainda
  - [ ] Botão "Me Candidatar"
- **Notas:** Transparência total do lado da faxineira. Ela sabe exatamente quanto recebe antes de candidatar. Crítico para confiança.

---

### F6 — Candidatar-se a Pedido
**Como faxineira, quero me candidatar a um pedido para ter chance de ser escolhida.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Clique em "Me Candidatar"
  - [ ] Validação: não tem outro serviço no mesmo horário (double-booking bloqueado)
  - [ ] Se bloqueado: "Você já tem serviço agendado nesse horário"
  - [ ] Se OK: candidatura é registrada, status muda para "Aguardando Escolha"
  - [ ] Cliente recebe notificação (nova candidata)
  - [ ] Faxineira vê candidatura em lista "Minhas Candidaturas" (tab separado)
- **Notas:** Double-booking é rígido. Impede conflito de horário.

---

### F7 — Ver Candidaturas
**Como faxineira, quero ver quais pedidos eu me candidatei e o status de cada um.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Tab "Minhas Candidaturas" (ou similar)
  - [ ] Listar candidaturas com status: "Aguardando" / "Selecionada" / "Não Selecionada"
  - [ ] Se "Selecionada": pedido muda para tab "Agendados", cliente pode falar no chat
  - [ ] Se "Não Selecionada": notificação discreta, dica de outras oportunidades
- **Notas:** Feedback importante. Ajuda faxineira entender se foi competitiva.

---

### F8 — Ver Agenda de Serviços Confirmados
**Como faxineira, quero ver minha agenda (serviços onde fui selecionada), para organizar meu dia.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Tab "Minha Agenda" (ou "Próximos Serviços")
  - [ ] Listar serviços confirmados em ordem cronológica
  - [ ] Mostrar: data, hora, cliente, endereço completo (agora visível), tipo, valor
  - [ ] Botão "Detalhes" abre chat + opções do serviço
  - [ ] Notificação no dia anterior (lembrete)
- **Notas:** Simples e clara. Faxineira sabe o que esperar cada dia.

---

### F9 — Confirmar Chegada (Código)
**Como faxineira que chegou no local, quero digitar o código que o cliente me passou, para confirmar presença.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Tela "Serviço em Andamento" com botão "Cheguei"
  - [ ] Clique em "Cheguei"
  - [ ] Se cliente disponível: app notifica cliente, cliente gera código, passa (pessoalmente ou chat)
  - [ ] Faxineira digita código em campo de input (4 dígitos)
  - [ ] App valida → se correto, chegada confirmada, cronômetro começa
  - [ ] Se errado: "Código incorreto. Tente novamente"
- **Notas:** Impede fraude. Se cliente não responde em 10 min, ativa GPS+foto.

---

### F10 — Confirmar Chegada (GPS+Foto)
**Como faxineira que chegou mas o cliente não responde, quero tirar uma foto da fachada + GPS confirma, para não perder tempo.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Faxineira clica "Cheguei"
  - [ ] App notifica cliente
  - [ ] Após 10 min sem resposta: app sugere "Fotografar fachada + GPS"
  - [ ] Faxineira abre câmera, tira foto (interface integrada)
  - [ ] GPS é capturado automaticamente
  - [ ] App valida: GPS está dentro de 50m do endereço
  - [ ] Se validado: chegada confirmada, cronômetro começa, foto guardada
  - [ ] Se GPS falha: "Não consegui validar localização. Fale com suporte"
- **Notas:** Foto + GPS fica como evidência se houver disputa depois. Segurança importante.

---

### F11 — Marcar Serviço Concluído
**Como faxineira que terminou a limpeza, quero marcar o serviço como concluído para que o cliente confirme.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Durante serviço, cronômetro rodando
  - [ ] Botão "Concluído" quando terminar
  - [ ] Clique em "Concluído"
  - [ ] App notifica cliente: "Está tudo certo?"
  - [ ] Faxineira vê status "Aguardando Confirmação"
  - [ ] Chat continua aberto (para qualquer dúvida last-minute)
- **Notas:** Cliente tem até 24h para confirmar, depois app confirma automaticamente. Simples e rápido.

---

### F12 — Responder a Disputa
**Como faxineira acusada de mau trabalho, quero explicar meu lado com texto + fotos, para defesa justa.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Se cliente abre disputa, faxineira recebe notificação
  - [ ] Tela com descrição do cliente + suas fotos
  - [ ] Campo de texto livre: "Sua resposta"
  - [ ] Opção de anexar até 3 fotos (evidência sua)
  - [ ] Botão "Enviar Resposta"
  - [ ] Faxineira tem 24h (cronômetro visível)
  - [ ] Admin analisa em até 48h
  - [ ] Faxineira recebe notificação de decisão (reembolso total, parcial, ou liberado)
- **Notas:** Direito de defesa. Crítico para confiança. Todas as partes são ouvidas.

---

### F13 — Avaliar Cliente
**Como faxineira após serviço, quero dar uma nota 1-5 para o cliente, para feedback da comunidade.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Após confirmação de conclusão, tela de avaliação
  - [ ] Escala 1-5 stars (clicável)
  - [ ] Campo de texto opcional (comentário)
  - [ ] Botão "Enviar avaliação"
  - [ ] Avaliação é oculta até cliente também avaliar OU 72h passarem
- **Notas:** Avaliação é pública. Score interno não é mostrado. Oculto previne retaliação.

---

### F14 — Ver Carteira
**Como faxineira, quero ver meu saldo (dividido entre "a liberar" e "disponível"), para saber quanto posso sacar.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Tela "Minha Carteira"
  - [ ] Mostrar: saldo total, breakdown por status
  - [ ] **"A Liberar"** (D-1 a D+14): serviços concluídos, mas ainda não liberados para saque
  - [ ] **"Disponível"** (D+15+): pode sacar
  - [ ] Exemplo visual: "R$500 a liberar + R$150 disponível = R$650 total"
  - [ ] Tabela de extrato: data, tipo, valor, status
  - [ ] Botão "Solicitar Saque"
- **Notas:** Transparência crítica. Faxineira precisa saber que valor não desapareceu, só está em ciclo D+15.

---

### F15 — Solicitar Saque
**Como faxineira com saldo disponível, quero transferir dinheiro para minha conta via PIX, para receber.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Clique em "Solicitar Saque"
  - [ ] Informe valor (mínimo R$20, máximo disponível)
  - [ ] Chave PIX é pré-preenchida (do cadastro)
  - [ ] Opção de editar chave se necessário
  - [ ] Confirmação: "Será transferido R$XX para a chave PIX registrada"
  - [ ] Botão "Confirmar Saque"
  - [ ] SMS enviado para a chave PIX (segurança)
  - [ ] Saldo muda de "disponível" para "em transferência"
  - [ ] Saque é processado em 1-2 dias úteis (via Asaas)
  - [ ] Notificação quando dinheiro cair na conta
- **Notas:** PIX é automático (sem intermediários). Mínimo R$20 reduz custo de processamento.

---

### F16 — Ver Score de Confiabilidade (Faxineira)
**Como faxineira, quero saber meu score de confiabilidade, para entender se estou em bom pé na plataforma.**

- **Prioridade:** P1
- **Critério de Aceitação:**
  - [ ] Perfil mostra nota média (1-5, pública)
  - [ ] Score interno (0-100) é mostrado (vêem só ela e admin)
  - [ ] Histórico mostra cancelamentos, faltas, disputas, serviços OK
  - [ ] Aviso se score está baixo: "Você está com score de risco. Complete serviços OK para recuperar"
- **Notas:** Score começa em 65. Cai com cancelamentos, faltas, disputas perdidas. Sobe com serviços OK. Importante para reputação.

---

### F17 — Cancelar Serviço (Faxineira)
**Como faxineira que não pode mais fazer um serviço, quero cancelá-lo e notificar o cliente, com penalidade no score.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Botão "Cancelar" disponível até a data do serviço
  - [ ] Campo obrigatório: motivo
  - [ ] Mensagem: "Cancelamento resultará em penalidade no seu score"
  - [ ] Clique em "Confirmar Cancelamento"
  - [ ] Pré-autorização é desfeita (estorno total para cliente)
  - [ ] Cliente recebe notificação
  - [ ] Faxineira sofre penalidade (score cai 5-10 pontos)
- **Notas:** Cancellation ruim. Só permitir com bom motivo. Penalidade é necessária.

---

## Admin

### A1 — Aprovar Faxineira
**Como admin, quero revisar cadastros de faxineiras e aprovar/reprovar com critérios objetivos.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Dashboard "Aprovações Pendentes" (fila com avatar, nome, data)
  - [ ] Clique abre detalhe: fotos (RG, CPF, selfie, comprovante, chave PIX)
  - [ ] Checklist objetiva: doc legível, selfie bate com RG, CPF válido, idade ≥18, comprovante recente
  - [ ] Botão "Aprovar" ou "Reprovar"
  - [ ] Se reprovar: campo obrigatório com motivo (doc ilegível, selfie não bate, CPF irregular, menor de idade)
  - [ ] Notificação enviada (aprovada → pode candidatar; reprovada → pode tentar 1x)
  - [ ] Prazo: responder em até 48h (SLA)
- **Notas:** Critérios objetivos, sem vagueza. Proteção de fraude.

---

### A2 — Acompanhar Pedidos
**Como admin, quero ver todos os pedidos em tempo real (abertos, confirmados, em andamento, concluídos, cancelados), para monitorar saúde do marketplace.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Dashboard "Pedidos" com abas por status
  - [ ] Filtros: data, cidade, cliente, faxineira, tipo de limpeza
  - [ ] Cada pedido mostra: ID, cliente, faxineira, data, valor, status
  - [ ] Clique abre detalhe: timeline completa (criado, pré-auth, candidatas, seleção, chegada, conclusão, confirmação, avaliação)
  - [ ] Alert visual se há problema (pré-auth falhada, disputa aberta, etc.)
- **Notas:** Observabilidade total. Crítico para intervir rápido.

---

### A3 — Resolver Disputas
**Como admin, quero analisar disputas bilaterais e decidir reembolso, proteção, proteção.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Dashboard "Disputas" com fila de abertas
  - [ ] Clique abre detalhe com: versão do cliente (texto + fotos) vs versão da faxineira (texto + fotos)
  - [ ] Timeline do serviço (chegada, GPS, conclusão)
  - [ ] Decisões possíveis: "Reembolso Total", "Reembolso Parcial", "Libera Pagamento"
  - [ ] Admin informa % de reembolso (se parcial)
  - [ ] Justificativa obrigatória (para auditoria)
  - [ ] Botão "Decidir"
  - [ ] SLA: analisar em até 48h
  - [ ] Ambas partes notificadas (cliente e faxineira)
  - [ ] Valor é processado (estorno ou captura) automaticamente
- **Notas:** Justificativa deixa claro o critério. Sem arbitrariedade. Máximo ressarcimento = valor da faxina.

---

### A4 — Gerenciar Financeiro
**Como admin, quero ver comissão arrecadada, taxa de urgência, estornos e saques, para relatório financeiro.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Dashboard "Financeiro" com resumo (período selecionável: dia, semana, mês, ano)
  - [ ] Métricas:
    - Pedidos completados (número + valor bruto)
    - Comissão arrecadada (15% de cada pedido)
    - Taxa de urgência (total + número de vezes acionada)
    - Custo de antecipação absorvido
    - Taxa de processamento (50% app)
    - Estornos (número + valor)
    - Saques processados (número + valor)
  - [ ] Breakdown por cidade (se multi-cidade)
  - [ ] Exportar relatório (CSV, PDF)
- **Notas:** Saúde financeira. Ajuda forecast.

---

### A5 — Gerenciar Tabelas de Preço
**Como admin, quero cadastrar e revisar tabelas de preço por cidade, para ativar/desativar cobertura e sugerir ajustes.**

- **Prioridade:** P0
- **Critério de Aceitação:**
  - [ ] Dashboard "Preços por Cidade"
  - [ ] Lista de cidades: cada uma com tabela (base + adicionais)
  - [ ] Editar tabela: formulário com todos os valores (Studio, 1, 2, 3, 4+ quartos; padrão/pesada; adicionais)
  - [ ] Botão "Ativar" / "Desativar" para cada cidade
  - [ ] Histórico de mudanças (quando mudou, quem mudou)
  - [ ] Coleta de métricas por cidade (pedidos, cancelamentos, taxa de urgência acionada)
  - [ ] Sugestão de ajuste (Fase 2): "Aumentar em 3% baseado em demanda alta" (com aprovação manual)
- **Notas:** MVP é manual. Fase 2 sugere. Fase 3 auto-ajusta.

---

### A6 — Visualizar Score de Confiabilidade
**Como admin, quero monitorar o score de clientes e faxineiras, para identificar problemas e tomar ações (suspensão, etc.).**

- **Prioridade:** P1
- **Critério de Aceitação:**
  - [ ] Dashboard "Score de Confiabilidade"
  - [ ] Abas: "Faxineiras" / "Clientes"
  - [ ] Listar com score, nota média, número de serviços
  - [ ] Filtros: score < 40 (risco), score entre 40-65 (atenção), score > 65 (OK)
  - [ ] Clique abre histórico: cancelamentos, faltas, disputas, serviços OK
  - [ ] Opção "Suspender" (bloqueia candidatura/serviço)
  - [ ] Opção "Avisar" (notificação ao usuário)
- **Notas:** Proteção do marketplace. Score é automático mas admin pode intervir.

---

## Resumo de Prioridades

| User Story | Prioridade | Tipo |
|-----------|-----------|------|
| C1-C15 | P0 (Cliente MVP) | Core |
| F1-F17 | P0 (Faxineira MVP) | Core |
| A1-A5 | P0 (Admin MVP) | Core |
| C16, F16, A6 | P1 | Feature pós-MVP |

**Foco MVP:** funcionalidades P0 apenas. Prioridade P1+ entra na Fase 2 conforme dados validem necessidade.
