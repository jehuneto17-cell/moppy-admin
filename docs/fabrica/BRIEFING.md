# Moppy — Resumo do Projeto (v2)

> **Versão 2.** Incorpora todas as decisões tomadas sobre as pendências do MVP. Pontos marcados com *(confirmar no sandbox)* dependem de números reais da conta Asaas, que podem ser testados sem CNPJ antes de ir ao ar.

Marketplace de faxina de duas pontas. Clientes publicam pedidos de limpeza para suas casas, faxineiras se candidatam, o cliente escolhe uma. Modelo de referência: apps de serviço tipo Uber, mas com escolha da profissional pelo cliente.

O dono do app ganha por comissão sobre cada serviço. **O app é apenas o intermediador que conecta faxineira e cliente e medeia conflitos — não é empregador, não é seguradora, não se responsabiliza pelo serviço executado.**


## Nome e identidade

Nome do app: Moppy.

Cor primária: roxo claro (#A78BFA). Estilo moderno e minimalista, tipografia Inter. Paleta "Lilac Minimal": roxo como único acento, resto em tons neutros (fundo quase branco, superfícies brancas, cinzas para texto). Sem gradientes pesados, sombras sutis.

Logo já criada: gota d'água branca com um brilho, letra M e o nome Moppy, sobre fundo roxo.


## Como funciona (visão geral)

O cliente cria um pedido informando o endereço, os dados da casa (quartos, banheiros, tipo de limpeza) e a data. O pedido fica visível para as faxineiras próximas por duas vias ao mesmo tempo: uma notificação push e uma tela de busca de trabalho (feed) onde ele aparece listado. As faxineiras interessadas se candidatam. O cliente compara as candidatas (nota, distância, número de serviços) e escolhe uma. O pagamento é feito pelo app, o serviço é executado, o cliente confirma, e o dinheiro é liberado para a faxineira, descontadas as taxas. No fim, os dois se avaliam.


## Perfis

Cliente: cadastra endereços, cria pedidos, escolhe a faxineira, paga e avalia.

Faxineira: faz um cadastro com documentos, define área de atuação e disponibilidade, recebe pedidos, se candidata, executa, recebe o pagamento e avalia. **Cadastra-se como pessoa física — não precisa de MEI/CNPJ.**

Admin (painel web): aprova cadastros de faxineiras, acompanha pedidos, media disputas e cuida da parte financeira.


## Pagamento

Gateway escolhido: Asaas. O motivo é que ele cria subcontas para as faxineiras pela própria API (sem exigir que cada uma abra conta e autorize por fora, como seria no Mercado Pago) e faz o split automático — a parte da faxineira vai pra conta dela e a comissão fica com o app, sem o dono do app precisar segurar dinheiro de terceiros.

A "custódia" do dinheiro não é uma conta guardando o valor — é uma pré-autorização no cartão do cliente. No dia anterior ao serviço, o valor é reservado no cartão (não cobrado). Só depois que o serviço é concluído e confirmado é que a cobrança acontece de fato e o dinheiro é dividido. Se der problema ou cancelar, a reserva é estornada e o dinheiro nunca saiu da conta do cliente.

No MVP, só cartão de crédito (PIX fica para depois, porque não tem pré-autorização).

Custo: o Asaas não cobra mensalidade, só um percentual por transação capturada. Pré-autorização e estorno são grátis.

### Quando a faxineira recebe (D+15)

A faxineira **não recebe na hora** — recebe **15 dias após a conclusão** do serviço (D+15). O motivo é financeiro: no cartão de crédito, o dinheiro só cai naturalmente em **D+32** no Asaas. Receber "na hora" exigiria antecipação total, que é cara. Liberar em D+15 é uma antecipação **parcial** de ~17 dias, com custo baixo.

- Custo estimado da antecipação parcial: taxa de antecipação automática (~1,15% ao mês) proporcional a ~17 dias ≈ **0,65% do serviço** (~R$1 numa faxina de R$150). *(confirmar no sandbox)*
- **O app absorve esse custo de antecipação** (sai da comissão), porque é pequeno e mantém o valor líquido da faxineira limpo e transparente.

### Infraestrutura de pagamento (obrigatória no MVP)

- **Cron (Vercel Cron):** job agendado que dispara a pré-autorização no cartão no D-1 (véspera) de cada serviço, automaticamente.
- **Webhook do Asaas:** o backend nunca confia só na resposta imediata da chamada; o webhook confirma reserva, captura, estorno e falha de forma confiável, com proteção de idempotência (não processar o mesmo evento duas vezes).

### Falha da pré-autorização no D-1

Se o cartão recusar a reserva na véspera (limite, cartão vencido, banco bloqueia):

1. 2 tentativas automáticas com 1h de intervalo.
2. Se falhar, push pro cliente trocar o cartão (prazo até 6h antes do serviço).
3. Se não resolver, o pedido é cancelado.

Nesse caso: **sem compensação para a faxineira** (o app não tem caixa para cobrir e não segurou nenhum dinheiro), mas o cancelamento **não conta como falta no score dela** — a culpa foi do meio de pagamento do cliente. A **penalidade de score recai sobre o cliente.** A faxineira é notificada na hora para liberar a agenda.


## Modelo financeiro (Cenário C — meio a meio)

Comissão do app: 15% sobre o valor base do serviço.

A taxa de processamento do cartão é dividida meio a meio entre cliente e faxineira. A taxa de **antecipação** (D+15) é absorvida pelo app.

**Exemplo com uma faxina de R$ 150** — taxa de processamento estimada em **R$0,49 + ~3%** para cartão à vista *(estimativa; confirmar no sandbox)*:

- Taxa de processamento ≈ R$0,49 + R$4,50 = **~R$5,00**, dividida 50/50 → ~R$2,50 para cada lado.
- Cliente paga: base + metade da taxa ≈ **R$ 152,50**
- Comissão do app: **R$ 22,50** (15%)
- Antecipação D+15 (absorvida pelo app): ~R$1,00
- Faxineira recebe (líquido, em D+15): base − comissão − metade da taxa ≈ **R$ 125,00**

> Observação: o exemplo anterior (v1) usava uma taxa de 7%, que estava inflada — aquele percentual maior vale para parcelado/assinatura, não para cartão à vista. Os números finais saem do sandbox do Asaas.

Nas telas, o cliente vê "taxa de serviço" (não "taxa Asaas"), e a faxineira vê o valor líquido que vai receber antes de se candidatar — transparência total do lado dela.


## Preço dos serviços

Quem define o preço é o app (tabela fixa), não a faxineira. O preço varia por cidade.

Tabela de referência (cidade de interior):
- Studio / 1 quarto: R$ 90 (padrão) / R$ 126 (pesada)
- 2 quartos: R$ 120 / R$ 168
- 3 quartos: R$ 150 / R$ 210
- 4+ quartos: R$ 180 / R$ 252

Adicionais: cada banheiro além do primeiro +R$ 15, área externa +R$ 25, faxineira leva os produtos +R$ 30, passar roupa +R$ 20.

**Tipos de limpeza no MVP:** padrão (manutenção), pesada (+40%, sujeira acumulada) e passar roupa (adicional). **Pós-obra fica fora do MVP** (fase 2) — exigiria um fluxo de orçamento próprio, que não compensa agora.

A variação de preço é por cidade, cadastrada manualmente no banco de dados. A população da cidade (dado do IBGE) serve só como sugestão de ponto de partida para preencher a tabela mais rápido — o valor final é sempre revisado antes de ativar. O app só opera em cidade que tenha tabela cadastrada e ativa; em cidade sem cobertura, o cliente vê "ainda não atendemos sua região".

### Evolução do preço em três fases

1. **Fase 1 (MVP):** preço **fixo**. O app **coleta métricas por cidade desde o dia 1**, mas **não ajusta preço automaticamente**. No início, o admin ajusta as tabelas na mão com base nos dados coletados.
2. **Fase 2:** o sistema **sugere** ajustes, que o admin aprova.
3. **Fase 3:** o preço pode se **auto-ajustar** dentro de limites de segurança.

Cada cidade tem tabela e dados próprios — a coleta é sempre separada por cidade. O ponto crítico agora é guardar as métricas desde o início, porque não dá para coletar isso retroativamente.


## Fluxo do serviço, do início ao fim

**Antes:** o cliente escolhe a faxineira e o cartão é tokenizado (guardado com segurança, sem os dados sensíveis ficarem no app). No dia anterior ao serviço (D-1), o valor é pré-autorizado no cartão. O app mostra "pagamento aprovado, valor será cobrado após o serviço".

**Chegada:** a faxineira abre o app e aperta "Cheguei". O app decide o caminho:

- **Cliente disponível:** o app envia um código de 4 dígitos ao celular do cliente; ele passa o código para a faxineira (chat ou pessoalmente), ela digita, e isso registra a chegada e inicia o cronômetro.
- **Cliente não responde em 10 min:** libera confirmação por **foto da fachada + GPS** dentro do raio do endereço. Foto e coordenadas ficam guardadas em silêncio, usadas só em disputa.
- **Cliente não responde E o GPS não confirma:** a chegada **não pode ser iniciada** — a faxineira aciona o suporte para resolver (regra rígida, prioriza evitar fraude).

**Durante:** a faxineira executa o serviço e, ao terminar, marca como concluído.

**Confirmação:** o cliente recebe uma notificação perguntando "está tudo certo?" com duas opções — Sim ou Tive um problema.

**Se deu certo:** o cliente confirma (ou, se não responder em 24h, o app confirma automaticamente, com um lembrete em 12h). O valor é capturado e dividido. O saldo da faxineira entra como "a liberar" e fica **disponível para saque em D+15**. Os dois se avaliam.

**Se deu problema:** o cliente descreve o que houve e pode anexar fotos. A faxineira é **notificada e tem 24h para anexar a versão dela** (texto + fotos). O valor continua retido. O admin analisa os dois lados em até 48h e decide: reembolso total, reembolso parcial, ou liberar o pagamento para a faxineira. Não há recurso formal no MVP, mas ninguém é penalizado sem ter sido ouvido. Os dois são avisados da decisão.


## Cancelamento

- Cliente cancela **antes do D-1** (pré-autorização ainda não foi feita): cancelamento **total e gratuito** — nada foi reservado.
- Cliente cancela **com +12h** de antecedência: estorno total.
- Cliente cancela **com −12h**: captura 30% como taxa de reserva, que vai para a faxineira. A faxineira recebe esses 30% **já com a taxa do Asaas descontada** (≈R$41 num serviço de R$150, não R$45), porque é ganho sobre um serviço que não aconteceu.
- Faxineira cancela: estorno total para o cliente e penalidade no histórico dela.


## Taxa de urgência (destaque pago)

Em pedidos imediatos, o cliente pode pagar uma taxa opcional para destacar o pedido no topo da lista das faxineiras e avisar mais gente na região. O valor é fixo por faixa de demanda: R$ 3,50 (baixa), R$ 4,50 (média) ou R$ 5,50 (alta), calculado na hora conforme a relação entre pedidos abertos e faxineiras ativas na região.

Essa taxa é cobrada na hora, é separada do valor do serviço, não é reembolsável (mesmo se ninguém aceitar) e fica 100% com o app. O texto explicando isso aparece sempre visível no checkout, sem letra miúda.

Os pedidos não expiram sozinhos — ficam disponíveis até alguém aceitar ou o cliente cancelar. **Pedido sem nenhuma candidata por 48h → push pro cliente sugerindo adicionar a taxa de urgência ou revisar o pedido.**


## Matching e candidaturas

- Quando o cliente **escolhe uma candidata**, as outras candidaturas caem automaticamente (viram "não selecionada", com notificação) e o pedido sai do feed.
- Uma faxineira **não pode se candidatar a dois pedidos no mesmo horário** — o app bloqueia candidatura que conflite com um serviço já agendado (evita double-booking).


## Reputação — duas notas separadas

**Nota de qualidade (1 a 5 estrelas):** quem dá é a outra parte, é pública. Mede a qualidade do serviço ou do cliente.

**Score de confiabilidade (0 a 100):** dado automaticamente pelo sistema, visível só para a própria pessoa e o admin. Mede o comportamento. **Todo mundo começa com 65.**

O score da faxineira cai com cancelamentos, faltas, atrasos e disputas perdidas, e sobe com serviços concluídos sem problema. Conforme o score, ela pode perder prioridade na lista, deixar de receber notificações, ou ser suspensa se cair muito. A lógica pune sem banir e permite recuperação. O cliente também tem um score parecido — e sofre penalidade quando a pré-autorização falha por culpa do cartão dele. Nos primeiros serviços, a prioridade é neutra até a pessoa formar histórico.

As avaliações ficam ocultas até os dois avaliarem ou passarem 72h, para evitar retaliação.


## Chat interno

Chat de texto simples entre cliente e faxineira, liberado depois que o cliente escolhe a faxineira. Existe para as pessoas combinarem detalhes sem sair para o WhatsApp — porque no WhatsApp elas poderiam combinar pagamento por fora e furar a comissão. Tem um aviso fixo dizendo que pagamento fora do app não tem garantia.


## Carteira e saque

A faxineira tem uma tela de carteira dentro do app com saldo, extrato e um botão para transferir o dinheiro para a conta dela via PIX (a chave é cadastrada no onboarding). O saldo aparece em dois estados:

- **A liberar:** serviço já concluído, mas ainda dentro dos 15 dias — visível, mas não sacável.
- **Disponível:** já passou o D+15 — pode transferir via PIX.

Precisa aparecer bem explicado na tela para a faxineira não achar que sumiu dinheiro. Tudo por dentro do app, sem precisar abrir o app do Asaas. Saque mínimo de R$ 20.


## Suporte

Botão "falar com suporte" que abre o WhatsApp Business do dono do app, já com o número do pedido preenchido. Simples, resolve no MVP. O botão de "relatar problema" dentro do pedido é diferente — esse abre a disputa.


## Cadastro e aprovação de faxineiras

A faxineira envia documento com foto, selfie, CPF, comprovante de endereço e chave PIX (**pessoa física, sem MEI**). O admin aprova manualmente, com critérios objetivos: reprova direto documento ilegível, selfie que não bate, CPF irregular ou menor de idade; aprova quando está tudo certo. Resposta em até 48h. Se reprovada, recebe o motivo e pode tentar de novo uma vez. Consulta de antecedentes criminais fica fora do MVP.

**Área de atuação:** a faxineira define um **raio em km** a partir do endereço dela (ex.: 5, 10 ou 20 km). As notificações de novo pedido e o feed usam esse raio.


## Notificações

O app envia notificações nos momentos-chave: novo pedido por perto, nova candidatura, cliente escolheu, lembrete de serviço no dia seguinte, faxineira chegou, "está tudo certo?", lembrete de confirmação, pagamento liberado, disputa aberta e decidida, cancelamento, cadastro aprovado ou reprovado, avaliação recebida e nova mensagem no chat.

**O app funciona 100% sem push:** o feed "buscar trabalho" mostra todos os pedidos, então mesmo que a faxineira negue a permissão de notificação, ela continua vendo e pegando trabalho. Push é reforço, não obrigatório.


## Segurança e dados

Verificação de documento e selfie no cadastro. O endereço completo só é liberado para a faxineira depois da contratação (antes ela vê só o bairro e a distância). Dados de cartão nunca ficam no app — são tokenizados pelo Asaas. Documentos e selfies ficam com acesso restrito.

O app lida com CPF, RG, selfie, endereço e localização, então precisa de termos de uso, política de privacidade (LGPD), aceite no cadastro e opção de excluir a conta.


## Danos, furtos e responsabilidade

**O app é apenas o mediador que conecta faxineira e cliente — não há seguro nem garantia de danos.** Os termos deixam explícito que o app não é empregador nem responsável pelo serviço executado.

Dano ou furto vira uma **disputa** analisada pelo admin caso a caso (com o direito de defesa da faxineira em 24h). O máximo que o app faz é estornar ou não cobrar aquele serviço — **teto de ressarcimento via app = o valor da faxina.** Qualquer coisa além disso é resolvida entre as partes, fora do app; o app fornece os dados de cadastro para isso, mas não paga a diferença.


## Métricas e eventos (coletar desde o dia 1)

Como o preço vai evoluir com base em dados e **não dá para coletar retroativamente**, o app registra tudo desde o primeiro pedido. A regra de ouro: **gravar cada evento importante com carimbo de data/hora e cidade** — as métricas são calculadas a partir dos eventos depois, inclusive métricas que ainda nem foram pensadas.

### Eventos a registrar (com data/hora + cidade)

- Pedido criado (com preço ofertado, tipo de limpeza, tamanho da casa, adicionais)
- Taxa de urgência acionada (e faixa: baixa/média/alta)
- Candidatura recebida
- Cliente escolheu uma faxineira
- Pré-autorização feita / falhou
- Chegada confirmada (por código / por GPS+foto / bloqueada)
- Serviço concluído
- Confirmação do cliente (manual / automática em 24h)
- Cancelamento (quem cancelou + antecedência: antes do D-1 / +12h / −12h)
- Disputa aberta / resultado
- Pagamento capturado e dividido
- Saque solicitado

### Métricas que saem desses eventos

**Demanda e preço:** preço ofertado por pedido, cidade/região, pedido aceito x cancelado sem candidata, uso e faixa da taxa de urgência.

**Saúde do marketplace:** tempo até a 1ª candidatura, nº de candidatas por pedido, tempo até o cliente escolher, quantos pedidos ficam sem candidata.

**Qualidade:** cancelamentos por lado e por antecedência, disputas (quantas e resultado), no-show / chegada não confirmada.

**Financeiro:** comissão arrecadada por serviço, custo de antecipação absorvido pelo app, receita de taxa de urgência.


## Parte jurídica

Três documentos já foram redigidos como ponto de partida (precisam de revisão de advogado): Termos de Uso, Política de Privacidade e Contrato de Adesão da Prestadora.

O maior risco do projeto é o vínculo trabalhista. Como o app define o preço, a defesa de que a faxineira é autônoma não pode se apoiar nisso — apoia-se na **liberdade dela de recusar pedidos**. E como a faxineira é **pessoa física (sem MEI)**, essa defesa se apoia inteiramente nessa liberdade, já que não dá para usar o argumento de "empresa contratada". Os documentos precisam refletir isso, e a forma como o app opera precisa ser coerente com o discurso de "puro intermediador".

Levar ao advogado: vínculo trabalhista, responsabilidade por danos ou furtos durante o serviço, termos de uso, privacidade e contrato da prestadora. Levar ao contador (separado): nota fiscal sobre a comissão, regime tributário, e como tratar a prestadora pessoa física (retenções, se houver).

O CNPJ do dono do app é de São Paulo, o que não afeta em nada o funcionamento — CNPJ é nacional.


## Tecnologia

App em Expo / React Native. Banco de dados e login no Firebase. Funções de backend na Vercel (incluindo o **Vercel Cron** para a pré-autorização no D-1 e o **webhook do Asaas** com idempotência). Pagamento no Asaas. Localização com geolocalização por raio. Notificações via Expo. As telas serão criadas no Claude Design, e a implementação depois no Claude Code.

Detalhe importante: o Asaas tem ambiente de testes (sandbox) que não exige CNPJ. Ou seja, dá para desenvolver e testar todo o pagamento — e **confirmar as taxas reais** — antes do CNPJ estar pronto. O CNPJ só é necessário para ir ao ar de verdade.


## Telas do MVP

Cliente: escolha de papel, login/cadastro, home, criar pedido, checkout/pagamento, lista de candidatas, pedido em andamento, confirmação, disputa, avaliação, chat, endereços e cartões, perfil.

Faxineira: cadastro com documentos, aguardando aprovação, home, buscar trabalho, detalhe do pedido e candidatura, agenda, serviço em andamento, carteira (com "a liberar" x "disponível"), chat, avaliações e perfil.

Admin (web): aprovação de faxineiras, pedidos, disputas, financeiro, usuários.


## Pendências resolvidas nesta versão

Falha da pré-autorização · chegada com cliente ausente · pagamento D+15 e custo de antecipação · webhook + cron · taxa sobre cancelamento −12h · cancelamento antes do D-1 · pessoa física sem MEI · matching e agenda · score inicial 65 · danos/furtos (só mediador) · disputa bilateral · pós-obra fora do MVP · raio de atuação · no-show do cliente · app sem push · métricas e eventos · cidade de lançamento · taxa de processamento nos exemplos.


## O que ainda depende de terceiros / próximos passos

- **Sandbox do Asaas:** confirmar a taxa real de processamento (cartão à vista) e o custo real da antecipação D+15. Substituir as estimativas do modelo financeiro.
- **CNPJ e conta Asaas de produção:** só para ir ao ar.
- **Advogado:** vínculo trabalhista (com faxineira pessoa física), danos/furtos, termos de uso, privacidade, contrato de adesão.
- **Contador:** nota fiscal da comissão, regime tributário, tratamento da prestadora pessoa física.
- **Cidade de lançamento:** Itaú de Minas e cidades vizinhas — cadastrar e revisar a tabela de preço de cada uma antes de ativar.


## Ordem sugerida de construção

Primeiro a fundação (projeto, login, navegação, identidade visual). Depois os cadastros. Depois os pedidos e o matching. Depois o pagamento (com cron e webhook). Depois a execução do serviço. Depois chat e reputação. Por fim, o polimento (carteira, notificações, estados vazios, termos, testes). O registro de eventos/métricas entra **desde o começo**, acompanhando cada parte conforme ela é construída.
