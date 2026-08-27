# Moppy — Wireframes (MVP)

Descrição textual clara de cada tela MVP. Layout, componentes, botões, campos, fluxo para próxima tela, estados de erro.

---

## 1. Telas Comuns (Onboarding)

### 1.1 Splash
**Objetivo:** Exibir logo, aguardar checagem de autenticação.

**Layout:**
- Background: Gradiente roxo suave (#A78BFA a #8B7FBE)
- Centro: Logo (gota d'água branca) + nome "Moppy"
- Rodapé: Versão do app

**Componentes:**
- Logo (80x80px)
- Spinner de carregamento

**Estados:**
- Carregando: Spinner ativo
- Erro: Mensagem de conexão, botão "Tentar Novamente"

**Fluxo:** Automaticamente para Login/Cadastro ou Home (se autenticado)

---

### 1.2 Login / Cadastro
**Objetivo:** Autenticar ou criar nova conta com email + senha.

**Layout:**
- Header: "Bem-vindo ao Moppy" (grande) ou "Criar Conta"
- Corpo: 2 campos (email, senha)
- Rodapé: "Criar Conta" (se login) / "Já tem conta? Entrar" (se cadastro)
- Campo de senha: Ícone de olho para mostrar/ocultar
- Validação: email formato, senha ≥8 chars

**Componentes:**
- TextInput: email, placeholder "seu@email.com"
- TextInput: senha, tipo "password", placeholder "Mínimo 8 caracteres"
- Button: "Entrar" / "Criar Conta" (primary)
- Link: "Criar Conta?" / "Já tem conta?" (secondary)
- ErrorText: (vermelho) se falha autenticação

**Estados:**
- Normal
- Loading: Botão desabilitado + spinner
- Error: "Email ou senha inválidos" / "Email já cadastrado"
- Success: Próxima tela carregando

**Fluxo:** 
- Login sucesso → Home (se já escolheu papel)
- Cadastro sucesso → Escolha de Papel

---

### 1.3 Escolha de Papel
**Objetivo:** Usuário seleciona se é Cliente ou Faxineira.

**Layout:**
- Header: "Como você quer usar o Moppy?"
- Corpo: 2 cards grandes (um para cada papel)
  - Card 1: "Sou Cliente" + ícone (casa) + descrição "Contrate faxineiras para sua casa"
  - Card 2: "Sou Faxineira" + ícone (vassoura) + descrição "Ofereça seus serviços"
- Rodapé: Botão "Continuar" (desabilitado até escolher)

**Componentes:**
- SelectableCard: Cliente (com ícone)
- SelectableCard: Faxineira (com ícone)
- Button: "Continuar" (primary)

**Estados:**
- Nenhum selecionado: Botão desabilitado
- Selecionado: Card com border + cor primária, botão ativo

**Fluxo:** 
- Escolhe Cliente → Cadastro Endereço (Cliente)
- Escolhe Faxineira → Cadastro com Documentos (Faxineira)

---

## 2. Telas Cliente

### 2.1 Cadastro Endereço (Cliente)
**Objetivo:** Primeiro endereço de entrega.

**Layout:**
- Header: "Onde você quer que a faxineira vá?"
- Corpo: 5 campos stacked
  - Rua (obrigatório)
  - Número (obrigatório)
  - Bairro (obrigatório)
  - Complemento (opcional: apto, sala, ref. ponto)
  - Cidade (dropdown com tabelas ativas apenas)
- Rodapé: Botão "Continuar" + "Pular" (para depois)

**Componentes:**
- TextInput: rua
- TextInput: número
- TextInput: bairro
- TextInput: complemento (placeholder "Apto 123, sala 201")
- Dropdown: cidade (filtra cidades ativas)
- Button: "Continuar" (primary)
- Button: "Pular" (secondary)

**Validação:**
- Todos obrigatórios exceto complemento
- Cidade deve ter tabela de preço ativa

**Estados:**
- Normal
- Error: "Cidade ainda não atendemos" (se dropdown)
- Loading: Após clique "Continuar"

**Fluxo:** → Salvar Cartão

---

### 2.2 Salvar Cartão (Cliente)
**Objetivo:** Tokenizar cartão via Asaas para futuro checkout.

**Layout:**
- Header: "Seu Cartão de Crédito"
- Corpo: 4 campos
  - Número do cartão (format automático: 1234 5678 9012 3456)
  - Validade (MM/YY, format automático)
  - CVV (3 dígitos, input mask)
  - Titular (nome completo)
- Info: "Seus dados estão 100% seguros. Não guardamos seu CVV"
- Rodapé: Botão "Continuar" + "Fazer depois"

**Componentes:**
- CreditCardInput: número (format automático, máscara)
- TextInput: validade (MM/YY)
- TextInput: CVV (type="number", maxLength 3)
- TextInput: titular
- Button: "Continuar"
- Button: "Fazer depois"
- Badge: Ícone cadeado + "Dados Seguros"

**Validação:**
- Número: Luhn check
- Validade: Mês 1-12, ano futuro
- CVV: 3 ou 4 dígitos
- Titular: nome mínimo 5 chars

**Estados:**
- Normal
- Loading: Após "Continuar" (tokenizando)
- Error: "Cartão inválido" / "Erro na tokenização"

**Fluxo:** → Aceitar Termos

---

### 2.3 Aceitar Termos (Cliente)
**Objetivo:** LGPD + Termos de Uso.

**Layout:**
- Header: "Concordar com os Termos"
- Corpo:
  - Checkbox: "Aceito os Termos de Uso" (link sublinhado)
  - Checkbox: "Aceito a Política de Privacidade" (link sublinhado)
  - Checkbox: "Li e entendo a isenção de responsabilidade" (ex: "App é mediador puro")
- Texto: "Precisa aceitar para continuar"
- Rodapé: Botão "Concordar"

**Componentes:**
- Checkbox: "Termos de Uso" + link
- Checkbox: "Política de Privacidade" + link
- Checkbox: "Isenção de Responsabilidade" + link
- Button: "Concordar" (desabilitado até todos 3 marcados)

**Estados:**
- Nenhum marcado: Botão desabilitado
- Todos marcados: Botão ativo

**Fluxo:** → Home (Cliente)

---

### 2.4 Home (Cliente)
**Objetivo:** Visão geral de próximos pedidos + histórico.

**Layout:**
- Header: "Olá, [Nome]" + Avatar (topo-esquerdo)
  - Ícone engrenagem (Settings) topo-direito
- Abas: "Próximos" / "Histórico" / "Cancelados" (default: Próximos)
- Corpo Próximos:
  - Se vazio: Ilustração + "Crie seu primeiro pedido" + Botão "Criar Pedido"
  - Se com pedidos: CardList
    - Card: data/hora, faxineira, tipo, valor, status (badge)
    - Status: "Aberto" (azul) / "Confirmado" (laranja) / "Em Andamento" (verde) / "Concluído" (cinza)
- Rodapé flutuante: Botão FAB "+" (roxo primário)

**Componentes:**
- TabBar: Próximos, Histórico, Cancelados
- Card (Pedido): data/hora (esquerda), tipo + valor (direita), status badge
- Button: FAB "+" (para criar pedido)
- ErrorBanner: (se offline)

**Fluxo:**
- Clique em card → Detalhe Pedido
- Clique FAB "+" → Criar Pedido Passo 1
- Clique engrenagem → Configurações / Perfil

---

### 2.5 Criar Pedido — Passo 1: Escolher Endereço
**Objetivo:** Selecionar ou criar novo endereço.

**Layout:**
- Header: "Onde fazer a limpeza?" (1/8 ou similar)
- Corpo:
  - Se tem endereços salvos: RadioGroup (cada endereço é um card clicável)
    - Card: endereço completo (texto) + radio button
  - Botão: "Adicionar novo endereço" (secondary)
- Rodapé: Botão "Próximo" (desabilitado até escolher ou criar)

**Componentes:**
- RadioCard: endereço salvado (clicável, seleção exclusiva)
- Button: "Adicionar novo" (secondary)
- Button: "Próximo" (primary, desabilitado)

**Estados:**
- Nenhum selecionado: "Próximo" desabilitado
- Selecionado: Card com radio marcado, "Próximo" ativo
- Criando novo: Modal/Sheet de novo endereço (rua, número, bairro, complemento, cidade)

**Fluxo:** → Passo 2

---

### 2.6 Criar Pedido — Passo 2: Tipo de Limpeza
**Objetivo:** Escolher tipo de serviço.

**Layout:**
- Header: "Que tipo de limpeza?" (2/8)
- Corpo: 3 cards clicáveis (RadioGroup)
  - Card 1: "Limpeza Padrão" + ícone + descrição "Limpeza geral, organizacao"
  - Card 2: "Limpeza Pesada" + ícone + descrição "Desinfecção profunda"
  - Card 3: "Passar Roupa" + ícone + descrição "Passar roupa apenas"
- Rodapé: "Próximo" e "Anterior"

**Componentes:**
- RadioCard: 3 opções de tipo
- Button: "Próximo", "Anterior"

**Fluxo:** → Passo 3

---

### 2.7 Criar Pedido — Passo 3: Tamanho
**Objetivo:** Tamanho da casa.

**Layout:**
- Header: "Qual o tamanho?" (3/8)
- Corpo: 5 cards clicáveis (RadioGroup)
  - "Studio", "1 Quarto", "2 Quartos", "3 Quartos", "4+ Quartos"
- Rodapé: "Próximo" e "Anterior"

**Componentes:**
- RadioCard: 5 tamanhos

**Fluxo:** → Passo 4

---

### 2.8 Criar Pedido — Passo 4: Adicionais
**Objetivo:** Serviços extras opcionais.

**Layout:**
- Header: "Quer adicionar serviços?" (4/8)
- Corpo: 3 checkboxes (multipla seleção)
  - ☐ Banheiros extras (+R$XX)
  - ☐ Área externa, varanda, quintal (+R$XX)
  - ☐ Faxineira leva os produtos (+R$XX)
- Info: "Todas opções são faculdativas"
- Rodapé: "Próximo" e "Anterior"

**Componentes:**
- CheckboxItem: 3 adicionais com preço
- Button: "Próximo", "Anterior"

**Fluxo:** → Passo 5

---

### 2.9 Criar Pedido — Passo 5: Data e Hora
**Objetivo:** Agendar data/hora do serviço.

**Layout:**
- Header: "Quando quer fazer?" (5/8)
- Corpo:
  - DatePicker (ou calendar): próximo dia em diante
  - TimePicker (ou 4 slots: 08:00-10:00 / 10:00-12:00 / 14:00-16:00 / 16:00-18:00)
  - Ou seletor customizado mostrando slots disponíveis por hora
- Rodapé: "Próximo" e "Anterior"

**Componentes:**
- DatePicker / Calendar
- TimePicker (ou slots pré-definidos)
- Button: "Próximo", "Anterior"

**Fluxo:** → Passo 6

---

### 2.10 Criar Pedido — Passo 6: Revisar Preço
**Objetivo:** Mostrar breakdown de custos antes de checkout.

**Layout:**
- Header: "Resumo do Pedido" (6/8)
- Corpo:
  - Card Resumo:
    - "Serviço base" R$XXX.XX
    - "+ Adicionais" R$XX.XX
    - "+ Taxa de serviço (15%)" R$XX.XX
    - "= Total" R$XXX.XX (destacado)
  - Info: "Você será cobrado APÓS o serviço ser concluído"
  - Botão "Entendi" ou "Continuar"
- Rodapé: "Próximo" e "Anterior"

**Componentes:**
- Card com breakdown itemizado
- Button: "Próximo", "Anterior"

**Fluxo:** → Passo 7

---

### 2.11 Criar Pedido — Passo 7: Taxa de Urgência (Opcional)
**Objetivo:** Cliente pode destacar pedido com taxa.

**Layout:**
- Header: "Seu pedido pode demorar mais" (7/8)
- Corpo:
  - Info: "Nenhuma faxineira se candidatou em 48h? Ative a taxa de urgência para destacar"
  - Card não-selecionado: "Sem Taxa" (padrão)
  - Card selecionável: "Taxa Baixa" + R$3,50
  - Card selecionável: "Taxa Média" + R$4,50
  - Card selecionável: "Taxa Alta" + R$5,50
  - Disclaimer: "Taxa não é reembolsável"
  - Novo total exibido dinamicamente
- Rodapé: "Próximo" e "Anterior"

**Componentes:**
- Card "Sem Taxa" (default)
- RadioCard: 3 faixas com preço
- Text dinâmico: "Total: R$XXX.XX"
- Button: "Próximo", "Anterior"

**Fluxo:** → Passo 8 (Checkout)

---

### 2.12 Checkout / Pagamento (Cliente)
**Objetivo:** Confirmar cartão e autorizar pré-autorização.

**Layout:**
- Header: "Finalizar Pagamento" (8/8)
- Corpo:
  - Card do cartão (resumo: últimos 4 dígitos, bandeira)
    - Opção "Usar outro cartão" → Modal de seleção
    - Opção "Adicionar novo" → Formulário
  - Resumo final:
    - Total + taxa de urgência
  - Checkbox: "Confirmo que li os termos e estou ciente de que..."
  - Info: "Pré-autorização será feita D-1. Cobrança após conclusão."
- Rodapé: Botão "Confirmar Pagamento" + "Voltar"

**Componentes:**
- CardPreview (últimos 4 dígitos + bandeira)
- Button: "Usar outro cartão"
- Button: "Adicionar novo"
- Checkbox: Confirmação de termos
- Button: "Confirmar Pagamento" (desabilitado até aceitar)
- Button: "Voltar"

**Estados:**
- Normal: Botão ativo se checkbox marcado
- Loading: Após "Confirmar" — "Processando..."
- Error: "Falha ao processar. Tente novamente"
- Success: "Pedido criado com sucesso!" → Home

**Fluxo:** 
- Confirmar → Pedido entra em "Aberto"
- Pré-auth agendada para D-1
- Volta para Home (aba "Próximos")

---

### 2.13 Home após Criar Pedido (Listando Candidatas)
**Objetivo:** Mostrar faxineiras que se candidataram.

**Layout:**
- Header: "[Tipo] em [Data]" + botão X (fechar / voltar home)
- Status badge: "Aguardando Faxineira" → "1 candidata" → etc
- Corpo:
  - Se nenhuma: "Nenhuma faxineira se candidatou ainda. Aguarde ou ative taxa de urgência"
  - Se com candidatas: CardList
    - Card (Candidata): foto (pequena, circular), nome, nota média (1-5 com stars), distância (km), nº de serviços
    - Clique em card → Detalhe Candidata
    - Botão "Escolher" em cada card (ou clicar no card)
- Rodapé: Botão "Voltar"

**Componentes:**
- Status badge
- Card (Candidata): foto + nome + stars + distância + nº serviços
- Button: "Escolher" (inline em card ou em detalhe)
- Button: "Voltar"

**Estados:**
- Vazio: "Nenhuma candidata"
- Com candidatas: 1+
- Selecionando: Mensagem "Analisando sua seleção..."

**Fluxo:**
- Clique em card → Detalhe Candidata (expandido, com avaliações recentes)
- Clique "Escolher" → Confirmação → Chat ativado

---

### 2.14 Detalhe Candidata (Expandido)
**Objetivo:** Informações completas da faxineira antes de escolher.

**Layout:**
- Header: Nome da faxineira + botão voltar
- Corpo (sheet/modal com scroll):
  - Foto grande (circular, 100x100)
  - Nome + distância
  - Nota média + nº de serviços
  - Seção: "Últimas Avaliações"
    - Card avalação (star + comentário)
    - Card avalação (star + comentário)
  - Seção: "Histórico" (últimos 5 serviços, datas)
- Rodapé: Botão "Escolher" (destaque roxo)

**Componentes:**
- Foto (circular)
- Stars (nota média)
- TextList: avaliações recentes
- TextList: histórico de serviços
- Button: "Escolher" (primary)

**Fluxo:** → Escolhe → Chat

---

### 2.15 Chat (Cliente e Faxineira)
**Objetivo:** Comunicação text-only entre cliente e faxineira.

**Layout:**
- Header: "Chat com [Nome Faxineira]"
- Aviso fixo (topo): "⚠ Pagamento fora do app não tem garantia"
- Corpo: Bubble list
  - Mensagens do cliente (direita, roxo)
  - Mensagens da faxineira (esquerda, cinza)
  - Timestamp em cada mensagem
- Rodapé: InputField (texto) + Botão enviar (ícone avião)

**Componentes:**
- Aviso fixed (banner)
- ChatBubble (Cliente: direita, roxo)
- ChatBubble (Faxineira: esquerda, cinza)
- TextInput: digitação
- Button: enviar (ícone)

**Estados:**
- Normal: Digitando e enviando
- Loading: Botão disabled enquanto envia
- Error: "Falha ao enviar"
- Read receipt: Ícone de leitura (futuro)

**Fluxo:** Chat contínuo até serviço terminar

---

### 2.16 Pedido em Andamento (Cliente)
**Objetivo:** Acompanhar execução do serviço.

**Layout:**
- Header: "Faxineira em Serviço" + [Faxineira: Nome, Foto]
- Status badge: "Em Progresso" (verde)
- Corpo (cards stacked):
  - Card Status:
    - Ícone + "Faxineira confirmou chegada às HH:MM"
    - Ou "Aguardando confirmação de chegada"
    - Ou "Código de 4 dígitos: XXXX" (se cliente gerou)
  - Card Cronômetro (futuro)
    - Hora início + duração esperada
  - Card Chat:
    - Resumo últimas 2-3 mensagens
    - Botão "Ver Chat"
- Rodapé flutuante: Botão "Tudo Certo?" (vermelho, aparece após conclusão)

**Componentes:**
- Status card
- Cronômetro (ou timer simples)
- ChatPreview
- Button: "Ver Chat"
- Button: "Tudo Certo?" (aparece quando faxineira marca concluído)

**Estados:**
- Aguardando chegada: "Confirme a chegada"
- Em andamento: Cronômetro rodando
- Concluído (faxineira): "Está tudo certo?"

**Fluxo:** 
- Botão Chat → Chat completo
- Botão "Tudo Certo?" → Confirmação ou Disputa

---

### 2.17 Confirmação de Conclusão (Cliente)
**Objetivo:** Cliente confirma satisfação ou abre disputa.

**Layout:**
- Header: "Serviço Finalizado"
- Corpo (centered):
  - Emoji grande ou ícone (✓ ou ⚠)
  - Texto: "Está tudo certo?"
  - Botão grande: "Sim, tudo perfeito!" (verde/roxo)
  - Botão grande: "Tive um problema" (vermelho)
  - Info abaixo: "Você tem até 24h para responder"

**Componentes:**
- Icon / Emoji
- Button: "Sim, tudo perfeito!" (primary)
- Button: "Tive um problema" (danger)

**Estados:**
- Normal
- Loading: Após clique (processando pagamento)
- Auto-confirming: "Você não respondeu. Confirmação automática em X horas"

**Fluxo:**
- "Sim" → Avaliação (ambos)
- "Tive um problema" → Abrir Disputa
- Sem resposta 24h → Auto-confirma → Avaliação

---

### 2.18 Abrir Disputa (Cliente)
**Objetivo:** Relatar problema com fotos e descrição.

**Layout:**
- Header: "Reportar Problema"
- Corpo:
  - TextArea: "Descreva o problema" (placeholder)
  - Seção Upload de Fotos:
    - 3 slots vazios (até 3 fotos)
    - Botão "+ Adicionar Foto" (câmera ou galeria)
    - Preview de fotos já adicionadas
  - Info: "Máximo 3 fotos"
- Rodapé: Botão "Enviar Disputa" (vermelho)

**Componentes:**
- TextArea
- ImageUpload (3 slots)
- Button: "Enviar Disputa"

**Estados:**
- Normal: Digitando
- Loading: Após envio
- Success: "Disputa aberta. Aguarde resposta da faxineira (24h)"

**Fluxo:** → Disputa Aberta (aguardando análise)

---

### 2.19 Avaliação (Cliente e Faxineira)
**Objetivo:** Dar nota 1-5 e comentário opcional após serviço.

**Layout:**
- Header: "Avalie [Nome]"
- Corpo:
  - Foto circular do avaliado
  - Stars 1-5 (clicáveis, interativas, preenchimento ao clicar)
  - TextArea: "Deixe seu comentário (opcional)"
- Rodapé: Botão "Enviar Avaliação"

**Componentes:**
- Stars (clicável, 1-5)
- TextArea (opcional)
- Button: "Enviar Avaliação"

**Estados:**
- Normal: Nenhuma star selecionada
- Stars selecionadas: Cor roxo ao passar mouse
- Loading: Após envio
- Success: "Obrigado! Sua avaliação foi registrada" (volta para Home)

**Validação:**
- Pelo menos 1 star obrigatória
- Comentário opcional

**Nota de Produto:** Avaliação fica oculta por 72h ou até ambos avaliarem (previne retaliação).

**Fluxo:** → Histórico (pedido atualizado com status "Avaliado")

---

### 2.20 Histórico de Pedidos (Cliente)
**Objetivo:** Ver pedidos passados.

**Layout:**
- Header: "Histórico" (tab selecionada)
- Corpo:
  - Se vazio: "Você ainda não fez nenhum serviço"
  - Se com pedidos: CardList (scroll)
    - Card: data, faxineira, tipo, valor, stars (se avaliado), status (Concluído)
    - Clique → Detalhe Pedido (readonly)

**Fluxo:** Clique em card → Detalhe Pedido

---

### 2.21 Detalhe Pedido (Readonly - Cliente)
**Objetivo:** Ver todas as informações de um pedido já finalizado.

**Layout:**
- Header: "Pedido #XXXX" + data
- Corpo (scrollável):
  - Card Informações:
    - Endereço
    - Data/hora
    - Tipo + tamanho + adicionais
    - Valor final + taxa de urgência (se ativada)
  - Card Faxineira:
    - Foto + nome + nota
  - Card Timeline:
    - ✓ Pedido criado
    - ✓ Pré-autorização
    - ✓ Faxineira selecionada
    - ✓ Chegada confirmada
    - ✓ Serviço concluído
    - ✓ Pagamento capturado
  - Card Avaliação (se disponível):
    - Stars que cliente deu
    - Comentário
    - Avaliação da faxineira (se disponível)
  - Chat (se houver histórico)

**Componentes:**
- InfoCard
- TimeLine
- RatingCard (readonly)
- ChatHistory

**Fluxo:** Botão voltar → Histórico

---

### 2.22 Perfil & Configurações (Cliente)
**Objetivo:** Editar dados, ver histórico de avaliações, deletar conta.

**Layout:**
- Header: "Perfil"
- Abas: "Dados" / "Cartões" / "Endereços" / "Mais"

**Aba Dados:**
- Nome (editável)
- Email (não editável)
- Telefone (editável)
- Foto de perfil (clicável para trocar)
- Nota média (readonly)

**Aba Cartões:**
- Lista de cartões salvos (últimos 4 dígitos + bandeira)
- Botão "Adicionar Cartão"
- Botão deletar (ícone lixo) em cada

**Aba Endereços:**
- Lista de endereços (checkbox de "preferido")
- Botão "Adicionar" / Botão editar
- Botão deletar (com validação: não deletar se tem pedido ativo)

**Aba Mais:**
- Checkbox: "Receber notificações"
- Checkbox: "Receber ofertas e promoções"
- Link: "Ver Termos de Uso"
- Link: "Ver Política de Privacidade"
- Button: "Deletar Conta" (danger, com confirmação)
- Button: "Sair"

**Componentes:**
- TextInput: nome, telefone
- ImagePicker: foto
- CardList: cartões
- AddressList
- Toggle: notificações

---

### 2.23 Detalhe Pedido Ativo (Cliente)
**Objetivo:** Mostrar pedido quando está "aberto" ou "confirmado" (antes da chegada da faxineira).

**Layout:**
- Header: "Seu Pedido" + status badge
- Resumo: data, hora, endereço, tipo, tamanho
- Se confirmado: card faxineira (foto, nome, nota, distância)
- Botões: "Conversar" / "Cancelar Pedido"
- Rodapé: preço total

**Estados:** Aberto / Confirmado / Carregando

**Fluxo:** "Cancelar" → 2.24; "Conversar" → 2.15

---

### 2.24 Cancelar Pedido (Cliente)
**Objetivo:** Mostrar 3 cenários de cancelamento com regras claras.

**Layout:**
- Header: "Cancelar Pedido?"
- Alerta: "Você está prestes a cancelar este pedido"
- Dinâmico conforme antecedência:

**Cenário 1 - Antes D-1 (Gratuito):**
- "Cancelamento gratuito. Nenhuma cobrança."
- Buttons: "Confirmar" / "Manter"

**Cenário 2 - +12h até D-1 (Estorno 100%):**
- "Você receberá reembolso total em até 2 dias úteis"
- Valor: "Reembolso: R$ [X]"
- Buttons: "Confirmar" / "Manter"

**Cenário 3 - Menos de 12h (Taxa 30%):**
- "Esta ação custará 30% de compensação à faxineira. Confirmar?"
- Valores: "Faxineira recebe: R$ [X]" / "Seu reembolso: R$ [Y]"
- Aviso: "Penalidade: −2 pontos de score"
- Buttons: "Confirmar Cancelamento" (danger) / "Manter"

**Estados:** Normal / Loading / Success / Error

**Fluxo:** "Confirmar" → Processamento → Home (2.4); "Manter" → 2.23

---

## 3. Telas Faxineira

### 3.1 Cadastro com Documentos (Faxineira)
**Objetivo:** Submeter documentos para aprovação.

**Layout:**
- Header: "Cadastre seus Documentos"
- Corpo (scrollável, 5 seções):

**Seção 1: RG**
- Label: "Foto do RG"
- Botão: "Tirar Foto" / "Escolher Galeria"
- Preview da foto (quando adicionada)

**Seção 2: CPF**
- Label: "Documento do CPF"
- Botão: "Tirar Foto" / "Escolher Galeria"
- Input: validar formato (XXX.XXX.XXX-XX)

**Seção 3: Selfie**
- Label: "Sua Selfie (rosto claro, recente)"
- Botão: "Tirar Selfie" (câmera frontal)
- Preview

**Seção 4: Comprovante de Endereço**
- Label: "Comprovante (água, luz, banco) — últimos 90 dias"
- Botão: "Tirar Foto" / "Escolher Galeria"

**Seção 5: Chave PIX**
- Label: "Informe sua chave PIX"
- Input: "CPF / Email / Telefone / Chave Aleatória"
- Validação básica (não verifica existência, MVP)

- Rodapé: Botão "Enviar para Análise" (desabilitado até todos 5 preenchidos)

**Componentes:**
- DocumentUpload: 5 uploads (RG, CPF, selfie, comprovante)
- TextInput: chave PIX
- Button: "Enviar para Análise"

**Estados:**
- Carregando uploads
- Erro em upload (arquivo grande ou formato inválido)

**Fluxo:** → Aguardando Aprovação

---

### 3.2 Aguardando Aprovação (Faxineira)
**Objetivo:** Informar que cadastro está em análise.

**Layout:**
- Corpo (centered):
  - Ícone grande (hourglass / análise)
  - Texto: "Seu Cadastro Está Sendo Analisado"
  - Subtexto: "Prazo: até 48 horas"
  - Info detalhes: "Analisamos: doc legível, selfie batendo, CPF válido, idade ≥18, comprovante recente"
  - "Você receberá uma notificação quando for aprovada"
- Rodapé: Botão "Voltar" (para fazer login de novo, ou ir pro home antes)

**Estados:**
- Aguardando (normal)
- Aprovado → Notificação + transição para Definir Raio de Atuação
- Reprovado → Notificação + opção "Tentar Novamente (1x)"

**Fluxo:** 
- Aprovado → Definir Raio de Atuação
- Reprovado → Retorno ao Cadastro com Documentos (1x apenas)

---

### 3.3 Definir Raio de Atuação (Faxineira)
**Objetivo:** Escolher distância máxima de trabalho.

**Layout:**
- Header: "Sua Área de Atuação"
- Info: "Você receberá pedidos dentro desse raio a partir do seu endereço"
- Corpo:
  - Mapa (ou representação visual) com círculo mostrando raio
  - RadioGroup: 5, 10, 15, 20 km
  - Cada opção com ícone de distância
- Rodapé: Botão "Confirmar"

**Componentes:**
- Map (visual do raio)
- RadioCard: 4-5 opções (5, 10, 15, 20 km)
- Button: "Confirmar"

**Fluxo:** → Home (Faxineira)

---

### 3.4 Home (Faxineira)
**Objetivo:** Visão geral de próximos serviços + histórico + buscar trabalho.

**Layout:**
- Header: "Olá, [Nome]" + Avatar (topo-esquerdo)
  - Ícone engrenagem (Settings) topo-direito
  - Badge com saldo (se aplicável): "R$XXX disponível"
- Abas: "Próximos" / "Histórico"
- Tab Bar (bottom): "Buscar" / "Agenda" / "Carteira" / "Perfil"

**Aba Próximos:**
- Se vazio: "Você ainda não tem serviços agendados"
- Se com serviços: CardList
  - Card: data/hora, cliente, tipo, valor, status
  - Clique → Detalhe Serviço

**Tab "Buscar" (Home padrão):**
- Botão grande: "Buscar Trabalho" → Feed de pedidos

**Fluxo:**
- Clique em card → Detalhe Serviço / Pedido
- Clique "Buscar Trabalho" → Feed de Pedidos
- Clique "Agenda" → Minha Agenda
- Clique "Carteira" → Tela de Carteira
- Clique "Perfil" → Perfil & Configurações

---

### 3.5 Feed de Pedidos (Faxineira)
**Objetivo:** Listar pedidos abertos para se candidatar.

**Layout:**
- Header: "Buscar Trabalho" + Ícone refresh
- Filtros (acima da lista, horizontal scrollável):
  - Botão "Tipo": padrão / pesada / roupa (dropdown)
  - Botão "Tamanho": Studio / 1Q / 2Q / 3Q / 4+Q
  - Botão "Data": próximo dia / futuro
- Corpo: CardList (scroll vertical, pull-to-refresh)
  - Card (Pedido):
    - Tipo + Tamanho
    - Bairro (não endereço completo)
    - Data/Hora
    - Valor bruto (direita)
    - Distância em km (embaixo)
    - Clique → Detalhe Pedido (candidatar)
- Estado vazio: "Nenhum pedido na sua região"

**Componentes:**
- FilterBar (tipo, tamanho, data)
- CardList (pedidos)
- Pull-to-refresh

**Fluxo:** Clique em card → Detalhe Pedido

---

### 3.6 Detalhe Pedido (Faxineira - Antes de Candidatar)
**Objetivo:** Ver todos os detalhes antes de candidatar.

**Layout:**
- Header: "Detalhe do Pedido" + Botão voltar
- Corpo (scrollável):
  - Card Informações:
    - Tipo + Tamanho
    - Bairro (ainda não endereço completo)
    - Data/Hora
    - Adicionais (se houver)
  - Card Preço:
    - Valor bruto
    - Valor líquido (após comissão 15% + taxa 50% + antecipação absorvida)
    - Info: "Isso é exatamente quanto você receberá"
  - Card Cliente:
    - Foto + nome
    - Nota média + nº de serviços
    - Info: "Cliente novo" ou "X serviços completados"
  - Distância: "X km de você"
- Rodapé: Botão "Me Candidatar" (roxo grande)

**Componentes:**
- Card (info)
- Card (preço + breakdown)
- Card (cliente)
- Button: "Me Candidatar"

**Estados:**
- Normal
- Loading: Após candidatura
- Bloqueado (double-booking): "Você já tem serviço nesse horário"

**Fluxo:**
- Clique "Me Candidatar" → Validação → Confirmação → Volta ao Feed
- Bloqueado → Mensagem de erro

---

### 3.7 Minhas Candidaturas (Faxineira)
**Objetivo:** Ver pedidos onde se candidatou.

**Layout:**
- Header: "Minhas Candidaturas"
- Abas: "Aguardando" / "Selecionadas" / "Não Selecionadas"
- Corpo (CardList):
  - Aba "Aguardando": Pedidos onde cliente ainda não escolheu
    - Card: tipo, cliente, valor, data
  - Aba "Selecionadas": Pedidos selecionados (passam para Minha Agenda)
  - Aba "Não Selecionadas": Pedidos onde não foi escolhida (notificação discreta)

**Fluxo:** Clique em card → Detalhe Candidatura

---

### 3.8 Minha Agenda (Faxineira)
**Objetivo:** Ver serviços confirmados organizados cronologicamente.

**Layout:**
- Header: "Minha Agenda"
- Corpo:
  - Se vazio: "Nenhum serviço agendado"
  - Se com serviços: Lista cronológica (próximos dias)
    - Card: data/hora, cliente, tipo, endereço (agora completo), valor
    - Badge de status: "Confirmado" ou "Chegou?" (no dia)
    - Clique → Detalhe Serviço / Executar

**Componentes:**
- CardList (cronológica)
- Badge (status)
- Button: "Cancelar" (long-press ou menu em cada card) — leva para 3.19

**Fluxo:**
- Clique em card → Execução do Serviço (ou Detalhe)
- No dia do serviço → Botão "Cheguei" (confirmação de chegada)
- Long-press card → Opção "Cancelar" (context menu) → 3.19

---

### 3.9 Execução do Serviço — Confirmação de Chegada (Faxineira)
**Objetivo:** Faxineira confirma que chegou no local.

**Cenário 1: Cliente Disponível (Código)**

**Layout:**
- Header: "Confirmação de Chegada"
- Corpo (centered):
  - Ícone grande (localização)
  - Texto: "Cliente será notificado para gerar código"
  - Status: "Aguardando resposta..." (com spinner)
  - Info abaixo: "Timeout em 10 min"
- Rodapé: Botão "Cancelar" (voltar)

Após cliente gerar código:

- Layout muda:
  - Texto: "Digite o código de 4 dígitos que recebeu"
  - Input (numérico, 4 dígitos, formato automático)
  - Botão "Confirmar" (desabilitado até preencher)
- Validação:
  - Código correto → "Chegada confirmada! Cronômetro iniciado"
  - Código errado → "Código incorreto. Tente novamente"

**Cenário 2: Cliente Ausente (GPS + Foto)**

Após 10 min sem resposta:

**Layout muda:**
- Texto: "Cliente não respondeu. Tire uma foto e confirme sua localização"
- 2 Botões grandes:
  - "Tirar Foto da Fachada" (câmera, tirar foto e guardar)
  - "Confirmar Localização" (GPS)
- Status: "GPS: Validando..." ou "GPS: Dentro do raio ✓"

Se GPS + foto OK:
- "Chegada confirmada! Cronômetro iniciado"
- Chat liberado

Se GPS falha:
- "Não consegui validar sua localização. Fale com suporte (WhatsApp Business)"
- Bloqueado

**Componentes:**
- TextInput (4 dígitos)
- ImageCapture (câmera)
- GPS (automático)
- Button: "Confirmar" / "Cancelar"
- StatusBadge (GPS validando)

**Fluxo:** 
- Chegada OK → Serviço em Andamento

---

### 3.10 Serviço em Andamento (Faxineira)
**Objetivo:** Faxineira executa serviço enquanto cronômetro roda.

**Layout:**
- Header: "Serviço em Andamento"
- Corpo:
  - Card Cliente: foto + nome
  - Cronômetro: grande, mostrando tempo decorrido desde confirmação de chegada
  - Info: "Duração esperada: XXh"
  - Chat (botão ou preview)
- Rodapé flutuante: Botão grande "Concluído" (roxo, fica ativo após mínimo 5 min)

**Componentes:**
- Client Preview
- Cronômetro
- ChatPreview + Button "Ver Chat"
- Button: "Concluído" (desabilitado até mínimo tempo)

**Estados:**
- Em andamento: Cronômetro rodando
- Chat aberto: Faxineira pode enviar mensagens

**Fluxo:** Clique "Concluído" → Confirmação Conclusão

---

### 3.11 Confirmação Conclusão (Faxineira)
**Objetivo:** Faxineira marca que terminou.

**Layout:**
- Corpo (centered):
  - Ícone + "Tem certeza que finalizou?"
  - Botão "Sim, finalizei" (verde/roxo)
  - Botão "Continuar trabalhando" (cinza)
- Info: "Cliente será notificado para confirmar"

**Componentes:**
- Button: "Sim, finalizei"
- Button: "Continuar trabalhando"

**Fluxo:**
- "Sim" → Status muda para "Aguardando Confirmação"
- Faxineira vê: "Cliente tem até 24h para confirmar"
- Chat continua aberto

---

### 3.12 Aguardando Confirmação (Faxineira)
**Objetivo:** Faxineira aguarda cliente confirmar.

**Layout:**
- Header: "Aguardando Confirmação"
- Corpo:
  - Status card: "Cliente tem até 24h para confirmar"
  - Cronômetro regressivo: "Falta XXh para auto-confirmação"
  - Chat (para combinar detalhes, se necessário)
- Info: "Após confirmação, você receberá avaliação do cliente"

**Estados:**
- Aguardando
- 12h antes: "Falta pouco!"
- 24h passado: "Serviço confirmado automaticamente"

**Fluxo:**
- Cliente confirma "Sim" → Avaliação
- Cliente abre disputa → Disputa Aberta
- 24h passa → Auto-confirmação → Avaliação

---

### 3.13 Responder Disputa (Faxineira)
**Objetivo:** Faxineira defende seu lado em disputa.

**Layout:**
- Header: "Responder Disputa"
- Corpo (scrollável):
  - Card (Cliente versão):
    - Problema relatado (texto)
    - Fotos anexadas
  - Seção Sua Resposta:
    - TextArea: "Sua explicação"
    - Botão "+ Adicionar Foto" (até 3 fotos)
    - Cronômetro: "Você tem 24h para responder"
- Rodapé: Botão "Enviar Resposta"

**Componentes:**
- ClientDispute (display)
- TextArea
- ImageUpload (3 slots)
- Timer (24h regressivo)
- Button: "Enviar Resposta"

**Fluxo:** → Aguardando Decisão Admin

---

### 3.14 Carteira (Faxineira)
**Objetivo:** Ver saldo quebrado entre "a liberar" e "disponível".

**Layout:**
- Header: "Minha Carteira"
- Corpo (cards stacked):
  - Card Saldo Total (grande):
    - "R$ XXX.XX"
    - Cor clara, destaque
  - Card Breakdown (visual):
    - "R$XXX.XX a liberar (dias D+1 a D+14)"
    - "R$YYY.YY disponível (D+15+)" ← Aqui pode sacar
    - Gráfico visual (barras ou cores)
  - Seção Extrato (tabela):
    - Data | Serviço | Valor | Status
    - Scroll vertical
    - Exemplo: "15/08 | Faxina Padrão | R$125.00 | A liberar"

- Rodapé flutuante: Botão "Solicitar Saque" (roxo)

**Componentes:**
- SaldoCard (total)
- BreakdownCard (visual a liberar vs disponível)
- ExtractTable (tabela com scroll)
- Button: "Solicitar Saque"

**Fluxo:** Clique "Solicitar Saque" → Solicitar Saque

---

### 3.15 Solicitar Saque (Faxineira)
**Objetivo:** Transferir dinheiro via PIX para faxineira.

**Layout:**
- Header: "Solicitar Saque"
- Corpo:
  - Card Info: "Saldo Disponível: R$XXX.XX"
  - Input: "Valor a sacar" (mínimo R$20, máximo disponível)
  - Input: "Chave PIX" (pré-preenchida do cadastro, editável)
  - Info: "Transferência em 1-2 dias úteis via PIX"
  - Checkbox: "Confirmo que esta é minha chave PIX"
- Rodapé: Botão "Confirmar Saque" (desabilitado até confirmar)

**Componentes:**
- NumberInput: valor (min R$20)
- TextInput: chave PIX (com validação básica)
- Checkbox: confirmação
- Button: "Confirmar Saque"

**Estados:**
- Normal
- Validando chave: "Validando chave PIX..."
- Loading: Após "Confirmar"
- Error: "Valor mínimo R$20" / "Chave PIX inválida"
- Success: "Saque solicitado com sucesso! Você receberá uma notificação quando for processado"

**Fluxo:** → Carteira atualizada (saldo muda para "em transferência")

---

### 3.16 Avaliação (Faxineira)
**Objetivo:** Faxineira avalia cliente.

**Layout:** (Idêntico ao da Cliente, mas avaliando cliente)

**Fluxo:** → Histórico

---

### 3.17 Histórico (Faxineira)
**Objetivo:** Ver serviços já concluídos.

**Layout:**
- Header: "Histórico"
- Corpo (CardList):
  - Card: cliente, tipo, data, valor recebido, stars (se avaliado)
  - Clique → Detalhe Serviço (readonly)

**Fluxo:** Clique em card → Detalhe Serviço

---

### 3.18 Perfil & Configurações (Faxineira)
**Objetivo:** Editar dados, deletar conta.

**Layout:**
- Header: "Perfil"
- Abas: "Dados" / "Documentos" / "Mais"

**Aba Dados:**
- Nome (editável)
- Email (não editável)
- Telefone (editável)
- Foto (clicável para trocar)
- Nota média (readonly)

**Aba Documentos:**
- RG (upload/preview)
- CPF (upload/preview)
- Selfie (upload/preview)
- Comprovante (upload/preview)
- Chave PIX (editável)
- Info: "Documentos são armazenados com segurança"

**Aba Mais:**
- Raio de Atuação (seletor)
- Disponibilidade (*(TBD)*)
- Checkbox: "Receber notificações"
- Link: "Ver Termos de Uso"
- Link: "Ver Política de Privacidade"
- Button: "Deletar Conta" (danger)
- Button: "Sair"

---

### 3.19 Cancelar Serviço (Faxineira)
**Objetivo:** Permitir faxineira cancelar com penalidade e campo obrigatório de motivo.

**Layout:**
- Header: "Cancelar Serviço?"
- Alerta vermelho: "Você está prestes a cancelar este serviço"
- Resumo: data, hora, cliente, valor bruto
- Campo obrigatório: Dropdown "Motivo do Cancelamento"
  - "Problema de saúde"
  - "Problema com transporte"
  - "Problema familiar"
  - "Outro (especifique)"
  - Se "Outro": TextInput "Descrever motivo" (texto livre)
- Aviso de penalidade:
  - "Cancelamentos resultam em penalidade de score"
  - Se <12h: "−10 pontos (penalidade severa por last-minute)"
  - Se ≥12h: "−5 pontos (cancelamento com aviso)"
- Checkbox: "Entendo que vou sofrer penalidade de score"
- Buttons: "Confirmar Cancelamento" (danger, desabilitado até checkbox checked) / "Manter Agendado"

**Componentes:**
- AlertBox
- Dropdown: motivo
- TextInput: especificar (condicional)
- Checkbox: confirmação
- Button: Confirm / Cancel

**Estados:**
- Normal
- Checkbox unchecked: botão desabilitado
- Loading: processamento
- Success: "Cancelamento confirmado. Faxineira será notificada."
- Error: "Falha no cancelamento"

**Fluxo:**
- "Confirmar" → Processamento → Minha Agenda (3.8) ou Home (3.4)
- "Manter" → Volta para Minha Agenda (3.8)

---

## 4. Telas Admin (Web)

**Escopo MVP:** 6 telas principais + 2 modais. Sem "Usuários" neste MVP (fase 2+).

### 4.1 Login (Admin)
**Objetivo:** Autenticar admin no painel web.

**Layout:**
- Centered form
- Email + Senha
- Botão "Entrar"
- Rodapé: "Esqueceu a senha?" (Fase 2)

**Fluxo:** → Dashboard

---

### 4.2 Dashboard (Admin)
**Objetivo:** Visão geral de estatísticas e acesso rápido às funcionalidades.

**Layout:**
- Header: "Dashboard" + Avatar admin
- Grid de cards (KPIs):
  - Card 1: "Pedidos Hoje" + número grande
  - Card 2: "Receita do Mês" + R$
  - Card 3: "Taxa de Conclusão" + %
  - Card 4: "Escalações Pendentes" + número
- Menu lateral (sidebar):
  - "Aprovações Pendentes"
  - "Pedidos"
  - "Disputas"
  - "Financeiro"
  - "Preços por Cidade"
  - "Score de Confiabilidade" (*(P1)*)

**Componentes:**
- KPI Cards
- Sidebar menu

**Fluxo:**
- Clique em card ou menu → Seção correspondente

---

### 4.3 Aprovações Pendentes (Admin)
**Objetivo:** Revisar e aprovar/reprovar faxineiras.

**Layout:**
- Header: "Aprovações Pendentes" + contador
- Corpo: CardList
  - Card (Faxineira): avatar + nome + data de submissão + "Ver Documentos"
  - Clique → Detalhe Faxineira
- Se vazio: "Nenhuma aprovação pendente"

**Fluxo:** Clique → Detalhe Faxineira

---

### 4.4 Detalhe Faxineira (Aprovação)
**Objetivo:** Admin analisa documentos e aprova/reprova.

**Layout:**
- Header: "Revisar Cadastro — [Nome Faxineira]"
- Corpo (scrollável):
  - Foto + nome + data
  - Seção 1: RG (foto grande, clicável para ampliar)
  - Seção 2: CPF (foto)
  - Seção 3: Selfie (foto)
  - Seção 4: Comprovante Endereço (foto)
  - Seção 5: Chave PIX (texto)
  - Checklist objetiva (checkboxes):
    - ☐ Documentos legíveis
    - ☐ Selfie bate com RG
    - ☐ CPF válido
    - ☐ Idade ≥18 anos
    - ☐ Comprovante recente (≤90 dias)
- Rodapé: 2 Botões
  - "Aprovar" (verde)
  - "Reprovar" (vermelho, abre campo de motivo)

**Se clicar "Reprovar":**
- Modal/Sheet com:
  - RadioGroup: "Motivo da reprovação"
    - ☐ Documentos ilegíveis
    - ☐ Selfie não bate com RG
    - ☐ CPF irregular
    - ☐ Menor de idade
    - ☐ Outro (campo texto)
  - Botão "Confirmar Reprovação"
  - Notificação automática será enviada à faxineira

**Se clicar "Aprovar":**
- Confirmação simples
- Status muda para "Aprovada"
- Notificação enviada à faxineira
- Admin volta à lista

**Componentes:**
- ImageViewer (fotos)
- Checklist
- Button: "Aprovar" / "Reprovar"
- Modal: Motivo reprovação (se reprovar)

**Fluxo:** → Volta à lista (Aprovações Pendentes)

---

### 4.5 Pedidos (Admin)
**Objetivo:** Acompanhar pedidos em tempo real.

**Layout:**
- Header: "Pedidos" + Filtros
- Filtros (acima da tabela):
  - Dropdown: Status (Abertos / Confirmados / Em Andamento / Concluídos / Cancelados)
  - DateRange picker
  - Dropdown: Cidade
  - TextSearch: Cliente ou Faxineira
- Tabela (scroll horizontal):
  - Colunas: ID | Cliente | Faxineira | Data | Valor | Status | Ações
  - Linha de cada pedido clicável → Detalhe
  - Alert visual se há problema (ícone de exclamação)
- Paginação (se muitos pedidos)

**Componentes:**
- FilterBar (status, data, cidade, busca)
- DataTable
- Pagination

**Fluxo:** Clique em linha → Detalhe Pedido

---

### 4.6 Detalhe Pedido (Admin)
**Objetivo:** Ver timeline completa de um pedido.

**Layout:**
- Header: "Pedido #XXXX" + Status badge
- Corpo (scrollável):
  - Card Info:
    - Cliente (nome, foto, nota)
    - Faxineira (nome, foto, nota)
    - Endereço
    - Data/Hora
    - Tipo + tamanho + adicionais
    - Valor + taxa de urgência
  - Card Timeline:
    - ✓ Pedido criado (data/hora)
    - ✓ Pré-autorização (sucesso/falha)
    - ✓ Candidaturas (lista de candidatas com horários)
    - ✓ Seleção (faxineira escolhida, horário)
    - ✓ Chegada confirmada (método: código ou GPS+foto, hora)
    - ✓ Conclusão (hora)
    - ✓ Confirmação cliente (manual ou automática, hora)
    - ✓ Pagamento capturado (hora)
  - Card Financeiro:
    - Valor bruto
    - Comissão (15%)
    - Taxa processamento
    - Valor faxineira
  - Card Avaliações (se disponível):
    - Cliente avalia: stars + comentário
    - Faxineira avalia: stars + comentário
  - Card Chat (se houver):
    - Últimas mensagens (preview)
    - Botão "Ver Chat Completo"
- Alert visível se:
  - Pré-auth falhou
  - Disputa aberta
  - Cancelamento

**Componentes:**
- InfoCard
- Timeline
- FinanceCard
- RatingCard
- ChatPreview
- Button: "Ver Chat" / "Intervir"

**Fluxo:** Botão voltar → Pedidos

---

### 4.7 Disputas (Admin)
**Objetivo:** Lista de disputas abertas para análise.

**Layout:**
- Header: "Disputas" + contador
- Abas: "Abertas" / "Em Análise" / "Fechadas"
- Tabela:
  - Colunas: ID | Cliente | Faxineira | Abertura | Status | Ações
  - Linha clicável → Detalhe
- Se vazio: "Nenhuma disputa pendente"

**Fluxo:** Clique em linha → Detalhe Disputa

---

### 4.8 Detalhe Disputa (Admin)
**Objetivo:** Admin analisa e decide (reembolso total/parcial ou libera).

**Layout:**
- Header: "Disputa #XXXX" + Status
- Corpo (scrollável, 2 colunas em desktop):

**Coluna 1: Versão do Cliente**
- Texto da reclamação
- Fotos anexadas (gallery)
- Timestamp
- Card Info cliente (nota, histórico)

**Coluna 2: Timeline + Evidências**
- Timeline do serviço:
  - ✓ Pedido criado
  - ✓ Chegada confirmada (foto + GPS se applicable)
  - ✓ Conclusão
- Chat entre cliente e faxineira

**Coluna 3: Versão da Faxineira** (se respondeu)
- Texto da resposta
- Fotos anexadas (gallery)
- Timestamp
- Card Info faxineira (nota, histórico)
- Se não respondeu em 24h: "Faxineira não respondeu no prazo"

**Seção Decisão (admin preenche):**
- RadioGroup: Decisão
  - ☐ Reembolso Total (100% para cliente)
  - ☐ Reembolso Parcial (campos: % para cliente, % para faxineira)
  - ☐ Libera Pagamento (100% para faxineira)
- TextArea: Justificativa (obrigatória)
- Botão: "Decidir" (desabilitado até preencher tudo)

**Nota de Produto:**
- Máximo ressarcimento = valor da faxina
- Qualquer coisa acima é entre as partes (fora do app)

**Componentes:**
- DisputeCard (cliente)
- DisputeCard (faxineira, se respondeu)
- Timeline
- ChatHistory
- RadioGroup (decisão)
- TextArea (justificativa)
- Button: "Decidir"

**Fluxo:**
- Clique "Decidir" → Notificações enviadas a ambas partes
- Valor processado automaticamente
- Volta à lista de Disputas

---

### 4.9 Financeiro (Admin)
**Objetivo:** Relatório financeiro de comissão, taxas, estornos, saques.

**Layout:**
- Header: "Financeiro"
- Filtro: DateRange selector (dia / semana / mês / ano)
- Grid de KPIs:
  - Card: "Pedidos Completados" + número + R$
  - Card: "Comissão Arrecadada (15%)" + R$
  - Card: "Taxa de Urgência" + R$ + número de acionamentos
  - Card: "Custo de Antecipação Absorvido" + R$
  - Card: "Taxa de Processamento (50%)" + R$
  - Card: "Estornos" + número + R$
  - Card: "Saques Processados" + número + R$
- Tabela (abaixo): Breakdown por cidade (se multi-cidade)
  - Colunas: Cidade | Pedidos | Comissão | Urgência | Saques
- Botão: "Exportar CSV" / "Exportar PDF"

**Componentes:**
- DateRange picker
- KPI Cards
- Table
- Button: "Exportar"

**Fluxo:** Exporta relatório

---

### 4.10 Preços por Cidade (Admin)
**Objetivo:** Cadastrar e manter tabelas de preço.

**Layout:**
- Header: "Preços por Cidade"
- Corpo: CardList de cidades
  - Card (Cidade): nome + status (Ativa / Inativa) + botão "Editar" / "Ativar" / "Desativar"
  - Botão "Adicionar Cidade" (topo)

**Fluxo:** Clique "Editar" → Detalhe Tabela de Preço

---

### 4.11 Detalhe Tabela de Preço (Admin)
**Objetivo:** Editar valores de preço para uma cidade.

**Layout:**
- Header: "Preços — [Cidade]"
- Corpo (scrollável, formulário):
  - Seção "Limpeza Padrão":
    - Input: Studio R$
    - Input: 1 Quarto R$
    - Input: 2 Quartos R$
    - Input: 3 Quartos R$
    - Input: 4+ Quartos R$
  - Seção "Limpeza Pesada":
    - (mesmos 5 inputs)
  - Seção "Passar Roupa":
    - (mesmos 5 inputs)
  - Seção "Adicionais":
    - Input: Banheiro Extra R$
    - Input: Área Externa R$
    - Input: Leva Produtos R$
  - Info: "Histórico de mudanças" (tabela com quem mudou e quando)
  - Metrics (se disponível):
    - Pedidos do mês
    - Taxa de urgência acionada
    - Cancelamentos
- Rodapé: Botão "Salvar" + "Ativar" / "Desativar" + "Voltar"

**Componentes:**
- NumberInput (múltiplos)
- HistoryTable (readonly)
- Button: "Salvar", "Ativar", "Desativar"

**Fluxo:** Clique "Salvar" → Volta à lista de Cidades

---

## Estados Transversais

**Loading:** Spinner + mensagem "Aguarde..."
**Error:** Ícone erro + mensagem + botão "Tentar Novamente"
**Empty:** Ilustração + "Nenhum resultado encontrado"
**Offline:** Banner topo "Sem conexão"
**Success:** Toast / Snackbar "Operação realizada com sucesso"

