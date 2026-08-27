# Moppy — 54 Prompts Completos para Claude Designer

**Design System Reference:**
- Primária: Roxo #A78BFA
- Texto Primário: #1F2937 | Secundário: #9CA3AF
- Fundo: #FFFFFF | Surface: #F9FAFB
- Semânticas: Verde #10B981, Vermelho #EF4444, Laranja #F59E0B, Azul #3B82F6
- Tipografia: Inter (Regular 400, Medium 500, Bold 700)
- Espaçamento: 8px system (4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px)
- Border Radius: 4px (inputs), 6px, 8px (cards/buttons), 12px (badges), 50% (avatars)

---

## Tela 1: Splash

**Descrição:** Tela de apresentação inicial exibindo logo e aguardando resultado de autenticação. Layout centralizado com gradiente roxo suave de fundo, gota d'água branca ao centro, texto "Moppy", spinner de carregamento e versão do app no rodapé.

### Componentes
- Background: Gradiente de #A78BFA a #8B7FBE
- Logo circular (80x80px, branca #FFFFFF)
- Texto "Moppy" (Heading 1, 32px Bold, branco)
- Spinner de carregamento (24px, branco)
- Versão do app rodapé (Caption, branco 60% opacity)

### Paleta & Tokens
- Background: Gradiente roxo
- White: #FFFFFF
- Spacing: Centralizado, 24px gaps

### Estados
- Carregando: Spinner ativo (rotação contínua)
- Erro: Mensagem "Falha na conexão" + botão "Tentar Novamente" (vermelho #EF4444)
- Sucesso: Transição automática (fade out)

---

## Tela 2: Login / Cadastro

**Descrição:** Tela de autenticação centralizada com toggle entre Login e Cadastro. Form com email e senha, validações em tempo real, botão principal, link de alternância de modo, e mensagens de erro (vermelho).

### Componentes
- Header: "Bem-vindo ao Moppy" ou "Criar Conta" (Heading 2, 24px Bold, centralizado)
- TextInput Email:
  - Placeholder: "seu@email.com"
  - Label: "Email" (Label 14px)
  - Border: 1px #E5E7EB, focus roxo #A78BFA
  - Validação: "Email inválido" (vermelho #EF4444)
- TextInput Senha:
  - Placeholder: "Mínimo 8 caracteres"
  - Type: password
  - Ícone olho (toggle show/hide)
  - Validação: "Mínimo 8 caracteres"
- Botão Principal:
  - "Entrar" ou "Criar Conta" (primary roxo #A78BFA, 16px, width 100%)
  - Desabilitado se form inválido (cinza)
- Link Alternância (secundário):
  - "Não tem conta? Criar" ou "Já tem conta? Entrar" (Link roxo 14px)
- ErrorBanner (Background #FEE2E2, border left 2px #EF4444):
  - "Email ou senha inválidos" ou "Email já cadastrado" (Body, vermelho)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Error: #EF4444
- Error Bg: #FEE2E2
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 16px input gaps, 20px botão

### Estados
- Normal: Inputs vazios, botão ativo
- Loading: Spinner em botão, "Entrando..."
- Error: Banner vermelho com mensagem
- Success: Transição automática

---

## Tela 3: Escolha de Papel

**Descrição:** Tela de seleção de papéis (Cliente ou Faxineira). 2 cards grandes clicáveis com ícones, descrições e radio selection. Botão "Continuar" desabilitado até escolher. Layout simples e acessível.

### Componentes
- Header: "Como você quer usar o Moppy?" (Heading 2, 24px Bold, centralizado)
- Subtítulo: "Escolha um perfil para começar" (Body, cinza, centralizado)
- SelectableCard 1 — Cliente:
  - Ícone casa (48x48px, roxo #A78BFA)
  - "Sou Cliente" (Label 16px bold)
  - "Contrate faxineiras para sua casa" (Body Small, cinza)
  - Radio button esquerda
  - Hover: background #E9D5FF (roxo light)
  - Selected: border 2px roxo, background light
- SelectableCard 2 — Faxineira:
  - Ícone vassoura (48x48px, roxo)
  - "Sou Faxineira" (Label 16px bold)
  - "Ofereça seus serviços e ganhe" (Body Small, cinza)
  - Radio button esquerda
  - Mesma interação do card anterior
- Botão "Continuar" (primary roxo, 16px, width 100%, desabilitado até escolher)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Primary Light: #E9D5FF
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 32px page, 20px card gaps, 16px padding cards

### Estados
- Nenhum selecionado: Cards normais, botão desabilitado (cinza)
- Selecionado: Card com border roxo, radio marcado, botão ativo

---

## Tela 4: Cadastro Endereço (Cliente)

**Descrição:** Formulário de endereço residencial com 5 campos stacked (rua, número, bairro, complemento, cidade). Validação em tempo real. Botões "Continuar" (primário) e "Pular" (secundário) no rodapé.

### Componentes
- Header: "Onde você quer que a faxineira vá?" (Heading 2, 24px Bold)
- TextInput Rua:
  - Placeholder: "Rua / Avenida"
  - Obrigatório (asterisco vermelho)
  - Border: 1px #E5E7EB, focus roxo
- TextInput Número:
  - Placeholder: "123"
  - Type: number
  - Obrigatório
- TextInput Bairro:
  - Placeholder: "Bairro"
  - Obrigatório
- TextInput Complemento:
  - Placeholder: "Apto 123, sala 201, referência"
  - Opcional (cinza)
- Dropdown Cidade:
  - Label: "Qual cidade?"
  - Options: Apenas cidades com tabelas ativas
  - Obrigatório
  - Error: "Cidade não atendemos ainda" (vermelho #EF4444)
- Botão "Continuar" (primary roxo, 16px, width 100%)
- Botão "Pular" (secondary, 16px, width 100%)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Error: #EF4444
- Border: #E5E7EB
- Surface: #F9FAFB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 12px input gaps, 16px botões

### Estados
- Normal: Inputs vazios (exceto complemento opcional)
- Loading: Spinner ao confirmar
- Error: Mensagem vermelha se cidade inválida
- Success: Transição automática

---

## Tela 5: Salvar Cartão (Cliente)

**Descrição:** Formulário de tokenização de cartão de crédito. 4 campos (número, validade, CVV, titular) com máscaras automáticas, validação Luhn, info segurança, e botões "Continuar" (processando) / "Fazer Depois".

### Componentes
- Header: "Seu Cartão de Crédito" (Heading 2, 24px Bold)
- Badge Segurança:
  - Ícone cadeado (16px, roxo)
  - "Dados 100% Seguros" (Label 12px bold roxo)
- CreditCardInput Número:
  - Placeholder: "1234 5678 9012 3456"
  - Type: text (masked, format automático)
  - Obrigatório
  - Validação: Luhn check
- TextInput Validade:
  - Placeholder: "MM/YY"
  - Format: MM/YY automático
  - Obrigatório
  - Validação: mês 1-12, ano futuro
- TextInput CVV:
  - Placeholder: "123"
  - Type: password (cinza dots)
  - maxLength: 4
  - Obrigatório
- TextInput Titular:
  - Placeholder: "Nome Completo"
  - Obrigatório
  - Validação: mínimo 5 caracteres
- Info: "Não guardamos seu CVV. Tokenização via Asaas." (Body Small, cinza)
- Botão "Continuar" (primary roxo, 16px, width 100%, desabilitado até form válido)
- Botão "Fazer Depois" (secondary, 16px, width 100%)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Error: #EF4444
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 12px input gaps, 16px botões

### Estados
- Normal: Inputs vazios
- Validando: Spinner em número (Luhn check)
- Loading: Spinner ao "Continuar"
- Error: "Cartão inválido" ou "Erro na tokenização" (vermelho)
- Success: Transição automática

---

## Tela 6: Aceitar Termos (Cliente)

**Descrição:** Tela de consentimento LGPD/Termos. 3 checkboxes obrigatórios (Termos, Privacidade, Isenção) com links, info de obrigatoriedade, botão "Concordar" desabilitado até todos marcados.

### Componentes
- Header: "Concordar com os Termos" (Heading 2, 24px Bold)
- Checkbox 1:
  - "Aceito os Termos de Uso" (Label 14px)
  - Link "Termos" (roxo #A78BFA, underline)
- Checkbox 2:
  - "Aceito a Política de Privacidade" (Label 14px)
  - Link "Política" (roxo, underline)
- Checkbox 3:
  - "Li e entendo a isenção de responsabilidade" (Label 14px)
  - Text: "(App é mediador puro, sem garantia de resultado)" (Body Small, cinza)
- Info: "Precisa aceitar todos para continuar" (Body Small, #9CA3AF)
- Botão "Concordar" (primary roxo, 16px, width 100%, desabilitado até todos 3 marcados)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 12px checkbox gaps, 20px botão

### Estados
- Nenhum marcado: Botão desabilitado (cinza #D1D5DB)
- 1-2 marcados: Botão cinza
- Todos 3 marcados: Botão ativo (roxo)
- Loading: Spinner ao confirmar

---

## Tela 7: Home (Cliente)

**Descrição:** Home inicial com abas de pedidos (Próximos/Histórico/Cancelados), card de boas-vindas ou lista de pedidos, FAB flutuante para criar pedido. Header com nome, avatar, settings.

### Componentes
- Header (sticky):
  - "Olá, [Nome]" (Heading 2, 24px Bold, esquerda)
  - Avatar circular (40x40px, topo esquerda)
  - Ícone engrenagem (settings, 24px, topo direita, roxo #A78BFA)
- TabBar (sticky, abaixo header):
  - "Próximos" (ativo default)
  - "Histórico"
  - "Cancelados"
  - Underline animado roxo
- Content:
  - Se vazio (Próximos):
    - Ilustração (150x150px, roxo light)
    - "Crie seu primeiro pedido" (Heading 3, 20px bold)
    - Botão "Criar Pedido" (primary roxo)
  - Se com pedidos:
    - CardList de pedidos:
      - Data/Hora (Label 14px bold)
      - Faxineira (Label 12px) ou "Aguardando"
      - Tipo + Valor (Body Small, roxo bold)
      - Status badge (azul "Aberto", laranja "Confirmado", verde "Em Progresso", cinza "Concluído")
      - Espaçamento: 12px entre cards
- FAB Button (floating):
  - "+" (ícone, branco #FFFFFF)
  - Background: Roxo #A78BFA
  - Position: bottom-right, 60x60px, shadow
  - Action: Create Order flow

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Primary Light: #E9D5FF
- Surface: #F9FAFB
- Border: #E5E7EB
- Info: #3B82F6, Warning: #F59E0B, Success: #10B981
- Text Primary: #1F2937
- Spacing: 24px page, 12px card gaps

### Estados
- Vazio: Ilustração + botão CTA
- Com pedidos: CardList visible
- Tab histórico: Cards com status concluído

---

## Tela 8: Criar Pedido — Passo 1: Escolher Endereço

**Descrição:** Passo 1 de 8. Seleção de endereço com RadioGroup de endereços salvos ou criação de novo via modal. Progresso 1/8, botão "Próximo" desabilitado até selecionar.

### Componentes
- Header: "Onde fazer a limpeza?" (Heading 2, 24px Bold)
- Progresso: "Passo 1/8" (Body Small, cinza)
- RadioGroup (CardList):
  - RadioCard endereço (Background #F9FAFB, border 1px #E5E7EB):
    - Radio button esquerda
    - "Rua X, 123 — Bairro, Cidade" (Body, roxo bold)
    - "Apto 456" (Body Small, cinza, se aplicável)
    - Hover: background light roxo
    - Selected: border 2px roxo #A78BFA
  - Espaçamento: 12px entre cards
- Botão "Adicionar novo endereço" (secondary roxo, 14px, width 100%)
  - Abre modal/bottom sheet com form:
    - Rua, Número, Bairro, Complemento, Cidade (mesmos campos Tela 4)
    - Botões "Salvar" / "Cancelar"
- Botão "Próximo" (primary roxo, 16px, desabilitado até escolher)
- Botão "Anterior" (secondary, 16px, hidden em passo 1 ou disabled)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Primary Light: #E9D5FF
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 12px card gaps, 16px botões

### Estados
- Nenhum selecionado: "Próximo" desabilitado
- Selecionado: Card com border roxo, "Próximo" ativo
- Criando novo: Modal overlay

---

## Tela 9: Criar Pedido — Passo 2: Tipo de Limpeza

**Descrição:** Passo 2 de 8. RadioGroup com 3 tipos de limpeza (Padrão, Pesada, Passar Roupa). Cards grandes com ícones e descrições. Progresso 2/8, botões navegação.

### Componentes
- Header: "Que tipo de limpeza?" (Heading 2, 24px Bold)
- Progresso: "Passo 2/8" (Body Small, cinza)
- RadioCard Limpeza Padrão:
  - Radio button esquerda
  - Ícone vassoura (48x48px, roxo)
  - "Limpeza Padrão" (Label 16px bold)
  - "Limpeza geral, organização" (Body Small, cinza)
  - Border: 1px #E5E7EB, selected 2px roxo
  - Padding: 16px
- RadioCard Limpeza Pesada:
  - (Mesma estrutura)
  - "Limpeza Pesada" + "Desinfecção profunda"
- RadioCard Passar Roupa:
  - (Mesma estrutura)
  - "Passar Roupa" + "Passar roupa apenas"
- Espaçamento: 12px entre cards
- Botão "Anterior" (secondary, 16px)
- Botão "Próximo" (primary roxo, 16px, desabilitado até escolher)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 12px card gaps, 16px botões

### Estados
- Nenhum selecionado: "Próximo" desabilitado
- Selecionado: Card com border roxo

---

## Tela 10: Criar Pedido — Passo 3: Tamanho

**Descrição:** Passo 3 de 8. RadioGroup com 5 tamanhos de casa (Studio, 1Q, 2Q, 3Q, 4+). Cards com labels claros. Progresso 3/8, botões navegação.

### Componentes
- Header: "Qual o tamanho da sua casa?" (Heading 2, 24px Bold)
- Progresso: "Passo 3/8" (Body Small, cinza)
- RadioCard Studio:
  - Radio button esquerda
  - "Studio" (Label 16px bold)
  - Ícone casa (24x24px)
  - Border: 1px #E5E7EB, selected 2px roxo
  - Padding: 16px
- RadioCard 1 Quarto, 2 Quartos, 3 Quartos, 4+ Quartos:
  - (Mesma estrutura)
- Espaçamento: 12px entre cards
- Botão "Anterior" (secondary, 16px)
- Botão "Próximo" (primary roxo, 16px, desabilitado até escolher)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 12px card gaps

### Estados
- Nenhum selecionado: "Próximo" desabilitado
- Selecionado: Card com border roxo

---

## Tela 11: Criar Pedido — Passo 4: Adicionais

**Descrição:** Passo 4 de 8 do fluxo de criação de pedido. Cliente seleciona serviços extras opcionais (banheiros extras, área externa, produtos inclusos). Layout com 3 checkboxes independentes, cada um exibindo o preço adicional. Header indica progresso (4/8) e rodapé tem botões Anterior e Próximo.

### Componentes
- Header com "Quer adicionar serviços?" (Heading 2, 24px Bold)
- Indicador de progresso "Passo 4/8" (Body Small, #9CA3AF)
- 3 CheckboxItems com labels e preços:
  - "Banheiros extras (+R$XX)" 
  - "Área externa, varanda, quintal (+R$XX)"
  - "Faxineira leva os produtos (+R$XX)"
- Texto informativo "Todas opções são faculdativas" (Body Small, cinza)
- Botão "Anterior" (secondary, 16px)
- Botão "Próximo" (primary roxo, 16px)

### Paleta & Tokens
- Background: #FFFFFF
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Primary Roxo: #A78BFA
- Border: #E5E7EB
- Spacing: 24px (page), 16px (padding cards), 12px (gap items), 20px (seções)

### Estados
- Padrão: Nenhum checkbox marcado, Próximo ativo
- Selecionado: Checkboxes com marca e background suave roxo
- Hover: Checkbox com border roxo

---

## Tela 12: Criar Pedido — Passo 5: Data e Hora

**Descrição:** Passo 5 de 8. Cliente seleciona data (DatePicker/Calendar) e hora (4 slots pré-definidos: 08:00-10:00 / 10:00-12:00 / 14:00-16:00 / 16:00-18:00). Header mostra "Quando quer fazer?" e progresso 5/8. Mostrar apenas dias futuros no calendário.

### Componentes
- Header "Quando quer fazer?" (Heading 2, 24px Bold)
- Progresso "Passo 5/8" (Body Small)
- DatePicker/Calendar (mostrar mês/ano, next/prev, destacar hoje, apenas próximos dias)
- RadioGroup com 4 slots de hora:
  - "08:00 — 10:00"
  - "10:00 — 12:00"
  - "14:00 — 16:00"
  - "16:00 — 18:00"
- Info: "Horários disponíveis podem variar por localização" (Body Small, cinza)
- Botão "Anterior" (secondary)
- Botão "Próximo" (primary roxo)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB (calendar background)
- Border: #E5E7EB (calendar grid)
- Text Maximum: #1F2937 (dates)
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Normal: Calendário vazio, slots de hora habilitados
- Data selecionada: Dia destacado com fundo roxo
- Hora selecionada: Slot com radio marcado e background roxo light

---

## Tela 13: Criar Pedido — Passo 6: Revisar Preço

**Descrição:** Passo 6 de 8. Card resumo itemizado mostrando breakdown de custos (serviço base, adicionais, taxa 15%, total). Info destacada que cobrança acontece após conclusão. Layout com números grandes e cores destacadas para o total.

### Componentes
- Header "Resumo do Pedido" (Heading 2, 24px Bold)
- Progresso "Passo 6/8" (Body Small)
- Card Resumo (Background #F9FAFB, border 1px #E5E7EB):
  - "Serviço base" | R$XXX.XX (Body, #1F2937)
  - "+ Adicionais" | R$XX.XX (Body, #9CA3AF)
  - "+ Taxa de serviço (15%)" | R$XX.XX (Body, #9CA3AF)
  - Divider
  - "= Total" | R$XXX.XX (Heading 3, 20px Bold, roxo #A78BFA)
- Info banner: "Você será cobrado APÓS o serviço ser concluído" (Body Small, #9CA3AF)
- Botão "Anterior" (secondary)
- Botão "Próximo" (primary roxo)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Border: #E5E7EB
- Radius: 8px (card)
- Spacing: 24px page, 16px card padding, 12px gaps entre linhas

### Estados
- Normal: Todas as linhas visíveis com valores calculados
- Loading: Spinner ao lado dos valores (futuro)

---

## Tela 14: Criar Pedido — Passo 7: Taxa de Urgência

**Descrição:** Passo 7 de 8. Cliente pode opcionalmente destacar pedido com taxa de urgência (3 faixas: Baixa, Média, Alta) ou manter sem taxa. Cada opção mostra o valor e novo total é atualizado dinamicamente. Disclaimer claro que taxa não é reembolsável.

### Componentes
- Header "Seu pedido pode demorar mais" (Heading 2, 24px Bold)
- Progresso "Passo 7/8" (Body Small)
- Info texto: "Nenhuma faxineira se candidatou em 48h? Ative a taxa de urgência para destacar" (Body, cinza)
- Card "Sem Taxa" (default, selecionado, background roxo light #E9D5FF):
  - Radio button marcado
  - "Sem Taxa — Padrão" (Label, bold)
  - Total destacado ao lado
- 3 RadioCards selecionáveis:
  - "Taxa Baixa — +R$3,50"
  - "Taxa Média — +R$4,50"
  - "Taxa Alta — +R$5,50"
- Info disclaimer: "Taxa não é reembolsável" (Body Small, #F59E0B em background #FEF3C7)
- Dinâmico "Novo Total: R$XXX.XX" (Heading 3, 20px Bold, roxo)
- Botão "Anterior" (secondary)
- Botão "Próximo" (primary roxo)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Primary Light: #E9D5FF
- Warning: #F59E0B
- Warning Background: #FEF3C7
- Text Primary: #1F2937
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Sem Taxa (default): Selecionado com background roxo light
- Taxa selecionada: Radio marcado, card destaque roxo
- Hover: Sem mudança de cor (apenas radio feedback)

---

## Tela 15: Checkout / Pagamento (Cliente)

**Descrição:** Passo 8 de 8. Confirmação final antes de processar pagamento. Cliente revisa cartão tokenizado (últimos 4 dígitos + bandeira), vê resumo final de valores e aceita termos. Layout com card do cartão, resumo de preços e checkbox de confirmação.

### Componentes
- Header "Finalizar Pagamento" (Heading 2, 24px Bold)
- Progresso "Passo 8/8" (Body Small)
- Card Cartão (Background #F9FAFB, border 1px #E5E7EB):
  - Ícone bandeira (Visa/Mastercard)
  - "Cartão terminado em ••••" + últimos 4 dígitos (Body, bold)
  - Botão "Usar outro cartão" (link secundário, 12px)
  - Botão "Adicionar novo" (link secundário, 12px)
- Resumo Preços:
  - "Total do Serviço: R$XXX.XX" (Body)
  - "+ Taxa de Urgência: R$XX.XX" (Body, se ativada)
  - "= Total: R$XXX.XX" (Heading 3, roxo #A78BFA)
- Info: "Pré-autorização será feita D-1. Cobrança após conclusão." (Body Small, cinza)
- Checkbox: "Confirmo que li os termos e estou ciente de que..." (Label 14px)
- Botão "Confirmar Pagamento" (primary roxo, 16px, desabilitado até checkbox)
- Botão "Voltar" (secondary, 16px)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Normal: Cartão exibido, checkbox desmarcado, botão desabilitado (cinza)
- Checkbox marcado: Botão ativo (roxo)
- Loading: "Processando..." com spinner
- Error: "Falha ao processar. Tente novamente" (vermelho #EF4444)

---

## Tela 16: Home após Criar Pedido (Listando Candidatas)

**Descrição:** Tela intermediária após pedido ser criado. Exibe status "Aguardando Faxineira" ou "1 candidata" com cards de candidatas (foto circular, nome, nota em stars, distância, número de serviços). Cada card é clicável para ver detalhe ou escolher.

### Componentes
- Header com título do pedido "[Tipo] em [Data]" (Heading 2, 24px Bold)
- Botão X para fechar (topo direita)
- Badge Status: "Aguardando Faxineira" (Badge, fundo #E9D5FF, text roxo) ou "1 candidata", "2 candidatas"
- CardList de Candidatas:
  - Avatar circular (60x60px, #E5E7EB border)
  - Nome (Label 14px bold)
  - Stars 1-5 (4.5★ exemplo, amarelo #F59E0B)
  - Distância "X km de você" (Body Small, cinza)
  - "Nº serviços: X" (Body Small, cinza)
  - Botão "Escolher" (primary roxo, 12px)
- Estado vazio: Ilustração + "Nenhuma faxineira se candidatou ainda. Aguarde ou ative taxa de urgência" (Body, cinza)
- Botão "Voltar" (secondary)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Primary Light: #E9D5FF
- Warning (stars): #F59E0B
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Border: #E5E7EB
- Spacing: 24px page, 12px card gaps, 16px padding

### Estados
- Vazio: Nenhuma candidata visível
- Com candidatas: 1+ cards visível com hover suave
- Selecionando: Mensagem "Analisando sua seleção..." com spinner

---

## Tela 17: Detalhe Candidata (Expandido)

**Descrição:** Sheet/modal expandido com informações completas da faxineira. Exibe foto grande circular, nome, distância, nota média com stars, seção de últimas avaliações e histórico de serviços. Rodapé com botão "Escolher" destaque roxo.

### Componentes
- Header: Nome da faxineira (Heading 2, 24px Bold) + botão voltar (X)
- Avatar circular (100x100px, #E5E7EB border)
- Nome + Distância:
  - "[Nome]" (Heading 3, 20px bold)
  - "X km de você" (Body Small, cinza)
- Nota Média:
  - "4.5★ de 5" (Label 14px bold)
  - "Baseado em X serviços" (Body Small, cinza)
- Seção "Últimas Avaliações":
  - Card avaliação (background #F9FAFB):
    - "5★ — Excelente trabalho!" (Body)
    - "por [Cliente], há 2 dias" (Caption, cinza)
  - Repetar 2-3 cards
- Seção "Histórico" (últimos 5 serviços):
  - TextList: "15/08 — Limpeza Padrão — 2Q" (Body Small)
  - Repetar 5 linhas
- Botão "Escolher" (primary roxo, 16px, destaque)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Warning (stars): #F59E0B
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Normal: Todas informações visível com scroll
- Loading: Spinner ao carregar avaliações

---

## Tela 18: Chat (Cliente e Faxineira)

**Descrição:** Interface de chat text-only entre cliente e faxineira. Header com nome da faxineira, aviso fixo sobre pagamentos fora do app. Lista de mensagens (bubbles à direita para cliente/roxo, à esquerda para faxineira/cinza) com timestamps. Input de texto + botão enviar no rodapé.

### Componentes
- Header: "Chat com [Nome Faxineira]" (Heading 2, 24px Bold) + botão voltar
- Banner Aviso (fixed topo): "⚠ Pagamento fora do app não tem garantia" (Background #FEF3C7, text #F59E0B)
- Bubble List (scroll):
  - ChatBubble Cliente (direita, fundo roxo #A78BFA, text branco):
    - Texto da mensagem (Body 14px)
    - Timestamp (Caption, branco 60% opacity)
  - ChatBubble Faxineira (esquerda, fundo #F9FAFB, text #1F2937):
    - Texto (Body 14px)
    - Timestamp (Caption, cinza)
- Input Field (bottom):
  - TextInput placeholder "Digite sua mensagem..." (Body 14px)
  - Botão enviar ícone (avião, roxo, 20px)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Warning: #F59E0B
- Warning Bg: #FEF3C7
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- White: #FFFFFF
- Spacing: 16px page, 12px bubble gaps, 8px bubble padding interno

### Estados
- Normal: Digitando e enviando
- Loading: Botão enviar disabled com spinner
- Error: "Falha ao enviar" (vermelho #EF4444)

---

## Tela 19: Pedido em Andamento (Cliente)

**Descrição:** Acompanhamento em tempo real do serviço sendo executado. Exibe foto/nome da faxineira, status "Em Progresso" (badge verde), cards com status de chegada (código ou GPS confirmado), cronômetro, preview de chat. Rodapé com botão "Tudo Certo?" que aparece quando faxineira marca concluído.

### Componentes
- Header: "Faxineira em Serviço" (Heading 2, 24px Bold)
- Card Faxineira (topo):
  - Avatar circular (40x40px)
  - "[Nome Faxineira]" (Label 14px bold)
- Badge Status: "Em Progresso" (Background #D1FAE5, text verde #10B981)
- Card Status Chegada (Background #F9FAFB):
  - Ícone check + "Faxineira confirmou chegada às 14:30" (Body)
  - Ou "Código: XXXX" (Label bold roxo) se cliente gerou
- Card Cronômetro (Background #F9FAFB):
  - Grande timer "00:45" (Display 32px bold)
  - "Duração esperada: 2h" (Body Small, cinza)
- Card Chat Preview:
  - "Últimas mensagens:" (Label 12px, cinza)
  - Últimas 1-2 mensagens (Body Small, cinza)
  - Botão "Ver Chat Completo" (link, roxo 14px)
- Botão "Tudo Certo?" (primary roxo, 16px, aparece após conclusão)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Success: #10B981
- Success Bg: #D1FAE5
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Aguardando chegada: Status "Confirme a chegada" em amarelo
- Em andamento: Cronômetro rodando
- Concluído: Botão "Tudo Certo?" ativo

---

## Tela 20: Confirmação de Conclusão (Cliente)

**Descrição:** Modal/tela simples centrada perguntando se serviço foi executado satisfatoriamente. Emoji/ícone grande (✓), texto "Está tudo certo?" com 2 botões de decisão: verde "Sim, tudo perfeito!" e vermelho "Tive um problema". Info: "Você tem até 24h para responder".

### Componentes
- Ícone grande (✓ ou checkmark, 64px, verde #10B981)
- Título: "Está tudo certo?" (Heading 2, 24px Bold, centralizado)
- Botão "Sim, tudo perfeito!" (primary verde #10B981, 16px, width 100%)
- Botão "Tive um problema" (danger vermelho #EF4444, 16px, width 100%)
- Info: "Você tem até 24h para responder" (Body Small, cinza, centralizado)

### Paleta & Tokens
- Success: #10B981
- Error: #EF4444
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 48px top, 24px entre botões, 16px padding

### Estados
- Normal: Ambos botões ativos
- Loading: Após clique, spinner + "Processando..."
- Auto-confirming: "Você não respondeu. Confirmação automática em Xh" (warning)

---

## Tela 21: Abrir Disputa (Cliente)

**Descrição:** Formulário para relatar problema com serviço. TextArea para descrição (placeholder "Descreva o problema"), seção de upload de fotos (até 3 slots), info "Máximo 3 fotos". Botão "Enviar Disputa" destacado em vermelho.

### Componentes
- Header: "Reportar Problema" (Heading 2, 24px Bold)
- TextArea (full width):
  - Placeholder: "Descreva o problema"
  - Min height: 120px
  - Border: 1px #E5E7EB
  - Padding: 12px
  - Radius: 6px
- Seção Upload Fotos:
  - Label: "Fotos do Problema" (Label 14px bold)
  - 3 slots vazios (preview):
    - Cada slot: 80x80px, border 2px dashed #E5E7EB, ícone câmera centralizado
  - Botão "+ Adicionar Foto" (secondary, 14px)
  - Preview de fotos já adicionadas em grid
- Info: "Máximo 3 fotos" (Caption, cinza)
- Botão "Enviar Disputa" (danger vermelho #EF4444, 16px)

### Paleta & Tokens
- Error: #EF4444
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 12px gaps, 16px padding

### Estados
- Normal: TextArea vazio, slots vazios, botão ativo
- Loading: "Enviando..." com spinner
- Success: "Disputa aberta. Aguarde resposta da faxineira (24h)" (toast)

---

## Tela 22: Avaliação (Cliente e Faxineira)

**Descrição:** Tela simples pós-serviço para dar nota 1-5 (stars clicáveis com preenchimento ao hover) e comentário opcional. TextArea para feedback. Botão "Enviar Avaliação" ao final.

### Componentes
- Header: "Avalie [Nome da Faxineira]" (Heading 2, 24px Bold)
- Avatar circular (80x80px, #E5E7EB border)
- Stars 1-5 (tamanho 40px cada):
  - Vazias inicialmente (cinza #E5E7EB)
  - Ao hover/clique: preenchidas com roxo #A78BFA
  - Indicador "1-5" abaixo (Body Small)
- TextArea (optional):
  - Placeholder: "Deixe seu comentário (opcional)"
  - Min height: 100px
  - Border: 1px #E5E7EB
- Info: "Sua avaliação fica oculta por 72h" (Caption, cinza)
- Botão "Enviar Avaliação" (primary roxo, 16px, desabilitado até star selecionada)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Warning (stars): #F59E0B (quando selecionada)
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 16px gaps, 12px entre elementos

### Estados
- Normal: Nenhuma star selecionada, botão desabilitado
- Hover: Star com roxo ao passar mouse
- Selecionada: Star preenchida com roxo
- Loading: Após envio, spinner

---

## Tela 23: Histórico de Pedidos (Cliente)

**Descrição:** Lista de pedidos já concluídos. Tab "Histórico" ativa. Se vazio, mostra mensagem "Você ainda não fez nenhum serviço". Se com pedidos, CardList com data, faxineira, tipo, valor, stars (se avaliado), status "Concluído".

### Componentes
- Header: "Histórico" (Heading 2, 24px Bold, com tab bar visual ativo)
- CardList (scroll):
  - Card Pedido (Background #F9FAFB, border 1px #E5E7EB):
    - Data/Hora (Body Small, cinza)
    - Avatar + Nome Faxineira (Label 14px bold)
    - Tipo + Valor (Body, roxo #A78BFA)
    - Stars (4.5★, amarelo #F59E0B)
    - Badge Status "Concluído" (verde #10B981)
  - Espaçamento entre cards: 12px
- Estado vazio: Ilustração + "Você ainda não fez nenhum serviço" (Body, cinza)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Success: #10B981
- Warning (stars): #F59E0B
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 12px card gaps

### Estados
- Vazio: Apenas mensagem
- Com pedidos: CardList visible

---

## Tela 24: Detalhe Pedido (Readonly - Cliente)

**Descrição:** Visualização completa de um pedido já finalizado (readonly). Exibe número do pedido, informações (endereço, data/hora, tipo, tamanho, adicionais, valor), card da faxineira, timeline visual (pedido criado → pré-auth → seleção → chegada → conclusão → pagamento), avaliações e chat histórico (se houver).

### Componentes
- Header: "Pedido #XXXX" (Heading 2, 24px Bold) + data (Body Small)
- Card Informações (Background #F9FAFB):
  - "Endereço" | valor (Body)
  - "Data/Hora" | valor
  - "Tipo + Tamanho + Adicionais" | valor
  - "Valor Final" | R$XXX.XX (roxo bold)
  - "Taxa de Urgência" | R$XX.XX (se aplicável)
- Card Faxineira (Background #F9FAFB):
  - Avatar circular + Nome (Label 14px bold)
  - Nota "4.5★" (Label)
- Timeline (vertical):
  - ✓ Pedido criado — 15/08 14:30 (Caption, cinza)
  - ✓ Pré-autorização — 16/08 (Caption)
  - ✓ Faxineira selecionada — 17/08 (Caption)
  - ✓ Chegada confirmada — 18/08 (Caption)
  - ✓ Serviço concluído — 18/08 (Caption)
  - ✓ Pagamento capturado — 19/08 (Caption)
- Card Avaliação (Background #F9FAFB):
  - "Sua avaliação:" | "5★ — Excelente!" (Body)
  - "Avaliação da [Faxineira]:" | "4★ — Bom atendimento" (Body)
- Chat Preview (últimas 3 mensagens em bubbles pequenas)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Success: #10B981
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Normal: Todas informações visible (readonly)

---

## Tela 25: Perfil & Configurações (Cliente)

**Descrição:** Tela com abas: "Dados" / "Cartões" / "Endereços" / "Mais". Aba Dados: campos editáveis (nome, telefone), foto, nota média. Aba Cartões: lista com últimos 4 dígitos, botão adicionar. Aba Endereços: lista com radio "preferido", edit/delete. Aba Mais: notificações, termos, deletar conta.

### Componentes
**Aba Dados:**
- Header "Perfil" (Heading 2, 24px Bold)
- Avatar circular (100x100px, clicável)
- TextInput: Nome (Label "Nome", Border 1px #E5E7EB, Padding 12px)
- TextInput: Email (disabled, cinza)
- TextInput: Telefone (editável)
- Text Nota Média: "4.5★ de 5" (Label bold roxo)

**Aba Cartões:**
- CardList:
  - Card (Background #F9FAFB): Ícone bandeira + "••••8765" + "Expira 12/26" (Body Small)
  - Botão delete (ícone lixo, 16px)
- Botão "Adicionar Cartão" (secondary)

**Aba Endereços:**
- CardList:
  - Card: Radio checkbox + "Rua X, 123, Bairro" (Body)
  - Botão edit (ícone lápis)
  - Botão delete (ícone lixo)
- Botão "Adicionar" (secondary)

**Aba Mais:**
- Toggle: "Receber notificações" (Label 14px)
- Toggle: "Receber ofertas" (Label 14px)
- Link: "Ver Termos de Uso" (Body, roxo #A78BFA)
- Link: "Ver Política de Privacidade" (Body, roxo)
- Botão "Deletar Conta" (danger vermelho #EF4444)
- Botão "Sair" (secondary)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Error: #EF4444
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Dados: Inputs editáveis ao clique
- Cartões: Swipe para deletar (mobile) ou botão delete
- Endereços: Checkradio "preferido" exclusivo

---

## Tela 26: Detalhe Pedido Ativo (Cliente)

**Descrição:** Visão de um pedido no estado "Aberto" ou "Confirmado" (antes da faxineira chegar). Exibe resumo com data, hora, endereço, tipo, tamanho, preço total. Se confirmado, mostra card da faxineira selecionada (foto, nome, nota). Botões "Conversar" e "Cancelar Pedido".

### Componentes
- Header: "Seu Pedido" (Heading 2, 24px Bold) + status badge (azul "Aberto" ou laranja "Confirmado")
- Card Resumo (Background #F9FAFB):
  - Data/Hora (Body)
  - Endereço (Body)
  - Tipo + Tamanho (Body)
  - Preço Total (Heading 3 roxo #A78BFA)
- Card Faxineira (se confirmado, Background #F9FAFB):
  - Avatar circular (50x50px)
  - Nome (Label 14px bold)
  - Nota "4.5★" (Label)
  - Distância "2.5 km" (Body Small, cinza)
- Botão "Conversar" (primary roxo, 16px)
- Botão "Cancelar Pedido" (danger vermelho #EF4444, 16px)
- Preço total rodapé (sticky): "Total: R$XXX.XX" (Label 14px bold)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Error: #EF4444
- Info: #3B82F6 (status "Aberto")
- Warning: #F59E0B (status "Confirmado")
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Aberto: Faxineira card hidden
- Confirmado: Faxineira card visible

---

## Tela 27: Cancelar Pedido (Cliente)

**Descrição:** Modal/sheet mostrando 3 cenários de cancelamento com regras claras. Cenário 1 (Antes D-1): Gratuito. Cenário 2 (+12h até D-1): Estorno 100%. Cenário 3 (Menos de 12h): Taxa 30% de compensação com valores desagregados. Cada com botões "Confirmar" / "Manter".

### Componentes
**Layout comum:**
- Header: "Cancelar Pedido?" (Heading 2, 24px Bold)
- Alert banner (Background #FEE2E2, border 2px left #EF4444):
  - "Você está prestes a cancelar este pedido" (Body, vermelho #EF4444)

**Cenário 1 (Gratuito):**
- Text: "Cancelamento gratuito. Nenhuma cobrança." (Body)
- Buttons: "Confirmar" (danger) / "Manter" (secondary)

**Cenário 2 (Estorno 100%):**
- Text: "Você receberá reembolso total em até 2 dias úteis" (Body)
- Value: "Reembolso: R$ XXX.XX" (Heading 3, verde #10B981)
- Buttons: "Confirmar" / "Manter"

**Cenário 3 (Taxa 30%):**
- Alert vermelho: "Esta ação custará 30% de compensação à faxineira. Confirmar?" (Body, vermelho)
- Values:
  - "Faxineira recebe: R$ XXX.XX" (Body)
  - "Seu reembolso: R$ XXX.XX" (Body)
- Warning: "Penalidade: −2 pontos de score" (Body Small, #F59E0B)
- Buttons: "Confirmar Cancelamento" (danger) / "Manter"

### Paleta & Tokens
- Error: #EF4444
- Error Bg: #FEE2E2
- Success: #10B981
- Warning: #F59E0B
- Text Primary: #1F2937
- Spacing: 24px padding, 16px gaps, 12px entre valores

### Estados
- Normal: Valores calculados dinamicamente
- Loading: Spinner ao confirmar
- Success: Toast "Cancelamento realizado"

---

## Tela 28: Cadastro com Documentos (Faxineira)

**Descrição:** Formulário longo com 5 seções para submeter documentos: RG (foto), CPF (foto + validação XXX.XXX.XXX-XX), Selfie, Comprovante Endereço (últimos 90 dias), Chave PIX. Cada seção tem upload com preview. Rodapé com botão "Enviar para Análise" (desabilitado até todos preenchidos).

### Componentes
- Header: "Cadastre seus Documentos" (Heading 2, 24px Bold)
- Seção RG:
  - Label: "Foto do RG (frente e verso)" (Label 14px bold)
  - Botão: "Tirar Foto / Escolher Galeria" (secondary, 14px)
  - Preview: 120x80px, placeholder imagem
- Seção CPF:
  - Label: "Documento do CPF" (Label 14px bold)
  - TextInput: CPF com format XXX.XXX.XXX-XX (placeholder "000.000.000-00")
  - Botão upload (secondary)
  - Preview (120x80px)
- Seção Selfie:
  - Label: "Sua Selfie (rosto claro, recente)" (Label 14px bold)
  - Botão: "Tirar Selfie" (câmera frontal, secondary)
  - Preview circular (100x100px)
- Seção Comprovante:
  - Label: "Comprovante de Endereço (água, luz, banco — últimos 90 dias)" (Label 14px bold)
  - Botão upload (secondary)
  - Preview (120x80px)
- Seção Chave PIX:
  - Label: "Informe sua chave PIX" (Label 14px bold)
  - Dropdown: "CPF / Email / Telefone / Chave Aleatória"
  - TextInput: valor da chave (placeholder "seu@email.com")
  - Validação: "Chave PIX inválida" (error vermelho #EF4444)
- Botão "Enviar para Análise" (primary roxo, 16px, desabilitado até todos preenchidos)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Error: #EF4444
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 16px seções, 12px gaps

### Estados
- Normal: Alguns uploads vazios, botão desabilitado (cinza)
- Todas preenchidas: Botão ativo (roxo)
- Loading: Spinner ao enviar
- Error: "Arquivo muito grande" ou "Formato inválido" (vermelho)

---

## Tela 29: Aguardando Aprovação (Faxineira)

**Descrição:** Tela simples de holding enquanto cadastro é analisado. Ícone grande (hourglass), texto "Seu Cadastro Está Sendo Analisado", subtexto "Prazo: até 48 horas", lista de critérios verificados, info sobre notificação futura. Botão "Voltar" para relogar.

### Componentes
- Ícone grande (hourglass, 64px, #A78BFA)
- Título: "Seu Cadastro Está Sendo Analisado" (Heading 2, 24px Bold, centralizado)
- Subtítulo: "Prazo: até 48 horas" (Body, #9CA3AF)
- Lista de critérios (Body Small, cinza):
  - "✓ Documentos legível"
  - "✓ Selfie batendo"
  - "✓ CPF válido"
  - "✓ Idade ≥18 anos"
  - "✓ Comprovante recente"
- Info: "Você receberá uma notificação quando for aprovada" (Body, #9CA3AF)
- Botão "Voltar" (secondary, 16px)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 48px top, 24px gaps, centralizado

### Estados
- Aguardando: Normal
- Aprovado: Transição para Definir Raio (automática com notificação)
- Reprovado: Mensagem de erro + opção "Tentar Novamente"

---

## Tela 30: Definir Raio de Atuação (Faxineira)

**Descrição:** Tela para escolher distância máxima de trabalho (5, 10, 15, 20 km). Exibe mapa visual ou representação círculo mostrando raio. RadioGroup com 4-5 opções. Info: "Você receberá pedidos dentro desse raio a partir do seu endereço". Botão "Confirmar" ao final.

### Componentes
- Header: "Sua Área de Atuação" (Heading 2, 24px Bold)
- Info: "Você receberá pedidos dentro desse raio a partir do seu endereço" (Body, cinza)
- Visualização do Raio (simplified):
  - Círculo com representação (SVG/Canvas ou imagem)
  - Marcador central (ponto azul, você)
  - Raio externo (linha tracejada, roxo #A78BFA)
- RadioGroup (4 opções):
  - "5 km" (Label 14px)
  - "10 km" (Label 14px, default selecionado)
  - "15 km" (Label 14px)
  - "20 km" (Label 14px)
- Botão "Confirmar" (primary roxo, 16px)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Info: #3B82F6 (marcador)
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 16px gaps

### Estados
- Normal: 10 km default selecionado
- Selecionado: Radio marcado com roxo

---

## Tela 31: Home (Faxineira)

**Descrição:** Home da faxineira com header "Olá, [Nome]" + avatar, ícone engrenagem (settings), badge saldo. Abas "Próximos" / "Histórico". Tab bar bottom: "Buscar" / "Agenda" / "Carteira" / "Perfil". Por padrão mostra "Buscar Trabalho" ou lista de próximos serviços.

### Componentes
- Header (sticky):
  - "Olá, [Nome]" (Heading 2, 24px Bold)
  - Avatar circular (40x40px, topo esquerdo)
  - Ícone engrenagem topo direito (settings, 24px)
  - Badge saldo: "R$XXX disponível" (Label 12px, fundo roxo light #E9D5FF, text roxo)
- Tab Bar topo (ou abas):
  - "Próximos" / "Histórico"
- Content:
  - Se Próximos vazio: "Você ainda não tem serviços agendados" (Body, cinza)
  - Se com serviços: CardList
    - Card: data/hora, cliente, tipo, valor, status
- Tab Bar bottom (mobile):
  - "Buscar" (ícone busca, roxo se ativo)
  - "Agenda" (ícone calendário)
  - "Carteira" (ícone carteira)
  - "Perfil" (ícone perfil)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Primary Light: #E9D5FF
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 12px card gaps

### Estados
- Vazio: Mensagem com botão "Buscar Trabalho"
- Com serviços: CardList visible

---

## Tela 32: Feed de Pedidos (Faxineira)

**Descrição:** Lista de pedidos abertos para se candidatar. Header "Buscar Trabalho" + ícone refresh. Filtros horizontais (Tipo, Tamanho, Data). CardList com scroll vertical, pull-to-refresh. Cards mostram tipo, tamanho, bairro, data/hora, valor, distância. Click em card leva para detalhe.

### Componentes
- Header: "Buscar Trabalho" (Heading 2, 24px Bold) + ícone refresh (24px, roxo)
- FilterBar (horizontal scroll):
  - Botão "Tipo" dropdown (Padrão / Pesada / Roupa)
  - Botão "Tamanho" (Studio / 1Q / 2Q / 3Q / 4+)
  - Botão "Data" (Próximo dia / Futuro)
  - Botão "Limpar" (secondary, se filtros aplicados)
- CardList (vertical scroll, pull-to-refresh):
  - Card Pedido (Background #F9FAFB, border 1px #E5E7EB):
    - "Limpeza Padrão — 2 Quartos" (Label 14px bold)
    - "Bairro: Pinheiros" (Body Small, cinza)
    - "18/08 — 14:00" (Body Small)
    - "R$120.00" (Heading 3, roxo #A78BFA, direita)
    - "2.5 km" (Body Small, cinza, embaixo)
  - Espaçamento: 12px entre cards
- Estado vazio: "Nenhum pedido na sua região" (Body, cinza, centrado)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 12px card gaps, 8px filter gaps

### Estados
- Carregando: Skeleton cards
- Vazio: Mensagem com ícone
- Filtros aplicados: Botão "Limpar" visible

---

## Tela 33: Detalhe Pedido (Faxineira - Antes de Candidatar)

**Descrição:** Visão completa de um pedido antes de se candidatar. Cards com informações (tipo, tamanho, bairro, data/hora, adicionais), preço breakdown (bruto, comissão, taxa, valor líquido), card do cliente (foto, nome, nota, histórico). Distância em km. Botão "Me Candidatar" grande e destacado ao final.

### Componentes
- Header: "Detalhe do Pedido" (Heading 2, 24px Bold) + botão voltar
- Card Informações (Background #F9FAFB):
  - "Tipo + Tamanho" (Body)
  - "Bairro" (Body)
  - "Data e Hora" (Body)
  - "Adicionais:" lista (Body Small, cinza)
- Card Preço (Background #F9FAFB):
  - "Valor bruto: R$XXX.XX" (Body)
  - "− Comissão (15%): R$XX.XX" (Body Small, cinza)
  - "− Taxa (50%): R$XX.XX" (Body Small, cinza)
  - "= Valor líquido: R$XXX.XX" (Heading 3, roxo #A78BFA, bold)
  - Info: "Isso é exatamente quanto você receberá" (Caption, cinza)
- Card Cliente (Background #F9FAFB):
  - Avatar circular (50x50px)
  - Nome + nota "4.5★" (Label 14px bold + Label 12px)
  - "Cliente novo" ou "X serviços completados" (Body Small, cinza)
- Distância: "2.5 km de você" (Body, cinza)
- Botão "Me Candidatar" (primary roxo, 16px, full width)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Normal: Todos cards visible
- Loading: Spinner ao candidatar
- Bloqueado: "Você já tem serviço nesse horário" (error banner vermelho #EF4444)

---

## Tela 34: Minhas Candidaturas (Faxineira)

**Descrição:** Abas "Aguardando" / "Selecionadas" / "Não Selecionadas". Cada aba com CardList dos pedidos correspondentes. Cards mostram tipo, cliente, valor, data. Click leva para detalhe da candidatura.

### Componentes
- Header: "Minhas Candidaturas" (Heading 2, 24px Bold)
- Tab Bar (sticky):
  - "Aguardando" (ativo por default)
  - "Selecionadas"
  - "Não Selecionadas"
- CardList:
  - Card (Background #F9FAFB):
    - "Limpeza Padrão" (Label 14px bold)
    - "Cliente: [Nome]" (Body Small)
    - "R$120.00" (Heading 3, roxo)
    - "18/08 — 14:00" (Body Small, cinza)
  - Espaçamento: 12px
- Estados vazios por aba: "[Aba] vazia" (Body, cinza)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 12px card gaps

### Estados
- Aguardando: Cards mostram pedidos aguardando decisão
- Selecionadas: Cards com badge verde "Selecionada"
- Não Selecionadas: Cards com badge cinza "Não Selecionada"

---

## Tela 35: Minha Agenda (Faxineira)

**Descrição:** Lista cronológica de serviços confirmados. Se vazio, mostra "Nenhum serviço agendado". Cards mostram data/hora, cliente, tipo, endereço completo, valor. Badge de status "Confirmado" ou "Chegou?" (no dia do serviço). Long-press ou menu contextual para cancelar.

### Componentes
- Header: "Minha Agenda" (Heading 2, 24px Bold)
- CardList (cronológica):
  - Card Serviço (Background #F9FAFB):
    - Data/Hora "18/08 — 14:00" (Label 14px bold)
    - "Cliente: [Nome]" (Body Small)
    - "Tipo: Limpeza Padrão — 2 Quartos" (Body Small)
    - "Endereço completo" (Body Small, cinza)
    - "R$120.00" (Heading 3, roxo, direita)
    - Badge Status: "Confirmado" (fundo azul #DBEAFE, text #3B82F6) ou "Chegou?" (fundo amarelo #FEF3C7, text #F59E0B)
  - Menu context (long-press): Botão "Cancelar" (danger vermelho)
- Estado vazio: "Nenhum serviço agendado" (Body, cinza)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Info: #3B82F6
- Warning: #F59E0B
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 12px card gaps

### Estados
- Vazio: Mensagem
- Com serviços: Cronológico, selecionável
- No dia: Badge "Chegou?" aparece

---

## Tela 36: Execução do Serviço — Confirmação de Chegada (Faxineira)

**Descrição:** Modal/tela de confirmação de chegada com 2 cenários. Cenário 1: Cliente disponível, gera código de 4 dígitos que faxineira digita. Cenário 2 (após 10 min sem resposta): Tirar foto da fachada + validar GPS. Layout com spinners de status, inputs condicionais, botões de ação.

### Componentes
**Cenário 1 (Aguardando Código):**
- Header: "Confirmação de Chegada" (Heading 2, 24px Bold)
- Ícone localização (64px, roxo #A78BFA)
- Texto: "Cliente será notificado para gerar código" (Body, centralizado)
- Status: "Aguardando resposta..." (Body Small, cinza, com spinner)
- Info: "Timeout em 10 min" (Caption, cinza)
- Botão "Cancelar" (secondary)

**Cenário 1 Código Recebido:**
- Texto: "Digite o código de 4 dígitos que recebeu" (Body)
- TextInput numérico: 4 slots, auto-advance entre slots (Input 48x48px cada)
- Botão "Confirmar" (primary roxo, desabilitado até preencher)
- Validação: Sucesso verde "Chegada confirmada! Cronômetro iniciado" ou Erro vermelho "Código incorreto. Tente novamente"

**Cenário 2 (Cliente Ausente):**
- Texto: "Cliente não respondeu. Tire uma foto e confirme sua localização" (Body)
- Botão: "Tirar Foto da Fachada" (secondary, 14px)
- Botão: "Confirmar Localização (GPS)" (secondary, 14px)
- StatusBadge: "GPS: Validando..." (cinza) ou "GPS: Dentro do raio ✓" (verde #10B981)
- Se falha GPS: Alert "Não consegui validar sua localização. Fale com suporte (WhatsApp Business)" (vermelho #EF4444)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Success: #10B981
- Error: #EF4444
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 16px gaps, 12px entre inputs

### Estados
- Aguardando: Spinner ativo
- Código recebido: Inputs numéricos visible
- GPS validando: Status badge com spinner
- Sucesso: Mensagem verde com checkmark

---

## Tela 37: Serviço em Andamento (Faxineira)

**Descrição:** Tela que mostra o serviço em execução. Card do cliente (foto, nome), cronômetro grande mostrando tempo decorrido, duração esperada, preview de chat com botão "Ver Chat". Rodapé flutuante com botão "Concluído" que fica ativo após mínimo 5 minutos.

### Componentes
- Header: "Serviço em Andamento" (Heading 2, 24px Bold)
- Card Cliente (Background #F9FAFB):
  - Avatar circular (40x40px)
  - "[Nome do Cliente]" (Label 14px bold)
- Cronômetro (grande, topo):
  - Número grande "00:45" (Display 48px bold, roxo #A78BFA)
  - Unidade "minutos decorridos" (Body Small, cinza)
- Info:
  - "Duração esperada: 2h" (Body Small, cinza)
- Chat Preview (Background #F9FAFB, border 1px #E5E7EB):
  - Label: "Últimas mensagens" (Label 12px, cinza)
  - Preview bubbles: "Olá, tudo bem?" / "Sim, tudo certo!" (Body Small, 1-2 linhas)
  - Botão "Ver Chat Completo" (link roxo, 14px)
- Botão "Concluído" (primary roxo, 16px, full width, sticky bottom, desabilitado até 5 min)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Primeiros 5 min: Botão "Concluído" desabilitado (cinza)
- Após 5 min: Botão ativo (roxo)
- Chat aberto: Preview hidden

---

## Tela 38: Confirmação Conclusão (Faxineira)

**Descrição:** Modal simples perguntando "Tem certeza que finalizou?". Ícone checkmark, 2 botões: "Sim, finalizei" (verde/roxo) e "Continuar trabalhando" (cinza). Info: "Cliente será notificado para confirmar".

### Componentes
- Ícone checkmark (64px, verde #10B981)
- Título: "Tem certeza que finalizou?" (Heading 2, 24px Bold, centralizado)
- Info: "Cliente será notificado para confirmar" (Body Small, cinza)
- Botão "Sim, finalizei" (primary verde #10B981, 16px, full width)
- Botão "Continuar trabalhando" (secondary cinza, 16px, full width)

### Paleta & Tokens
- Success: #10B981
- Surface: #F9FAFB
- Text Primary: #1F2937
- Spacing: 48px vertical, 16px entre botões, centralizado

### Estados
- Normal: Ambos botões ativos
- Confirmando: Spinner ao clicar "Sim"

---

## Tela 39: Aguardando Confirmação (Faxineira)

**Descrição:** Tela que mostra faxineira aguardando confirmação do cliente (até 24h). Card de status com cronômetro regressivo "Falta XXh para auto-confirmação", info sobre avaliação futura. Chat contínuo disponível. Layout simples e clara.

### Componentes
- Header: "Aguardando Confirmação" (Heading 2, 24px Bold)
- Card Status (Background #F9FAFB):
  - "Cliente tem até 24h para confirmar" (Body)
  - Cronômetro regressivo "Falta 18h para auto-confirmação" (Heading 3, roxo #A78BFA)
  - "Se não responder, o serviço será confirmado automaticamente" (Body Small, cinza)
- Info: "Após confirmação, você receberá avaliação do cliente" (Body Small, cinza)
- Chat Section (abaixo):
  - Label: "Chat com [Cliente]" (Label 14px bold)
  - Chat preview ou "Ver Chat" (link roxo)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 16px cards

### Estados
- Aguardando: Cronômetro regressivo
- 12h antes: Texto "Falta pouco!" (warning)
- 24h passado: "Serviço confirmado automaticamente" (verde #10B981)

---

## Tela 40: Responder Disputa (Faxineira)

**Descrição:** Modal/sheet para faxineira responder a disputa aberta. Exibe problema relatado pelo cliente (texto + fotos), seção "Sua Resposta" com TextArea, botão para adicionar até 3 fotos de defesa, cronômetro "24h para responder". Botão "Enviar Resposta" ao final.

### Componentes
- Header: "Responder Disputa" (Heading 2, 24px Bold)
- Card Cliente Versão (Background #FEE2E2, border 1px #EF4444):
  - "Problema relatado:" (Label 14px bold)
  - Texto da reclamação (Body Small)
  - Fotos (gallery, até 3 imagens 80x80px em grid)
  - Timestamp (Caption, cinza)
- Seção Sua Resposta:
  - TextArea placeholder: "Sua explicação" (Body, 120px min)
  - Label: "+ Adicionar Foto" (link roxo, 14px, até 3 fotos)
  - Preview fotos em grid (80x80px)
- Timer (card Background #FEF3C7):
  - "Você tem 24h para responder" (Body Small, #F59E0B)
  - Cronômetro: "Falta 20h" (Label bold)
- Botão "Enviar Resposta" (primary roxo, 16px)

### Paleta & Tokens
- Error: #EF4444
- Error Bg: #FEE2E2
- Warning: #F59E0B
- Warning Bg: #FEF3C7
- Primary Roxo: #A78BFA
- Text Primary: #1F2937
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Normal: TextArea vazio, botão ativo
- Loading: Spinner ao enviar
- Success: "Resposta enviada. Aguardando decisão" (toast)

---

## Tela 41: Carteira (Faxineira)

**Descrição:** Visão de saldo quebrado entre "a liberar" (D+1 a D+14) e "disponível" (D+15+). Card de saldo total grande, breakdown visual (barras ou cores), tabela de extrato (data, serviço, valor, status). Botão "Solicitar Saque" rodapé.

### Componentes
- Header: "Minha Carteira" (Heading 2, 24px Bold)
- Card Saldo Total (Background #E9D5FF, border 1px #A78BFA):
  - "R$ XXX.XX" (Display 32px bold, roxo #A78BFA, centralizado)
- Card Breakdown (Background #F9FAFB):
  - "A liberar (D+1 a D+14):" | "R$XXX.XX" (Body)
  - "Disponível (D+15+):" | "R$YYY.YY" (Body, verde #10B981 bold)
  - Visual: 2 barras horizontais com cores (laranja para liberar, verde para disponível)
- Seção Extrato (tabela, scroll horizontal em mobile):
  - Coluna: Data | Serviço | Valor | Status
  - Linhas exemplo:
    - "18/08 | Faxina Padrão 2Q | R$120.00 | A liberar"
    - "17/08 | Faxina Pesada 3Q | R$180.00 | Disponível"
  - Body Small (12px) para dados
- Botão "Solicitar Saque" (primary roxo, 16px, sticky bottom)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Primary Light: #E9D5FF
- Success: #10B981
- Warning: #F59E0B
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 16px cards, 12px gaps

### Estados
- Saldo zero: "Você ainda não realizou nenhum serviço" (Body, cinza)
- Com saldo: Cards e tabela visible

---

## Tela 42: Solicitar Saque (Faxineira)

**Descrição:** Modal/tela para transferência PIX. Exibe saldo disponível (card), input para valor (min R$20), input chave PIX (pré-preenchida, editável), checkbox confirmação. Botão "Confirmar Saque" final.

### Componentes
- Header: "Solicitar Saque" (Heading 2, 24px Bold)
- Card Info (Background #F9FAFB):
  - "Saldo Disponível: R$XXX.XX" (Heading 3, roxo #A78BFA)
- Input Valor:
  - Label: "Valor a sacar" (Label 14px bold)
  - TextInput: "0,00" (Body 14px, currency format)
  - Info: "Mínimo R$20, máximo R$XXX.XX" (Caption, cinza)
- Input Chave PIX:
  - Label: "Chave PIX" (Label 14px bold)
  - TextInput: pre-filled (pré-preenchida do cadastro, editável)
  - Info: "CPF, Email, Telefone ou Chave Aleatória" (Caption, cinza)
  - Validação: "Chave PIX inválida" (error vermelho #EF4444, se inválida)
- Info Transfer:
  - "Transferência em 1-2 dias úteis via PIX" (Body Small, cinza)
- Checkbox:
  - "Confirmo que esta é minha chave PIX" (Label 14px)
- Botão "Confirmar Saque" (primary roxo, 16px, desabilitado até checkbox marcado)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Error: #EF4444
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 16px gaps, 12px entre inputs

### Estados
- Normal: Valor vazio, checkbox desmarcado, botão desabilitado
- Validando: "Validando chave PIX..." (spinner)
- Loading: Spinner ao confirmar
- Error: Mensagens de validação (vermelho)
- Success: "Saque solicitado com sucesso! Você receberá uma notificação quando for processado" (toast)

---

## Tela 43: Avaliação (Faxineira)

**Descrição:** Faxineira avalia cliente (idêntico ao da cliente, mas avaliando cliente). Header "Avalie [Nome do Cliente]", foto circular, stars clicáveis 1-5, TextArea opcional para comentário, botão "Enviar Avaliação".

### Componentes
- Header: "Avalie [Nome do Cliente]" (Heading 2, 24px Bold)
- Avatar circular (80x80px, #E5E7EB border)
- Stars (5 grandes, 40px cada):
  - Vazias inicialmente (cinza #E5E7EB)
  - Hover: preenchidas roxo #A78BFA
  - Clique: permanece preenchida
  - Indicador "1-5 ★" (Body Small)
- TextArea:
  - Placeholder: "Deixe seu comentário (opcional)"
  - Border: 1px #E5E7EB
  - Padding: 12px
  - Min height: 100px
- Info: "Sua avaliação fica oculta por 72h" (Caption, cinza)
- Botão "Enviar Avaliação" (primary roxo, 16px, desabilitado até star selecionada)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Warning (stars): #F59E0B
- Border: #E5E7EB
- Text Primary: #1F2937
- Text Secondary: #9CA3AF
- Spacing: 24px page, 16px gaps

### Estados
- Normal: Nenhuma star, botão desabilitado
- Star hover: Roxo ao passar
- Star selecionada: Preenchida roxo
- Loading: Spinner ao enviar

---

## Tela 44: Histórico (Faxineira)

**Descrição:** Lista de serviços já concluídos. CardList com cliente, tipo, data, valor recebido, stars (se avaliado). Click em card leva para detalhe (readonly).

### Componentes
- Header: "Histórico" (Heading 2, 24px Bold)
- CardList (scroll):
  - Card Serviço (Background #F9FAFB, border 1px #E5E7EB):
    - "Cliente: [Nome]" (Label 14px bold)
    - "Tipo: Limpeza Padrão — 2Q" (Body Small)
    - "Data: 15/08" (Body Small, cinza)
    - "R$120.00" (Heading 3, roxo #A78BFA, direita)
    - "4.5★" (Label 12px, amarelo #F59E0B) se avaliado
  - Espaçamento: 12px
- Estado vazio: "Você ainda não completou nenhum serviço" (Body, cinza)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Warning (stars): #F59E0B
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 12px card gaps

### Estados
- Vazio: Mensagem
- Com serviços: CardList visible

---

## Tela 45: Perfil & Configurações (Faxineira)

**Descrição:** Abas "Dados" / "Documentos" / "Mais". Aba Dados: nome (editável), email (readonly), telefone (editável), foto, nota média. Aba Documentos: previews/uploads de RG, CPF, Selfie, Comprovante, Chave PIX (editável). Aba Mais: raio atuação, notificações, termos, deletar conta.

### Componentes
**Aba Dados:**
- Header "Perfil" (Heading 2, 24px Bold)
- Avatar circular (100x100px, clicável)
- TextInput: Nome (Label, editável, Border 1px #E5E7EB)
- TextInput: Email (disabled, cinza)
- TextInput: Telefone (editável)
- Text Nota: "4.5★ de 5" (Label bold roxo)

**Aba Documentos:**
- Seção RG:
  - Preview imagem (120x80px) ou "Foto do RG" (Label)
  - Botão "Trocar" (secondary, 12px)
- Seção CPF:
  - Preview ou "CPF" (Label)
  - Botão "Trocar" (secondary)
- Seção Selfie:
  - Avatar circular preview (100x100px)
  - Botão "Trocar" (secondary)
- Seção Comprovante:
  - Preview (120x80px)
  - Botão "Trocar" (secondary)
- Seção Chave PIX (editável):
  - TextInput: "seu@email.com" (editável, Body 14px)
  - Botão "Atualizar" (secondary)
  - Info: "Documentos são armazenados com segurança" (Caption, cinza)

**Aba Mais:**
- Dropdown: "Raio de Atuação" (20 km selected)
- Toggle: "Receber notificações" (Label 14px)
- Link: "Ver Termos de Uso" (Body, roxo #A78BFA)
- Link: "Ver Política de Privacidade" (Body, roxo)
- Botão "Deletar Conta" (danger vermelho #EF4444, 16px)
- Botão "Sair" (secondary, 16px)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Error: #EF4444
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px page, 16px gaps, 12px entre inputs

### Estados
- Dados: Inputs editáveis
- Documentos: Previews com botões trocar
- Mais: Toggles e links

---

## Tela 46: Cancelar Serviço (Faxineira)

**Descrição:** Modal de cancelamento com alerta vermelho, resumo do serviço (data, hora, cliente, valor bruto), dropdown obrigatório de motivo (com opção "Outro" que abre TextInput), penalidade clara (−10 ou −5 pontos por antecedência), checkbox confirmação, botões "Confirmar Cancelamento" (danger) / "Manter Agendado".

### Componentes
- Header: "Cancelar Serviço?" (Heading 2, 24px Bold)
- Alert banner (Background #FEE2E2, border 2px left #EF4444):
  - "Você está prestes a cancelar este serviço" (Body, vermelho #EF4444)
- Card Resumo (Background #F9FAFB):
  - "Data/Hora: 18/08 — 14:00" (Body Small)
  - "Cliente: [Nome]" (Body Small)
  - "Valor bruto: R$120.00" (Body Small)
- Dropdown Motivo (obrigatório):
  - Label: "Motivo do Cancelamento" (Label 14px bold)
  - Options:
    - "Problema de saúde"
    - "Problema com transporte"
    - "Problema familiar"
    - "Outro (especifique)"
  - TextInput condicional: "Descrever motivo" (se "Outro" selecionado)
- Alert Penalidade (Background #FEF3C7, border 1px #F59E0B):
  - "Cancelamentos resultam em penalidade de score" (Body Small)
  - "Se <12h: −10 pontos (penalidade severa)" (Body Small, vermelho) ou "Se ≥12h: −5 pontos" (Body Small, laranja)
- Checkbox:
  - "Entendo que vou sofrer penalidade de score" (Label 14px)
- Botão "Confirmar Cancelamento" (danger vermelho #EF4444, 16px, desabilitado até checkbox)
- Botão "Manter Agendado" (secondary, 16px)

### Paleta & Tokens
- Error: #EF4444
- Error Bg: #FEE2E2
- Warning: #F59E0B
- Warning Bg: #FEF3C7
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px padding, 16px gaps

### Estados
- Normal: Dropdown vazio, checkbox desmarcado, botão desabilitado
- Motivo selecionado: "Outro" abre TextInput
- Checkbox marcado: Botão ativo (vermelho)
- Loading: Spinner ao confirmar
- Success: "Cancelamento confirmado"

---

## Tela 47: Login (Admin)

**Descrição:** Tela simples de login web. Form centralizado com email + senha, botão "Entrar". Rodapé com link "Esqueceu a senha?" (futuro, Fase 2). Layout desktop-first.

### Componentes
- Centered Form (max-width 400px):
  - Logo Moppy (64x64px, roxo #A78BFA)
  - Título: "Admin Moppy" (Heading 1, 28px Bold, centralizado)
  - TextInput Email:
    - Label: "Email" (Label 14px bold)
    - Placeholder: "seu@email.com"
    - Border: 1px #E5E7EB
    - Padding: 12px
  - TextInput Senha:
    - Label: "Senha" (Label 14px bold)
    - Placeholder: "Mínimo 8 caracteres"
    - Type: password
  - Botão "Entrar" (primary roxo, 16px, width 100%)
  - Link: "Esqueceu a senha?" (Body Small, roxo #A78BFA, link)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 24px gaps, 16px input padding

### Estados
- Normal: Inputs vazios, botão ativo
- Loading: Spinner + "Entrando..."
- Error: "Email ou senha inválidos" (vermelho #EF4444)

---

## Tela 48: Dashboard (Admin)

**Descrição:** Visão geral com KPIs em grid (Pedidos Hoje, Receita do Mês, Taxa de Conclusão, Escalações Pendentes). Sidebar menu esquerdo com links (Aprovações Pendentes, Pedidos, Disputas, Financeiro, Preços por Cidade, Score de Confiabilidade). Desktop layout.

### Componentes
- Header (sticky): "Dashboard" (Heading 2, 24px Bold) + Avatar admin
- Sidebar (fixed, 280px):
  - Logo (roxo #A78BFA)
  - Menu items (Label 14px):
    - "Aprovações Pendentes" (link ativo roxo)
    - "Pedidos"
    - "Disputas"
    - "Financeiro"
    - "Preços por Cidade"
    - "Score de Confiabilidade"
- Main Content:
  - Grid KPI (4 cols, 1-2 rows):
    - Card "Pedidos Hoje" (Background #F9FAFB, border 1px #E5E7EB)
      - "42" (Display 32px bold, roxo)
      - "pedidos" (Body Small, cinza)
    - Card "Receita do Mês"
      - "R$ 12.450,00" (Display 32px bold, verde #10B981)
      - "receita líquida" (Body Small)
    - Card "Taxa de Conclusão"
      - "94%" (Display 32px bold, azul #3B82F6)
      - "concluído com sucesso" (Body Small)
    - Card "Escalações Pendentes"
      - "7" (Display 32px bold, laranja #F59E0B)
      - "aguardando análise" (Body Small)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Success: #10B981
- Warning: #F59E0B
- Info: #3B82F6
- Surface: #F9FAFB
- Border: #E5E7EB
- Sidebar Background: #FFFFFF
- Text Primary: #1F2937
- Spacing: 20px page, 16px grid gaps

### Estados
- Normal: KPIs exibindo valores
- Loading: Skeleton cards

---

## Tela 49: Aprovações Pendentes (Admin)

**Descrição:** Lista de faxineiras aguardando aprovação. Tabela/CardList com avatar, nome, data de submissão, botão "Ver Documentos" (ou direto clicável). Header com contador de pendentes.

### Componentes
- Header: "Aprovações Pendentes" (Heading 2, 24px Bold) + contador "5 pendentes"
- CardList ou Tabela:
  - Card/Row Faxineira:
    - Avatar circular (40x40px)
    - "Nome da Faxineira" (Label 14px bold)
    - "Data de submissão: 16/08/2024" (Body Small, cinza)
    - Botão "Ver Documentos" (secondary, 12px) ou clicável row
  - Espaçamento: 12px entre cards
- Estado vazio: "Nenhuma aprovação pendente" (Body, cinza)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 20px page, 12px card gaps

### Estados
- Com pendentes: CardList visible
- Vazio: Mensagem

---

## Tela 50: Detalhe Faxineira (Aprovação)

**Descrição:** Admin analisa documentos de faxineira para aprovação. Layout com foto + nome + data, seções de documentos (RG, CPF, Selfie, Comprovante, Chave PIX), checklist objetiva (5 checkboxes), botões "Aprovar" (verde) e "Reprovar" (vermelho, abre modal de motivo).

### Componentes
- Header: "Revisar Cadastro — [Nome Faxineira]" (Heading 2, 24px Bold)
- Avatar + Info (Background #F9FAFB):
  - Avatar circular (80x80px)
  - "[Nome]" (Label 14px bold)
  - "Data de submissão: 16/08" (Body Small)
- Seções Documentos (scrollável):
  - Seção RG:
    - "RG" (Label 14px bold)
    - Imagem grande (clicável para ampliar) (400x300px max)
  - Seção CPF:
    - "CPF" (Label)
    - Imagem (400x300px)
  - Seção Selfie:
    - "Selfie" (Label)
    - Avatar circular grande (200x200px)
  - Seção Comprovante:
    - "Comprovante de Endereço" (Label)
    - Imagem (400x300px)
  - Seção Chave PIX:
    - "Chave PIX" (Label)
    - Text: "123.456.789-00" (Body, monospace)
- Checklist Objetiva:
  - ☐ Documentos legíveis (Checkbox)
  - ☐ Selfie bate com RG (Checkbox)
  - ☐ CPF válido (Checkbox)
  - ☐ Idade ≥18 anos (Checkbox)
  - ☐ Comprovante recente (≤90 dias) (Checkbox)
- Botões (sticky bottom):
  - "Aprovar" (primary verde #10B981, 16px)
  - "Reprovar" (danger vermelho #EF4444, 16px)

**Modal Reprovar:**
- "Motivo da Reprovação" (Heading 3, 20px)
- RadioGroup (Label 14px):
  - ☐ Documentos ilegíveis
  - ☐ Selfie não bate com RG
  - ☐ CPF irregular
  - ☐ Menor de idade
  - ☐ Outro (com TextInput condicional)
- TextInput (se "Outro"): "Descrever motivo"
- Botão "Confirmar Reprovação" (danger vermelho, 16px)

### Paleta & Tokens
- Success: #10B981
- Error: #EF4444
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 20px page, 16px seções, 12px gaps

### Estados
- Normal: Documentos visible, checklist vazio
- Selecionando motivo: Modal aberto
- Aprovado: Notificação automática

---

## Tela 51: Pedidos (Admin)

**Descrição:** Tabela de pedidos em tempo real com filtros. Header "Pedidos", FilterBar (Status, DateRange, Cidade, TextSearch). Tabela com colunas (ID, Cliente, Faxineira, Data, Valor, Status, Ações). Rows clicáveis para detalhe. Paginação se necessário.

### Componentes
- Header: "Pedidos" (Heading 2, 24px Bold)
- FilterBar (sticky, horizontal):
  - Dropdown "Status" (Abertos / Confirmados / Em Andamento / Concluídos / Cancelados) + ícone filtro
  - DateRangePicker "De — Até" (calendaricon)
  - Dropdown "Cidade" (São Paulo, Rio, etc)
  - TextInput Search "Cliente ou Faxineira" (search icon)
- DataTable (scroll horizontal em mobile):
  - Header row (Background #F9FAFB, border-bottom 1px #E5E7EB):
    - "ID" (Label 12px bold)
    - "Cliente" (Label 12px bold)
    - "Faxineira" (Label 12px bold)
    - "Data" (Label 12px)
    - "Valor" (Label 12px)
    - "Status" (Label 12px)
    - "Ações" (Label 12px)
  - Data rows (clicáveis, hover Background #F9FAFB):
    - "#1234" (Body Small)
    - "Maria Silva" (Body Small)
    - "João Faxineira" (Body Small)
    - "15/08/2024" (Body Small)
    - "R$120.00" (Body Small, roxo)
    - Badge "Concluído" (verde #10B981) / "Aberto" (azul) / etc
    - Botão "Ver" (link roxo, 12px)
  - Height row: 48px
- Paginação (abaixo, se muitos pedidos):
  - "Página X de Y" (Body Small)
  - Setas prev/next (roxo #A78BFA)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Success: #10B981
- Info: #3B82F6
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 20px page, 12px gaps

### Estados
- Normal: Tabela visible
- Filtros aplicados: "Limpar filtros" link visible
- Loading: Skeleton rows

---

## Tela 52: Detalhe Pedido (Admin)

**Descrição:** Visão 360 de um pedido. Timeline completa (criação, pré-auth, candidaturas, seleção, chegada, conclusão, confirmação, pagamento), card financeiro (breakdown), avaliações, chat preview. Alerts se há problemas (pré-auth falhou, disputa aberta, cancelamento).

### Componentes
- Header: "Pedido #1234" (Heading 2, 24px Bold) + Status badge (Aberto, Concluído, etc)
- Botão "Intervir" (secondary, se necessário)
- Card Info (Background #F9FAFB):
  - "Cliente:" | "[Nome] — Nota 4.5★"
  - "Faxineira:" | "[Nome] — Nota 4.8★"
  - "Endereço:" | "[Completo]"
  - "Data/Hora:" | "18/08/2024 — 14:00"
  - "Tipo + Tamanho + Adicionais:" | "Padrão, 2 Quartos, Banheiros Extras"
  - "Valor bruto:" | "R$150.00"
  - "Taxa de urgência:" | "R$5.00"
- Card Timeline (Background #F9FAFB):
  - Vertical timeline com circles + labels:
    - ✓ Pedido criado — 15/08 14:30
    - ✓ Pré-autorização — 16/08 (sucesso/falha)
    - ✓ Candidaturas — 3 candidatas
    - ✓ Seleção — 17/08 14:00
    - ✓ Chegada confirmada — 18/08 (código/GPS+foto)
    - ✓ Conclusão — 18/08 16:30
    - ✓ Confirmação cliente — 19/08 (manual/automática)
    - ✓ Pagamento — 19/08
- Card Financeiro (Background #F9FAFB):
  - "Valor bruto: R$150.00" (Body)
  - "Comissão (15%): R$22.50"
  - "Taxa processamento (50%): X"
  - "= Valor faxineira: R$XXX.XX" (roxo bold)
- Card Avaliações (Background #F9FAFB):
  - "Cliente avalia:" | "5★ — Excelente trabalho!" (Body Small)
  - "Faxineira avalia:" | "4★ — Cliente educado" (Body Small)
- Card Chat (Background #F9FAFB):
  - "Últimas mensagens:" (Label 12px)
  - Preview bubbles (1-2 mensagens)
  - Botão "Ver Chat Completo" (link roxo)
- Alert (se problema): "⚠ Pré-autorização falhou" (Background #FEE2E2, text vermelho)

### Paleta & Tokens
- Primary Roxo: #A78BFA
- Success: #10B981
- Error: #EF4444
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 20px page, 16px cards

### Estados
- Normal: Todas informações visible
- Com alerta: Alert banner visible

---

## Tela 53: Disputas (Admin)

**Descrição:** Tabela de disputas abertas com abas (Abertas / Em Análise / Fechadas). Colunas: ID, Cliente, Faxineira, Data Abertura, Status, Ações. Rows clicáveis para detalhe.

### Componentes
- Header: "Disputas" (Heading 2, 24px Bold) + contador "3 abertas"
- Tab Bar (sticky):
  - "Abertas" (ativo por default)
  - "Em Análise"
  - "Fechadas"
- DataTable (scroll horizontal):
  - Header row:
    - "ID" | "Cliente" | "Faxineira" | "Data Abertura" | "Status" | "Ações"
  - Data rows:
    - "#D-0042" | "Maria" | "João" | "16/08" | Badge "Aberta" (vermelho #EF4444) | Botão "Ver"
  - Height: 48px
- Estado vazio: "Nenhuma disputa [em aba]" (Body, cinza)

### Paleta & Tokens
- Error: #EF4444
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 20px page

### Estados
- Abertas: Muitas rows
- Em Análise: Poucas
- Fechadas: Histórico

---

## Tela 54: Detalhe Disputa (Admin)

**Descrição:** Análise completa de disputa. 2-3 colunas: Versão do Cliente (texto + fotos), Timeline + Evidências (timeline do serviço, chat), Versão da Faxineira (se respondeu). Seção Decisão com RadioGroup (Reembolso Total / Parcial / Libera Pagamento), TextArea justificativa, botão "Decidir".

### Componentes
- Header: "Disputa #D-0042" (Heading 2, 24px Bold) + Status badge
- 3-Column Layout (desktop) ou Stacked (mobile):

**Coluna 1: Versão do Cliente**
- Card (Background #FEE2E2, border 1px #EF4444):
  - "Reclamação do Cliente:" (Label 14px bold, vermelho)
  - Texto (Body Small)
  - Gallery de fotos (3 max, 80x80px em grid)
  - Timestamp (Caption, cinza)
  - Info cliente: "Nota: 4.2★" / "Serviços: 5" (Body Small)

**Coluna 2: Timeline + Evidências**
- Card Timeline:
  - ✓ Pedido criado — 15/08
  - ✓ Chegada confirmada — 18/08 (foto + GPS se applicable)
  - ✓ Conclusão — 18/08 16:30
- Card Chat (Background #F9FAFB):
  - "Chat entre cliente e faxineira:" (Label)
  - Chat bubbles (últimas 3-5 mensagens, reduzidas)

**Coluna 3: Versão da Faxineira**
- Card (Background #E9D5FF, border 1px #A78BFA):
  - "Resposta da Faxineira:" (Label 14px bold, roxo)
  - Texto (Body Small)
  - Gallery fotos (até 3)
  - Timestamp (Caption)
  - Ou "Faxineira não respondeu no prazo" (Body Small, vermelho) se vencido
  - Info faxineira: "Nota: 4.8★" / "Serviços: 45"

**Seção Decisão (bottom, sticky):**
- Card (Background #F9FAFB, border 1px #E5E7EB):
  - "Sua Decisão:" (Label 14px bold)
  - RadioGroup:
    - ☐ "Reembolso Total (100% para cliente)" (Label)
    - ☐ "Reembolso Parcial" (Label) com 2 inputs:
      - "% para cliente:" (input 10-90%)
      - "% para faxineira:" (input auto-calculated)
    - ☐ "Libera Pagamento (100% para faxineira)" (Label)
  - TextArea: "Justificativa (obrigatória)" (Body 14px, 100px min)
  - Info: "Máximo ressarcimento = valor da faxina" (Caption, cinza)
  - Botão "Decidir" (primary roxo, 16px, desabilitado até tudo preenchido)

### Paleta & Tokens
- Error: #EF4444
- Error Bg: #FEE2E2
- Primary Roxo: #A78BFA
- Primary Light: #E9D5FF
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #1F2937
- Spacing: 20px page, 16px cards, 12px gaps

### Estados
- Normal: Todas 3 colunas visível, decisão aberta
- Faxineira não respondeu: Info vermelho, time crítico
- Loading: Spinner ao decidir
- Success: "Decisão registrada. Notificações enviadas" (toast)

---

## Resumo Executivo

- **Total de prompts:** 54 (telas 1-54)
- **Distribuição:** 
  - Telas Comuns: 3 prompts (1-3)
  - Telas Cliente: 24 prompts (4-27)
  - Telas Faxineira: 19 prompts (28-46)
  - Telas Admin: 8 prompts (47-54)
- **Complexidade estimada:**
  - Simples (Splash, Login): 5-10 min rendering
  - Médio (Cards, Lists): 15-20 min rendering
  - Complexo (Timeline, Dashboard, Tabelas): 25-40 min rendering
- **Tela mais complexa:** Tela 54 (Detalhe Disputa) — 3 colunas, timeline, chat, decisão
- **Padrão de design:** Minimalista, acessível (WCAG AA), 8px spacing system, tipografia Inter
- **Tempo total estimado:** 25-30h para renderizar todos (paralelo com validações do Jehu)
