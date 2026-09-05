# Moppy — Perfil de Pagamento

**Projeto:** Moppy — Marketplace de Faxina
**Última atualização:** 2026-09-04
**Status:** ✅ Aprovado — Gate 3 (Jehu, 2026-09-04)

---

## 0. Por que este documento foi reescrito (2026-09-04)

> **Isto não é preferência de design. É restrição real, descoberta testando ao vivo contra o sandbox do Asaas.**

O desenho anterior (2026-08-23) assumia **pré-autorização de cartão**: reservar o valor em D-1 e capturar só depois que o cliente confirmasse o serviço em D/D+1. Testes reais contra o sandbox da Moppy em 2026-09-04 derrubaram essa premissa:

| Achado | Evidência |
|---|---|
| Não existe "authorizeOnly" em `POST /v3/payments` | Cobrança com `creditCardToken` volta `status: "CONFIRMED"` na hora — o dinheiro sai imediatamente |
| Pré-autorização estendida não pode ser habilitada nesta conta | `POST /v3/creditCard/preAuthorization/config` rejeitou `daysToExpire` = 1, 2, 3 e 5: *"A atividade econômica de sua empresa não permite a criação de cobranças com pré-autorização maiores que 3 dias"* + *"O prazo deve estar dentro do intervalo de 3 a 25 dias"* — as duas regras juntas não deixam nenhum valor válido |
| Não é limitação de sandbox | O Asaas libera pré-autorização estendida só para categorias específicas de atividade econômica (hotelaria, locação de veículos, cruzeiros, táxi). Limpeza residencial não está na lista. Uma conta de produção da Moppy cairia na mesma regra |
| Declarar atividade econômica falsa foi **recusado** | Declarar "táxi" para uma instituição financeira para contornar a regra é risco real de bloqueio/congelamento de conta em produção. Jehu concordou em não fazer |
| A autenticação documentada estava errada | O header é `access_token: <chave>`. `Authorization: Bearer` devolve **401**. Confirmado com curl |
| Split e transferência PIX não exigem subconta | `POST /v3/payments` aceita `split[]` na própria cobrança; `POST /v3/transfers` transfere direto para `pixAddressKey`. Nenhum dos dois exige subconta por faxineira |

**Consequência:** o modelo de custódia via pré-autorização morreu. A Moppy passa a **cobrar de verdade** o cartão e a **estornar** quando o serviço não acontece. Todo o resto do modelo financeiro (comissão 15%, taxa 50/50, antecipação D+15, saldo "a liberar" → "disponível", saque mínimo R$20) continua valendo.

---

## 1. Decisão central: quando o cartão é cobrado

### Decisão

**A cobrança acontece em D-1 (véspera do serviço), pelo mesmo cron que antes fazia a pré-autorização.** O dinheiro entra na conta Asaas da Moppy antes de a faxineira sair de casa. Se o serviço não acontece, o caminho de volta é **estorno**, não "deixar de capturar".

**Regra complementar (fura o cron):** se o pedido for confirmado com menos de 24h de antecedência — agendamento para hoje ou para amanhã cedo depois de o cron já ter rodado — a cobrança é disparada **na hora da confirmação**, não no cron. Sem isso o pedido chega ao dia do serviço sem cobrança nenhuma (falha real do cron atual, ver §7).

### Por que não cobrar só na confirmação (D/D+1)

| Critério | Cobrar em D-1 (escolhido) | Cobrar em D+1, após o serviço |
|---|---|---|
| Faxineira trabalha e o cartão recusa | **Impossível.** Recusa aparece em D-1, com ~13h de folga | **Acontece.** Ela gastou 4h e transporte, e não há dinheiro. A Moppy paga do bolso ou perde a faxineira |
| Custo de uma recusa | Zero. Pedido cancelado, agenda liberada com aviso na véspera | Catastrófico. É o pior evento possível num marketplace novo — churn do lado da oferta |
| Alavanca de recuperação | Retry 2× + 6h para o cliente trocar o cartão | Nenhuma. O cliente já consumiu o serviço |
| Auto-confirmação em 24h | Continua funcionando (é só liberação interna de saldo) | Vira "vamos tentar te cobrar" — inviável |
| Custo de cancelamento | Taxa de estorno (~R$5 por pedido cancelado após a cobrança) | Zero |
| Percepção do cliente | "Cobraram na véspera" — igual a hotel, passagem, iFood | "Só pagou depois" — melhor, mas irrelevante frente ao risco acima |

**Racional em uma frase:** o recurso escasso e insubstituível aqui é o dia da faxineira. O modelo de pagamento tem que proteger a oferta, porque cliente a Moppy consegue outro e faxineira que trabalhou de graça não volta.

### Opção descartada: cobrar no fechamento do pedido (quando o cliente escolhe a candidata)

Descartada. O intervalo entre fechar o pedido e o serviço pode ser de 1 a 14 dias. Cobrar no fechamento aumenta a janela de cancelamento (mais estornos, mais taxa perdida, mais "por que já cobraram?") e **não elimina o teste de D-1** — um cartão bom hoje pode estar estourado na véspera. D-1 é o último instante em que a falha ainda custa zero.

### Custo novo que essa decisão cria

Estorno de cartão no Asaas **não devolve a taxa da transação** (confirmar no sandbox). Cada pedido cancelado depois da cobrança custa à Moppy ~R$5,07 num ticket de R$152,50. É o preço de proteger a faxineira.

**Métrica de vigilância:** `% de pedidos estornados após a cobrança`. Se passar de **8%**, reavaliar mover a cobrança para a manhã do dia D (janela menor de cancelamento, ainda antes do deslocamento da faxineira).

---

## 2. Decisão: sem subconta Asaas por faxineira, e sem `split` na cobrança

**Decisão formal: a Moppy não cria subconta Asaas para faxineira, e não usa o campo `split` da cobrança.** O dinheiro é cobrado 100% para a conta principal da Moppy; a carteira da faxineira é um **livro-razão interno no Firestore**; o pagamento sai como **transferência PIX direta** (`POST /v3/transfers` com `pixAddressKey`) no momento do saque.

Motivos:

| Motivo | Detalhe |
|---|---|
| O `split` da cobrança executaria cedo demais | Ele divide o dinheiro **no momento da cobrança (D-1)**, antes de o serviço acontecer. Isso quebra o "a liberar → disponível em D+15" e transforma todo estorno em cobrança reversa contra a faxineira |
| Subconta é atrito de onboarding | Cada faxineira teria que abrir conta, mandar documento e ser aprovada pelo Asaas antes de receber o primeiro pedido. Para o público-alvo da Moppy isso mata a conversão |
| O código já é assim | `app/api/wallets/withdraw/route.ts` já lê `cleaner.pix.key_value` e transfere da conta principal. Nunca houve subconta de verdade em lugar nenhum do código — o documento antigo é que estava desalinhado |
| PIX direto não exige subconta | Confirmado ao vivo: `POST /v3/transfers` com `pixAddressKey` + tipo de chave resolve o saque |

**O que isso implica e precisa estar escrito:**

1. A Moppy **passa a segurar dinheiro de terceiros em trânsito**. O documento anterior dizia o contrário ("custódia é feita como pré-autorização"). Isso acabou. O saldo "a liberar" + "disponível" das faxineiras é **passivo**, não caixa da Moppy.
2. **Item obrigatório para o contador:** 100% do valor entra na conta da Moppy. Só a comissão + taxa é receita; o resto é repasse. Precisa de tratamento contábil e de nota fiscal correto, senão vira faturamento inflado.
3. Um relatório de conferência precisa mostrar, todo dia: `saldo em conta Asaas ≥ soma de todas as carteiras (a liberar + disponível)`. Se essa desigualdade quebrar, a Moppy gastou dinheiro de faxineira.

---

## 3. Modelo Financeiro

Inalterado, exceto pela nova linha de custo de estorno.

| Item | Valor | Quem paga |
|---|---|---|
| Comissão do app | **15%** sobre a base do serviço | Descontado da faxineira |
| Taxa Asaas (cartão à vista) | ~R$0,49 + ~3% *(confirmar no sandbox)* | **50/50** cliente e faxineira |
| Custo de antecipação D+15 | ~0,65% do serviço | **App absorve** |
| Taxa de urgência | R$3,50 – R$5,50 | Cliente. 100% do app, não reembolsável, não entra na base de comissão |
| **Custo de estorno (NOVO)** | **Taxa da transação, não devolvida pelo Asaas (~R$5 em R$152,50)** | **App absorve** |

### Exemplo completo (serviço de R$150)

| Conceito | Valor |
|---|---|
| Base do serviço | R$ 150,00 |
| Taxa Asaas (0,49 + 3%) | R$ 5,07 |
| — metade do cliente | + R$ 2,53 |
| — metade da faxineira | − R$ 2,53 |
| Comissão do app (15% da base) | − R$ 22,50 |
| Custo de antecipação (app absorve) | − R$ 0,98 |
| | |
| **Cliente é cobrado** | **R$ 152,53** |
| **Faxineira recebe (líquido, D+15)** | **R$ 124,97** |
| **App fica com** | **R$ 22,50 + R$ 2,53 − R$ 0,98 = R$ 24,05** |

**Duas correções de cálculo que a implementação real precisa aplicar** (o mock nunca cobrou taxa de verdade, então passaram despercebidas):

1. `lib/split.ts` calcula `app_total = comissão + feeShare + anticipationCost`. A antecipação é **custo**, tem que **subtrair**. Hoje o painel financeiro superestima o lucro do app.
2. A taxa do Asaas incide sobre o **valor efetivamente cobrado** (`amount.gross`, R$152,53), não sobre a base (`amount.split_base`, R$150). Hoje `computeSplit` recebe a base — subestima a taxa em ~R$0,08 por pedido. Pequeno, mas em conciliação com o extrato do Asaas nunca fecha.

---

## 4. Tabela de Preços MVP (inalterada)

### Base (Limpeza Padrão — Manutenção)

| Tamanho | Preço |
|---------|-------|
| Studio / 1 quarto | R$ 90 |
| 2 quartos | R$ 120 |
| 3 quartos | R$ 150 |
| 4+ quartos | R$ 180 |

### Limpeza Pesada — +40% sobre a base

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
| Passar roupa | +R$ 20 |

### Taxa de Urgência (Destaque Pago)

| Faixa de Demanda | Valor |
|-----------------|-------|
| Baixa | R$ 3,50 |
| Média | R$ 4,50 |
| Alta | R$ 5,50 |

100% do app, não reembolsável mesmo se ninguém aceitar, fora da base de comissão. Cliente vê o valor e a explicação no checkout, sem letra miúda.

### Variação por Cidade

Cada cidade tem tabela própria, cadastrada manualmente. App só opera onde há tabela ativa. Fase 1 (MVP): preço fixo, métricas coletadas desde o dia 1, ajuste manual. Fase 2: sistema sugere, admin aprova. Fase 3: auto-ajuste dentro de limites.

---

## 5. Fluxo resumido

Detalhamento completo, com diagrama e casos de erro, em `PAYMENT-FLOW.md`.

```
FECHAMENTO DO PEDIDO   cliente escolhe a candidata → pedido "confirmed"
                       nada é cobrado ainda (salvo pedido para <24h → cobra agora)
        ↓
D-1 (cron, 19h BRT)    cria a cobrança no Asaas com o cartão tokenizado
                       → dinheiro na conta Asaas da Moppy (charge_success)
                       recusou? retry 1h, retry 1h, depois 6h para trocar o cartão
        ↓
D                      faxineira confirma chegada → executa → marca "Concluído"
        ↓
ATÉ 24h APÓS           cliente confirma (ou o app confirma sozinho em 24h)
                       → split calculado → carteira creditada "a liberar" (settled)
                       cliente reclama → disputa (dinheiro já está com a Moppy, não sai)
        ↓
D+15                   "a liberar" vira "disponível"
        ↓
SAQUE                  faxineira pede ≥ R$20 → PIX direto para a chave dela
```

**Diferença central em relação ao desenho antigo:** entre `charge_success` e `settled` o dinheiro **já está na conta da Moppy**. Antes ele estava reservado no cartão. Todo caminho de volta (cancelamento, disputa, no-show) agora é **estorno**, com custo e latência reais.

---

## 6. Cancelamento — regras reescritas

O critério antigo era "a pré-autorização já foi feita?". O critério novo é **"a cobrança já foi feita?"**, combinado com a antecedência.

| # | Situação | Cobrança | Ação financeira | Estado final |
|---|---|---|---|---|
| 1 | Cliente cancela **antes da cobrança** | não existe | nada a fazer | `cancelled_free` |
| 2 | Cliente cancela **após a cobrança**, com **≥12h** de antecedência | cobrada | **estorno total** do valor cobrado (R$152,53). App absorve a taxa perdida | `refunded` |
| 3 | Cliente cancela **após a cobrança**, com **<12h** | cobrada | **retém 30% da base** (R$45,00) → creditado **integralmente** na carteira da faxineira, sem comissão e sem rateio de taxa. **Estorna o restante** (R$107,53) | `partial_refund` |
| 4 | Faxineira cancela **antes da cobrança** | não existe | nada. Pedido volta para `open` para outra candidata, ou cancela se não der tempo | `cancelled_free` |
| 5 | Faxineira cancela **após a cobrança** | cobrada | **estorno total** ao cliente. App absorve a taxa | `refunded` |
| 6 | Cobrança falha 3× e o cliente não troca o cartão em 6h | falhou | nada a estornar | `cancelled_no_payment` |
| 7 | Cliente quer cancelar **depois do serviço executado** | cobrada | **não é cancelamento.** Vira disputa | `disputa_aberta` |

**Mudança deliberada em relação ao doc antigo:** no caso 3, o documento anterior descontava taxa e entregava ~R$41 à faxineira. Agora ela recebe os R$45 cheios. Motivo: ela é a parte prejudicada, a conta fica trivial de explicar no app, e o custo extra para o app (~R$4) é menor que o custo de uma faxineira achando que levou desconto num cancelamento que não foi culpa dela.

**Penalidades (inalteradas):** faxineira que cancela perde score (−5 a −10 conforme a antecedência); cliente com cobrança recusada por culpa do cartão perde score (−5).

---

## 7. Estados do pagamento e quem muda cada um

O documento antigo misturava estado do pagamento com estado da carteira. Isso foi separado: `saldo_a_liberar` / `saldo_disponivel` **não são estados de pagamento**, são campos de `wallets/{cleanerId}.balance`.

| Estado | Significado | Quem muda | Efeito na agenda da faxineira (o "estoque" da Moppy) |
|---|---|---|---|
| `pending` | Pedido confirmado, cobrança ainda não criada | Sistema (ao confirmar o pedido) | Slot reservado |
| `charge_pending` | Cobrança enviada ao Asaas, aguardando resposta/webhook | Cron D-1 (ou confirmação < 24h) | Slot reservado |
| `charge_retry_1` / `charge_retry_2` | Recusou, retry agendado para +1h | Cron | Slot reservado |
| `charge_failed` | 3 tentativas falharam; cliente tem 6h para trocar o cartão | Cron | Slot reservado, com aviso à faxineira |
| `charge_success` | **Dinheiro cobrado, na conta Asaas da Moppy.** Carteira da faxineira ainda NÃO creditada | Webhook `PAYMENT_CONFIRMED` (ou resposta da criação, reconciliada depois) | Slot **firme** |
| `settled` | Serviço confirmado, split calculado, carteira creditada como "a liberar" | Cliente (C23) ou cron auto-confirm 24h ou admin (disputa "libera") | Slot consumido |
| `disputa_aberta` | Cliente reportou problema; dinheiro fica parado na conta da Moppy | Cliente (C24) | Slot consumido |
| `refunded` | Estorno total processado | Admin, cliente (cancelamento ≥12h) ou sistema (faxineira cancelou) | Slot **liberado** |
| `partial_refund` | Estorno parcial + crédito parcial na carteira | Admin (disputa) ou sistema (cancelamento <12h) | Slot liberado |
| `refund_pending` | Estorno enviado, aguardando confirmação do Asaas | Sistema | — |
| `refund_failed` | Estorno recusado — **exige ação manual do admin** | Sistema | — |
| `cancelled_free` | Cancelado antes de qualquer cobrança | Cliente ou faxineira | Slot liberado |
| `cancelled_no_payment` | Cobrança falhou definitivamente | Cron | Slot liberado |
| `chargeback_requested` | **NOVO.** Cliente contestou no banco | Webhook `PAYMENT_CHARGEBACK_REQUESTED` | Congela o saldo desse pedido na carteira |

### Mapa de renomeação (para a implementação)

| Estado antigo | Estado novo |
|---|---|
| `preauth_pending` | `charge_pending` |
| `preauth_retry_1` / `preauth_retry_2` | `charge_retry_1` / `charge_retry_2` |
| `preauth_success` | `charge_success` |
| `preauth_failed` | `charge_failed` |
| `capture_pending` | **removido** — não existe captura separada |
| `capture_success` | `settled` |
| `capture_failed` | **removido** — a falha agora é `charge_failed`, em D-1 |
| `payment_processado` | `settled` (fundido) |
| `disputa_liberado` | `settled` |
| `disputa_reembolso_total` | `refunded` |
| `disputa_reembolso_parcial` | `partial_refund` |
| `saldo_a_liberar` / `saldo_disponivel` | deixam de ser estados de pagamento; viram `wallets/{id}.balance.pending_release` / `.available` |
| — | `chargeback_requested` (novo) |

---

## 8. Conciliação — como o Jehu sabe que recebeu

Três camadas, todas obrigatórias no MVP:

| Camada | O quê | Onde |
|---|---|---|
| **Painel financeiro** | Lista diária: pedidos cobrados, valor bruto, comissão, taxa, estornos, saldo devido às faxineiras | `/financeiro` (já existe) |
| **Cron de reconciliação (2h)** | Para cada pagamento em `charge_pending` / `refund_pending`, consulta `GET /v3/payments/{id}` e sincroniza. Detecta webhook perdido | `/api/cron/reconcile` |
| **Trava de caixa (diária)** | Compara saldo da conta Asaas com a soma de todas as carteiras. Alerta se `saldo Asaas < passivo das carteiras` | Card no dashboard + alerta |

**A pergunta "recebi ou não?" se responde no painel, nunca abrindo o Firestore.** Todo pagamento carrega `externalReference = orderId`, então qualquer linha do extrato do Asaas é rastreável até o pedido.

---

## 9. Segredos e variáveis de ambiente

Todas em variável de ambiente na Vercel. Nenhuma no código, nenhuma no app mobile.

| Variável | Onde vive | Para quê |
|---|---|---|
| `ASAAS_API_KEY` | Vercel (admin, server-side) | Header `access_token` de toda chamada |
| `ASAAS_BASE_URL` | Vercel | `https://sandbox.asaas.com/api/v3` ou `https://api.asaas.com/api/v3` |
| `ASAAS_WEBHOOK_TOKEN` | Vercel | Valor que o Asaas devolve no header `asaas-access-token` — validar em todo webhook |
| `CRON_SECRET` | Vercel | Autenticação dos crons (`authorization: Bearer`) |
| ~~`ASAAS_WALLET_ID`~~ | **removida** | Só fazia sentido com subconta/split |

Regras que continuam valendo: nunca guardar PAN, CVV ou validade — só `creditCardToken`, últimos 4 dígitos e bandeira. HTTPS obrigatório. Nenhum dado sensível em log.

---

## 10. Limites e prazos

| Limite | Valor |
|---|---|
| Mínimo por serviço | R$ 20,00 |
| Mínimo para saque | R$ 20,00 |
| Máximo no cartão | Limite do cliente |

| Prazo | Duração |
|---|---|
| Cobrança | D-1, 19h BRT (ou na confirmação, se faltar <24h) |
| Retry de cobrança | 1h entre tentativas, 2 retries |
| Janela para o cliente trocar o cartão | 6h após a 3ª falha |
| Confirmação do cliente | 24h (lembrete em 12h), depois auto-confirma |
| Defesa da faxineira na disputa | 24h |
| Análise do admin | até 48h |
| Estorno chegando ao cliente | 1 a 2 faturas / até 2 dias úteis, conforme o banco |
| Saldo "a liberar" → "disponível" | D+15 contado da **confirmação**, não da cobrança |
| Saque PIX | 1-2 dias úteis |
| Reconciliação | a cada 2h |

**Prazo que sumiu:** "validade da pré-autorização (~30 dias)" não existe mais. Não há hold para expirar.

---

## 11. Reaproveitamento de outros projetos do Jehu

| O quê | De onde | Estado |
|---|---|---|
| Cliente Asaas com header `access_token`, `User-Agent`, tratamento de erro | Nenhum projeto tem integração Asaas real ainda — Empório, Nova Era Tintas e Sara Pastelaria usam PIX manual / link | **Escrever do zero.** Será o primeiro cliente Asaas real da fábrica — vale nascer como módulo reaproveitável |
| Webhook idempotente por `event_id` | `app/api/webhooks/asaas/route.ts` (Moppy) | Estrutura serve; o payload e o header de auth precisam virar os reais |
| Cron autenticado por `CRON_SECRET` | Moppy, 3 crons já em pé | Reaproveita direto |
| Carteira com "a liberar"/"disponível" + `runTransaction` | `lib/payments.ts` (Moppy) | Reaproveita direto, só renomeia estados |

---

## 12. Riscos que este modelo cria e não existiam antes

| Risco | Mitigação |
|---|---|
| **Chargeback.** Cobrança real pode ser contestada no banco | Tratar `PAYMENT_CHARGEBACK_REQUESTED`; congelar o saldo daquele pedido se ainda não sacado; guardar a trilha (chegada com código/GPS+foto, chat, avaliação) como evidência |
| **Cobrança duplicada.** Cron rodando duas vezes = cliente cobrado 2× | `payments/{orderId}` como chave natural + `externalReference = orderId` + consulta `GET /v3/payments?externalReference=` antes de criar |
| **Estorno duplicado.** Admin clica duas vezes em "reembolso total" | `runRefund` precisa checar o estado antes (hoje **não checa** — falha real do código atual) |
| **Moppy gasta dinheiro de faxineira** | Trava de caixa diária (§8) |
| **Custo de estorno acumulado** | Métrica "% estornado após cobrança"; gatilho de revisão em 8% |
| **Enquadramento contábil do repasse** | Item obrigatório para o contador antes da produção |

---

## PRÓXIMO PASSO

1. **A cobrança do cartão passa a ser real em D-1** (o cron que pré-autorizava agora cobra), porque pré-autorização não é liberada para a atividade econômica de limpeza no Asaas — restrição confirmada ao vivo, não escolha de design.
2. **Todo caminho de volta vira estorno:** cancelamento ≥12h = estorno total; <12h = retém 30% para a faxineira e estorna o resto; disputa = estorno total ou parcial decidido pelo admin. Custo: ~R$5 de taxa não devolvida por pedido estornado, absorvido pelo app.
3. **Sem subconta e sem split na cobrança:** tudo entra na conta principal da Moppy, a carteira é livro-razão no Firestore e o saque sai por PIX direto — que é exatamente o que o código já faz. Em troca, a Moppy passa a segurar dinheiro de terceiros, o que exige trava de caixa diária e tratamento contábil do repasse.

**Gate 3 aprovado pelo Jehu em 2026-09-04.** A sessão principal implementa `lib/asaas.ts` real seguindo `PAYMENT-IMPLEMENTATION.md` §2.
