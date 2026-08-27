# Moppy — Screen Map (MVP)

Árvore hierárquica de telas por role. Contador total, transições principais, componentes reutilizáveis.

---

## 1. Cliente — Árvore de Navegação

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (12 telas)                   │
└─────────────────────────────────────────────────────────┘

🔓 Onboarding (não-autenticado)
  ├─ Splash
  │
  ├─ Login / Cadastro
  │   ↓
  │   ├─ Escolha de Papel (Cliente)
  │   │   ↓
  │   ├─ Cadastro Endereço
  │   │   ↓
  │   ├─ Salvar Cartão
  │   │   ↓
  │   └─ Aceitar Termos LGPD
  │       ↓
  └─ ✓ HOME (logado)

🏠 Main Navigation (Tabs)
  │
  ├─ [TAB 1] Home — Próximos Serviços
  │   ├─ Card Pedido → Detalhe Pedido (ativo) → [Fluxo de Serviço]
  │   │   ├─ Chat
  │   │   ├─ Confirmação (Sim / Tive Problema)
  │   │   ├─ Disputa (se problema)
  │   │   └─ Avaliação
  │   │
  │   ├─ FAB "+" → Criar Pedido (Wizard 8 passos)
  │   │   ├─ Passo 1: Escolher Endereço
  │   │   ├─ Passo 2: Tipo de Limpeza
  │   │   ├─ Passo 3: Tamanho
  │   │   ├─ Passo 4: Adicionais
  │   │   ├─ Passo 5: Data/Hora
  │   │   ├─ Passo 6: Revisar Preço
  │   │   ├─ Passo 7: Taxa de Urgência
  │   │   └─ Passo 8: Checkout → Confirmação
  │   │
  │   └─ (Novo pedido) Lista de Candidatas
  │       └─ Candidata (detalhe expandido) → Escolher
  │           ├─ Chat
  │           ├─ Serviço em Andamento
  │           │   ├─ Gerar Código (cliente disponível)
  │           │   └─ (ou esperar GPS+foto se ausente)
  │           └─ Confirmação Conclusão
  │               ├─ "Sim" → Avaliação → Histórico
  │               └─ "Tive Problema" → Disputa → Resposta Faxineira → Decisão Admin
  │
  ├─ [TAB 2] Histórico
  │   └─ Card Pedido (passado) → Detalhe Pedido (readonly)
  │       └─ Timeline + Chat + Avaliações
  │
  ├─ [TAB 3] Cancelados
  │   └─ Card Pedido (cancelado) → Detalhe (readonly)
  │
  └─ [SETTINGS] Perfil & Configurações
      ├─ Aba "Dados"
      │   ├─ Nome (edit)
      │   ├─ Foto (upload)
      │   └─ Telefone (edit)
      ├─ Aba "Cartões"
      │   ├─ Card List (salvas)
      │   ├─ Adicionar Cartão
      │   └─ Deletar
      ├─ Aba "Endereços"
      │   ├─ Address List
      │   ├─ Editar
      │   ├─ Adicionar
      │   └─ Deletar (com validação)
      └─ Aba "Mais"
          ├─ Notificações (toggle)
          ├─ Termos de Uso (link)
          ├─ Política Privacidade (link)
          ├─ Deletar Conta
          └─ Sair
```

**Cliente Total:** 12 telas principais (onboarding) + 8 passos wizard + detalhe candidatas + chat + confirmação + disputa + avaliação = ~25 telas com modais/sheets.

---

## 2. Faxineira — Árvore de Navegação

```
┌─────────────────────────────────────────────────────────┐
│                   FAXINEIRA (16 telas)                  │
└─────────────────────────────────────────────────────────┘

🔓 Onboarding (não-autenticado)
  ├─ Splash
  │
  ├─ Login / Cadastro
  │   ↓
  │   ├─ Escolha de Papel (Faxineira)
  │   │   ↓
  │   ├─ Cadastro com Documentos
  │   │   ├─ RG (foto)
  │   │   ├─ CPF (foto)
  │   │   ├─ Selfie
  │   │   ├─ Comprovante Endereço
  │   │   └─ Chave PIX (texto)
  │   │       ↓
  │   │   └─ Aceitar Termos LGPD
  │   │       ↓
  │   ├─ Aguardando Aprovação (até 48h)
  │   │   ├─ Aprovado → Definir Raio de Atuação
  │   │   │   ↓
  │   │   └─ ✓ HOME (logado)
  │   │
  │   └─ Reprovado → (opção: Tentar Novamente 1x)
  │
  🏠 Main Navigation (Tab Bar)
  │
  ├─ [TAB 1] Buscar (Home padrão) — Feed de Pedidos
  │   ├─ Filtros (tipo, tamanho, data)
  │   ├─ Card Pedido → Detalhe Pedido (não-candidatado ainda)
  │   │   └─ Botão "Me Candidatar"
  │   │       └─ Validação (double-booking)
  │   │           ├─ OK → Candidatura registrada (status "Aguardando")
  │   │           └─ Bloqueado → Mensagem erro
  │   │
  │   └─ (Pedidos vê em "Aguardando" até cliente escolher)
  │
  ├─ [TAB 2] Agenda — Minha Agenda (Confirmados)
  │   ├─ Card Serviço (agendado) → Detalhe / Executar
  │   │   │
  │   │   └─ [DIA DO SERVIÇO] Botão "Cheguei"
  │   │       ├─ Opção 1: Cliente Disponível → Código 4 dígitos
  │   │       │   ├─ Cliente notificado
  │   │       │   ├─ Cliente gera código
  │   │       │   ├─ Faxineira digita
  │   │       │   └─ ✓ Chegada Confirmada → Cronômetro
  │   │       │
  │   │       └─ Opção 2: Cliente Ausente (10 min timeout)
  │   │           ├─ Faxineira tira foto
  │   │           ├─ GPS valida (50m raio)
  │   │           ├─ ✓ OK → Cronômetro
  │   │           └─ ✗ GPS Falha → Bloqueado + Suporte
  │   │
  │   └─ Serviço em Andamento
  │       ├─ Cronômetro rodando
  │       ├─ Chat (livre)
  │       └─ Botão "Concluído"
  │           ↓
  │           Aguardando Confirmação Cliente (24h)
  │           ├─ Cliente confirma "Sim" → Avaliação
  │           ├─ Cliente abre Disputa → [Responder Disputa]
  │           │   ├─ Texto + Fotos (até 3)
  │           │   └─ 24h para responder
  │           │       └─ Aguardando Decisão Admin (até 48h)
  │           │           └─ Notificação: Reembolso / Libera / Parcial
  │           │
  │           └─ 24h passado → Auto-confirmação → Avaliação
  │
  ├─ [TAB 3] Carteira
  │   ├─ Saldo Total
  │   ├─ Breakdown "A Liberar" (D-1 a D+14)
  │   ├─ Breakdown "Disponível" (D+15+)
  │   ├─ Extrato (tabela)
  │   └─ Botão "Solicitar Saque"
  │       ├─ Input: Valor (min R$20)
  │       ├─ Input: Chave PIX (pré-preenchida, editável)
  │       ├─ Confirmação
  │       └─ ✓ SMS Validação
  │           └─ Processado em 1-2 dias (via Asaas)
  │
  ├─ [TAB 4] Minhas Candidaturas (*)
  │   ├─ Aba "Aguardando" (cliente ainda escolhendo)
  │   ├─ Aba "Selecionadas" (passam para Agenda)
  │   └─ Aba "Não Selecionadas" (notificação discreta)
  │
  └─ [SETTINGS] Perfil & Configurações
      ├─ Aba "Dados"
      ├─ Aba "Documentos" (edit + upload)
      ├─ Aba "Raio de Atuação" (edit)
      └─ Aba "Mais" (notificações, deletar conta, sair)

(* Pode estar como aba ou dentro de Buscar, depende de design final)

Avaliação (após serviço)
  └─ Stars 1-5 + Comentário (opcional)
      └─ Oculta por 72h ou até ambos avaliarem
          └─ Histórico

**Faxineira Total:** 14 telas principais + documentos onboarding + chat + responder disputa + avaliação = ~20 telas.

---

## 3. Admin (Web) — Árvore de Navegação

```
┌─────────────────────────────────────────────────────────┐
│                     ADMIN WEB (7 telas)                 │
└─────────────────────────────────────────────────────────┘

🔓 Login
  ↓
📊 Dashboard (Menu Lateral)
  │
  ├─ [1] Aprovações Pendentes
  │   └─ Detalhe Faxineira
  │       ├─ RG, CPF, Selfie, Comprovante, PIX
  │       ├─ Checklist objetiva
  │       ├─ Botão "Aprovar"
  │       └─ Botão "Reprovar" → Modal Motivo
  │           └─ Notificação automática
  │
  ├─ [2] Pedidos
  │   ├─ Filtros (status, data, cidade, cliente, faxineira)
  │   ├─ Tabela (scroll)
  │   └─ Linha → Detalhe Pedido
  │       ├─ Card Info (cliente, faxineira, endereço, preço)
  │       ├─ Timeline (criação → pré-auth → candidatas → seleção → chegada → conclusão → confirmação → pagamento)
  │       ├─ Card Financeiro
  │       ├─ Avaliações (se disponível)
  │       └─ Chat (preview + "Ver Completo")
  │
  ├─ [3] Disputas
  │   ├─ Abas: "Abertas" / "Em Análise" / "Fechadas"
  │   ├─ Tabela
  │   └─ Linha → Detalhe Disputa
  │       ├─ Versão Cliente (texto + fotos)
  │       ├─ Versão Faxineira (texto + fotos, se respondeu)
  │       ├─ Timeline do Serviço
  │       ├─ Chat entre Partes
  │       ├─ RadioGroup Decisão
  │       │   ├─ Reembolso Total
  │       │   ├─ Reembolso Parcial (input %)
  │       │   └─ Libera Pagamento
  │       ├─ TextArea Justificativa (obrigatória)
  │       └─ Botão "Decidir"
  │           └─ Notificações automáticas + processamento valor
  │
  ├─ [4] Financeiro
  │   ├─ DateRange filter
  │   ├─ KPI Cards (pedidos, comissão, urgência, taxa, estornos, saques)
  │   ├─ Tabela Breakdown por Cidade
  │   └─ Botão "Exportar" (CSV/PDF)
  │
  ├─ [5] Preços por Cidade
  │   ├─ CardList de Cidades (status Ativa / Inativa)
  │   ├─ Botão "Adicionar Cidade"
  │   └─ Card → Detalhe Tabela
  │       ├─ Inputs: Studio / 1Q / 2Q / 3Q / 4+Q (para 3 tipos: padrão, pesada, roupa)
  │       ├─ Inputs: Adicionais (banheiros, área, produtos)
  │       ├─ Histórico mudanças (read-only)
  │       ├─ Métricas (pedidos, urgência, cancelamentos)
  │       └─ Botão "Salvar" + "Ativar" / "Desativar"
  │
  └─ [6] Score de Confiabilidade (*(P1)*) — Não incluído em MVP básico
      ├─ Aba "Faxineiras" (score, nota média, nº serviços, histórico)
      ├─ Aba "Clientes" (similar)
      ├─ Filtros: score < 40 (risco) / 40-65 (atenção) / >65 (OK)
      └─ Opções: "Suspender" / "Avisar"

**Admin Total:** 7 telas principais (sem P1).

---

## 4. Contagem Total de Telas (MVP)

| Role | Telas Principais | Modais/Sheets | Total |
|------|-----------------|----------------|-------|
| Cliente | 12 | ~13 (wizard 8 passos + 5 operações) | ~25 |
| Faxineira | 14 | ~6 (cadastro docs + chat + disputa) | ~20 |
| Admin (Web) | 6 | ~3 (detalhe modals) | ~9 |
| **TOTAL MVP** | **32** | **~22** | **~54** |

*(Modais e sheets são computados como telas de fluxo, não como telas separadas no design)*

Telas sem contar duplicação (Chat, Avaliação, etc):
- **Cliente:** 12 telas
- **Faxineira:** 14 telas  
- **Admin:** 6 telas
- **Total:** 32 telas core (sem contar modais)

---

## 5. Transições Principais

### Cliente
```
Splash → Login/Cadastro → Papel → Onboarding (Endereço, Cartão, Termos)
  ↓
Home (Próximos/Histórico/Cancelados) ← → Criar Pedido (Wizard)
  ↓
Pedido Aberto → Lista Candidatas → Seleção
  ↓
Detalhe Pedido (Ativo) → Chat
  ↓
Serviço em Andamento → Confirmação (Sim/Problema)
  ↓
Avaliação → Histórico
```

### Faxineira
```
Splash → Login/Cadastro → Papel → Documentos → Aprovação (até 48h)
  ↓
Raio de Atuação → Home
  ↓
Buscar (Feed) → Detalhe Pedido → Candidatura
  ↓
Aguardando Escolha → Seleção (Notificação)
  ↓
Agenda → Dia do Serviço → Confirmação Chegada (Código/GPS)
  ↓
Cronômetro → Concluído → Aguardando Confirmação Cliente (24h)
  ↓
Avaliação → Histórico / Carteira
```

### Admin
```
Login → Dashboard
  ├─ Aprovações → Detalhe Faxineira → Decidir (Aprovar/Reprovar)
  ├─ Pedidos → Detalhe Pedido → Timeline
  ├─ Disputas → Detalhe Disputa → Decidir
  ├─ Financeiro → Relatório / Exportar
  └─ Preços → Detalhe Tabela → Editar / Salvar
```

---

## 6. Componentes Reutilizáveis

| Componente | Cliente | Faxineira | Admin | Descrição |
|-----------|---------|-----------|-------|-----------|
| **Card (Pedido/Serviço)** | ✓ | ✓ | ✓ | Data, tipo, valor, status, clique → detalhe |
| **Stars (Rating 1-5)** | ✓ | ✓ | ✓ | Avaliação interativa (cliente/faxineira avaliam, admin vê) |
| **ChatBubble** | ✓ | ✓ | (preview) | Mensagens texto (cliente ↔ faxineira), com aviso de pagamento fora do app |
| **Button Primary** | ✓ | ✓ | ✓ | "Confirmar", "Enviar", "Próximo" (roxo #A78BFA) |
| **Button Secondary** | ✓ | ✓ | ✓ | "Cancelar", "Voltar", "Pular" (cinza) |
| **Button Danger** | ✓ | ✓ | ✓ | "Tive Problema", "Deletar", "Reprovar" (vermelho) |
| **TextInput** | ✓ | ✓ | ✓ | Campos de texto genéricos |
| **NumberInput** | ✓ | ✓ | ✓ | Valores monetários, quantidade |
| **Checkbox** | ✓ | ✓ | ✓ | Múltipla seleção (termos, adicionais, checklist) |
| **RadioGroup** | ✓ | ✓ | ✓ | Seleção exclusiva (papel, tipo, tamanho, decisão) |
| **DatePicker** | ✓ | ✗ | ✓ | Escolha data pedido / filtro admin |
| **TimePicker** | ✓ | ✗ | ✗ | Escolha horário pedido |
| **ImageUpload** | ✓ | ✓ | ✗ | Foto (cartão não aparece, mas upload de docs) |
| **Timeline** | ✓ | ✓ | ✓ | Histórico de eventos (pedido → pagamento) |
| **Badge** | ✓ | ✓ | ✓ | Status (Aberto, Confirmado, Em Andamento, etc) |
| **Modal/Sheet** | ✓ | ✓ | ✓ | Confirmações, filtros, detalhe expandido |
| **Table** | ✗ | ✗ | ✓ | Admin (Pedidos, Disputas, Financeiro) |
| **KPI Card** | ✗ | ✗ | ✓ | Métricas grandes (Dashboard, Financeiro) |
| **Spinner/Loader** | ✓ | ✓ | ✓ | Estados de carregamento |
| **Cronômetro** | ✗ | ✓ | ✗ | Tempo de serviço em andamento |
| **Progress Bar** | ✓ | ✗ | ✗ | Passos do wizard (criar pedido) |
| **Divider** | ✓ | ✓ | ✓ | Separação de seções |
| **Aviso/Info Banner** | ✓ | ✓ | ✓ | "Sem conexão", "Pagamento fora do app não garantido" |

---

## 7. Navegação Estrutural

### Cliente (Bottom Tab Bar)
```
┌─────────────────────────────────────────┐
│  Home | Histórico | Cancelados | Perfil │
└─────────────────────────────────────────┘
```

### Faxineira (Bottom Tab Bar)
```
┌────────────────────────────────────────────────┐
│  Buscar | Agenda | Carteira | Candidaturas(*) | Perfil
└────────────────────────────────────────────────┘
```

### Admin (Web — Sidebar Left + Top Bar)
```
┌─────────────────────────────────────────────────────────┐
│                Dashboard                                │
├─────────────────────────────────────────────────────────┤
│ Aprovações Pendentes                                    │
│ Pedidos                                                 │
│ Disputas                                                │
│ Financeiro                                              │
│ Preços por Cidade                                       │
│ Score de Confiabilidade (P1)                            │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Casos de Uso Críticos por Tela

### Cliente — "Criar Pedido"
- 8 passos (wizard com progresso visual)
- Validações: cidade com cobertura, cartão válido (D-1)
- Descarte seguro: salvar rascunho ou descartar

### Faxineira — "Confirmar Chegada"
- 2 caminhos (Código / GPS+Foto)
- Bloqueio se falha: "Fale com suporte"
- Timeout 10 min: cliente não responde → GPS+foto

### Admin — "Resolver Disputa"
- Ver ambos os lados (bilateral)
- Decisão com justificativa obrigatória
- Automação: notificações + processamento de valor

