# Moppy — User Flows (Redesign Premium)

**Projeto:** Moppy — Marketplace de Faxina
**Data:** 2026-08-23
**Status:** 🟢 Redesenhado — referências Mobbin incorporadas, pronto para Etapa 6 (fab-ui)

**O que mudou nesta versão:** o USER-FLOWS.md anterior descrevia a lógica dos fluxos em ASCII. Esta versão mantém a mesma lógica (aprovada nos Gates 2, 3 e 4) e eleva o nível de referência visual: cada uma das 54 telas agora aponta para 1-2 telas reais do Mobbin — marketplaces premium (Uber/inDrive, TaskRabbit/Angi, Airtasker, iFood/Bolt Food/Glovo/DoorDash) e apps de serviço de alta qualidade (Urban Company, Careem HomeServices, Fiverr, Grab Driver). É o material que o Jehu cola direto no prompt de cada tela no Claude Designer.

**Nota sobre o Mobbin:** pesquisa feita ao vivo via MCP do Mobbin nesta sessão. Onde não achei uma referência forte o suficiente, marquei "buscar no Mobbin" em vez de forçar uma referência fraca — é mais honesto que preencher a coluna com qualquer coisa.

---

## 1. Mapa de Telas (54 telas)

Formato de cada linha: tela → propósito em uma linha → referência Mobbin (o app real que resolve aquele padrão) → prioridade.

### 1.1 Cliente (25 telas)

| # | Tela | Propósito | Referência Mobbin | Prioridade |
|---|------|-----------|--------------------|------------|
| C01 | Splash | Logo Moppy em tela cheia enquanto valida sessão | [Preply](https://mobbin.com/screens/75848004-2d18-47c2-ab3c-051786989681) | MVP |
| C02 | Login / Cadastro (email + senha) | Entrar ou criar conta com Firebase Auth | buscar no Mobbin | MVP |
| C03 | Escolha de Papel | Definir se a conta é Cliente ou Faxineira, sem volta fácil depois | [inDrive — "Passenger or driver?"](https://mobbin.com/screens/d49d16c7-e096-4c3f-a9f4-570ce4e599d4) · [Wise — tipo de conta](https://mobbin.com/screens/f2733067-8528-4536-9d54-b30e3ced0c47) | MVP |
| C04 | Onboarding — Cadastro de Endereço | Primeiro endereço da casa (rua, número, bairro, cidade) | [On — novo endereço](https://mobbin.com/screens/a68ae3ca-9ce6-4ca1-9056-48c708429d34) · [Honest Greens](https://mobbin.com/screens/66c021dc-80f1-46a3-af4b-d779644ed2e9) | MVP |
| C05 | Onboarding — Salvar Cartão | Tokenizar cartão via Asaas (sem dado sensível salvo no app) | buscar no Mobbin (formulário de captura) — gerenciamento pós-cadastro: [Deliveroo](https://mobbin.com/screens/d72704c5-0d33-44c6-9a00-e5d10eb6445f) | MVP |
| C06 | Onboarding — Aceitar Termos LGPD | Checkbox obrigatório de Termos + Privacidade antes de liberar Home | [foodpanda](https://mobbin.com/screens/a77fb4b9-cf63-47ad-9931-6058c27c5f58) · [Clue](https://mobbin.com/screens/77e7a0d5-ddbc-4282-ae08-a1d396739709) | MVP |
| C07 | Permissão de Notificações | Pedir push no momento certo (depois do primeiro pedido criado, não no onboarding) | [Grubhub](https://mobbin.com/screens/644de4d8-28ca-449c-9387-1d68051a3db2) | MVP |
| C08 | Home (Próximos / Histórico / Cancelados) | Um único ecrã com segmented control entre as 3 visões + FAB para novo pedido | [Postmates — vazio](https://mobbin.com/screens/fade7a5a-0726-459f-abe6-5e2715a80002) (estado vazio) · populada: buscar no Mobbin | MVP |
| C09 | Criar Pedido — Passo 1: Endereço | Escolher endereço salvo ou adicionar novo, inline | reaproveita C04 | MVP |
| C10 | Criar Pedido — Passo 2: Tipo de Limpeza | Cards de categoria: padrão / pesada / passar roupa | [Careem HomeServices — categorias](https://mobbin.com/screens/d8e56d7f-8412-4b3b-b640-a926c846bf0a) | MVP |
| C11 | Criar Pedido — Passo 3: Tamanho da Casa | Studio / 1 / 2 / 3 / 4+ quartos, com preço-base já visível por opção | [Careem — Packers&Movers, tamanho do imóvel](https://mobbin.com/screens/18967ec3-fd3a-4605-9c56-d6081fba09c6) | MVP |
| C12 | Criar Pedido — Passo 4: Adicionais | Banheiros extra, área externa, faxineira leva produtos (chips + preço) | [Careem — add-ons de serviço](https://mobbin.com/screens/6b740a44-3557-447d-af49-bd4140596f29) | MVP |
| C13 | Criar Pedido — Passo 5: Data/Hora | Calendário + slots de horário disponíveis | [Warby Parker](https://mobbin.com/screens/69b6baa5-99c9-4bbd-99af-2eb6b1476390) · [Crate & Barrel](https://mobbin.com/screens/23d33f2e-271a-4101-9308-d7b2206af376) | MVP |
| C14 | Criar Pedido — Passo 6: Revisão de Preço | Breakdown base + adicionais + taxa de serviço, tudo desagregado | [Fiverr — Order review](https://mobbin.com/screens/da378890-e36b-4be0-aab0-4b3869968189) | MVP |
| C15 | Criar Pedido — Passo 7: Taxa de Urgência | Oferta opcional para destacar o pedido (R$3,50/4,50/5,50) | [Feeld — "Be found with Uplift"](https://mobbin.com/screens/59b09d01-14dd-4201-b072-51c1c1b3f735) | MVP |
| C16 | Checkout — Passo 8: Pagamento | Escolher cartão salvo, ver aviso de pré-autorização D-1 | [Agoda — método de pagamento](https://mobbin.com/screens/1c9ffe1a-e3df-4f32-a5a8-c8ded2c52544) · [Keeta](https://mobbin.com/screens/fd996dff-6f33-415f-b21e-07f5cddef8b5) | MVP |
| C17 | Confirmação do Pedido | Tela de sucesso pós-checkout, sem cobrança ainda | [Fiverr — "We're processing your order"](https://mobbin.com/screens/90189b37-6a9d-4ac8-932e-df051f76a391) · [Fiverr — thank you](https://mobbin.com/screens/14c5596a-eda7-4a74-afe0-8c6822eb26b5) | MVP |
| C18 | Lista de Candidatas | Faxineiras candidatas ordenadas por nota/distância/histórico | [Angi — "Hire a Handyman"](https://mobbin.com/screens/71c0cd71-25e9-49c6-8582-450cec5068a9) · [Realtor.com — pros recomendados](https://mobbin.com/screens/b3cc1a68-d11e-4078-93b7-d9326aa7d0a1) | MVP |
| C19 | Perfil da Candidata (detalhe) | Avaliações recentes, nº de serviços, botão Escolher | [Fiverr — perfil vendedor](https://mobbin.com/screens/f9a32acb-4926-42eb-b82c-b922040be92f) · [Airtasker — reviews](https://mobbin.com/screens/fe2f52e3-066d-460b-82a9-cd8d9241f85a) | MVP |
| C20 | Pedido em Andamento | Status ao vivo (aguardando/chegada/em progresso), chat, "está tudo certo?" | [Keeta — courier a caminho](https://mobbin.com/screens/56299fbf-b2d0-48be-867d-c434ca5af134) · [Bolt Food — arriving](https://mobbin.com/screens/9509b853-f44c-425e-81c0-c6e96efffe2c) | MVP |
| C21 | Código de Confirmação (modal) | Gera 4 dígitos, cliente passa para a faxineira presencialmente | [Coffee Meets Bagel](https://mobbin.com/screens/26b15b1f-2fc1-477a-b6fe-c711dfa9beaf) · [TIDE](https://mobbin.com/screens/03f90888-36dd-4bde-a88f-05e65f46bcb3) | MVP |
| C22 | Chat | Texto simples com a faxineira, aviso fixo de segurança | [Fiverr — chat "We have your back"](https://mobbin.com/screens/b5234996-4b9b-4324-b1df-1b0464177b74) · [BlaBlaCar](https://mobbin.com/screens/7c4e93f9-31fc-4c4c-9130-d6e77d076b02) | MVP |
| C23 | "Está tudo certo?" (confirmação / disputa) | Sim → capturar pagamento / Tive um problema → abre disputa | buscar no Mobbin | MVP |
| C24 | Abrir Disputa | Descrição obrigatória + até 3 fotos | [DoorDash — item quality issues](https://mobbin.com/screens/54f363c8-3506-4f7e-a3c4-0b49ca9e11e8) · [Wolt — damage/quality](https://mobbin.com/screens/cee3e04e-0447-4f81-979d-6fc807248c34) | MVP |
| C25 | Avaliação + Perfil & Configurações | Stars 1-5 pós-serviço; e aba única com dados/cartões/endereços/mais | [Urban Company — avaliação](https://mobbin.com/screens/23644ce7-e1fd-4f7f-a67e-6a83a5598535) · perfil: [Grab Driver](https://mobbin.com/screens/eaf7dd68-dfcf-47ae-b079-f65f25a28a02) · cartões: [eBay](https://mobbin.com/screens/1eadfdc1-fd80-418d-9490-6e8a1c3c682e) | MVP |

### 1.2 Faxineira (20 telas)

| # | Tela | Propósito | Referência Mobbin | Prioridade |
|---|------|-----------|--------------------|------------|
| F01 | Escolha de Papel (Faxineira) | Mesmo componente de C03, resultado diferente | [inDrive](https://mobbin.com/screens/d49d16c7-e096-4c3f-a9f4-570ce4e599d4) | MVP |
| F02 | Cadastro com Documentos | RG, CPF, selfie, comprovante, chave PIX — wizard com progresso | [DoorDash Dasher — "Scan your driver's license"](https://mobbin.com/screens/3933f4aa-88c5-48c3-8d55-ee6e770a7b12) · [Shopee — verificação em etapas](https://mobbin.com/screens/79589f4c-7b36-4372-adc3-49ccfa9a3f99) | MVP |
| F03 | Termos LGPD + Raio de Atuação | Aceite de termos seguido do slider de km (5-20km) | [Clue](https://mobbin.com/screens/77e7a0d5-ddbc-4282-ae08-a1d396739709) · raio: [Tinder — distance preference](https://mobbin.com/screens/65ef1aa6-b3ad-46a5-9076-79a90d5015bf) | MVP |
| F04 | Aguardando Aprovação | "Seu cadastro está em análise" (até 48h); estados aprovado/reprovado nesta mesma tela | [Chase UK — "Sorry for the wait"](https://mobbin.com/screens/a72ad958-d8d9-44ed-8f66-357157e2cda2) · [Binance — Under Review](https://mobbin.com/screens/dc19aec5-78ff-4aed-9f8b-8719e4a1b236) | MVP |
| F05 | Home / Buscar Trabalho (feed) | Lista de pedidos abertos no raio, valor líquido já visível | [Dave — Flexible Hours](https://mobbin.com/screens/33b61cbf-c31b-4203-aaa6-eda196c3e345) | MVP |
| F06 | Filtros do Feed (modal) | Tipo de limpeza, tamanho, distância, data | buscar no Mobbin | MVP |
| F07 | Detalhe do Pedido (não-candidatado) | Endereço só com bairro, valor bruto/líquido, botão "Me candidatar" | [Angi — request quote](https://mobbin.com/screens/71c0cd71-25e9-49c6-8582-450cec5068a9) | MVP |
| F08 | Candidatura (confirmação / bloqueio) | Sucesso "Aguardando escolha" ou erro de double-booking | buscar no Mobbin | MVP |
| F09 | Minhas Candidaturas | Abas Aguardando / Selecionada / Não selecionada | layout de agrupamento por status: [ClickUp](https://mobbin.com/screens/ab0224c3-34f9-4521-9a26-c5173ff63859) | MVP |
| F10 | Minha Agenda | Serviços confirmados, ordenados por data | buscar no Mobbin | MVP |
| F11 | Confirmação de Chegada | Caminho A (código) ou caminho B (GPS+foto) na mesma tela | código: [TIDE](https://mobbin.com/screens/03f90888-36dd-4bde-a88f-05e65f46bcb3) · foto+GPS: [Turo — finish check-in](https://mobbin.com/screens/44d4cfb9-76e9-4115-a06f-89ad9a2db601) · [Lime — foto de encerramento](https://mobbin.com/screens/9ed22b0d-f65d-48ec-9a28-6bf47a910b1b) | MVP |
| F12 | Serviço em Andamento | Cronômetro rodando + chat + botão Concluído | [Toggl Track — foco rodando](https://mobbin.com/screens/d610cdb8-9cda-4f55-b250-d0852318d819) · [Numo](https://mobbin.com/screens/b82d4fcf-e9a5-4baa-bd6d-4cf7d5acf24b) | MVP |
| F13 | Concluído / Aguardando Confirmação do Cliente | Estado de espera (24h), cronômetro decrescente do prazo | buscar no Mobbin | MVP |
| F14 | Responder Disputa | Vê versão do cliente, responde com texto + fotos em até 24h | [Wolt — damage/quality issues](https://mobbin.com/screens/cee3e04e-0447-4f81-979d-6fc807248c34) | MVP |
| F15 | Avaliação | Stars 1-5 + comentário sobre o cliente | [Urban Company](https://mobbin.com/screens/23644ce7-e1fd-4f7f-a67e-6a83a5598535) | MVP |
| F16 | Carteira | Saldo total, breakdown "a liberar" vs "disponível", extrato | [Careem — wallet](https://mobbin.com/screens/d5637068-8346-4354-9334-430e0f15df8f) · [Grab — OVO](https://mobbin.com/screens/8bff5e95-d9a5-48d2-ac8e-74636ac193a6) | MVP |
| F17 | Solicitar Saque | Valor (mín. R$20), chave PIX pré-preenchida, confirmação | [Careem — withdraw money](https://mobbin.com/screens/cfd51bca-40e4-4162-9f35-fbaad678266e) · [ShopBack](https://mobbin.com/screens/e93d6b6c-c849-491c-9648-7592d73559ab) | MVP |
| F18 | Chat | Mesmo componente do cliente (C22), do lado da faxineira | [Fiverr](https://mobbin.com/screens/b5234996-4b9b-4324-b1df-1b0464177b74) | MVP |
| F19 | Perfil & Configurações | Dados, documentos, raio de atuação, notificações | [Grab Driver — my profile](https://mobbin.com/screens/eaf7dd68-dfcf-47ae-b079-f65f25a28a02) · [Fiverr — perfil](https://mobbin.com/screens/f9a32acb-4926-42eb-b82c-b922040be92f) | MVP |
| F20 | Histórico de Serviços | Lista de serviços concluídos/cancelados, somatório do período | buscar no Mobbin | MVP |

### 1.3 Admin — Web (9 telas)

| # | Tela | Propósito | Referência Mobbin | Prioridade |
|---|------|-----------|--------------------|------------|
| A01 | Login | Acesso da equipe Moppy | buscar no Mobbin | MVP |
| A02 | Dashboard | Cards de pedidos hoje, receita do mês, cancelamentos, escalações | [Base44](https://mobbin.com/screens/11cbaa8c-23d3-4493-be28-d67d9a31d4b1) · [Squarespace — "Welcome, Alex"](https://mobbin.com/screens/c31bbf92-170e-4042-81e1-ccfc636269de) | MVP |
| A03 | Aprovações Pendentes | Fila de faxineiras + checklist objetiva + aprovar/reprovar | [Wellfound — revisão de candidato](https://mobbin.com/screens/963a16f0-abc2-4690-b0f9-def0e53ffcaf) · [Discord — pending members](https://mobbin.com/screens/77e2e431-ec73-4eaf-b60b-28b51482d09c) | MVP |
| A04 | Pedidos (tabela + detalhe/timeline) | Filtro por status/cidade/data, linha abre timeline completa | [Vapi — tabela com filtros](https://mobbin.com/screens/1965682c-0c4e-4146-a0fb-864ad2eabf2d) · [Navattic — painel de detalhe lateral](https://mobbin.com/screens/1ef8248f-ac5c-4c7b-b44c-e7db3f8d9ed3) | MVP |
| A05 | Disputas (fila + detalhe/decisão) | Evidência bilateral, radio de decisão, justificativa obrigatória | [Whop — case com Accept/Deny](https://mobbin.com/screens/85a46bd4-caa3-4991-92ff-cc98ad01cfdf) · [PayPal — Resolution Center](https://mobbin.com/screens/57a6cb07-dfed-46c3-b0c4-bdc725a1d0aa) · [Airwallex — disputas](https://mobbin.com/screens/b1f2e410-6e3c-4ea2-8567-0afd619dd766) | MVP |
| A06 | Financeiro | Comissão, taxa de urgência, estornos, saques, export CSV/PDF | [Quicken — reports](https://mobbin.com/screens/ac1b45e3-44c0-4c9a-8738-6601b60a9a41) · [Kajabi — payments by type](https://mobbin.com/screens/183d38b1-ff93-4da3-a6cf-ca5a8e1c5879) | MVP |
| A07 | Preços por Cidade | Lista de cidades ativas/inativas + editor de tabela | buscar no Mobbin | MVP |
| A08 | Usuários (clientes/faxineiras) | Histórico e busca de qualquer conta da plataforma | reaproveita [Navattic](https://mobbin.com/screens/1ef8248f-ac5c-4c7b-b44c-e7db3f8d9ed3) | MVP |
| A09 | Score de Confiabilidade | Faxineiras/clientes por faixa de score, suspender/avisar | buscar no Mobbin | v2 |

**Total: 25 + 20 + 9 = 54 telas**, igual ao SCREEN-MAP.md aprovado — nada foi cortado ou adicionado, só ganhou referência visual e mais textura de interação.

---

## 2. Navegação

### 2.1 Cliente — Bottom Tab Bar
```
Home | Histórico¹ | Cancelados¹ | Perfil
```
¹ Histórico e Cancelados vivem como segmented control **dentro** de Home (C08), não como tabs próprias — reduz de 4 para 3 destinos reais na tab bar e mantém a barra limpa (referência de clareza: tab bar enxuta do Airbnb — Explore/Wishlists/Trips/Messages/Profile).

- **Stack principal:** Home → Criar Pedido (modal fullscreen, wizard de 8 passos com barra de progresso) → Confirmação → volta para Home.
- **Stack de execução:** Home → Detalhe do Pedido Ativo → Chat / Pedido em Andamento / Disputa — sempre com botão voltar para o Detalhe, nunca pulando direto pra Home (o usuário precisa ver o estado do pedido antes de sair).
- **Modais:** Código de Confirmação, Filtros, Confirmar Cancelamento, Escolher Cartão — sempre sheet de baixo pra cima, fecham com swipe ou X.
- **Tela cheia sem tab bar:** todo o wizard de Criar Pedido, Checkout, Chat, Disputa — o usuário está em uma tarefa, a tab bar some para não distrair.
- **Voltar:** todo passo do wizard volta ao passo anterior preservando os dados já preenchidos (nunca perde o que já escolheu).

### 2.2 Faxineira — Bottom Tab Bar
```
Buscar | Agenda | Carteira | Perfil
```
"Minhas Candidaturas" (F09) não é tab — é uma aba dentro de "Buscar", ao lado do feed. Reduz de 5 para 4 destinos.

- **Stack de execução:** Agenda → Detalhe do Serviço → Confirmação de Chegada → Serviço em Andamento → Concluído — stack linear, sem pular etapas.
- **Modal:** Solicitar Saque (sheet), Filtros (sheet), Responder Disputa (fullscreen — tem peso de decisão, merece tela inteira).
- **Tela cheia sem tab bar:** onboarding completo (Cadastro com Documentos → Aguardando Aprovação), Confirmação de Chegada, Serviço em Andamento.

### 2.3 Admin — Web (Sidebar fixa + conteúdo)
```
Dashboard | Aprovações | Pedidos | Disputas | Financeiro | Preços | Usuários | Score(v2)
```
- Sidebar sempre visível (referência: Vapi, Navattic — sidebar fina à esquerda, conteúdo com respiro).
- Detalhe de linha (Pedido, Disputa, Faxineira) abre em **painel lateral direito**, não em nova página — mantém contexto da lista (referência: Navattic, Lyssna).
- Decisão de disputa é ação que não tem "voltar": exige confirmação em modal antes de processar.

---

## 3. Fluxos Principais (tela a tela)

### 3.1 Onboarding — Cliente
1. **C01 Splash** → detecta sessão.
2. **C02 Login/Cadastro** → cria conta ou entra. Erro de senha errada: mensagem inline, sem travar o formulário.
3. **C03 Escolha de Papel** → toca "Cliente" → avança automaticamente (sem botão "Próximo" — o toque no card já navega, como no inDrive).
4. **C04 Cadastro de Endereço** → preenche e salva → avança.
5. **C05 Salvar Cartão** → tokeniza via Asaas → se falhar, mostra erro específico (número inválido / cartão recusado) sem apagar o que já foi digitado.
6. **C06 Termos LGPD** → aceita → **C08 Home** (vazia, com CTA "Criar meu primeiro pedido").

### 3.2 Onboarding — Faxineira
1. **F01 Escolha de Papel** → toca "Faxineira".
2. **F02 Cadastro com Documentos** → 5 uploads em sequência com barra de progresso (RG → CPF → Selfie → Comprovante → Chave PIX). Cada upload confirma com preview antes de avançar.
3. **F03 Termos + Raio de Atuação** → aceita termos → desliza slider (padrão 10km).
4. **F04 Aguardando Aprovação** → tela de espera até 48h.
   - Aprovado → notificação push + **F05 Home/Buscar Trabalho** liberado.
   - Reprovado → notificação com motivo objetivo + botão "Tentar novamente" (1x).

### 3.3 Fluxo Central — Criar Pedido → Checkout → Confirmação (equivalente ao catálogo→carrinho→checkout)
> Regra de 3 toques: do Home até abrir o wizard é **1 toque** (FAB "+"). Dentro do wizard, cada passo é otimizado para 1 toque por decisão (cards grandes, sem scroll para decisões binárias) — a "distância" real está na natureza do serviço (8 decisões: endereço, tipo, tamanho, adicionais, data, preço, urgência, pagamento), não na fricção da UI. Cada passo permite pular direto pro anterior salvo.

1. **C08 Home** → toca FAB → **C09 Endereço** (pré-seleciona o mais usado).
2. **C10 Tipo de Limpeza** → cards grandes com ícone (padrão/pesada/passar roupa), toque único avança.
3. **C11 Tamanho** → chips Studio/1/2/3/4+, preço-base já aparece ao lado de cada opção.
4. **C12 Adicionais** → toggle chips com preço incremental visível, botão "Continuar" sempre fixo embaixo.
5. **C13 Data/Hora** → calendário + slots, indisponibilidade em cinza.
6. **C14 Revisão de Preço** → todo o cálculo desagregado (base + adicionais + taxa de serviço), nada escondido.
7. **C15 Taxa de Urgência** → opcional, card de upsell claro sobre o que ganha (mais visibilidade, resposta mais rápida) e o que não devolve (não reembolsável).
8. **C16 Checkout** → escolhe cartão salvo ou adiciona novo → toca "Confirmar pedido".
9. **C17 Confirmação** → "Pedido criado! Pré-autorização será feita na véspera do serviço." → volta para **C08 Home**, pedido aparece em "Próximos" com status Aberto.
10. Primeira candidatura chega → push → **C18 Lista de Candidatas** → toca em uma → **C19 Perfil** → "Escolher" → confirma.

### 3.4 Acompanhamento de Pedido (Cliente + Faxineira em paralelo)
**Cliente:**
1. **C20 Pedido em Andamento** exibe status ao vivo.
2. Dia do serviço, cliente disponível → **C21 Código de Confirmação** gera 4 dígitos → passa para a faxineira.
3. Faxineira digita, chegada confirmada → status muda para "Em serviço" em C20, cronômetro visível do lado do cliente também (somente leitura).
4. Faxineira marca concluído → push "Está tudo certo?" → **C23**.
5. Sim → captura processada → **C25 Avaliação**. Tive um problema → **C24 Abrir Disputa**.

**Faxineira (em paralelo):**
1. **F10 Minha Agenda** → toca no serviço do dia → **F11 Confirmação de Chegada**.
2. Cliente disponível → digita código recebido → confirmado, cronômetro inicia em **F12**.
3. Cliente ausente 10min → app oferece caminho B (foto + GPS) na mesma tela, sem trocar de tela.
4. Toca "Concluído" → **F13 Aguardando Confirmação do Cliente** (até 24h).
5. Cliente confirma → **F15 Avaliação**. Cliente disputa → **F14 Responder Disputa** (24h de prazo, cronômetro visível).

### 3.5 Área do Cliente (pós-serviço)
- **C25 Perfil & Configurações** — hub único: dados pessoais, cartões (C05 reaproveitada em modo lista), endereços (C04 reaproveitada em modo lista), notificações, termos, deletar conta.
- Histórico completo vive em **C08 Home** (segmented control "Histórico"), cada card abre o Detalhe do Pedido em modo somente-leitura com timeline + avaliação trocada.

### 3.6 Fluxo Admin — Aprovação → Disputa → Financeiro
1. **A01 Login** → **A02 Dashboard**.
2. **A03 Aprovações Pendentes** → abre painel lateral com os 5 documentos + checklist objetiva (doc legível / selfie bate / CPF ok / maior de idade / comprovante recente) → Aprovar ou Reprovar (motivo obrigatório).
3. **A04 Pedidos** → filtra por status → abre timeline completa de qualquer pedido.
4. **A05 Disputas** → abre case → vê evidência de cliente e faxineira lado a lado → escolhe decisão (reembolso total/parcial/libera) → justificativa obrigatória → confirma em modal → processa automaticamente via Asaas.
5. **A06 Financeiro** → filtra período → exporta CSV/PDF.
6. **A07 Preços por Cidade** → edita tabela → salva com histórico de mudança registrado.

---

## 4. Estados de Cada Tela

Todo estado abaixo é obrigatório onde a tela pode legitimamente cair nele. O estado **vazio** aparece em toda lista — é o mais esquecido e o que mais define a primeira impressão.

| Tela / Grupo | Loading | Vazio | Erro | Offline | Sucesso |
|---|---|---|---|---|---|
| C08 Home | Skeleton dos cards | "Você ainda não tem pedidos. Crie o primeiro e receba propostas em minutos." + CTA | "Não deu pra carregar seus pedidos agora." + Tentar de novo | Banner fixo: "Sem conexão. Mostrando a última versão salva." | Badge de status atualizado ao vivo |
| C10-C15 Wizard | — (dados locais, sem loading) | — | Campo obrigatório vazio: contorno vermelho + texto abaixo | Wizard continua funcionando (rascunho local), só o passo de checkout exige conexão | Barra de progresso avança com transição suave |
| C16 Checkout | "Validando cartão…" | — | "Cartão recusado. Tente outro ou fale com seu banco." | "Sem conexão. Não é possível processar pagamento agora." | "Pagamento aprovado, será cobrado após o serviço" |
| C18 Lista de Candidatas | Skeleton de cards | "Ainda ninguém se candidatou. Avisaremos assim que alguém aparecer." (após 48h: sugestão de taxa de urgência) | "Não conseguimos carregar as candidatas." + Tentar de novo | Lista da última sincronização, banner de aviso | Nova candidata entra com animação de entrada no topo |
| C20 Pedido em Andamento | Spinner na etapa atual | — | "Perdemos a conexão com o status do pedido." + Atualizar | Última etapa conhecida fica destacada, resto acinzentado | Checkmark verde a cada etapa concluída |
| C21 Código de Confirmação | Gerando código… | — | "Não foi possível gerar o código agora." + Tentar de novo | Código gerado localmente funciona sem internet | Código exibido em destaque, cópia fácil |
| C22 / F18 Chat | Skeleton de bolhas | "Converse com a faxineira aqui assim que ela for selecionada." | "Mensagem não enviada." + Reenviar | Mensagens em fila, ícone de relógio até reconectar | Check duplo ao entregar |
| F05 Buscar Trabalho (feed) | Skeleton de cards | "Nenhum pedido na sua região agora. Aumente seu raio de atuação ou volte mais tarde." | "Não conseguimos atualizar o feed." + Tentar de novo | Feed funciona sem push (regra de negócio: 100% funcional offline de notificação) | Pull-to-refresh com novo pedido aparecendo no topo |
| F11 Confirmação de Chegada | "Validando localização…" | — | "Não consegui validar sua localização. Fale com o suporte." (bloqueia) | GPS+foto exige conexão para validar; código funciona offline | "Chegada confirmada!" com check verde |
| F16 Carteira | Skeleton dos valores | "Nenhum serviço concluído ainda. Assim que você finalizar um, o valor aparece aqui." | "Não conseguimos carregar seu saldo agora." | Mostra último saldo sincronizado com aviso | Saldo atualiza com animação de contagem |
| F17 Solicitar Saque | "Processando saque…" | — | "Chave PIX inválida. Corrija para continuar." (após 3 falhas: saques suspensos até correção) | Bloqueado — saque exige conexão | "Solicitado! Cai em 1-2 dias úteis." |
| A03/A04/A05 (Admin listas) | Skeleton de linhas da tabela | "Nenhum item nesta fila agora." | "Erro ao carregar." + Recarregar | N/A (web assume conexão) | Toast de confirmação após ação |

---

## 5. Microcópia Crítica

Tom: direto, sem gíria, trata o usuário como adulto que está com pressa (uma mão, em pé, internet ruim).

### Botões
| Contexto | Texto |
|---|---|
| Avançar no wizard | "Continuar" |
| Fechar o pedido | "Confirmar pedido" |
| Escolher faxineira | "Escolher [Nome]" |
| Chegada confirmada manualmente | "Cheguei" |
| Encerrar serviço | "Concluído" |
| Confirmar qualidade | "Sim, está tudo certo" |
| Reportar problema | "Tive um problema" |
| Pedir dinheiro | "Solicitar saque" |
| Cancelar ação destrutiva | "Cancelar pedido" (nunca "OK" genérico) |

### Erros
| Situação | Mensagem |
|---|---|
| Cartão recusado (1ª tentativa) | "Cartão recusado. Vamos tentar de novo em breve." |
| Cartão recusado (após 2 tentativas) | "Seu cartão foi recusado duas vezes. Troque o cartão em até 6h ou o pedido será cancelado." |
| Double-booking | "Você já tem um serviço agendado nesse horário. Escolha outro pedido." |
| GPS falha na chegada | "Não conseguimos confirmar sua localização. Fale com o suporte para continuar." |
| Chave PIX inválida | "Essa chave PIX não é válida. Confira e tente de novo." |
| Sem conexão | "Sem conexão com a internet. Algumas ações vão esperar você voltar a ficar online." |
| Cidade sem cobertura | "Ainda não atendemos essa região. Deixe seu contato e avisamos quando chegarmos lá." |

### Confirmações
| Situação | Mensagem |
|---|---|
| Pedido criado | "Pedido criado! Você será avisado assim que alguém se candidatar." |
| Pagamento pré-autorizado | "Pagamento aprovado. Só cobramos depois que o serviço for confirmado." |
| Chegada confirmada | "Chegada confirmada. Bom serviço!" |
| Serviço confirmado pelo cliente | "Pagamento processado. Avalie como foi o serviço." |
| Confirmação automática (24h) | "Confirmamos automaticamente porque o prazo de 24h passou. Avalie o serviço." |
| Saque solicitado | "Saque de R$[valor] solicitado. Cai na sua chave PIX em 1-2 dias úteis." |
| Disputa decidida | "Sua disputa foi analisada: [resultado]. Qualquer dúvida, fale com o suporte." |

### Avisos fixos
- No chat: **"Combinar pagamento fora do app não tem garantia da Moppy."**
- Na taxa de urgência: **"Essa taxa não é reembolsável, mesmo se ninguém aceitar o pedido."**
- No cancelamento com menos de 12h: **"Cancelar agora vai custar 30% de compensação à faxineira."**

---

## 6. Regras de UX do Pagamento

Coerente com `PAYMENT-FLOW.md` (pré-autorização D-1 → captura pós-confirmação → split 70/30 automático via Asaas).

### O que o cliente vê em cada etapa
| Momento do PAYMENT-FLOW.md | O que aparece na tela | Tela |
|---|---|---|
| Checkout concluído | "Pagamento será feito na véspera do serviço. Nada é cobrado agora." | C16 → C17 |
| Cron D-1 dispara e pré-autoriza | Push silencioso + status "Pagamento aprovado" no Detalhe do Pedido | C20 |
| Pré-autorização falha (1ª/2ª tentativa) | Nada visível ainda (retries são silenciosos, evita alarme falso) | — |
| Falha após 2 tentativas | Push urgente + banner vermelho fixo: "Cartão recusado. Troque em até 6h." | C16 (reaberto) |
| Cliente confirma "Sim" | Loading breve "Processando pagamento…" seguido de sucesso | C23 |
| Cliente não responde 24h | Nenhuma tela nova — próximo login mostra "Confirmamos automaticamente" no Detalhe | C20 (histórico) |
| Disputa aberta | "Valor retido até a decisão. Isso pode levar até 48h." | C24 |
| Decisão da disputa | Notificação + resumo do valor processado no Detalhe do Pedido | C20 (histórico) |

### Como o usuário sabe que deu certo
- **Nunca** um fluxo de pagamento termina sem confirmação visual explícita — nem um toast que some sozinho: pré-autorização, captura, estorno e saque sempre geram uma tela ou card persistente que o usuário pode reabrir depois (histórico do pedido / extrato da carteira).
- Todo valor exibido é **sempre líquido e bruto lado a lado** quando relevante (faxineira vê os dois; cliente vê preço final com taxa desagregada).

### O que o usuário faz se falhar
| Falha | Ação disponível na tela |
|---|---|
| Pré-autorização recusada | Botão "Trocar cartão" leva direto para C16 pré-preenchido |
| Captura falha (raro) | Nenhuma ação do usuário — mensagem "Estamos processando, avisamos em breve" + suporte acionado internamente |
| Estorno falha | "Seu reembolso está demorando mais que o esperado. Nossa equipe já foi avisada." + botão "Falar com suporte" |
| Saque com chave PIX inválida | Formulário reabre com o campo da chave em destaque + "Corrigir chave PIX" |
| Webhook atrasado (sync a cada 2h) | Nenhuma tela nova — o app mostra o último status conhecido sem travar a navegação |

### Split visível (transparência é o produto)
Na tela de Revisão de Preço (C14) e no Detalhe do Pedido (candidata, F07), sempre mostrar:
- Cliente vê: preço base + adicionais + taxa de serviço = total.
- Faxineira vê: valor bruto do serviço → **valor líquido a receber** já com comissão (15%) e taxa de processamento descontados, **antes** de se candidatar — nunca depois.

---

## PRÓXIMO PASSO

1. Jehu revisa este USER-FLOWS.md e roda `/fabrica-gate` para o Gate 4 (UX), comparando com a versão anterior já aprovada — a lógica não mudou, só o nível de referência visual.
2. Com o Gate 4 revalidado, seguir para a Etapa 6: `fab-ui` usa esta tabela de 54 telas + links do Mobbin para gerar `DESIGN-SYSTEM.md` e, principalmente, o `UI-SPEC.md` — um prompt pronto por tela para colar no Claude Designer, uma tela por vez, citando a referência Mobbin correspondente no próprio prompt.
3. Onde a coluna ficou "buscar no Mobbin" (14 telas: Login/Cadastro, Home populada, Data/Hora — coberto parcialmente, Está tudo certo?, Filtros do Feed, Candidatura, Minha Agenda, Concluído/Aguardando, Histórico de Serviços, Login Admin, Preços por Cidade, Score de Confiabilidade), vale uma segunda passada manual no Mobbin antes de gerar o prompt daquela tela específica — ou seguir direto pro Designer com a lógica já descrita aqui, sem referência visual de apoio.
