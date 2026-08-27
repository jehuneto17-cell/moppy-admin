# Moppy — Roadmap do Produto (3 Fases)

## Visão Geral

O Moppy evolui em três fases, começando por um MVP minimalista (Fase 1) e expandindo funcionalidades conforme o marketplace amadurece e os dados guiam decisões.

---

## Fase 1: MVP (Lançamento)

**O que é:** Marketplace funcional com pedidos, candidaturas, pagamento e disputas. Foco em conectar cliente e faxineira com segurança e transparência mínima.

**Timeline:** ~16-20 semanas (desenvolvimento + validação no sandbox Asaas + testes)

**Objetivo:** Validar modelo de negócio, coletar dados de demanda/qualidade, operar em 1 cidade (Itaú de Minas + arredores).

### Funcionalidades

**Cliente:**
- Login/cadastro, cadastro de endereços
- Criar pedido (tipo, tamanho, adicionais, data, hora)
- Visualizar preço com taxas desagregadas
- Escolher taxa de urgência opcional
- Receber pré-autorização automática (D-1)
- Comparar candidatas (foto, nota, distância, histórico)
- Escolher faxineira
- Passar código de confirmação (ou autorizar por GPS+foto)
- Confirmar qualidade ou reportar problema
- Avaliar faxineira (1-5 stars)
- Chatear com faxineira (in-app)
- Ver histórico de serviços

**Faxineira:**
- Cadastro com documentos (RG, CPF, selfie, comprovante, PIX)
- Aguardar aprovação manual (até 48h)
- Definir raio de atuação (km)
- Ver feed de pedidos abertos
- Candidatar-se a pedidos
- Ver valor líquido antes de candidatar
- Confirmar chegada (código ou GPS+foto)
- Marcar serviço como concluído
- Aguardar confirmação do cliente (ou automática em 24h)
- Responder a disputas (24h)
- Avaliar cliente (1-5 stars)
- Ver carteira ("a liberar" vs "disponível")
- Solicitar saque via PIX (mínimo R$20)
- Ver histórico de serviços

**Admin (Web):**
- Aprovação de faxineiras (critérios objetivos)
- Acompanhamento de pedidos em tempo real
- Resolução de disputas (análise bilateral, decisão em até 48h)
- Dashboard financeiro (comissão, taxa de urgência, estornos)
- Gerenciamento de tabelas de preço (manual, por cidade)
- Visualização de score de confiabilidade (cliente e faxineira)

### Métricas Críticas

- Número de pedidos criados (por cidade)
- Taxa de conversão (pedidos com candidata)
- Tempo até 1ª candidata
- Número de candidatas por pedido
- Cancelamentos (taxa + motivo + antecedência)
- Disputas (taxa + resolução)
- Rating médio (cliente + faxineira)
- Comissão arrecadada
- Receita de taxa de urgência
- No-show / chegada não confirmada

### Critério de Sucesso

- [ ] App funcionando em Itaú de Minas + cidades vizinhas
- [ ] Mínimo 50 faxineiras ativas na região
- [ ] Mínimo 100 pedidos/mês completados
- [ ] Taxa de disputa < 5%
- [ ] Rating médio ≥ 4.0 (cliente e faxineira)
- [ ] Zero falhas críticas de pagamento por 30 dias
- [ ] Faxineiras recebendo em D+15 sem atrasos

### Dependências Externas

- **Sandbox Asaas:** ✓ (confirmação de taxas reais: processamento + antecipação)
- **Advogado:** [ ] validar vínculo trabalhista, responsabilidade por danos/furtos, termos de uso, privacidade, contrato de adesão
- **Contador:** [ ] nota fiscal sobre comissão, regime tributário, tratamento de PF
- **CNPJ + conta Asaas produção:** [ ] necessário para ir ao ar (sandbox é suficiente para Fase 1)
- **Testes de ponta a ponta:** [ ] pedido → pré-auth → captura → split → saque

### Entregáveis

- App Expo (iOS/Android) funcional
- Painel admin web
- PRODUCT-SPEC.md finalizado
- PAYMENT-FLOW.md confirmado com dados reais
- BUSINESS-RULES.md consolidado
- USER-STORIES.md priorizado
- Documentação técnica (ARCHITECTURE.md, DATABASE.md)
- Termos de uso, política de privacidade, contrato de adesão (revisados por advogado)

---

## Fase 2: Expansão & Refinamento

**Timeline:** Semanas 21-36 (após 30 dias de operação em produção)

**Objetivo:** Expandir para 2-3 cidades, refinar preço com base em dados, melhorar experiência.

### Funcionalidades Novas

**Cliente:**
- PIX como opção de pagamento (além de cartão)
- Foto de antes/depois do serviço
- Filtro avançado de candidatas (avaliação mínima, raio, tempo de resposta)
- Agendamento de serviço recorrente (semanal, bi-semanal, mensal)
- Pacotes de desconto (5 serviços = 2% de desconto)

**Faxineira:**
- Limpeza pós-obra (com fluxo de orçamento)
- Definir disponibilidade por horário (futura automação)
- Consultar estatísticas (taxa de aceitação, tempo médio, ganho/mês)
- Chat com suporte (além de WhatsApp)

**Admin:**
- Sistema de sugestão automática de ajuste de preço (com aprovação manual)
- Relatórios de saúde por região (demanda, qualidade, churn)
- Ferramenta de filtro avançado (disputas, faxineiras de risco, clientes de risco)

### Novos KPIs

- Recall de faxineira (% que volta a fazer serviço)
- Churn de cliente (% que não volta)
- Lifetime value (LTV) de cliente e faxineira
- Custo de aquisição (CAC) por canal
- Retenção em D30 / D60 / D90

### Critério de Sucesso

- [ ] Expandir para 2-3 cidades sem perder qualidade
- [ ] 1.000+ pedidos/mês consolidados
- [ ] Rating médio mantido ≥ 4.0
- [ ] Sistema de preço automático sugerindo ajustes com 90%+ acurácia
- [ ] Churn de cliente < 20%/mês

### Dependências

- Feedback de usuários após 30 dias de operação
- Dados suficientes para sugerir preço (mínimo 300 pedidos/cidade)
- Aprovação legal para PIX (se diferente de cartão)

---

## Fase 3: Escalabilidade & Inteligência

**Timeline:** Semanas 37-52 (após estabilização em 3+ cidades)

**Objetivo:** Auto-ajuste de preço, algoritmo de matching inteligente, novos tipos de serviço.

### Funcionalidades Novas

**Cliente:**
- Matching inteligente (sugerir faxineiras baseado em histórico + preferências)
- Agendamento automático (cliente define critérios, app agenda com melhor faxineira disponível)
- Integração com gestão de imóveis (para clientes com múltiplas propriedades)
- Avaliação por categoria (limpeza, pontualidade, atenciosidade, etc.)

**Faxineira:**
- Dashboard completo de performance (com benchmarks de região)
- Badges (ex: "100% pontual", "5 stars consecutivas")
- Certificação (cursos de upsell para certos tipos de limpeza)
- Agendamento de blocos de tempo (disponibilidade automática)

**Admin:**
- Auto-ajuste de preço dentro de limites de segurança
- Algoritmo de detecção de fraude
- Previsão de demanda por região
- Dashboard de inteligência competitiva (benchmarks de preço vs concorrentes)

### Novos Serviços

- Limpeza de piscina
- Limpeza de vidros (comercial)
- Desinfecção specializada
- Serviços corporativos (escritórios, lojas)

### Critério de Sucesso

- [ ] Auto-ajuste de preço economizando 5%+ vs ajuste manual, com demanda estável
- [ ] Matching inteligente melhorando taxa de aceitação em 15%+
- [ ] Expansão para 10+ cidades
- [ ] 10.000+ pedidos/mês

### Dependências

- Dados históricos consolidados de 6+ meses
- ML/AI infrastructure (possivelmente terceirizado)
- Aprovação para novos tipos de serviço (legal + operacional)

---

## Timeline Resumido

| Marco | Fase | Semanas | Status |
|-------|------|---------|--------|
| MVP Pronto | 1 | 0-16 | Em desenvolvimento |
| Beta Fechado | 1 | 16-20 | *(TBD — depende de duração real do beta com faxineiras piloto)* |
| Lançamento Público | 1 | 20 | *(validar com cliente)* |
| Estabilização | 1 | 20-30 | *(TBD — bugs de produção, otimizações; duração depende de volume/problemas encontrados)* |
| Expansão (Fase 2) | 2 | 21-36 | *(planejado após validação)* |
| Escalabilidade (Fase 3) | 3 | 37-52 | *(planejado para Q3-Q4)* |

---

## Decisões de Priorização

**Fase 1 só inclui:** pagamento seguro, qualidade garantida (reputação + disputa), transparência (preço, score). Tudo mais é complexidade desnecessária.

**Fase 2 entra quando:** dados suficientes (300+ pedidos/cidade), modelo validado, zero fraudes.

**Fase 3 só com:** infraestrutura de dados consolidada, aprovação jurídica para automação, suporte operacional estável.

---

## Riscos & Mitigações

| Risco | Mitigação |
|-------|-----------|
| Pré-autorização falha no D-1 | Retry automático 2x, push para cliente trocar cartão, suporte acionado |
| Faxineira sem candidatas por 48h | Push sugerindo taxa de urgência ou revisar pedido |
| Disputa de dano/furto | Mediação bilateral, máximo ressarcimento = valor da faxina, resto entre as partes |
| Score de confiabilidade manipulado | Análise de pattern (múltiplas cancelações, avaliações inconsistentes), suspensão manual |
| Vínculo trabalhista questionado | Termos deixam claro autonomia, faxineira recusa pedidos, não há exclusividade |
| Roubo/exposição de dados | Tokenização de cartão (Asaas), dados documentos com acesso restrito, LGPD completo |

---

## Revisão de Roadmap

Este documento será revisado:
- A cada 30 dias (ajustes de timeline)
- Antes de cada fase (validação de sucesso anterior)
- Se surgir mudança de escopo aprovada pelo cliente
