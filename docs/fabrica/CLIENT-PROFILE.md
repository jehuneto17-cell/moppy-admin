# Moppy — Perfil do Cliente

## Sobre a Moppy

**Moppy** é um marketplace de faxina que conecta clientes que precisam de limpeza com faxineiras profissionais. O app é um **intermediador puro** — não é empregador, não oferece seguro, não se responsabiliza pela execução do serviço.

---

## Negócio Atual

- **Modelo:** marketplace de duas pontas (cliente + faxineira)
- **Receita:** comissão de 15% sobre o valor base de cada serviço
- **Status:** pré-lançamento (MVP em desenvolvimento)
- **Cidades-alvo para lançamento:** Itaú de Minas e cidades vizinhas

---

## Problema que Quer Resolver

**Cliente (quem precisa de faxina):**
- Dificuldade de encontrar faxineira confiável
- Processo de contratação lento e desorganizado
- Segurança: não sabe quem entra em casa
- Pagamento não protegido (se pagar direto, sem garantia)

**Faxineira (prestadora):**
- Precisa de forma segura e padronizada de receber por serviço
- Quer autonomia para recusar trabalho
- Precisa de buffer de tempo antes de receber (D+15 é aceitável)
- Quer saber exatamente quanto ganha (transparência)

**Moppy (dono do app):**
- Monetizar conectando os dois lados
- Reduzir atrito: pagamento automático, comissão 15%, sem exigir MEI/CNPJ da faxineira
- Crescer organicamente (começar pequeno, uma cidade)

---

## Público-Alvo

### Clientes
- **Faixa etária:** 25-60 anos (classe média)
- **Localização:** cidade e arredores de Itaú de Minas (expandir depois)
- **Comportamento:** usa smartphone, prefere solução pronta, quer confiabilidade
- **Frequência:** serviço ocasional (1-2x/mês) a eventual (1-2x/semana)
- **Tipos de serviço:** limpeza regular da casa (manutenção), limpeza pesada (sujeira acumulada), passar roupa

### Faxineiras
- **Faixa etária:** 20-65 anos (maioria 30-50)
- **Situação:** pessoa física (sem MEI/CNPJ), trabalha por conta própria
- **Smartphone:** tem e sabe usar
- **Raio de atuação:** define próprio raio (5-20 km a partir de casa)
- **Autonomia:** escolhe quais pedidos aceitar
- **Documentação:** documentos já cuidados (RG, CPF, comprovante de endereço)

### Admin
- **Quem:** dono/gestor da Moppy
- **Tarefas:** aprovar cadastro de faxineiras, mediar disputas, acompanhar financeiro, ajustar preços por cidade

---

## Restrições e Constraints

### Jurídicas
- Faxineira é **pessoa física autônoma**, não empregada
- **Sem seguro** para danos ou furtos (app é mediador, não responsável)
- Termos de uso precisam deixar claro que app apenas conecta as partes
- Máximo ressarcimento via app = valor da faxina (qualquer coisa acima disso é entre as partes)
- *(confirmar com advogado)* vínculo trabalhista, termos de uso, política de privacidade, contrato de adesão

### Financeiras
- **Asaas:** gateway escolhido (cria subcontas para faxineiras, faz split automático)
- **Pagamento:** cartão de crédito (MVP), PIX apenas para saque da faxineira
- **Pré-autorização:** sem cobrança no D-1, captura só após confirmação do cliente
- Custo de antecipação D+15 absorvido pelo app (reduz comissão)

### Operacionais
- **Lançamento:** cidade única (Itaú de Minas) antes de escalar
- **Preço:** definido pelo app (tabela fixa por cidade), não pela faxineira
- **Tabelas de preço:** cadastradas manualmente, revisadas antes de ativar cada cidade
- **Funcionamento:** 100% sem push (feed de pedidos funciona mesmo sem notificações)

### Tecnológicas
- **Stack:** Expo/React Native (app), Firebase (BD + login), Vercel (backend + cron), Asaas (pagamento)
- **Dados:** coletar eventos desde dia 1 (não dá para retroativamente)
- **Sandbox do Asaas:** *(confirmar)* taxas reais de processamento (cartão à vista) e custo real de antecipação D+15

---

## Decisões Já Tomadas

| Aspecto | Decisão |
|---------|---------|
| **Comissão** | 15% sobre valor base do serviço |
| **Taxa de processamento** | 50/50 entre cliente e faxineira |
| **Antecipação D+15** | Absorvida pelo app (~0,65% do serviço) |
| **Tipo de contratação** | Faxineira pessoa física, sem MEI |
| **Gateway** | Asaas (com subcontas e split automático) |
| **Pagamento MVP** | Cartão de crédito (PIX para saque, não para pagamento) |
| **Pré-autorização** | Automática no D-1 via Vercel Cron |
| **Confirmação** | Bilateral com chat, webhook de idempotência |
| **Score de confiabilidade** | Começa em 65 para todos |
| **Seleção de faxineira** | Escolha do cliente (não é algoritmo como Uber) |
| **Tipos de limpeza MVP** | Padrão, pesada, passar roupa (pós-obra é fase 2) |
| **Rating** | 1-5 stars (separado do score automático) |

---

## O Que Ainda Precisa de Terceiros

- **Advogado:** vínculo trabalhista, danos/furtos, termos de uso, privacidade, contrato de adesão da prestadora
- **Contador:** nota fiscal sobre comissão, regime tributário, tratamento de prestadora pessoa física
- **CNPJ e conta Asaas produção:** para ir ao ar (sandbox já testa tudo)
- **Cidades:** validação de tabela de preço antes de cada cidade ativar
