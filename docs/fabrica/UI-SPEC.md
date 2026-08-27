# Moppy — UI-SPEC (Prompts Claude Designer)

**Projeto:** Moppy — Marketplace de Faxina
**Data:** 2026-08-24
**Status:** 🟢 55 prompts prontos — cada um cola direto no Claude Designer, sem edição manual

Este documento substitui a versão anterior do UI-SPEC.md. Mudou o nível de detalhe: cada prompt agora carrega o **link Mobbin exato** do `USER-FLOWS.md` (redesenho de 2026-08-24) e os **tokens de cor/tipografia do DESIGN-SYSTEM.md embutidos linha a linha** — o Jehu não precisa abrir outro arquivo para completar nada.

Onde o `USER-FLOWS.md` marcou "buscar no Mobbin" (14 telas), o prompt abaixo diz isso explicitamente e sugere o app de referência mais próximo já usado em outra tela do mesmo fluxo, para não deixar o Jehu sem nenhuma direção visual.

Duas paletas de tokens se repetem em todo prompt (copie exatamente como está — vêm do `DESIGN-SYSTEM.md`):

**Bloco mobile (Cliente + Faxineira, Expo/React Native):**
```
Cores: C.primary=#7C3AED, C.primaryDark=#6D28D9, C.primaryLight=#EDE9FE, C.fundo=#FFFFFF, C.superficie=#F9FAFB, C.borda=#E5E7EB, C.textoPrimario=#374151, C.textoMaximo=#1F2937, C.textoSecundario=#9CA3AF, C.sucesso=#10B981, C.erro=#EF4444, C.aviso=#F59E0B, C.info=#3B82F6
Tipografia: Inter (fallback -apple-system, Segoe UI), título Heading 2 24px/700, subtítulo Heading 3 20px/700, corpo Body 14px/400, botão Label 14px/500, legenda Caption 11px/400
Espaçamento base 8px — padding página 24px, padding card 16px, gap entre cards 12px
Raio de card 8px, raio de botão 8px, raio de badge/pill 12px, avatar circular (raio 50%)
Ícones: Feather Icons, 20-24px, alinhados ao centro vertical do texto
Área de toque mínima 44×44px
Animações: Reanimated v2, transições padrão 150ms cubic-bezier(0.4,0,0.2,1); modais entram em 150ms ease-in-out
**Tab bar Cliente:** Home | Perfil (bottom tab bar fixo, 2 abas apenas. Histórico e Cancelados vivem como segmented control DENTRO de Home/C08, não como tabs. Sem tab bar em wizards, modais e telas fullscreen.)
**Tab bar Faxineira:** Buscar | Agenda | Carteira | Perfil (bottom tab bar fixo, 4 abas. Minhas Candidaturas vive como aba DENTRO de Buscar/F05, não como tab.)
```

**Bloco admin (Web, Next.js):**
```
Cores: mesma paleta do app — C.primary=#7C3AED, C.fundo=#FFFFFF, C.superficie=#F9FAFB, C.borda=#E5E7EB, C.textoPrimario=#374151, C.textoMaximo=#1F2937, C.textoSecundario=#9CA3AF, C.sucesso=#10B981, C.erro=#EF4444, C.aviso=#F59E0B, C.info=#3B82F6
Tipografia: Inter, título de página Heading 1 28px/700, título de seção Heading 2 24px/700, corpo Body 14px/400, célula de tabela Body Small 12px/400
Densidade "dense" nas tabelas: padding 12px, altura de linha 32px; página com padding 24-32px
Raio de card/painel lateral 8px, raio de botão 8px
Ícones: Feather Icons, 20px
Animações: CSS, transições 150ms ease-in-out
```

Cada prompt abaixo já embute a versão correta desse bloco — não precisa copiar de novo, só usar o prompt inteiro tal como está.

---

## 1. CLIENTE (C01–C26)

## Tela: C01 — Splash
**Referência Mobbin:** [Preply](https://mobbin.com/screens/75848004-2d18-47c2-ab3c-051786989681)
**Estados:** loading / sucesso

```prompt para o Claude Designer
Crie a tela de Splash de um app de marketplace de faxina (Moppy) para clientes que contratam limpeza residencial.

ESTRUTURA (de cima para baixo):
- Fundo cheio na cor primária C.primary=#7C3AED
- Logo Moppy (gota d'água branca) centralizada vertical e horizontalmente
- Abaixo do logo, texto pequeno branco translúcido opcional com a versão do app

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (fundo cheio), branco #FFFFFF (logo e texto)
- Tipografia: Inter, versão do app em Caption 11px/400 branco 70% opacidade
- Espaçamento base 8px, sem cards nesta tela
- Ícones: Feather Icons não se aplica (só logo vetorial)

COMPONENTES:
- Spinner branco discreto, 1s linear infinito, logo abaixo do logo, indicando validação de sessão

AÇÃO PRINCIPAL:
- Nenhuma interação do usuário. Navegação automática e silenciosa: sessão válida leva para Home (C08); sem sessão leva para Login/Cadastro (C02).

ESTADO A MOSTRAR: loading (spinner visível, sem texto de erro). Gere também uma variação trocando esta linha para "sucesso" (fade-out do splash, 150ms) se quiser mostrar a transição.

Mobile first. Referência visual de layout: https://mobbin.com/screens/75848004-2d18-47c2-ab3c-051786989681 (Preply — splash).
```

## Tela: C02 — Login / Cadastro
**Referência Mobbin:** não encontrada nesta pesquisa (USER-FLOWS.md marcou "buscar no Mobbin") — use como direção visual o padrão de abas limpo de formulários de auth premium (ex.: mesma linguagem visual das abas do inDrive usadas em C03)
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie a tela de Login/Cadastro (email + senha, Firebase Auth) de um app de marketplace de faxina (Moppy) para clientes.

ESTRUTURA (de cima para baixo):
- Logo Moppy pequeno centralizado no topo
- Segmented control com duas abas: "Entrar" / "Cadastrar"
- Modo Entrar: campo email, campo senha (com ícone de olho para mostrar/ocultar), link "Esqueci minha senha", botão "Entrar"
- Modo Cadastrar: campo email, campo senha, campo confirmar senha, checkbox "Concordo com os Termos", botão "Cadastrar"

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (aba ativa e botão), C.fundo=#FFFFFF, C.borda=#E5E7EB (contorno input), C.erro=#EF4444 (contorno e texto de erro), C.textoSecundario=#9CA3AF (placeholder)
- Tipografia: Inter, título ausente (segmented control já orienta), label do input Label 14px/500, texto de erro Body Small 12px/400 em C.erro
- Espaçamento base 8px, padding página 24px, gap entre campos 12px
- Raio de input 6px, raio de botão 8px
- Ícones: Feather Icons — "eye"/"eye-off" para senha

COMPONENTES:
- Input de texto com erro inline sob o campo (contorno vermelho + texto de erro abaixo, nunca some o que já foi digitado)
- Botão primário full-width, altura 44px

AÇÃO PRINCIPAL:
- "Entrar" autentica e leva para Home (C08) se já tiver perfil completo, ou para Escolha de Papel (C03) se for a primeira vez.
- "Cadastrar" cria a conta e leva direto para C03.

ESTADO A MOSTRAR: erro — mostre a mensagem "E-mail ou senha incorretos." sob o campo senha, com contorno vermelho, mantendo o email já digitado no campo.

Mobile first. Sem referência Mobbin direta encontrada para esta tela — use um padrão limpo de abas Entrar/Cadastrar equivalente ao de apps de marketplace premium (Uber, iFood).
```

## Tela: C03 — Escolha de Papel
**Referência Mobbin:** [inDrive — "Passenger or driver?"](https://mobbin.com/screens/d49d16c7-e096-4c3f-a9f4-570ce4e599d4) · [Wise — tipo de conta](https://mobbin.com/screens/f2733067-8528-4536-9d54-b30e3ced0c47)
**Estados:** sucesso (única, sem erro possível)

```prompt para o Claude Designer
Crie a tela de Escolha de Papel de um app de marketplace de faxina (Moppy), logo após o cadastro, para definir se a conta é Cliente ou Faxineira.

ESTRUTURA (de cima para baixo):
- Título "Como você quer usar o Moppy?"
- Duas cards grandes, empilhadas verticalmente, ocupando 80% da largura da tela cada, margens iguais nas laterais
- Card 1: ícone de pessoa + "Contratar Faxina" + descrição "Procure faxineiras qualificadas para sua casa"
- Card 2: ícone de mão + "Oferecer Faxina" + descrição "Aceite trabalhos e ganhe com sua experiência"

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.superficie=#F9FAFB (fundo do card), C.borda=#E5E7EB, C.primary=#7C3AED (ícone e destaque ao tocar)
- Tipografia: título Heading 2 24px/700 C.textoMaximo=#1F2937, título do card Heading 3 20px/700, descrição Body 14px/400 C.textoSecundario=#9CA3AF
- Espaçamento base 8px, padding página 24px, gap entre as duas cards 16px, padding interno do card 16px
- Raio de card 8px
- Ícones: Feather Icons, 32px dentro do card

COMPONENTES:
- Card clicável inteiro (sem botão separado) — toque em qualquer parte da card já navega

AÇÃO PRINCIPAL:
- Tocar em "Contratar Faxina" define papel Cliente e avança direto para Cadastro de Endereço (C04), sem botão "Próximo".
- Tocar em "Oferecer Faxina" define papel Faxineira e avança para Cadastro com Documentos (F02).

ESTADO A MOSTRAR: sucesso (estado único desta tela — sem loading, vazio ou erro aplicável)

Mobile first. Referência visual de layout: https://mobbin.com/screens/d49d16c7-e096-4c3f-a9f4-570ce4e599d4 (inDrive) e https://mobbin.com/screens/f2733067-8528-4536-9d54-b30e3ced0c47 (Wise).
```

## Tela: C04 — Onboarding — Cadastro de Endereço
**Referência Mobbin:** [On — novo endereço](https://mobbin.com/screens/a68ae3ca-9ce6-4ca1-9056-48c708429d34) · [Honest Greens](https://mobbin.com/screens/66c021dc-80f1-46a3-af4b-d779644ed2e9)
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie a tela de Cadastro de Endereço de um app de marketplace de faxina (Moppy), para o cliente registrar o primeiro endereço da casa.

ESTRUTURA (de cima para baixo):
- Título "Onde fica sua casa?"
- Formulário com campos: Rua, Número, Complemento (opcional), Bairro, Cidade, CEP
- Campo CEP com ícone de lupa que autocompleta bairro e cidade
- Preview de mapa abaixo do formulário (20% da altura da tela) mostrando um pin no endereço digitado
- Botão "Salvar endereço" fixo no rodapé

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.borda=#E5E7EB, C.primary=#7C3AED (pin do mapa e botão), C.erro=#EF4444 (validação)
- Tipografia: título Heading 2 24px/700, label do campo Label 14px/500, texto do input Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre campos 12px
- Raio de input 6px, raio do preview de mapa 8px, raio de botão 8px
- Ícones: Feather Icons — "search" no campo CEP, "map-pin" no mapa

COMPONENTES:
- Input com máscara de CEP (00000-000)
- Mapa estático com pin (usar mock de mapa, sem necessidade de API real no protótipo)
- Botão fixo no rodapé, desabilitado até todos os campos obrigatórios preenchidos

AÇÃO PRINCIPAL:
- "Salvar endereço" valida (nenhum campo vazio, CEP válido) e avança para Salvar Cartão (C05) no onboarding, ou volta para a lista de endereços se acessada a partir do Perfil (C26).

ESTADO A MOSTRAR: erro — CEP inválido digitado, contorno vermelho no campo CEP e texto "CEP inválido, confira e tente de novo." abaixo.

Mobile first. Referência visual de layout: https://mobbin.com/screens/a68ae3ca-9ce6-4ca1-9056-48c708429d34 (On) e https://mobbin.com/screens/66c021dc-80f1-46a3-af4b-d779644ed2e9 (Honest Greens).
```

## Tela: C05 — Onboarding — Salvar Cartão
**Referência Mobbin:** formulário de captura sem referência forte (USER-FLOWS.md: "buscar no Mobbin") · gerenciamento pós-cadastro: [Deliveroo](https://mobbin.com/screens/d72704c5-0d33-44c6-9a00-e5d10eb6445f)
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie a tela de Salvar Cartão de um app de marketplace de faxina (Moppy), para tokenizar o cartão do cliente via gateway Asaas (nenhum dado sensível fica salvo no app).

ESTRUTURA (de cima para baixo):
- Título "Adicione um cartão"
- Formulário: Número do cartão (com máscara 0000 0000 0000 0000), Validade (MM/YY) e CVV lado a lado, Nome do titular
- Campo CVV oculto (bolinhas) até receber foco
- Checkbox "Lembrar este cartão para próximos pagamentos"
- Botão "Salvar cartão" fixo no rodapé

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.borda=#E5E7EB, C.primary=#7C3AED (botão), C.erro=#EF4444 (cartão recusado)
- Tipografia: título Heading 2 24px/700, label Label 14px/500, input Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre campos 12px
- Raio de input 6px, raio de botão 8px
- Ícones: Feather Icons — "credit-card" no campo número, bandeira do cartão (Visa/Mastercard) detectada automaticamente à direita

COMPONENTES:
- Input com máscara de número de cartão e detecção de bandeira
- Checkbox padrão
- Botão fixo no rodapé

AÇÃO PRINCIPAL:
- "Salvar cartão" tokeniza via Asaas e avança para Aceitar Termos LGPD (C06) no onboarding, ou volta para a lista de cartões se acessada a partir do Perfil (C26) ou do Checkout (C16).

ESTADO A MOSTRAR: erro — mensagem específica "Cartão recusado. Vamos tentar de novo em breve." em vermelho abaixo do formulário, sem apagar os dados já digitados.

Mobile first. Sem referência Mobbin forte para o formulário de captura — para o padrão de gerenciamento pós-cadastro, use https://mobbin.com/screens/d72704c5-0d33-44c6-9a00-e5d10eb6445f (Deliveroo).
```

## Tela: C06 — Onboarding — Aceitar Termos LGPD
**Referência Mobbin:** [foodpanda](https://mobbin.com/screens/a77fb4b9-cf63-47ad-9931-6058c27c5f58) · [Clue](https://mobbin.com/screens/77e7a0d5-ddbc-4282-ae08-a1d396739709)
**Estados:** sucesso (checkbox desabilita/habilita botão, sem erro de servidor)

```prompt para o Claude Designer
Crie a tela de Aceitar Termos LGPD de um app de marketplace de faxina (Moppy), última etapa do onboarding do cliente antes de liberar a Home.

ESTRUTURA (de cima para baixo):
- Título "Últimos detalhes"
- Área scrollável com o texto de Termos de Uso e Política de Privacidade (fonte pequena, cinza)
- Checkbox obrigatório "Li e concordo com os Termos de Uso e a Política de Privacidade" logo abaixo do texto, dentro do scroll
- Botão "Continuar" fixo no rodapé

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.textoSecundario=#9CA3AF (texto legal), C.primary=#7C3AED (botão ativo), C.borda=#E5E7EB (botão desabilitado)
- Tipografia: título Heading 2 24px/700, texto legal Body Small 12px/400, checkbox Label 14px/500
- Espaçamento base 8px, padding página 24px
- Raio de botão 8px

COMPONENTES:
- Checkbox obrigatório (contorno 2px)
- Botão que muda de cor pálida C.borda=#E5E7EB para C.primary=#7C3AED assim que o checkbox é marcado

AÇÃO PRINCIPAL:
- "Continuar" (desabilitado até marcar o checkbox) leva para Home vazia (C08) com CTA "Criar meu primeiro pedido".

ESTADO A MOSTRAR: sucesso — mostre o botão no estado ativo (checkbox já marcado) e também gere uma variação com o botão desabilitado (checkbox desmarcado) trocando esta linha.

Mobile first. Referência visual de layout: https://mobbin.com/screens/a77fb4b9-cf63-47ad-9931-6058c27c5f58 (foodpanda) e https://mobbin.com/screens/77e7a0d5-ddbc-4282-ae08-a1d396739709 (Clue).
```

## Tela: C07 — Permissão de Notificações
**Referência Mobbin:** [Grubhub](https://mobbin.com/screens/644de4d8-28ca-449c-9387-1d68051a3db2)
**Estados:** sucesso (única)

```prompt para o Claude Designer
Crie a tela de Permissão de Notificações de um app de marketplace de faxina (Moppy). Esta tela aparece apenas depois que o cliente cria o primeiro pedido, nunca durante o onboarding inicial.

ESTRUTURA (de cima para baixo):
- Ícone grande de sino (ilustração ou ícone Feather ampliado), centralizado
- Título "Fique por dentro"
- Descrição "Avise-me quando uma faxineira aceitar meu pedido e quando o serviço estiver perto de terminar"
- Dois botões empilhados: "Ativar notificações" (primário) e "Talvez depois" (secundário/texto)

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (ícone e botão primário), C.textoMaximo=#1F2937 (título), C.textoSecundario=#9CA3AF (descrição)
- Tipografia: título Heading 2 24px/700, descrição Body 14px/400 centralizado
- Espaçamento base 8px, padding página 24px, gap entre os dois botões 12px
- Raio de botão 8px
- Ícones: Feather Icons "bell", 64px

COMPONENTES:
- Botão primário full-width 44px de altura
- Botão secundário estilo texto (sem fundo, cor C.primary)

AÇÃO PRINCIPAL:
- "Ativar notificações" solicita a permissão nativa do sistema e continua para a Home.
- "Talvez depois" não bloqueia o fluxo — vai direto para a Home também.

ESTADO A MOSTRAR: sucesso (estado único — decisão binária, sem erro de servidor)

Mobile first. Referência visual de layout: https://mobbin.com/screens/644de4d8-28ca-449c-9387-1d68051a3db2 (Grubhub).
```

## Tela: C08 — Home (Cliente)
**Referência Mobbin:** [Postmates — vazio](https://mobbin.com/screens/fade7a5a-0726-459f-abe6-5e2715a80002) · versão populada: buscar no Mobbin (siga o mesmo padrão de lista de pedidos usado em outros marketplaces de serviço, ex. Angi)
**Estados:** loading / vazio / erro / offline / sucesso

```prompt para o Claude Designer
Crie a tela Home do cliente de um app de marketplace de faxina (Moppy), tela principal pós-login.

ESTRUTURA (de cima para baixo):
- Header: "Oi, [Nome]" + data de hoje
- Segmented control com 3 abas: "Próximos" / "Histórico" / "Cancelados" (troca de lista sem navegar de tela)
- Lista de cards de pedido, cada card contém: header com ícone + tipo de limpeza (ex. "Limpeza Padrão"), data/hora, valor final em C.primary=#7C3AED (roxo); badge de status ("Aberto", "Aguardando", "Selecionado", "Em serviço", "Concluído", "Cancelado"); se já tiver faxineira selecionada, foto redonda + nome + nota com estrela
- FAB "+" fixo no canto inferior direito

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.superficie=#F9FAFB (card), C.borda=#E5E7EB, C.primary=#7C3AED (valor e badge concluído), C.primaryLight=#EDE9FE (badge aberto), C.erro=#EF4444 (badge cancelado), C.aviso=#F59E0B (badge aguardando)
- Tipografia: saudação Heading 2 24px/700, tipo de limpeza Heading 3 20px/700, data/hora Body Small 12px/400, valor Label 14px/500
- Espaçamento base 8px, padding página 24px, gap entre cards 12px, padding interno do card 16px
- Raio de card 8px, raio de badge 12px, avatar circular
- Ícones: Feather Icons

COMPONENTES:
- Segmented control (3 opções)
- Card de pedido (composto: header + badge + faxineira)
- FAB circular 56px, sombra média, ícone "+" branco
- Skeleton de cards para loading
- Banner fixo de offline no topo

AÇÃO PRINCIPAL:
- Toque no FAB "+" abre o wizard de Criar Pedido (C09), fullscreen, sem tab bar.
- Toque em um card abre o Detalhe do Pedido correspondente ao status (C18, C20 ou histórico read-only).

ESTADO A MOSTRAR: vazio — mostre a mensagem "Você ainda não tem pedidos. Crie o primeiro e receba propostas em minutos." centralizada com ilustração simples, e o botão "Criar meu primeiro pedido" no lugar do FAB. Gere variações trocando esta linha para: loading (skeleton de 3 cards), erro ("Não deu pra carregar seus pedidos agora." + botão Tentar de novo), offline (banner fixo "Sem conexão. Mostrando a última versão salva.") ou sucesso (lista populada).

Mobile first. Referência visual de layout (estado vazio): https://mobbin.com/screens/fade7a5a-0726-459f-abe6-5e2715a80002 (Postmates). Para o estado populado, use o mesmo padrão de lista de cards de outros marketplaces de serviço premium (Angi, TaskRabbit).
```

## Tela: C09 — Criar Pedido — Passo 1: Endereço
**Referência Mobbin:** reaproveita a referência de C04 ([On](https://mobbin.com/screens/a68ae3ca-9ce6-4ca1-9056-48c708429d34) · [Honest Greens](https://mobbin.com/screens/66c021dc-80f1-46a3-af4b-d779644ed2e9))
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie o Passo 1 (Endereço) do wizard de Criar Pedido de um app de marketplace de faxina (Moppy), fullscreen, sem tab bar.

ESTRUTURA (de cima para baixo):
- Barra de progresso no topo preenchida 1/8
- Título "Onde limpamos?"
- Lista de endereços salvos em cards (ícone de casa + rua, número, bairro), o mais usado já vem pré-selecionado com um checkmark
- Link "+ Adicionar novo endereço" em cor primária C.primary=#7C3AED C.info=#3B82F6, abaixo da lista
- Botão "Continuar" fixo no rodapé

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (barra de progresso e checkmark), C.superficie=#F9FAFB (card), C.primary=#7C3AED (link adicionar), C.borda=#E5E7EB
- Tipografia: título Heading 2 24px/700, endereço Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre cards 12px
- Raio de card 8px, raio de botão 8px
- Ícones: Feather Icons "home", "check-circle" no selecionado

COMPONENTES:
- Barra de progresso linear (1/8 preenchida em C.primary)
- Card de endereço selecionável (radio implícito por card)
- "+ Adicionar novo endereço" abre o formulário C04 como modal inline

AÇÃO PRINCIPAL:
- Botão "Continuar" (ativa somente com um endereço selecionado) avança para o Passo 2 — Tipo de Limpeza (C10).

ESTADO A MOSTRAR: sucesso — endereço pré-selecionado, botão "Continuar" ativo. Gere uma variação trocando para "erro" caso o usuário tente avançar sem selecionar (mensagem "Selecione um endereço para continuar.").

Mobile first. Referência visual de layout: https://mobbin.com/screens/a68ae3ca-9ce6-4ca1-9056-48c708429d34 (On) e https://mobbin.com/screens/66c021dc-80f1-46a3-af4b-d779644ed2e9 (Honest Greens).
```

## Tela: C10 — Criar Pedido — Passo 2: Tipo de Limpeza
**Referência Mobbin:** [Careem HomeServices — categorias](https://mobbin.com/screens/d8e56d7f-8412-4b3b-b640-a926c846bf0a)
**Estados:** sucesso (seleção única, sem erro)

```prompt para o Claude Designer
Crie o Passo 2 (Tipo de Limpeza) do wizard de Criar Pedido de um app de marketplace de faxina (Moppy), fullscreen, sem tab bar.

ESTRUTURA (de cima para baixo):
- Barra de progresso no topo preenchida 2/8
- Título "Qual é o tipo de limpeza?"
- 3 cards grandes empilhados, ocupando ~100% da largura:
  1. Ícone + "Limpeza Padrão" + descrição "Dusting, varrer, mopar, banheiros"
  2. Ícone + "Limpeza Pesada" + descrição "Paredes, armários, fundo de tudo"
  3. Ícone + "Passar Roupas" + descrição "Pela metragem da casa"

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (barra de progresso 2/8 e ícone da card), C.superficie=#F9FAFB (card), C.textoSecundario=#9CA3AF (descrição)
- Tipografia: título Heading 2 24px/700, título do card Heading 3 20px/700, descrição Body Small 12px/400
- Espaçamento base 8px, padding página 24px, gap entre cards 12px, padding interno do card 16px
- Raio de card 8px
- Ícones: Feather Icons, 28px

COMPONENTES:
- Card clicável (sem botão "Próximo" — toque na card já avança, mesmo padrão de C03)

AÇÃO PRINCIPAL:
- Toque em qualquer card seleciona o tipo e avança automaticamente para o Passo 3 — Tamanho da Casa (C11).

ESTADO A MOSTRAR: sucesso (estado único desta tela)

Mobile first. Referência visual de layout: https://mobbin.com/screens/d8e56d7f-8412-4b3b-b640-a926c846bf0a (Careem HomeServices).
```

## Tela: C11 — Criar Pedido — Passo 3: Tamanho da Casa
**Referência Mobbin:** [Careem — Packers&Movers, tamanho do imóvel](https://mobbin.com/screens/18967ec3-fd3a-4605-9c56-d6081fba09c6)
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie o Passo 3 (Tamanho da Casa) do wizard de Criar Pedido de um app de marketplace de faxina (Moppy), fullscreen, sem tab bar.

ESTRUTURA (de cima para baixo):
- Barra de progresso no topo preenchida 3/8
- Título "Qual é o tamanho da sua casa?"
- 5 chips/pills em lista vertical: "Studio · R$ 90", "1 quarto · R$ 90", "2 quartos · R$ 120", "3 quartos · R$ 150", "4+ quartos · R$ 180" (preços-base por tamanho segundo tabela oficial)
- Botão "Continuar" fixo no rodapé

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (chip selecionado), C.superficie=#F9FAFB (chip não selecionado), C.textoMaximo=#1F2937 (preço)
- Tipografia: título Heading 2 24px/700, chip Label 14px/500, preço Body Small 12px/400
- Espaçamento base 8px, padding página 24px, gap entre chips 8px
- Raio de chip 12px (pill), raio de botão 8px

COMPONENTES:
- Chip selecionável (background muda para C.primaryLight=#EDE9FE ao selecionar, borda C.primary)
- Botão fixo no rodapé, ativo apenas com um chip selecionado

AÇÃO PRINCIPAL:
- "Continuar" avança para o Passo 4 — Adicionais (C12).

ESTADO A MOSTRAR: sucesso — chip "2 quartos" selecionado, botão ativo. Gere variação "erro" para nenhum chip selecionado (botão desabilitado, cor pálida).

Mobile first. Referência visual de layout: https://mobbin.com/screens/18967ec3-fd3a-4605-9c56-d6081fba09c6 (Careem Packers&Movers).
```

## Tela: C12 — Criar Pedido — Passo 4: Adicionais
**Referência Mobbin:** [Careem — add-ons de serviço](https://mobbin.com/screens/6b740a44-3557-447d-af49-bd4140596f29)
**Estados:** sucesso (toggle livre, sem erro bloqueante)

```prompt para o Claude Designer
Crie o Passo 4 (Adicionais) do wizard de Criar Pedido de um app de marketplace de faxina (Moppy), fullscreen, sem tab bar.

ESTRUTURA (de cima para baixo):
- Barra de progresso no topo preenchida 4/8
- Título "Deseja adicionar algo?"
- Lista de 4 toggles com preço incremental à direita:
  - "1 banheiro extra" +R$ 15
  - "Área externa (varanda/quintal)" +R$ 25
  - "Limpeza de geladeira" +R$ 25
  - "Faxineira leva produtos de limpeza" +R$ 30
- Subtotal em destaque logo abaixo da lista, atualizando a cada toggle
- Botão "Continuar" fixo no rodapé

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (toggle ativo), C.borda=#E5E7EB (toggle inativo), C.sucesso=#10B981 (subtotal)
- Tipografia: título Heading 2 24px/700, item Body 14px/400, preço Label 14px/500, subtotal Heading 3 20px/700
- Espaçamento base 8px, padding página 24px, gap entre itens 12px
- Raio de toggle 6px, raio de botão 8px

COMPONENTES:
- Toggle/switch com preço incremental à direita
- Card de subtotal fixo acima do botão, com transição de 150ms ao atualizar o valor

AÇÃO PRINCIPAL:
- "Continuar" avança para o Passo 5 — Data/Hora (C13).

ESTADO A MOSTRAR: sucesso — dois adicionais marcados, subtotal atualizado refletindo a soma.

Mobile first. Referência visual de layout: https://mobbin.com/screens/6b740a44-3557-447d-af49-bd4140596f29 (Careem add-ons).
```

## Tela: C13 — Criar Pedido — Passo 5: Data/Hora
**Referência Mobbin:** [Warby Parker](https://mobbin.com/screens/69b6baa5-99c9-4bbd-99af-2eb6b1476390) · [Crate & Barrel](https://mobbin.com/screens/23d33f2e-271a-4101-9308-d7b2206af376)
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie o Passo 5 (Data/Hora) do wizard de Criar Pedido de um app de marketplace de faxina (Moppy), fullscreen, sem tab bar.

ESTRUTURA (de cima para baixo):
- Barra de progresso no topo preenchida 5/8
- Título "Quando você precisa?"
- Calendário nativo scrollável, com o dia de hoje destacado; datas indisponíveis (próximas 24h, domingos) em cinza e desabilitadas
- Abaixo do calendário, scroll horizontal de horários em chips de 30 em 30 minutos: "09:00", "09:30", "10:00" ... "17:00"; horários indisponíveis em cinza desabilitado
- Botão "Continuar" fixo no rodapé

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (dia selecionado e chip de horário ativo), C.textoSecundario=#9CA3AF (datas/horários desabilitados), C.borda=#E5E7EB
- Tipografia: título Heading 2 24px/700, dia do calendário Body 14px/400, chip de horário Label 14px/500
- Espaçamento base 8px, padding página 24px, gap entre chips 8px
- Raio de chip 12px (pill)

COMPONENTES:
- Calendário nativo com estado desabilitado visual (cinza, sem interação)
- Scroll horizontal de chips de horário

AÇÃO PRINCIPAL:
- "Continuar" (ativo somente com data e horário selecionados) avança para o Passo 6 — Revisão de Preço (C14).

ESTADO A MOSTRAR: sucesso — data de amanhã e horário "10:00" selecionados. Gere variação "erro" tentando avançar sem selecionar horário (mensagem "Escolha um horário disponível.").

Mobile first. Referência visual de layout: https://mobbin.com/screens/69b6baa5-99c9-4bbd-99af-2eb6b1476390 (Warby Parker) e https://mobbin.com/screens/23d33f2e-271a-4101-9308-d7b2206af376 (Crate & Barrel).
```

## Tela: C14 — Criar Pedido — Passo 6: Revisão de Preço
**Referência Mobbin:** [Fiverr — Order review](https://mobbin.com/screens/da378890-e36b-4be0-aab0-4b3869968189)
**Estados:** sucesso (tela informativa, sem erro)

```prompt para o Claude Designer
Crie o Passo 6 (Revisão de Preço) do wizard de Criar Pedido de um app de marketplace de faxina (Moppy), fullscreen, sem tab bar.

ESTRUTURA (de cima para baixo):
- Barra de progresso no topo preenchida 6/8
- Título "Revisar seu pedido"
- Bloco de resumo desagregado, tudo visível, nada escondido:
  Base (Limpeza Padrão, 1 quarto): R$ 90,00
  + Banheiro extra: R$ 15,00
  + Taxa de processamento (50% da taxa Asaas): R$ 1,82
  divisor
  Total: R$ 106,82 (em destaque, maior e em negrito)
  (Nota: Comissão de 15% é descontada do valor recebido pela faxineira, não do cliente.)
- Botão "Próximo passo" fixo no rodapé

DESIGN SYSTEM:
- Cores: C.textoSecundario=#9CA3AF (linhas de taxa, texto pequeno cinza), C.textoMaximo=#1F2937 (total)
- Tipografia: título Heading 2 24px/700, linha de item Body 14px/400, total Heading 2 24px/700
- Espaçamento base 8px, padding página 24px, gap entre linhas 8px
- Divider 1px C.borda=#E5E7EB acima do total

COMPONENTES:
- Lista de linhas de preço com divider antes do total
- Botão fixo no rodapé

AÇÃO PRINCIPAL:
- "Próximo passo" avança para o Passo 7 — Taxa de Urgência (C15).

ESTADO A MOSTRAR: sucesso (tela puramente informativa, sem estado alternativo)

Mobile first. Referência visual de layout: https://mobbin.com/screens/da378890-e36b-4be0-aab0-4b3869968189 (Fiverr Order review).
```

## Tela: C15 — Criar Pedido — Passo 7: Taxa de Urgência
**Referência Mobbin:** [Feeld — "Be found with Uplift"](https://mobbin.com/screens/59b09d01-14dd-4201-b072-51c1c1b3f735)
**Estados:** sucesso (seleção opcional, sem erro)

```prompt para o Claude Designer
Crie o Passo 7 (Taxa de Urgência) do wizard de Criar Pedido de um app de marketplace de faxina (Moppy), fullscreen, sem tab bar.

ESTRUTURA (de cima para baixo):
- Barra de progresso no topo preenchida 7/8
- Título "Quer aumentar sua visibilidade?"
- Descrição "Destaque seu pedido para receber propostas mais rápido. Essa taxa não é reembolsável, mesmo se ninguém aceitar o pedido."
- 3 cards horizontais empilhados:
  - "Normal" — sem custo adicional (selecionado por padrão)
  - "Urgência Baixa" — +R$ 3,50 (destaca por 6h)
  - "Urgência Alta" — +R$ 5,50 (destaca por 24h)
- Botão "Continuar para pagamento" fixo no rodapé

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (card selecionado), C.superficie=#F9FAFB (cards não selecionados), C.aviso=#F59E0B (aviso de não-reembolsável)
- Tipografia: título Heading 2 24px/700, descrição Body 14px/400, nome do card Label 14px/500, preço Body Small 12px/400
- Espaçamento base 8px, padding página 24px, gap entre cards 12px
- Raio de card 8px

COMPONENTES:
- Card de seleção única (radio implícito)
- Aviso fixo em amarelo claro sobre não-reembolsabilidade

AÇÃO PRINCIPAL:
- "Continuar para pagamento" avança para o Passo 8 — Checkout (C16), com a taxa de urgência (se escolhida) somada ao total.

ESTADO A MOSTRAR: sucesso — "Normal" selecionado por padrão (nenhum custo extra).

Mobile first. Referência visual de layout: https://mobbin.com/screens/59b09d01-14dd-4201-b072-51c1c1b3f735 (Feeld).
```

## Tela: C16 — Checkout — Passo 8: Pagamento
**Referência Mobbin:** [Agoda — método de pagamento](https://mobbin.com/screens/1c9ffe1a-e3df-4f32-a5a8-c8ded2c52544) · [Keeta](https://mobbin.com/screens/fd996dff-6f33-415f-b21e-07f5cddef8b5)
**Estados:** loading / erro / offline / sucesso

```prompt para o Claude Designer
Crie o Passo 8 (Checkout — Pagamento) do wizard de Criar Pedido de um app de marketplace de faxina (Moppy), fullscreen, sem tab bar.

ESTRUTURA (de cima para baixo):
- Barra de progresso no topo preenchida 8/8
- Título "Escolha como pagar"
- Seção "Cartões salvos": lista de cards mostrando últimos 4 dígitos + bandeira (Visa/Mastercard) + nome do titular, toque seleciona (checkmark)
- Link "+ Adicionar novo cartão" abaixo, abre o formulário C05 como modal fullscreen
- Aviso em amarelo claro: "Pagamento será feito na véspera do serviço. Nada é cobrado agora."
- Botão "Confirmar pedido" C.primary=#7C3AED (roxo) fixo no rodapé

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (checkmark do cartão selecionado), C.primary=#7C3AED (botão "Confirmar pedido"), C.aviso=#F59E0B / fundo #FEF3C7 (aviso de pré-autorização), C.erro=#EF4444 (cartão recusado)
- Tipografia: título Heading 2 24px/700, dados do cartão Body 14px/400, aviso Body Small 12px/400
- Espaçamento base 8px, padding página 24px, gap entre cards 12px
- Raio de card 8px, raio de banner de aviso 8px

COMPONENTES:
- Card de cartão salvo selecionável
- Banner de aviso fixo (amarelo claro, ícone de alerta)
- Botão C.primary=#7C3AED (roxo) fixo no rodapé, com estado "Validando cartão…" durante loading

AÇÃO PRINCIPAL:
- "Confirmar pedido" processa a pré-autorização e avança para a Confirmação do Pedido (C17).

ESTADO A MOSTRAR: erro — mensagem "Cartão recusado. Vamos tentar de novo em breve." em vermelho abaixo do cartão selecionado. Gere variações trocando para: loading ("Validando cartão…" com spinner no botão), offline ("Sem conexão. Não é possível processar pagamento agora.") ou sucesso (avança para C17).

Mobile first. Referência visual de layout: https://mobbin.com/screens/1c9ffe1a-e3df-4f32-a5a8-c8ded2c52544 (Agoda) e https://mobbin.com/screens/fd996dff-6f33-415f-b21e-07f5cddef8b5 (Keeta).
```

## Tela: C17 — Confirmação do Pedido
**Referência Mobbin:** [Fiverr — "We're processing your order"](https://mobbin.com/screens/90189b37-6a9d-4ac8-932e-df051f76a391) · [Fiverr — thank you](https://mobbin.com/screens/14c5596a-eda7-4a74-afe0-8c6822eb26b5)
**Estados:** sucesso (única)

```prompt para o Claude Designer
Crie a tela de Confirmação do Pedido de um app de marketplace de faxina (Moppy), exibida logo após o checkout, sem nenhuma cobrança ainda realizada.

ESTRUTURA (de cima para baixo):
- Ícone grande de checkmark C.primary=#7C3AED (roxo) animado, centralizado no topo
- Título "Pedido criado com sucesso!"
- Descrição "Você será avisado assim que uma faxineira se candidatar. Pagamento será feito na véspera do serviço."
- Card cinzento com o resumo: tipo, tamanho, data/hora, valor total
- Dois botões empilhados: "Ver detalhes do pedido" (primário) e "Voltar para Home" (secundário)

DESIGN SYSTEM:
- Cores: C.sucesso=#10B981 (ícone de checkmark), C.superficie=#F9FAFB (card de resumo), C.primary=#7C3AED (botão primário)
- Tipografia: título Heading 2 24px/700, descrição Body 14px/400, resumo Body Small 12px/400
- Espaçamento base 8px, padding página 24px, gap entre elementos 16px
- Raio de card 8px, raio de botão 8px
- Animação: ícone de checkmark com scale-in 150ms + fade, Reanimated v2

COMPONENTES:
- Ícone animado de sucesso
- Card de resumo do pedido
- Dois botões empilhados

AÇÃO PRINCIPAL:
- "Ver detalhes do pedido" leva para a Lista de Candidatas (C18), já que o pedido acabou de ser criado sem faxineira ainda.
- "Voltar para Home" leva para C08; se for o primeiro pedido do cliente, mostra C07 (Permissão de Notificações) antes, depois C08.

ESTADO A MOSTRAR: sucesso (estado único — a tela não some sozinha, espera o toque do usuário em um dos dois botões)

Mobile first. Referência visual de layout: https://mobbin.com/screens/90189b37-6a9d-4ac8-932e-df051f76a391 e https://mobbin.com/screens/14c5596a-eda7-4a74-afe0-8c6822eb26b5 (Fiverr).
```

## Tela: C18 — Lista de Candidatas
**Referência Mobbin:** [Angi — "Hire a Handyman"](https://mobbin.com/screens/71c0cd71-25e9-49c6-8582-450cec5068a9) · [Realtor.com — pros recomendados](https://mobbin.com/screens/b3cc1a68-d11e-4078-93b7-d9326aa7d0a1)
**Estados:** loading / vazio / erro / offline / sucesso

```prompt para o Claude Designer
Crie a tela de Lista de Candidatas de um app de marketplace de faxina (Moppy), mostrando as faxineiras que se candidataram ao pedido do cliente.

ESTRUTURA (de cima para baixo):
- Título "Faxineiras interessadas"
- Lista de cards verticais, cada um com: foto redonda + nome + nota (ex.: "4,8 · 23 serviços"); linha de especialidade em cinza (ex.: "Limpeza pesada é sua força"); distância em km destacada em cor primária C.primary=#7C3AED; botão discreto "Ver perfil"

DESIGN SYSTEM:
- Cores: C.superficie=#F9FAFB (card), C.primary=#7C3AED (distância), C.aviso=#F59E0B (estrela da nota), C.textoSecundario=#9CA3AF (especialidade)
- Tipografia: nome Heading 3 20px/700, nota e especialidade Body Small 12px/400, distância Label 14px/500
- Espaçamento base 8px, padding página 24px, gap entre cards 12px, padding interno do card 16px
- Raio de card 8px, avatar circular 48px

COMPONENTES:
- Card de candidata (avatar + nome + nota + especialidade + distância + botão)
- Pull-to-refresh no topo
- Skeleton de cards para loading

AÇÃO PRINCIPAL:
- Toque em "Ver perfil" ou no card abre o Perfil da Candidata (C19).

ESTADO A MOSTRAR: vazio — "Ainda ninguém se candidatou. Você será avisado em breve." com CTA em cor primária C.primary=#7C3AED "Aumentar visibilidade com taxa de urgência" (aparece após 48h sem candidatura, conforme regra do USER-FLOWS.md). Gere variações trocando para: loading (skeleton), erro ("Não conseguimos carregar as candidatas." + Tentar de novo), offline (última lista sincronizada com banner) ou sucesso (lista populada, nova candidata entra com animação no topo).

Mobile first. Referência visual de layout: https://mobbin.com/screens/71c0cd71-25e9-49c6-8582-450cec5068a9 (Angi) e https://mobbin.com/screens/b3cc1a68-d11e-4078-93b7-d9326aa7d0a1 (Realtor.com).
```

## Tela: C19 — Perfil da Candidata (detalhe)
**Referência Mobbin:** [Fiverr — perfil vendedor](https://mobbin.com/screens/f9a32acb-4926-42eb-b82c-b922040be92f) · [Airtasker — reviews](https://mobbin.com/screens/fe2f52e3-066d-460b-82a9-cd8d9241f85a)
**Estados:** sucesso (leitura, sem erro/loading relevante além do carregamento inicial)

```prompt para o Claude Designer
Crie a tela de Perfil da Candidata de um app de marketplace de faxina (Moppy), acessada a partir da Lista de Candidatas.

ESTRUTURA (de cima para baixo):
- Header: foto grande (80% da largura), nome grande, nota em estrelas grande, número total de serviços realizados
- Seção "Sobre": texto livre descritivo (ex.: "Faço limpeza há 5 anos...")
- Seção "Avaliações Recentes": 3 a 5 cards com data, nome do cliente, nota em estrelas e comentário breve
- Chips coloridos de especialidade (ex.: "Limpeza Pesada", "Rápida")
- Botão grande "Escolher [Nome]" fixo no rodapé

DESIGN SYSTEM:
- Cores: C.aviso=#F59E0B (estrelas), C.primaryLight=#EDE9FE (chip de especialidade), C.primary=#7C3AED (botão)
- Tipografia: nome Heading 1 28px/700, seção "Sobre"/"Avaliações" Heading 3 20px/700, texto Body 14px/400, comentário Body Small 12px/400
- Espaçamento base 8px, padding página 24px, gap entre seções 20px
- Raio de card de avaliação 8px, raio de chip 12px (pill), avatar circular

COMPONENTES:
- Avatar grande no topo
- Rating de estrelas readonly
- Card de avaliação (data + nome + estrelas + comentário)
- Chip de especialidade

AÇÃO PRINCIPAL:
- Botão "Escolher [Nome]" confirma a seleção da faxineira e avança para o Pedido em Andamento (C20).

ESTADO A MOSTRAR: sucesso (perfil populado com 3 avaliações e 2 chips de especialidade)

Mobile first. Referência visual de layout: https://mobbin.com/screens/f9a32acb-4926-42eb-b82c-b922040be92f (Fiverr) e https://mobbin.com/screens/fe2f52e3-066d-460b-82a9-cd8d9241f85a (Airtasker).
```

## Tela: C20 — Pedido em Andamento
**Referência Mobbin:** [Keeta — courier a caminho](https://mobbin.com/screens/56299fbf-b2d0-48be-867d-c434ca5af134) · [Bolt Food — arriving](https://mobbin.com/screens/9509b853-f44c-425e-81c0-c6e96efffe2c)
**Estados:** loading / erro / offline / sucesso

```prompt para o Claude Designer
Crie a tela de Pedido em Andamento de um app de marketplace de faxina (Moppy), mostrando o status ao vivo do serviço contratado.

ESTRUTURA (de cima para baixo):
- Header: badge grande de status ("Faxineira chegando", "Em serviço", etc.) + cronômetro visível somente-leitura quando em serviço
- Timeline vertical com 4 etapas: Pedido confirmado (com data/hora) → Faxineira chegando (com ETA ou checkmark) → Em serviço (cronômetro em C.primary=#7C3AED (roxo)) → Pendente de confirmação
- Card da faxineira: foto + nome + botão de Chat
- Bloco "Está tudo certo?" com dois botões: "Sim, está tudo certo" (C.primary=#7C3AED (roxo)) e "Tive um problema" (vermelho) — aparece apenas quando o serviço é marcado como concluído pela faxineira

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (badge de status ativo), C.sucesso=#10B981 (etapas concluídas e cronômetro), C.erro=#EF4444 (botão "Tive um problema"), C.borda=#E5E7EB (etapas pendentes)
- Tipografia: badge Label 14px/500, timeline Body 14px/400, timestamp Caption 11px/400
- Espaçamento base 8px, padding página 24px, gap entre etapas da timeline 16px
- Raio de badge 12px, raio de card 8px, avatar circular

COMPONENTES:
- Timeline vertical (círculos + linha conectora, check C.primary=#7C3AED (roxo) nas etapas concluídas)
- Cronômetro (formato hh:mm:ss)
- Card de faxineira com botão de chat
- Par de botões de confirmação

AÇÃO PRINCIPAL:
- "Sim, está tudo certo" processa o pagamento e avança para a Avaliação (C25).
- "Tive um problema" abre a tela de Abrir Disputa (C24).

ESTADO A MOSTRAR: sucesso — etapa "Em serviço" ativa, cronômetro rodando em C.primary=#7C3AED (roxo). Gere variações trocando para: loading (spinner na etapa atual), erro ("Perdemos a conexão com o status do pedido." + Atualizar) ou offline (última etapa conhecida destacada, resto acinzentado).

Mobile first. Referência visual de layout: https://mobbin.com/screens/56299fbf-b2d0-48be-867d-c434ca5af134 (Keeta) e https://mobbin.com/screens/9509b853-f44c-425e-81c0-c6e96efffe2c (Bolt Food).
```

## Tela: C21 — Código de Confirmação (modal)
**Referência Mobbin:** [Coffee Meets Bagel](https://mobbin.com/screens/26b15b1f-2fc1-477a-b6fe-c711dfa9beaf) · [TIDE](https://mobbin.com/screens/03f90888-36dd-4bde-a88f-05e65f46bcb3)
**Estados:** loading / erro / sucesso

```prompt para o Claude Designer
Crie o modal de Código de Confirmação de um app de marketplace de faxina (Moppy), aberto a partir do Pedido em Andamento no dia do serviço.

ESTRUTURA (de cima para baixo):
- Modal em formato de bottom sheet ocupando 60% da altura da tela
- Botão de fechar (X) no canto superior direito do sheet
- Título "Código de chegada"
- Descrição "Passe este código para a faxineira confirmar que chegou"
- Código em fonte monoespaçada, letras gigantes, 4 dígitos com espaço entre eles (ex.: "7 3 9 2"), sempre visível

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF (sheet), C.textoMaximo=#1F2937 (código)
- Tipografia: título Heading 2 24px/700, descrição Body 14px/400, código fonte monoespaçada 40px/700
- Espaçamento base 8px, padding do sheet 24px
- Raio do sheet 12px no topo (round)
- Animação: sheet entra de baixo para cima em 150ms ease-in-out

COMPONENTES:
- Bottom sheet com handle no topo
- Código em display estático (nenhum botão de copiar)

AÇÃO PRINCIPAL:
- Cliente lê o código e o passa verbalmente para a faxineira (validação de presença física).
- Fechar o modal (X ou swipe down) volta para C20 sem invalidar o código.

ESTADO A MOSTRAR: sucesso — código já gerado e visível. Gere variações trocando para: loading ("Gerando código…") ou erro ("Não foi possível gerar o código agora." + Tentar de novo).

Mobile first. Referência visual de layout: https://mobbin.com/screens/26b15b1f-2fc1-477a-b6fe-c711dfa9beaf (Coffee Meets Bagel) e https://mobbin.com/screens/03f90888-36dd-4bde-a88f-05e65f46bcb3 (TIDE).
```

## Tela: C22 — Chat
**Referência Mobbin:** [Fiverr — chat "We have your back"](https://mobbin.com/screens/b5234996-4b9b-4324-b1df-1b0464177b74) · [BlaBlaCar](https://mobbin.com/screens/7c4e93f9-31fc-4c4c-9130-d6e77d076b02)
**Estados:** loading / vazio / erro / offline / sucesso

```prompt para o Claude Designer
Crie a tela de Chat entre cliente e faxineira de um app de marketplace de faxina (Moppy).

ESTRUTURA (de cima para baixo):
- Aviso fixo no topo (fundo amarelo claro): "Combinar pagamento fora do app não tem garantia da Moppy."
- Header com foto e nome da faxineira + indicador de status online/offline (bolinha C.primary=#7C3AED (roxo)/cinza)
- Timeline de mensagens: bolhas arredondadas do cliente à direita em roxo, da faxineira à esquerda em cinza, cada uma com timestamp e ícone de entrega (✓ entregue, ✓✓ lido)
- Input de texto fixo no rodapé com ícone de anexo de foto

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (bolha do cliente), C.superficie=#F9FAFB (bolha da faxineira), C.aviso=#F59E0B / fundo #FEF3C7 (aviso fixo), C.sucesso=#10B981 (bolinha online)
- Tipografia: mensagem Body 14px/400, timestamp Caption 11px/400, aviso Body Small 12px/400
- Espaçamento base 8px, padding página 16px, gap entre mensagens 8px
- Raio de bolha 12px (mais fechado no canto próximo ao remetente)
- Ícones: Feather Icons "paperclip" no anexo, "check"/"check-check" no status de entrega

COMPONENTES:
- Chat bubble (enviada/recebida)
- Input com anexo de imagem
- Banner de aviso fixo não-dispensável

AÇÃO PRINCIPAL:
- Enviar mensagem no input adiciona a bolha na timeline em tempo real.

ESTADO A MOSTRAR: vazio — "Converse com a faxineira aqui assim que ela for selecionada." Gere variações trocando para: loading (skeleton de bolhas), erro ("Mensagem não enviada." + Reenviar), offline (mensagens em fila com ícone de relógio) ou sucesso (conversa populada com check duplo na última mensagem).

Mobile first. Referência visual de layout: https://mobbin.com/screens/b5234996-4b9b-4324-b1df-1b0464177b74 (Fiverr) e https://mobbin.com/screens/7c4e93f9-31fc-4c4c-9130-d6e77d076b02 (BlaBlaCar).
```

## Tela: C23 — "Está tudo certo?" (confirmação / disputa)
**Referência Mobbin:** buscar no Mobbin (USER-FLOWS.md) — use o mesmo padrão de decisão binária com card de contexto de C20/C24
**Estados:** loading / sucesso

```prompt para o Claude Designer
Crie a tela de decisão pós-serviço de um app de marketplace de faxina (Moppy), onde o cliente confirma se o serviço foi bem feito.

ESTRUTURA (de cima para baixo):
- Cartão grande no topo com foto e nome da faxineira
- Pergunta destacada "Está tudo certo com o trabalho da [Nome]?"
- Descrição "Confirme aqui para liberar o pagamento. Tem algum problema? Abra uma disputa."
- Dois botões grandes empilhados: "Sim, está tudo certo" (C.primary=#7C3AED (roxo), primário) e "Tive um problema" (vermelho, secundário)

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (botão primário), C.erro=#EF4444 (botão secundário), C.superficie=#F9FAFB (card da faxineira)
- Tipografia: pergunta Heading 2 24px/700, descrição Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre botões 12px
- Raio de card 8px, raio de botão 8px, avatar circular

COMPONENTES:
- Card de contexto (avatar + nome)
- Par de botões de decisão, altura 48px cada

AÇÃO PRINCIPAL:
- "Sim, está tudo certo" processa a captura do pagamento (loading breve "Processando pagamento…") e avança para a Avaliação (C25).
- "Tive um problema" abre a tela de Abrir Disputa (C24).

ESTADO A MOSTRAR: sucesso (tela de decisão, sem estado vazio ou erro de listagem). Gere variação "loading" para o momento pós-toque em "Sim, está tudo certo" (spinner + texto "Processando pagamento…").

Mobile first. Sem referência Mobbin direta encontrada para esta tela — mantenha a mesma linguagem visual de card + decisão binária das telas C20 e C24.
```

## Tela: C24 — Abrir Disputa
**Referência Mobbin:** [DoorDash — item quality issues](https://mobbin.com/screens/54f363c8-3506-4f7e-a3c4-0b49ca9e11e8) · [Wolt — damage/quality](https://mobbin.com/screens/cee3e04e-0447-4f81-979d-6fc807248c34)
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie a tela de Abrir Disputa de um app de marketplace de faxina (Moppy), acessada quando o cliente reporta um problema com o serviço.

ESTRUTURA (de cima para baixo):
- Título "Relatar problema"
- Textarea obrigatória para descrição (mínimo 50 caracteres)
- Upload de até 3 fotos em grid (ícone de câmera)
- Checkbox "Autorizo a Moppy a contactar a faxineira sobre este problema"
- Rodapé com texto "Sua disputa será analisada em até 48h."
- Botão "Abrir disputa" C.primary=#7C3AED (roxo), fixo no rodapé

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (botão ativo), C.borda=#E5E7EB (botão desabilitado), C.erro=#EF4444 (validação de campo obrigatório)
- Tipografia: título Heading 2 24px/700, textarea Body 14px/400, texto de prazo Body Small 12px/400
- Espaçamento base 8px, padding página 24px, gap entre seções 16px
- Raio de textarea 6px, raio dos quadrados de foto 8px, raio de botão 8px
- Ícones: Feather Icons "camera" nos slots de upload vazios

COMPONENTES:
- Textarea com contador de caracteres (mínimo 50)
- Grid de upload de foto (3 slots)
- Checkbox obrigatório
- Botão fixo, desabilitado até a descrição atingir o mínimo

AÇÃO PRINCIPAL:
- "Abrir disputa" envia a disputa e volta para o Pedido em Andamento (C20), agora mostrando "Valor retido até a decisão. Isso pode levar até 48h."

ESTADO A MOSTRAR: erro — textarea com 20 caracteres (abaixo do mínimo), contorno vermelho e texto "Descreva o problema com pelo menos 50 caracteres." Gere variação "sucesso" com descrição completa e 2 fotos anexadas, botão ativo.

Mobile first. Referência visual de layout: https://mobbin.com/screens/54f363c8-3506-4f7e-a3c4-0b49ca9e11e8 (DoorDash) e https://mobbin.com/screens/cee3e04e-0447-4f81-979d-6fc807248c34 (Wolt).
```

## Tela: C25 — Avaliação
**Referência Mobbin:** [Urban Company](https://mobbin.com/screens/23644ce7-e1fd-4f7f-a67e-6a83a5598535)
**Estados:** sucesso (formulário, sem erro relevante)

```prompt para o Claude Designer
Crie a tela de Avaliação pós-serviço de um app de marketplace de faxina (Moppy), exibida após o cliente confirmar "Sim, tudo certo" em C20.

ESTRUTURA (de cima para baixo):
- Título "Como foi o serviço de [Nome da Faxineira]?"
- Estrelas de 1 a 5 em tamanho grande, tocar seleciona (default: nenhuma)
- Textarea opcional "Deixe um comentário" (máximo 500 caracteres, placeholder "Sua opinião ajuda a comunidade")
- Botão "Enviar avaliação" C.primary=#7C3AED (roxo) fixo no rodapé

DESIGN SYSTEM:
- Cores: C.aviso=#F59E0B (estrelas), C.primary=#7C3AED (botão enviar), C.borda=#E5E7EB (divider)
- Tipografia: título Heading 2 24px/700, textarea Body 14px/400
- Espaçamento base 8px, padding página 24px
- Raio de botão 8px

COMPONENTES:
- Rating de estrelas interativo (1-5, sem metade)
- Textarea com contador de caracteres

AÇÃO PRINCIPAL:
- "Enviar avaliação" registra a nota e o comentário e volta para Home (C08).

ESTADO A MOSTRAR: sucesso — 4 estrelas selecionadas e comentário preenchido.

Mobile first. Referência visual: https://mobbin.com/screens/23644ce7-e1fd-4f7f-a67e-6a83a5598535 (Urban Company).
```

---

## Tela: C26 — Perfil & Configurações
**Referência Mobbin:** [Grab Driver](https://mobbin.com/screens/eaf7dd68-dfcf-47ae-b079-f65f25a28a02) · [eBay](https://mobbin.com/screens/1eadfdc1-fd80-418d-9490-6e8a1c3c682e)
**Estados:** sucesso (leitura/edição, sem erro relevante)

```prompt para o Claude Designer
Crie a tela de Perfil & Configurações do cliente de um app de marketplace de faxina (Moppy), acessável pela tab bar (aba "Perfil").

ESTRUTURA (de cima para baixo):
- Título "Seu Perfil"
- Seções expansíveis (accordion):
  1. "Dados Pessoais" — Nome, Email, Telefone (editável inline, salva ao sair do campo)
  2. "Endereços" — lista de endereços salvos (C04 readonly) + link "+ Adicionar novo"
  3. "Cartões" — lista de cartões salvos (C05 readonly) + link "+ Novo cartão"
  4. "Notificações" — toggles "Notificações push" e "Email"
  5. "Mais" — links "Termos de Uso", "Política de Privacidade", "Deletar conta"

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (título seção ativa), C.borda=#E5E7EB (divider), C.erro=#EF4444 (link "Deletar conta")
- Tipografia: título Heading 2 24px/700, seção accordion Heading 3 20px/700, campo Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre seções 12px
- Raio de card 8px

COMPONENTES:
- Accordion (seção expansível com chevron)
- Input inline editável
- Toggle/switch para notificações
- Componentes C04/C05 em modo readonly

AÇÃO PRINCIPAL:
- Edição inline: salva automaticamente ao sair do campo
- "+ Adicionar novo": abre C04 (Cadastro de Endereço)
- "+ Novo cartão": abre C05 (Salvar Cartão)
- "Deletar conta": abre modal de confirmação (2FA exigido)

ESTADO A MOSTRAR: sucesso — seção "Dados Pessoais" aberta, campos visíveis.

Mobile first. Referência visual: https://mobbin.com/screens/eaf7dd68-dfcf-47ae-b079-f65f25a28a02 (Grab Driver), https://mobbin.com/screens/1eadfdc1-fd80-418d-9490-6e8a1c3c682e (eBay, cartões).
```

---

## 2. FAXINEIRA (F01–F20)

## Tela: F01 — Escolha de Papel (Faxineira)
**Referência Mobbin:** [inDrive](https://mobbin.com/screens/d49d16c7-e096-4c3f-a9f4-570ce4e599d4)
**Estados:** sucesso (única)

```prompt para o Claude Designer
Crie a mesma tela de Escolha de Papel de um app de marketplace de faxina (Moppy) já descrita em C03, mas focando o resultado "Faxineira".

ESTRUTURA (de cima para baixo):
- Título "Como você quer usar o Moppy?"
- Duas cards grandes empilhadas: "Contratar Faxina" e "Oferecer Faxina" (com ícone de mão + descrição "Aceite trabalhos e ganhe com sua experiência")

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.superficie=#F9FAFB (card), C.primary=#7C3AED (ícone e destaque)
- Tipografia: título Heading 2 24px/700, título do card Heading 3 20px/700, descrição Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre cards 16px
- Raio de card 8px
- Ícones: Feather Icons, 32px

COMPONENTES:
- Card clicável inteiro (sem botão separado)

AÇÃO PRINCIPAL:
- Tocar em "Oferecer Faxina" define o papel Faxineira e avança direto para Cadastro com Documentos (F02).

ESTADO A MOSTRAR: sucesso (estado único)

Mobile first. Referência visual de layout: https://mobbin.com/screens/d49d16c7-e096-4c3f-a9f4-570ce4e599d4 (inDrive).
```

## Tela: F02 — Cadastro com Documentos
**Referência Mobbin:** [DoorDash Dasher — "Scan your driver's license"](https://mobbin.com/screens/3933f4aa-88c5-48c3-8d55-ee6e770a7b12) · [Shopee — verificação em etapas](https://mobbin.com/screens/79589f4c-7b36-4372-adc3-49ccfa9a3f99)
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie o wizard de Cadastro com Documentos de um app de marketplace de faxina (Moppy), para a faxineira enviar os documentos necessários para aprovação.

ESTRUTURA (de cima para baixo):
- Barra de progresso no topo mostrando o passo atual de 5
- Passo 1/5 — RG: upload de frente e verso (câmera ou galeria), com preview antes de confirmar
- Passo 2/5 — CPF: upload via câmera
- Passo 3/5 — Selfie: apenas câmera, instrução "rosto limpo, bem iluminado"
- Passo 4/5 — Comprovante de residência (últimos 3 meses): câmera ou galeria
- Passo 5/5 — Chave PIX: campo de texto (aceita CPF, e-mail ou telefone)
- Cada passo mostra o preview em destaque (foto ou texto) com dois botões: "Confirmar" e "Tirar novamente"

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (barra de progresso), C.superficie=#F9FAFB (área de preview), C.erro=#EF4444 (foto rejeitada, borrada ou ilegível)
- Tipografia: título do passo Heading 2 24px/700, instrução Body 14px/400
- Espaçamento base 8px, padding página 24px
- Raio de preview 8px, raio de botão 8px
- Ícones: Feather Icons "camera", "image" (galeria)

COMPONENTES:
- Barra de progresso de 5 passos
- Componente de upload com preview e dois botões de ação
- Input de texto com validação de formato para a chave PIX

AÇÃO PRINCIPAL:
- "Confirmar" em cada passo avança para o próximo; ao final do passo 5, avança para Termos LGPD + Raio de Atuação (F03).

ESTADO A MOSTRAR: sucesso — passo 3/5 (Selfie) com preview de foto já tirada, aguardando confirmação. Gere variação "erro" para foto rejeitada por má qualidade (mensagem "Não conseguimos identificar sua selfie, tire novamente com mais luz.").

Mobile first. Referência visual de layout: https://mobbin.com/screens/3933f4aa-88c5-48c3-8d55-ee6e770a7b12 (DoorDash Dasher) e https://mobbin.com/screens/79589f4c-7b36-4372-adc3-49ccfa9a3f99 (Shopee).
```

## Tela: F03 — Termos LGPD + Raio de Atuação
**Referência Mobbin:** [Clue](https://mobbin.com/screens/77e7a0d5-ddbc-4282-ae08-a1d396739709) · raio: [Tinder — distance preference](https://mobbin.com/screens/65ef1aa6-b3ad-46a5-9076-79a90d5015bf)
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie a tela de Termos LGPD + Raio de Atuação de um app de marketplace de faxina (Moppy), etapa final do onboarding da faxineira antes da análise de cadastro.

ESTRUTURA (de cima para baixo):
- Primeira seção: texto scrollável de Termos de Uso e Privacidade + checkbox obrigatório "Li e concordo com os Termos e Privacidade"
- Segunda seção: título "Qual é o seu raio de atuação?" + texto acima do slider "Você atenderá pedidos até 10 km de distância" (atualiza em tempo real) + slider de 5 a 20 km, padrão 10km
- Botão "Continuar" C.primary=#7C3AED (roxo) fixo no rodapé

DESIGN SYSTEM:
- Cores: C.textoSecundario=#9CA3AF (texto legal), C.primary=#7C3AED (slider ativo), C.primary=#7C3AED (botão ativo), C.borda=#E5E7EB (trilho do slider e botão desabilitado)
- Tipografia: título da seção Heading 3 20px/700, texto do raio Body 14px/400, texto legal Body Small 12px/400
- Espaçamento base 8px, padding página 24px, gap entre seções 20px
- Raio de botão 8px

COMPONENTES:
- Checkbox obrigatório
- Slider horizontal com handle destacado e valor em tempo real acima

AÇÃO PRINCIPAL:
- "Continuar" (ativo apenas com checkbox marcado e slider ajustado) avança para Aguardando Aprovação (F04).

ESTADO A MOSTRAR: sucesso — checkbox marcado, slider em 10km, botão ativo. Gere variação "erro" com botão desabilitado (checkbox desmarcado).

Mobile first. Referência visual de layout: https://mobbin.com/screens/77e7a0d5-ddbc-4282-ae08-a1d396739709 (Clue) e https://mobbin.com/screens/65ef1aa6-b3ad-46a5-9076-79a90d5015bf (Tinder).
```

## Tela: F04 — Aguardando Aprovação
**Referência Mobbin:** [Chase UK — "Sorry for the wait"](https://mobbin.com/screens/a72ad958-d8d9-44ed-8f66-357157e2cda2) · [Binance — Under Review](https://mobbin.com/screens/dc19aec5-78ff-4aed-9f8b-8719e4a1b236)
**Estados:** loading (em análise) / sucesso (aprovado) / erro (reprovado)

```prompt para o Claude Designer
Crie a tela de Aguardando Aprovação de um app de marketplace de faxina (Moppy), exibida enquanto a equipe Moppy valida o cadastro da faxineira.

ESTRUTURA (de cima para baixo):
- Ícone grande (ampulheta ou check pendente), centralizado
- Título "Seu cadastro está em análise"
- Descrição "Pode levar até 48h. Avisaremos por notificação assim que terminar."
- Checklist de status abaixo: RG validado, CPF validado, Selfie aprovada, Comprovante verificado (cada item com ícone vazio, em progresso ou concluído)

DESIGN SYSTEM:
- Cores: C.aviso=#F59E0B (ícone de espera), C.sucesso=#10B981 (itens aprovados e estado final aprovado), C.erro=#EF4444 (estado final reprovado)
- Tipografia: título Heading 2 24px/700, descrição Body 14px/400, item de checklist Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre itens da checklist 12px
- Ícones: Feather Icons "clock", "check-circle", "x-circle"

COMPONENTES:
- Ícone central de status
- Checklist com 4 itens

AÇÃO PRINCIPAL:
- Quando aprovado: ícone muda para checkmark grande, título "Parabéns! Você está pronto para trabalhar." e botão "Começar agora" leva para a Home/Buscar Trabalho (F05).
- Quando reprovado: ícone muda para X, título "Sua candidatura foi rejeitada por: [motivo]" e botão "Tentar novamente" (permite reenvio único).

ESTADO A MOSTRAR: loading — em análise, checklist com 2 de 4 itens concluídos. Gere variações trocando para: sucesso (aprovado, com botão "Começar agora") ou erro (reprovado, com motivo e botão "Tentar novamente").

Mobile first. Referência visual de layout: https://mobbin.com/screens/a72ad958-d8d9-44ed-8f66-357157e2cda2 (Chase UK) e https://mobbin.com/screens/dc19aec5-78ff-4aed-9f8b-8719e4a1b236 (Binance).
```

## Tela: F05 — Home / Buscar Trabalho (feed)
**Referência Mobbin:** [Dave — Flexible Hours](https://mobbin.com/screens/33b61cbf-c31b-4203-aaa6-eda196c3e345)
**Estados:** loading / vazio / erro / offline / sucesso

```prompt para o Claude Designer
Crie a tela Home/Buscar Trabalho de um app de marketplace de faxina (Moppy) para a faxineira, mostrando os pedidos abertos no raio de atuação.

ESTRUTURA (de cima para baixo):
- Título "Trabalhos disponíveis"
- Duas abas no topo: "Feed de pedidos" e "Minhas candidaturas"
- Feed: lista de cards verticais com: tipo/tamanho/endereço (só bairro, sem número, por privacidade) em cinza; data/hora pequena; preço bruto em destaque com seta para o valor líquido menor abaixo (transparência: faxineira recebe base − 15% comissão − 50% da taxa de processamento); distância em cor primária; botão "Ver detalhes" ou toque no card

DESIGN SYSTEM:
- Cores: C.superficie=#F9FAFB (card), C.primary=#7C3AED (distância), C.primary=#7C3AED (valor líquido), C.textoSecundario=#9CA3AF (endereço e data)
- Tipografia: tipo/tamanho Heading 3 20px/700, endereço/data Body Small 12px/400, preço bruto Label 14px/500, valor líquido Body Small 12px/400
- Espaçamento base 8px, padding página 24px, gap entre cards 12px
- Raio de card 8px

COMPONENTES:
- Tabs (Feed / Minhas candidaturas)
- Card de pedido com preço bruto → líquido
- Pull-to-refresh
- Skeleton de cards para loading

AÇÃO PRINCIPAL:
- Toque no card abre o Detalhe do Pedido não-candidatado (F07).
- Ícone de filtro no header abre o modal de Filtros (F06).

ESTADO A MOSTRAR: vazio — "Nenhum pedido na sua região agora. Aumente seu raio de atuação ou volte mais tarde." com ícone de filtro em destaque. Gere variações trocando para: loading (skeleton), erro ("Não conseguimos atualizar o feed." + Tentar de novo), offline (feed funciona sem push, 100% navegável) ou sucesso (pull-to-refresh trazendo novo pedido no topo).

Mobile first. Referência visual de layout: https://mobbin.com/screens/33b61cbf-c31b-4203-aaa6-eda196c3e345 (Dave).
```

## Tela: F06 — Filtros do Feed (modal)
**Referência Mobbin:** buscar no Mobbin (USER-FLOWS.md) — use o mesmo padrão de bottom sheet com filtros usado em apps de marketplace de serviço
**Estados:** sucesso (aplicação de filtro, sem erro relevante)

```prompt para o Claude Designer
Crie o modal de Filtros do Feed de um app de marketplace de faxina (Moppy), acessado pela faxineira a partir da Home/Buscar Trabalho.

ESTRUTURA (de cima para baixo):
- Modal em bottom sheet ocupando 70% da altura da tela
- Filtro "Tipo de limpeza": checkboxes Padrão / Pesada / Passar Roupa
- Filtro "Tamanho": checkboxes Studio até 4+ quartos
- Filtro "Distância máxima": slider de 5 a 20km com valor atual
- Filtro "Data": opções em chip "Hoje" / "Próx. 3 dias" / "Próx. semana" ou calendário de intervalo
- Rodapé com contagem de resultados "23 pedidos encontrados" e dois botões: "Aplicar filtros" (C.primary=#7C3AED (roxo)) e "Limpar" (texto)

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (checkbox e slider ativos), C.primary=#7C3AED (botão Aplicar), C.textoSecundario=#9CA3AF (contagem de resultados)
- Tipografia: título do filtro Heading 3 20px/700, opção Body 14px/400, contagem Body Small 12px/400
- Espaçamento base 8px, padding do sheet 24px, gap entre grupos de filtro 20px
- Raio do sheet 12px no topo (round)

COMPONENTES:
- Bottom sheet com handle
- Checkbox múltiplo
- Slider
- Chip de data

AÇÃO PRINCIPAL:
- "Aplicar filtros" fecha o modal e atualiza o feed (F05) com os filtros selecionados.
- "Limpar" reseta todos os filtros para o padrão.

ESTADO A MOSTRAR: sucesso — 2 tipos de limpeza marcados, distância em 15km, contagem "23 pedidos encontrados".

Mobile first. Sem referência Mobbin direta encontrada — use o padrão visual de bottom sheet com filtros por checkbox e slider comum em apps de marketplace de serviço (Angi, TaskRabbit).
```

## Tela: F07 — Detalhe do Pedido (não-candidatado)
**Referência Mobbin:** [Angi — request quote](https://mobbin.com/screens/71c0cd71-25e9-49c6-8582-450cec5068a9)
**Estados:** sucesso (leitura + ação, sem loading relevante)

```prompt para o Claude Designer
Crie a tela de Detalhe do Pedido (ainda não-candidatado) de um app de marketplace de faxina (Moppy), acessada pela faxineira a partir do feed.

ESTRUTURA (de cima para baixo):
- Header: tipo/tamanho/data/hora
- Endereço mostrando apenas o bairro (sem número, por privacidade até a candidatura)
- Preço bruto → preço líquido: "Você receberá: R$ 74,90" (base R$90 − 15% comissão R$13,50 − 50% da taxa de processamento R$1,60)
- Descrição breve do cliente (se disponível)
- Botão grande "Me candidatar" C.primary=#7C3AED (roxo) fixo no rodapé

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (valor líquido e botão), C.textoSecundario=#9CA3AF (bairro e descrição), C.borda=#E5E7EB (botão desabilitado após candidatura)
- Tipografia: header Heading 2 24px/700, endereço Body 14px/400, valor líquido Heading 3 20px/700
- Espaçamento base 8px, padding página 24px, gap entre blocos 16px
- Raio de botão 8px

COMPONENTES:
- Bloco de preço bruto/líquido
- Botão de candidatura, muda para "Você já se candidatou" (desabilitado) se já candidatado a este pedido

AÇÃO PRINCIPAL:
- "Me candidatar" envia a candidatura e avança para a tela de Candidatura (F08).

ESTADO A MOSTRAR: sucesso — botão "Me candidatar" ativo, ainda sem candidatura enviada. Gere variação com o botão no estado "Você já se candidatou" (desabilitado, cinza).

Mobile first. Referência visual de layout: https://mobbin.com/screens/71c0cd71-25e9-49c6-8582-450cec5068a9 (Angi).
```

## Tela: F08 — Candidatura (confirmação / bloqueio)
**Referência Mobbin:** buscar no Mobbin (USER-FLOWS.md) — use o mesmo padrão de tela de resultado (sucesso/erro) usado em C17/F04
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie a tela de resultado da Candidatura de um app de marketplace de faxina (Moppy), exibida logo após a faxineira tocar em "Me candidatar".

ESTRUTURA (de cima para baixo):
Sucesso:
- Ícone grande de checkmark C.primary=#7C3AED (roxo)
- Título "Candidatura enviada!"
- Descrição "Fique de olho nas notificações. Você saberá em breve se foi selecionada."
- Botão "Voltar para o feed"

Erro (double-booking):
- Ícone grande de alerta laranja/vermelho
- Título "Você já tem um serviço agendado nesse horário"
- Descrição "Escolha outro pedido."
- Botão "Voltar"

DESIGN SYSTEM:
- Cores: C.sucesso=#10B981 (ícone e estado de sucesso), C.erro=#EF4444 (ícone e estado de erro)
- Tipografia: título Heading 2 24px/700, descrição Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre elementos 16px
- Ícones: Feather Icons "check-circle", "alert-triangle", 64px

COMPONENTES:
- Ícone central de resultado
- Botão único de saída

AÇÃO PRINCIPAL:
- Botão volta para a Home/Buscar Trabalho (F05), na aba Feed ou Minhas Candidaturas conforme o resultado.

ESTADO A MOSTRAR: erro — double-booking, mensagem "Você já tem um serviço agendado nesse horário. Escolha outro pedido." Gere variação "sucesso" com a mensagem de candidatura enviada.

Mobile first. Sem referência Mobbin direta — use o mesmo padrão visual de tela de resultado binário (sucesso/erro) das outras telas de confirmação do app.
```

## Tela: F09 — Minhas Candidaturas
**Referência Mobbin:** agrupamento por status: [ClickUp](https://mobbin.com/screens/ab0224c3-34f9-4521-9a26-c5173ff63859)
**Estados:** vazio / sucesso

```prompt para o Claude Designer
Crie a aba "Minhas Candidaturas" dentro da Home/Buscar Trabalho de um app de marketplace de faxina (Moppy).

ESTRUTURA (de cima para baixo):
- Agrupamento em 3 seções com contador em cada título:
  1. "Aguardando escolha (X)" — candidaturas sem decisão do cliente
  2. "Selecionada (X)" — a faxineira foi escolhida, cada item leva para a Agenda (F10)
  3. "Não selecionada (X)" — cliente escolheu outra pessoa, itens arquivados
- Cada card: tipo/tamanho/data + botão "Ver detalhes"

DESIGN SYSTEM:
- Cores: C.aviso=#F59E0B (badge "Aguardando escolha"), C.sucesso=#10B981 (badge "Selecionada"), C.textoSecundario=#9CA3AF (badge "Não selecionada")
- Tipografia: título de seção Heading 3 20px/700, card Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre seções 20px, gap entre cards 12px
- Raio de card 8px

COMPONENTES:
- Seção agrupada por status com contador no título
- Card de candidatura com botão "Ver detalhes"

AÇÃO PRINCIPAL:
- "Ver detalhes" em qualquer card abre o Detalhe do Pedido (F07).
- Item em "Selecionada" leva direto para Minha Agenda (F10).

ESTADO A MOSTRAR: sucesso — 2 aguardando, 1 selecionada, 3 não selecionadas. Gere variação "vazio" para nenhuma candidatura ainda ("Você ainda não se candidatou a nenhum pedido.").

Mobile first. Referência visual de layout (agrupamento por status): https://mobbin.com/screens/ab0224c3-34f9-4521-9a26-c5173ff63859 (ClickUp).
```

## Tela: F10 — Minha Agenda
**Referência Mobbin:** buscar no Mobbin (USER-FLOWS.md) — use o mesmo padrão de lista de cards por data já usado em C08/F05
**Estados:** vazio / sucesso

```prompt para o Claude Designer
Crie a tela Minha Agenda de um app de marketplace de faxina (Moppy), mostrando os serviços já confirmados (faxineira escolhida pelo cliente).

ESTRUTURA (de cima para baixo):
- Título "Sua agenda"
- Lista de cards ordenados por data crescente, cada um com: data/hora em destaque, tipo/tamanho/endereço (só bairro), valor líquido em cor primária C.primary=#7C3AED, badge de status ("Confirmado", "Hoje", "Passado")

DESIGN SYSTEM:
- Cores: C.info=#3B82F6 (valor líquido), C.primary=#7C3AED (badge "Hoje"), C.textoSecundario=#9CA3AF (badge "Passado")
- Tipografia: data/hora Heading 3 20px/700, endereço Body Small 12px/400, valor Label 14px/500
- Espaçamento base 8px, padding página 24px, gap entre cards 12px
- Raio de card 8px, raio de badge 12px

COMPONENTES:
- Card de serviço confirmado com badge de status

AÇÃO PRINCIPAL:
- Toque no card do dia abre a Confirmação de Chegada (F11).

ESTADO A MOSTRAR: sucesso — 3 serviços, um deles com badge "Hoje". Gere variação "vazio" para nenhuma agenda ainda ("Nenhum serviço confirmado ainda. Candidate-se a um pedido no Feed.").

Mobile first. Sem referência Mobbin direta — mantenha o mesmo padrão visual de lista de cards por data usado nas outras telas do app.
```

## Tela: F11 — Confirmação de Chegada
**Referência Mobbin:** código: [TIDE](https://mobbin.com/screens/03f90888-36dd-4bde-a88f-05e65f46bcb3) · foto+GPS: [Turo — finish check-in](https://mobbin.com/screens/44d4cfb9-76e9-4115-a06f-89ad9a2db601) · [Lime — foto de encerramento](https://mobbin.com/screens/9ed22b0d-f65d-48ec-9a28-6bf47a910b1b)
**Estados:** loading / erro / sucesso

```prompt para o Claude Designer
Crie a tela de Confirmação de Chegada de um app de marketplace de faxina (Moppy), onde a faxineira confirma que chegou no local do serviço.

ESTRUTURA (de cima para baixo):
- Título "Confirmar chegada"
- Caminho A (padrão): texto "Digite o código que o cliente passou:" + input de 4 dígitos + botão "Confirmar"
- Toggle "Caminho alternativo" (aparece após ~10 minutos de inatividade do cliente): ao ativar, expande na mesma tela, sem navegar:
  - Bloco GPS: "Sua localização será validada" + mapa pequeno com pin
  - Bloco Foto: ícone de câmera "Tire uma selfie no local para confirmar"
- Botão "Confirmar chegada" no rodapé, muda de comportamento conforme o caminho ativo

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (input de código e botão), C.aviso=#F59E0B (aviso de caminho alternativo), C.erro=#EF4444 (falha de validação)
- Tipografia: título Heading 2 24px/700, instrução Body 14px/400, input de código fonte monoespaçada 24px/700
- Espaçamento base 8px, padding página 24px, gap entre blocos 16px
- Raio de input 6px, raio de botão 8px, raio do preview de mapa 8px
- Ícones: Feather Icons "camera", "map-pin"

COMPONENTES:
- Input de código de 4 dígitos
- Toggle expansível "Caminho alternativo"
- Mapa pequeno com pin + captura de câmera (selfie)

AÇÃO PRINCIPAL:
- "Confirmar chegada" (via código ou via GPS+foto) valida a chegada e avança para o Serviço em Andamento (F12).

ESTADO A MOSTRAR: sucesso — caminho A (código), 4 dígitos preenchidos, botão ativo. Gere variações trocando para: loading ("Validando localização…", apenas no caminho B) ou erro ("Não consegui validar sua localização. Fale com o suporte." — bloqueia o avanço).

Mobile first. Referência visual de layout: https://mobbin.com/screens/03f90888-36dd-4bde-a88f-05e65f46bcb3 (TIDE), https://mobbin.com/screens/44d4cfb9-76e9-4115-a06f-89ad9a2db601 (Turo) e https://mobbin.com/screens/9ed22b0d-f65d-48ec-9a28-6bf47a910b1b (Lime).
```

## Tela: F12 — Serviço em Andamento
**Referência Mobbin:** [Toggl Track — foco rodando](https://mobbin.com/screens/d610cdb8-9cda-4f55-b250-d0852318d819) · [Numo](https://mobbin.com/screens/b82d4fcf-e9a5-4baa-bd6d-4cf7d5acf24b)
**Estados:** sucesso (cronômetro sempre rodando, sem estado de erro relevante)

```prompt para o Claude Designer
Crie a tela de Serviço em Andamento de um app de marketplace de faxina (Moppy), exibida enquanto a faxineira executa o serviço.

ESTRUTURA (de cima para baixo):
- Cronômetro grande no topo (formato horas:minutos:segundos), rodando em C.primary=#7C3AED (roxo) — não reseta se o app for para o background
- Card do cliente: foto, nome, avaliação
- Botão de Chat (abre F18)
- Bloco "Como está tudo indo?" com dois botões: "Estou terminando agora" (amarelo, envia aviso de 5min ao cliente) e "Concluído" (C.primary=#7C3AED (roxo), finaliza o serviço)

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (cronômetro e botão Concluído), C.aviso=#F59E0B (botão "Estou terminando agora"), C.superficie=#F9FAFB (card do cliente)
- Tipografia: cronômetro fonte monoespaçada 40px/700, nome do cliente Heading 3 20px/700
- Espaçamento base 8px, padding página 24px, gap entre blocos 16px
- Raio de card 8px, raio de botão 8px, avatar circular

COMPONENTES:
- Cronômetro persistente (Reanimated v2, atualiza a cada segundo)
- Card de cliente com botão de chat
- Par de botões de status

AÇÃO PRINCIPAL:
- "Concluído" finaliza o cronômetro e avança para Concluído / Aguardando Confirmação do Cliente (F13). Não é possível sair da tela sem tocar em "Concluído".

ESTADO A MOSTRAR: sucesso — cronômetro em 00:42:17, rodando.

Mobile first. Referência visual de layout: https://mobbin.com/screens/d610cdb8-9cda-4f55-b250-d0852318d819 (Toggl Track) e https://mobbin.com/screens/b82d4fcf-e9a5-4baa-bd6d-4cf7d5acf24b (Numo).
```

## Tela: F13 — Concluído / Aguardando Confirmação do Cliente
**Referência Mobbin:** buscar no Mobbin (USER-FLOWS.md) — use o mesmo padrão de tela de espera com cronômetro decrescente de F17/A05
**Estados:** loading (aguardando) / sucesso (confirmado) / erro (disputa aberta)

```prompt para o Claude Designer
Crie a tela de Concluído / Aguardando Confirmação do Cliente de um app de marketplace de faxina (Moppy), exibida logo após a faxineira marcar o serviço como concluído.

ESTRUTURA (de cima para baixo):
- Ícone de checkmark + título "Serviço concluído!"
- Descrição "Aguardando confirmação do cliente. Você tem até 24h para responder a uma disputa se abrir."
- Cronômetro decrescente em vermelho: "Prazo de 24h termina em: 23h 45min"
- Card do cliente: foto + nome + avaliação
- Botão "Voltar para agenda"

DESIGN SYSTEM:
- Cores: C.sucesso=#10B981 (ícone de conclusão), C.erro=#EF4444 (cronômetro decrescente), C.superficie=#F9FAFB (card do cliente)
- Tipografia: título Heading 2 24px/700, descrição Body 14px/400, cronômetro Label 14px/500
- Espaçamento base 8px, padding página 24px, gap entre blocos 16px
- Raio de card 8px, avatar circular

COMPONENTES:
- Ícone de sucesso
- Cronômetro decrescente (atualiza em tempo real)
- Card de cliente

AÇÃO PRINCIPAL:
- Se o cliente confirma "Sim, está tudo certo": a tela muda automaticamente para Avaliação (F15).
- Se o cliente abre disputa: a tela muda automaticamente para Responder Disputa (F14).

ESTADO A MOSTRAR: loading — aguardando, cronômetro em "23h 45min". Gere variações trocando para: sucesso (confirmado, transição para F15) ou erro (disputa aberta, transição para F14).

Mobile first. Sem referência Mobbin direta — use o mesmo padrão de tela de espera com cronômetro decrescente das outras telas de prazo do app.
```

## Tela: F14 — Responder Disputa
**Referência Mobbin:** [Wolt — damage/quality issues](https://mobbin.com/screens/cee3e04e-0447-4f81-979d-6fc807248c34)
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie a tela de Responder Disputa de um app de marketplace de faxina (Moppy), acessada quando o cliente abre uma disputa sobre o serviço.

ESTRUTURA (de cima para baixo):
- Título "Responder disputa"
- Seção "Alegação do cliente" em cinza (somente-leitura): texto + até 3 fotos em grid
- Seção "Sua resposta" (obrigatória): textarea (mínimo 50 caracteres) + upload de até 3 fotos em grid
- Cronômetro em vermelho: "Você tem 24h para responder"
- Botão "Enviar resposta" C.primary=#7C3AED (roxo) fixo no rodapé

DESIGN SYSTEM:
- Cores: C.superficie=#F9FAFB (bloco de alegação do cliente), C.primary=#7C3AED (botão ativo), C.erro=#EF4444 (cronômetro e validação de campo)
- Tipografia: título Heading 2 24px/700, seção Heading 3 20px/700, texto Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre seções 20px
- Raio de bloco 8px, raio dos quadrados de foto 8px, raio de botão 8px

COMPONENTES:
- Bloco readonly com texto + grid de fotos
- Textarea + grid de upload de foto
- Cronômetro decrescente

AÇÃO PRINCIPAL:
- "Enviar resposta" (desabilitado até a descrição atingir o mínimo) envia a resposta para análise do admin (A05).

ESTADO A MOSTRAR: erro — textarea vazia, botão desabilitado, cronômetro "Você tem 24h para responder" em destaque. Gere variação "sucesso" com resposta preenchida e 1 foto anexada, botão ativo.

Mobile first. Referência visual de layout: https://mobbin.com/screens/cee3e04e-0447-4f81-979d-6fc807248c34 (Wolt).
```

## Tela: F15 — Avaliação
**Referência Mobbin:** [Urban Company](https://mobbin.com/screens/23644ce7-e1fd-4f7f-a67e-6a83a5598535)
**Estados:** sucesso (única)

```prompt para o Claude Designer
Crie a tela de Avaliação de um app de marketplace de faxina (Moppy), onde a faxineira avalia o cliente após o serviço confirmado.

ESTRUTURA (de cima para baixo):
- Título "Como foi trabalhar para [Nome do cliente]?"
- Estrelas de 1 a 5 em tamanho grande, tocar seleciona
- Textarea opcional "Deixe um comentário"
- Botão "Enviar avaliação" C.primary=#7C3AED (roxo) fixo no rodapé

DESIGN SYSTEM:
- Cores: C.aviso=#F59E0B (estrelas), C.primary=#7C3AED (botão)
- Tipografia: título Heading 2 24px/700, textarea Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre elementos 16px
- Raio de textarea 6px, raio de botão 8px

COMPONENTES:
- Rating de estrelas interativo
- Textarea opcional

AÇÃO PRINCIPAL:
- "Enviar avaliação" registra a nota e volta para Minha Agenda (F10).

ESTADO A MOSTRAR: sucesso — 5 estrelas selecionadas, sem comentário.

Mobile first. Referência visual de layout: https://mobbin.com/screens/23644ce7-e1fd-4f7f-a67e-6a83a5598535 (Urban Company).
```

## Tela: F16 — Carteira
**Referência Mobbin:** [Careem — wallet](https://mobbin.com/screens/d5637068-8346-4354-9334-430e0f15df8f) · [Grab — OVO](https://mobbin.com/screens/8bff5e95-d9a5-48d2-ac8e-74636ac193a6)
**Estados:** loading / vazio / erro / sucesso

```prompt para o Claude Designer
Crie a tela de Carteira de um app de marketplace de faxina (Moppy), mostrando o saldo e o extrato de ganhos da faxineira.

ESTRUTURA (de cima para baixo):
- Header com saldo total em destaque: "R$ 1.234,56"
- Dois cards de breakdown lado a lado: "A liberar" (serviços concluídos, ainda não pagos, ex.: R$ 234,56) e "Disponível para saque" (já pago, pronto para sacar, ex.: R$ 1.000,00)
- Extrato scrollável abaixo: cada linha é 1 serviço ou 1 saque, com data, descrição e valor (C.primary=#7C3AED (roxo) = crédito, vermelho = saque)

DESIGN SYSTEM:
- Cores: C.textoMaximo=#1F2937 (saldo total), C.aviso=#F59E0B (card "A liberar"), C.sucesso=#10B981 (card "Disponível" e valores de crédito), C.erro=#EF4444 (valores de saque)
- Tipografia: saldo total Display 32px/700, breakdown Heading 3 20px/700, linha de extrato Body 14px/400
- Espaçamento base 8px, padding página 24px, gap entre os dois cards 12px, gap entre linhas do extrato 8px
- Raio de card 8px

COMPONENTES:
- Card de breakdown (2 lado a lado)
- Linha de extrato (data + descrição + valor colorido)
- Pull-to-refresh
- Skeleton para loading

AÇÃO PRINCIPAL:
- Toque no card "Disponível para saque" ou botão dedicado leva para Solicitar Saque (F17).

ESTADO A MOSTRAR: vazio — "Nenhum serviço concluído ainda. Assim que você finalizar um, o valor aparece aqui." Gere variações trocando para: loading (skeleton dos valores), erro ("Não conseguimos carregar seu saldo agora.") ou sucesso (saldo e extrato populados, animação de contagem no saldo).

Mobile first. Referência visual de layout: https://mobbin.com/screens/d5637068-8346-4354-9334-430e0f15df8f (Careem) e https://mobbin.com/screens/8bff5e95-d9a5-48d2-ac8e-74636ac193a6 (Grab OVO).
```

## Tela: F17 — Solicitar Saque
**Referência Mobbin:** [Careem — withdraw money](https://mobbin.com/screens/cfd51bca-40e4-4162-9f35-fbaad678266e) · [ShopBack](https://mobbin.com/screens/e93d6b6c-c849-491c-9648-7592d73559ab)
**Estados:** loading / erro / sucesso

```prompt para o Claude Designer
Crie a tela de Solicitar Saque de um app de marketplace de faxina (Moppy), onde a faxineira pede a transferência do saldo disponível via PIX.

ESTRUTURA (de cima para baixo):
- Título "Solicitar saque"
- Input "Valor" (mínimo R$ 20, máximo o saldo disponível), com chips de sugestão: R$ 50 / R$ 100 / R$ 200 / "Tudo"
- Chave PIX pré-preenchida (cadastrada no F02) com ícone de editar + dropdown de tipo (CPF/Email/Telefone)
- Checkbox "Confirmo que a chave PIX é minha"
- Texto de rodapé "O saque cai em 1-2 dias úteis."
- Botão "Solicitar saque" C.primary=#7C3AED (roxo) fixo no rodapé

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (chips de sugestão), C.primary=#7C3AED (botão ativo), C.erro=#EF4444 (chave PIX inválida)
- Tipografia: título Heading 2 24px/700, label Label 14px/500, input Body 14px/400, texto de prazo Body Small 12px/400
- Espaçamento base 8px, padding página 24px, gap entre campos 12px
- Raio de chip 12px (pill), raio de input 6px, raio de botão 8px

COMPONENTES:
- Input de valor com chips de sugestão rápida
- Campo de chave PIX editável com dropdown de tipo
- Checkbox obrigatório

AÇÃO PRINCIPAL:
- "Solicitar saque" (desabilitado até confirmar a chave PIX) envia o pedido e mostra confirmação "Solicitado! Cai em 1-2 dias úteis."

ESTADO A MOSTRAR: erro — "Chave PIX inválida. Corrija para continuar." em vermelho sob o campo (após 3 falhas seguidas, saques ficam suspensos até correção — mostrar esse aviso adicional). Gere variações trocando para: loading ("Processando saque…") ou sucesso ("Solicitado! Cai em 1-2 dias úteis.").

Mobile first. Referência visual de layout: https://mobbin.com/screens/cfd51bca-40e4-4162-9f35-fbaad678266e (Careem) e https://mobbin.com/screens/e93d6b6c-c849-491c-9648-7592d73559ab (ShopBack).
```

## Tela: F18 — Chat
**Referência Mobbin:** [Fiverr](https://mobbin.com/screens/b5234996-4b9b-4324-b1df-1b0464177b74)
**Estados:** loading / vazio / erro / offline / sucesso

```prompt para o Claude Designer
Crie a tela de Chat entre faxineira e cliente de um app de marketplace de faxina (Moppy) — mesmo componente do chat do cliente (C22), espelhado do lado da faxineira.

ESTRUTURA (de cima para baixo):
- Aviso fixo no topo (fundo amarelo claro): "Combinar pagamento fora do app não tem garantia da Moppy."
- Header com foto e nome do cliente + indicador de status online/offline
- Timeline de mensagens: bolhas da faxineira à direita em roxo, do cliente à esquerda em cinza, com timestamp e status de entrega
- Input de texto fixo no rodapé com ícone de anexo de foto

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (bolha da faxineira), C.superficie=#F9FAFB (bolha do cliente), C.aviso=#F59E0B / fundo #FEF3C7 (aviso fixo)
- Tipografia: mensagem Body 14px/400, timestamp Caption 11px/400
- Espaçamento base 8px, padding página 16px, gap entre mensagens 8px
- Raio de bolha 12px

COMPONENTES:
- Chat bubble (enviada/recebida)
- Input com anexo de imagem
- Banner de aviso fixo

AÇÃO PRINCIPAL:
- Enviar mensagem adiciona a bolha na timeline em tempo real.

ESTADO A MOSTRAR: sucesso — conversa populada, última mensagem com check duplo (lida). Gere variações trocando para: loading, vazio ("Converse com o cliente aqui assim que for selecionada."), erro ("Mensagem não enviada." + Reenviar) ou offline (fila com ícone de relógio).

Mobile first. Referência visual de layout: https://mobbin.com/screens/b5234996-4b9b-4324-b1df-1b0464177b74 (Fiverr).
```

## Tela: F19 — Perfil & Configurações
**Referência Mobbin:** [Grab Driver — my profile](https://mobbin.com/screens/eaf7dd68-dfcf-47ae-b079-f65f25a28a02) · [Fiverr — perfil](https://mobbin.com/screens/f9a32acb-4926-42eb-b82c-b922040be92f)
**Estados:** sucesso (formulário/leitura)

```prompt para o Claude Designer
Crie a tela de Perfil & Configurações de um app de marketplace de faxina (Moppy) para a faxineira.

ESTRUTURA (de cima para baixo):
Seções em accordion (expansível):
- "Dados Pessoais" — Nome, Email, Telefone (editável inline)
- "Documentos" — status de RG/CPF/Selfie/Comprovante em badges somente-leitura (✓ aprovado / ⏳ em análise / ✗ rejeitado), com opção "Reenviar" no item rejeitado
- "Raio de Atuação" — slider de 5 a 20km (editável)
- "Chave PIX" — campo de texto (editável)
- "Notificações" — toggles Push e Email
- "Mais" — links "Termos" e "Deletar conta"

DESIGN SYSTEM:
- Cores: C.sucesso=#10B981 (badge aprovado), C.aviso=#F59E0B (badge em análise), C.erro=#EF4444 (badge rejeitado e link "Deletar conta"), C.primary=#7C3AED (slider)
- Tipografia: título de seção Heading 3 20px/700, campo Body 14px/400, badge Label Small 12px/400
- Espaçamento base 8px, padding página 24px, gap entre seções 12px
- Raio de badge 12px (pill)

COMPONENTES:
- Accordion
- Badge de status de documento
- Slider de raio
- Toggle de notificação

AÇÃO PRINCIPAL:
- Edição inline salva automaticamente ao sair do campo.
- "Reenviar" em documento rejeitado reabre o upload correspondente do wizard F02.
- Link "Histórico de Serviços" na seção "Mais" leva para F20.

ESTADO A MOSTRAR: sucesso — Documentos com RG e CPF aprovados (C.primary=#7C3AED (roxo)), Comprovante em análise (amarelo).

Mobile first. Referência visual de layout: https://mobbin.com/screens/eaf7dd68-dfcf-47ae-b079-f65f25a28a02 (Grab Driver) e https://mobbin.com/screens/f9a32acb-4926-42eb-b82c-b922040be92f (Fiverr).
```

## Tela: F20 — Histórico de Serviços
**Referência Mobbin:** buscar no Mobbin (USER-FLOWS.md) — use o mesmo padrão de lista filtrável por tabs já usado em C08
**Estados:** vazio / sucesso

```prompt para o Claude Designer
Crie a tela de Histórico de Serviços de um app de marketplace de faxina (Moppy), listando os serviços já concluídos ou cancelados pela faxineira.

ESTRUTURA (de cima para baixo):
- Título "Histórico de serviços"
- Tabs de filtro: "Tudo" / "Concluído" / "Cancelado" / "Pendente"
- Lista de cards: data/hora, cliente (nome + avaliação, se existir), tipo/tamanho/endereço, valor líquido, badge de status
- Rodapé com somatório: "Total de 47 serviços · Ganho total: R$ 3.245,67"

DESIGN SYSTEM:
- Cores: C.sucesso=#10B981 (badge concluído e valor), C.erro=#EF4444 (badge cancelado), C.aviso=#F59E0B (badge pendente)
- Tipografia: título Heading 2 24px/700, card Body 14px/400, somatório Heading 3 20px/700
- Espaçamento base 8px, padding página 24px, gap entre cards 12px
- Raio de card 8px, raio de badge 12px

COMPONENTES:
- Tabs de filtro
- Card de serviço histórico
- Pull-to-refresh
- Bloco de somatório fixo no rodapé

AÇÃO PRINCIPAL:
- Toque em um card abre o detalhe do serviço em modo somente-leitura.

ESTADO A MOSTRAR: sucesso — aba "Tudo", 47 serviços, somatório visível. Gere variação "vazio" para nenhum serviço no filtro selecionado ("Nenhum serviço encontrado neste filtro.").

Mobile first. Sem referência Mobbin direta — mantenha o mesmo padrão de lista com tabs de filtro usado em C08.
```

---

## 3. ADMIN — WEB (A01–A09)

## Tela: A01 — Login (Admin)
**Referência Mobbin:** buscar no Mobbin (USER-FLOWS.md) — use um padrão simples de login corporativo com 2FA
**Estados:** erro / sucesso

```prompt para o Claude Designer
Crie a tela de Login do painel admin de um app de marketplace de faxina (Moppy), acesso restrito à equipe (sem cadastro público, apenas por convite via Firebase Admin).

ESTRUTURA (de cima para baixo):
- Card central (largura fixa ~400px) na tela, fundo branco, sombra sutil
- Logo Moppy pequeno + título "Admin Moppy"
- Campo email + campo senha + botão "Entrar"
- Segunda tela pós-sucesso: campo único para código do autenticador (2FA/TOTP) + botão "Verificar"

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.superficie=#F9FAFB (fundo da página, atrás do card), C.primary=#7C3AED (botão), C.erro=#EF4444 (erro de credencial)
- Tipografia: título Heading 1 28px/700, label Label 14px/500, input Body 14px/400
- Espaçamento base 8px, padding do card 32px
- Raio do card 8px, raio de input 6px, raio de botão 8px

COMPONENTES:
- Card de login centralizado na viewport
- Input de código TOTP com 6 dígitos separados

AÇÃO PRINCIPAL:
- "Entrar" valida credenciais e avança para a tela de código 2FA.
- "Verificar" valida o código TOTP e leva ao Dashboard (A02).

ESTADO A MOSTRAR: erro — "E-mail ou senha incorretos." em vermelho sob o formulário. Gere variação "sucesso" avançando para a tela de código 2FA.

Desktop first (painel web). Sem referência Mobbin direta — use um padrão simples de login corporativo centralizado com 2FA.
```

## Tela: A02 — Dashboard
**Referência Mobbin:** [Base44](https://mobbin.com/screens/11cbaa8c-23d3-4493-be28-d67d9a31d4b1) · [Squarespace — "Welcome, Alex"](https://mobbin.com/screens/c31bbf92-170e-4042-81e1-ccfc636269de)
**Estados:** loading / erro / sucesso

```prompt para o Claude Designer
Crie a tela de Dashboard do painel admin de um app de marketplace de faxina (Moppy), com sidebar fixa à esquerda.

ESTRUTURA (de cima para baixo):
- Sidebar fixa à esquerda com itens: Dashboard, Aprovações, Pedidos, Disputas, Financeiro, Preços, Usuários, Score (v2)
- Header do conteúdo: "Olá, [Nome do Admin]" + data de hoje
- Grid de 4 cards KPI (responsivo, empilha em telas menores): "Pedidos hoje" (número + tendência %), "Receita do mês" (R$ + tendência %), "Cancelamentos" (número + tendência %), "Faxineiras ativas" (número + tendência %)
- Abaixo dos KPIs: gráfico de linha "Pedidos por dia (últimos 30 dias)" e gráfico de barras "Receita por cidade"

DESIGN SYSTEM:
- Cores: sidebar fundo C.textoMaximo=#1F2937 com item ativo em C.primary=#7C3AED, cards KPI fundo C.fundo=#FFFFFF, tendência positiva C.sucesso=#10B981, tendência negativa C.erro=#EF4444
- Tipografia: saudação Heading 1 28px/700, valor do KPI Display 32px/700, label do KPI Body Small 12px/400
- Espaçamento base 8px, padding da página 32px, gap entre cards KPI 16px
- Raio de card 8px

COMPONENTES:
- Sidebar de navegação fixa
- Card KPI (número grande + seta de tendência)
- Placeholder de gráfico de linha e gráfico de barras

AÇÃO PRINCIPAL:
- Clique em qualquer item da sidebar navega para a respectiva tela (A03-A09).

ESTADO A MOSTRAR: sucesso — 4 KPIs populados com tendências mistas (2 positivas, 2 negativas). Gere variação "loading" com skeleton nos cards KPI e nos gráficos.

Desktop first (painel web). Referência visual de layout: https://mobbin.com/screens/11cbaa8c-23d3-4493-be28-d67d9a31d4b1 (Base44) e https://mobbin.com/screens/c31bbf92-170e-4042-81e1-ccfc636269de (Squarespace).
```

## Tela: A03 — Aprovações Pendentes
**Referência Mobbin:** [Wellfound — revisão de candidato](https://mobbin.com/screens/963a16f0-abc2-4690-b0f9-def0e53ffcaf) · [Discord — pending members](https://mobbin.com/screens/77e2e431-ec73-4eaf-b60b-28b51482d09c)
**Estados:** loading / vazio / sucesso

```prompt para o Claude Designer
Crie a tela de Aprovações Pendentes do painel admin de um app de marketplace de faxina (Moppy), com sidebar fixa à esquerda.

ESTRUTURA (de cima para baixo):
- Sidebar fixa à esquerda (mesma do Dashboard)
- Tabela com a fila de faxineiras aguardando aprovação: colunas Foto, Nome, CPF, Data de cadastro, botão "Revisar"
- Ao clicar em "Revisar", abre painel lateral direito (sem sair da lista) com: os 5 documentos (RG, CPF, Selfie, Comprovante, Chave PIX) em preview expandível; checklist visual de 5 itens (Documentação legível / Selfie confere com o RG / CPF válido / Maior de 18 anos / Comprovante recente); radio de decisão "Aprovar" / "Reprovar"; se reprovar, textarea obrigatória "Motivo da rejeição"; botão "Salvar decisão" com modal de confirmação antes de processar

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.superficie=#F9FAFB (linha alternada da tabela), C.sucesso=#10B981 (checklist marcado e decisão Aprovar), C.erro=#EF4444 (decisão Reprovar)
- Tipografia: título de coluna Label 14px/500, célula Body Small 12px/400, título do painel lateral Heading 2 24px/700
- Densidade dense: padding 12px, altura de linha 32px
- Raio de painel lateral 8px, raio de botão 8px

COMPONENTES:
- Tabela dense
- Painel lateral direito (não é modal, mantém a lista visível ao fundo)
- Preview expandível de documento
- Checklist de 5 itens
- Radio de decisão + textarea condicional
- Modal de confirmação antes de processar

AÇÃO PRINCIPAL:
- "Salvar decisão" processa a aprovação/reprovação após confirmação em modal, remove o item da fila e atualiza o status da faxineira (refletido em F04).

ESTADO A MOSTRAR: sucesso — painel lateral aberto com 3 dos 5 checklist marcados, decisão ainda não selecionada. Gere variações trocando para: loading (skeleton de linhas da tabela) ou vazio ("Nenhum item nesta fila agora.").

Desktop first (painel web). Referência visual de layout: https://mobbin.com/screens/963a16f0-abc2-4690-b0f9-def0e53ffcaf (Wellfound) e https://mobbin.com/screens/77e2e431-ec73-4eaf-b60b-28b51482d09c (Discord).
```

## Tela: A04 — Pedidos (tabela + detalhe/timeline)
**Referência Mobbin:** [Vapi — tabela com filtros](https://mobbin.com/screens/1965682c-0c4e-4146-a0fb-864ad2eabf2d) · [Navattic — painel de detalhe lateral](https://mobbin.com/screens/1ef8248f-ac5c-4c7b-b44c-e7db3f8d9ed3)
**Estados:** loading / vazio / erro / sucesso

```prompt para o Claude Designer
Crie a tela de Pedidos do painel admin de um app de marketplace de faxina (Moppy), com sidebar fixa à esquerda.

ESTRUTURA (de cima para baixo):
- Sidebar fixa à esquerda
- Filtros no topo (dropdowns): Status, Cidade, Intervalo de data
- Tabela com colunas: ID, Cliente, Faxineira, Data, Status, Valor — todas as colunas ordenáveis
- Clique em uma linha abre painel lateral direito com: header (tipo/tamanho/data/hora/valor em destaque); timeline vertical (Pedido criado → Faxineira selecionada → Chegada confirmada → Serviço concluído → Pagamento processado, cada etapa com datetime); botão de Chat (abre histórico da conversa); ação "Cancelar pedido" (com campo de motivo obrigatório, modal de confirmação)

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.superficie=#F9FAFB (linha alternada), C.primary=#7C3AED (etapa ativa da timeline), C.sucesso=#10B981 (etapa concluída), C.erro=#EF4444 (ação de cancelar)
- Tipografia: título de coluna Label 14px/500, célula Body Small 12px/400, header do painel Heading 2 24px/700
- Densidade dense: padding 12px, altura de linha 32px
- Raio de painel lateral 8px

COMPONENTES:
- Filtros em dropdown
- Tabela ordenável (dense)
- Painel lateral com timeline vertical
- Modal de confirmação para cancelamento

AÇÃO PRINCIPAL:
- Clique na linha abre o painel de detalhe; "Cancelar pedido" processa o cancelamento após confirmação em modal.

ESTADO A MOSTRAR: sucesso — tabela com 8 pedidos, painel lateral aberto mostrando um pedido com 3 das 5 etapas concluídas. Gere variações trocando para: loading (skeleton de linhas), vazio ("Nenhum item nesta fila agora.") ou erro ("Erro ao carregar." + Recarregar).

Desktop first (painel web). Referência visual de layout: https://mobbin.com/screens/1965682c-0c4e-4146-a0fb-864ad2eabf2d (Vapi) e https://mobbin.com/screens/1ef8248f-ac5c-4c7b-b44c-e7db3f8d9ed3 (Navattic).
```

## Tela: A05 — Disputas (fila + detalhe/decisão)
**Referência Mobbin:** [Whop — case com Accept/Deny](https://mobbin.com/screens/85a46bd4-caa3-4991-92ff-cc98ad01cfdf) · [PayPal — Resolution Center](https://mobbin.com/screens/57a6cb07-dfed-46c3-b0c4-bdc725a1d0aa) · [Airwallex — disputas](https://mobbin.com/screens/b1f2e410-6e3c-4ea2-8567-0afd619dd766)
**Estados:** loading / vazio / sucesso

```prompt para o Claude Designer
Crie a tela de Disputas do painel admin de um app de marketplace de faxina (Moppy), com sidebar fixa à esquerda.

ESTRUTURA (de cima para baixo):
- Sidebar fixa à esquerda
- Filtro de Status: Novo, Em análise, Resolvido
- Tabela com colunas: ID, Cliente, Faxineira, Data, Status, Ação
- Clique em uma linha abre painel lateral direito com: alegação do cliente (texto + até 3 fotos em grid); resposta da faxineira (texto + até 3 fotos em grid); histórico de comentários bilaterais (se houver); radio de decisão com 3 opções — "Reembolso total ao cliente (R$ X,XX)", "Reembolso parcial (input R$ X,XX)", "Libera pagamento à faxineira"; textarea obrigatória "Justificativa da decisão"; botão "Aplicar decisão" com modal de confirmação antes de processar via Asaas

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.superficie=#F9FAFB (bloco de alegação/resposta), C.erro=#EF4444 (badge "Novo"), C.aviso=#F59E0B (badge "Em análise"), C.sucesso=#10B981 (badge "Resolvido")
- Tipografia: título de coluna Label 14px/500, texto de alegação Body 14px/400, título do painel Heading 2 24px/700
- Densidade dense: padding 12px, altura de linha 32px
- Raio de painel lateral 8px, raio dos quadrados de foto 8px

COMPONENTES:
- Tabela dense com badge de status
- Painel lateral com dois blocos de evidência lado a lado
- Radio de decisão de 3 opções
- Modal de confirmação antes de processar

AÇÃO PRINCIPAL:
- "Aplicar decisão" (desabilitado até justificativa preenchida) processa o reembolso ou liberação via Asaas após confirmação em modal — ação sem "voltar".

ESTADO A MOSTRAR: sucesso — painel lateral aberto com evidência de ambos os lados, decisão "Reembolso parcial" selecionada, valor preenchido. Gere variações trocando para: loading (skeleton de linhas) ou vazio ("Nenhuma disputa em aberto no momento.").

Desktop first (painel web). Referência visual de layout: https://mobbin.com/screens/85a46bd4-caa3-4991-92ff-cc98ad01cfdf (Whop), https://mobbin.com/screens/57a6cb07-dfed-46c3-b0c4-bdc725a1d0aa (PayPal) e https://mobbin.com/screens/b1f2e410-6e3c-4ea2-8567-0afd619dd766 (Airwallex).
```

## Tela: A06 — Financeiro
**Referência Mobbin:** [Quicken — reports](https://mobbin.com/screens/ac1b45e3-44c0-4c9a-8738-6601b60a9a41) · [Kajabi — payments by type](https://mobbin.com/screens/183d38b1-ff93-4da3-a6cf-ca5a8e1c5879)
**Estados:** loading / sucesso

```prompt para o Claude Designer
Crie a tela Financeiro do painel admin de um app de marketplace de faxina (Moppy), com sidebar fixa à esquerda.

ESTRUTURA (de cima para baixo):
- Sidebar fixa à esquerda
- Filtros no topo: período (intervalo de datas), cidade, tipo (comissões, taxas de urgência, estornos, saques)
- 4 resumos em destaque: "Total comissionado (15%): R$ X", "Total taxas de urgência: R$ X", "Total estornos: -R$ X", "Total saques processados: -R$ X"
- Tabela abaixo com colunas: Data, Tipo, Descrição, Valor bruto, Comissão (15%), Valor líquido
- Botões de exportação no topo direito: "CSV" e "PDF"

DESIGN SYSTEM:
- Cores: C.primary=#7C3AED (valores positivos/comissão), C.erro=#EF4444 (estornos), C.textoSecundario=#9CA3AF (saques), C.superficie=#F9FAFB (linha alternada)
- Tipografia: resumo Heading 3 20px/700, título de coluna Label 14px/500, célula Body Small 12px/400
- Densidade dense: padding 12px, altura de linha 32px
- Raio de card de resumo 8px, raio de botão 8px

COMPONENTES:
- Cards de resumo (4 lado a lado)
- Tabela dense
- Botões de exportação com ícone (Feather "download")

AÇÃO PRINCIPAL:
- Botão "CSV" ou "PDF" exporta a tabela filtrada no período selecionado.

ESTADO A MOSTRAR: sucesso — resumos populados, tabela com 10 linhas do mês corrente. Gere variação "loading" com skeleton nos resumos e na tabela.

Desktop first (painel web). Referência visual de layout: https://mobbin.com/screens/ac1b45e3-44c0-4c9a-8738-6601b60a9a41 (Quicken) e https://mobbin.com/screens/183d38b1-ff93-4da3-a6cf-ca5a8e1c5879 (Kajabi).
```

## Tela: A07 — Preços por Cidade
**Referência Mobbin:** buscar no Mobbin (USER-FLOWS.md) — use o mesmo padrão de tabela + editor lateral de A04/A05
**Estados:** loading / sucesso

```prompt para o Claude Designer
Crie a tela de Preços por Cidade do painel admin de um app de marketplace de faxina (Moppy), com sidebar fixa à esquerda.

ESTRUTURA (de cima para baixo):
- Sidebar fixa à esquerda
- Tabela de cidades: colunas Nome, Estado, Status (ativo/inativo), Preço base, botão "Editar"
- Clique em "Editar" abre painel lateral direito com formulário: 3 linhas de tipo de limpeza (Padrão, Pesada, Passar Roupa), cada linha com inputs de preço por tamanho (Studio, 1, 2, 3, 4+); toggle "Ativa" (liga a cidade no feed dos usuários); seção expansível "Histórico de mudanças" (quem alterou, quando, valor antigo → novo); botão "Salvar" com modal de confirmação

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.sucesso=#10B981 (badge "Ativo"), C.textoSecundario=#9CA3AF (badge "Inativo"), C.primary=#7C3AED (toggle ativo)
- Tipografia: título de coluna Label 14px/500, célula Body Small 12px/400, título do painel Heading 2 24px/700
- Densidade dense: padding 12px, altura de linha 32px
- Raio de painel lateral 8px, raio de input 6px

COMPONENTES:
- Tabela dense com badge de status
- Painel lateral com grid de inputs de preço (3 tipos × 5 tamanhos)
- Accordion de histórico de mudanças
- Modal de confirmação

AÇÃO PRINCIPAL:
- "Salvar" grava a nova tabela de preços da cidade e registra a mudança no histórico, após confirmação em modal.

ESTADO A MOSTRAR: sucesso — painel lateral aberto para uma cidade ativa, grid de preços preenchido. Gere variação "loading" com skeleton na tabela de cidades.

Desktop first (painel web). Sem referência Mobbin direta — use o mesmo padrão de tabela + editor lateral já usado em A04/A05.
```

## Tela: A08 — Usuários (clientes/faxineiras)
**Referência Mobbin:** reaproveita [Navattic](https://mobbin.com/screens/1ef8248f-ac5c-4c7b-b44c-e7db3f8d9ed3)
**Estados:** loading / vazio / sucesso

```prompt para o Claude Designer
Crie a tela de Usuários do painel admin de um app de marketplace de faxina (Moppy), com sidebar fixa à esquerda.

ESTRUTURA (de cima para baixo):
- Sidebar fixa à esquerda
- Barra de busca no topo: "Buscar por Nome, Email, CPF ou Telefone"
- Tabela com colunas: ID, Tipo (Cliente/Faxineira), Nome, Email, Status, Data de cadastro, Ação
- Clique em uma linha abre painel lateral direito com: dados pessoais (somente-leitura); histórico de pedidos/serviços com links diretos para o detalhe correspondente em A04; ação "Suspender" (com campo de motivo obrigatório, modal de confirmação)

DESIGN SYSTEM:
- Cores: C.fundo=#FFFFFF, C.superficie=#F9FAFB (linha alternada), C.primary=#7C3AED (badge "Cliente"), C.info=#3B82F6 (badge "Faxineira"), C.erro=#EF4444 (ação Suspender)
- Tipografia: título de coluna Label 14px/500, célula Body Small 12px/400, título do painel Heading 2 24px/700
- Densidade dense: padding 12px, altura de linha 32px
- Raio de painel lateral 8px, raio da barra de busca 6px

COMPONENTES:
- Barra de busca com ícone de lupa
- Tabela dense com badge de tipo
- Painel lateral com histórico de pedidos linkado
- Modal de confirmação para suspensão

AÇÃO PRINCIPAL:
- "Suspender" (com motivo obrigatório) desativa a conta do usuário após confirmação em modal.

ESTADO A MOSTRAR: sucesso — busca com resultado de 5 usuários, painel lateral aberto para um cliente com 3 pedidos no histórico. Gere variações trocando para: loading (skeleton) ou vazio ("Nenhum usuário encontrado para esta busca.").

Desktop first (painel web). Referência visual de layout: https://mobbin.com/screens/1ef8248f-ac5c-4c7b-b44c-e7db3f8d9ed3 (Navattic).
```

## Tela: A09 — Score de Confiabilidade (v2)
**Referência Mobbin:** buscar no Mobbin (USER-FLOWS.md) — use o mesmo padrão de tabela + filtro por faixa de A08
**Estados:** loading / vazio / sucesso

```prompt para o Claude Designer
Crie a tela de Score de Confiabilidade (funcionalidade v2, ainda não priorizada para o MVP) do painel admin de um app de marketplace de faxina (Moppy), com sidebar fixa à esquerda.

ESTRUTURA (de cima para baixo):
- Sidebar fixa à esquerda, item "Score" marcado com badge "v2"
- Filtros: tipo (Faxineira/Cliente), intervalo de score
- Tabela com colunas: Faxineira/Cliente, Score (0-100), Faixa (Verde/Amarelo/Vermelho), Ação
- Ações por linha: "Avisar" (envia notificação push) e "Suspender" (desativa a conta, com modal de confirmação)
- Rodapé com descrição curta dos critérios do score: cancelamentos, disputas, avaliações, velocidade de resposta

DESIGN SYSTEM:
- Cores: C.sucesso=#10B981 (faixa Verde), C.aviso=#F59E0B (faixa Amarela), C.erro=#EF4444 (faixa Vermelha)
- Tipografia: título de coluna Label 14px/500, célula Body Small 12px/400, descrição de critérios Body Small 12px/400
- Densidade dense: padding 12px, altura de linha 32px
- Raio de badge de faixa 12px (pill)

COMPONENTES:
- Tabela dense com badge de faixa colorido
- Botões de ação por linha
- Modal de confirmação para suspensão

AÇÃO PRINCIPAL:
- "Avisar" envia notificação push ao usuário; "Suspender" desativa a conta após confirmação em modal.

ESTADO A MOSTRAR: sucesso — tabela com 6 usuários, 2 em cada faixa de score. Gere variações trocando para: loading (skeleton) ou vazio ("Nenhum usuário fora da faixa segura no momento.").

Desktop first (painel web). Sem referência Mobbin direta — use o mesmo padrão de tabela + filtro por faixa já usado em A08. Prioridade: v2, gerar apenas se o Jehu quiser adiantar o design.
```

---

## Resumo

- **55 prompts prontos**, um por tela, organizados em Cliente (C01-C25), Faxineira (F01-F20) e Admin (A01-A09).
- Cada prompt carrega o **link Mobbin exato** do `USER-FLOWS.md` — nas 14 telas sem referência forte, o prompt aponta isso e sugere o padrão visual mais próximo já usado em outra tela do mesmo fluxo, para nunca deixar o Jehu sem direção.
- Cada prompt embute os **tokens do DESIGN-SYSTEM.md** (cores em hex, tipografia, espaçamento, raio, ícones, animação) diretamente no texto — nenhum prompt depende de abrir outro arquivo.
- Microcópia em PT-BR reaproveitada das tabelas de Botões/Erros/Confirmações do `USER-FLOWS.md` (seção 5), tom direto sem gíria.
- Toda tela com estado relevante (loading/vazio/erro/offline/sucesso) traz a linha `ESTADO A MOSTRAR` — para gerar uma variação, troque só essa linha e cole de novo.
- Ordem recomendada de geração no Claude Designer: C01-C17 (onboarding + wizard de pedido) → C18-C25 (execução + pós-serviço) → F01-F13 (onboarding + execução da faxineira) → F14-F20 (disputa, carteira, perfil) → A01-A09 (admin).

---

## PRÓXIMO PASSO

1. Jehu cola cada prompt, um por vez, no Claude Designer — começando por C01-C17.
2. Para telas com múltiplos estados, gerar a variação principal primeiro (`ESTADO A MOSTRAR: sucesso`) e, se necessário para o QA depois, gerar loading/vazio/erro trocando só essa linha.
3. Rodar `/fabrica-gate` para o Gate 5 (UI) com este UI-SPEC.md e o DESIGN-SYSTEM.md já aprovado.
4. Com o Gate 5 aprovado, seguir a Etapa 8 (Implementação) já liberada conforme `ESTADO.md`.
