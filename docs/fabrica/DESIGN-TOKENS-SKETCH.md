# Moppy — Design Tokens & Component Spec (MVP)

Paleta, tipografia, espaçamento, componentes, estados. Guia visual para Figma.

---

## 1. Paleta de Cores

### Primária
- **Roxo Primário (Accent):** `#A78BFA` — Botões, headers, destaques principais
- **Roxo Escuro (Hover/Active):** `#9368F7` — Estados hover e active dos componentes roxos
- **Roxo Claro (Tint):** `#E9D5FF` — Backgrounds suaves, badges de destaque

### Neutrals (Grayscale)
- **Branco (Background Principal):** `#FFFFFF` — Fundo geral da app
- **Cinza Muito Claro (Superfície):** `#F9FAFB` — Cards, inputs, superfícies levemente elevadas
- **Cinza Claro (Borda):** `#E5E7EB` — Bordas de inputs, dividers
- **Cinza Médio (Texto Secundário):** `#9CA3AF` — Descrições, placeholders, subtextos
- **Cinza Escuro (Texto Principal):** `#374151` — Texto padrão de corpo, legibilidade alta
- **Preto (Texto Máximo Contraste):** `#1F2937` — Headers, título destaque

### Semânticas
- **Verde (Sucesso):** `#10B981` — Confirmação, check, status "OK"
- **Verde Claro (Tint):** `#DBEAFE` — Background success, badges
- **Vermelho (Erro/Danger):** `#EF4444` — Botões "Tive Problema", "Deletar", alertas
- **Vermelho Claro (Tint):** `#FEE2E2` — Background de erro, alerts
- **Laranja (Warning):** `#F59E0B` — Status "Aguardando", "Processando"
- **Laranja Claro (Tint):** `#FEF3C7` — Background warning
- **Azul (Info):** `#3B82F6` — Informações, notificações
- **Azul Claro (Tint):** `#DBEAFE` — Background info

### Dark Mode (Futuro, MVP pode não incluir)
```
Se implementar dark mode:
- Fundo: #1F2937 (cinza muito escuro)
- Superfícies: #111827 (preto bem escuro)
- Texto primário: #F3F4F6 (cinza muito claro)
- Texto secundário: #9CA3AF (cinza médio)
- Roxo primário: #A78BFA (mantém, funciona em dark)
- Bordas: #374151 (cinza escuro)
```

---

## 2. Tipografia

### Font Family
- **Primária:** Inter (Google Fonts)
  - Pesos: Regular (400), Medium (500), Bold (700)
  - Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### Escala Tipográfica

| Usar Para | Tamanho | Peso | Line Height | Letter Spacing |
|-----------|---------|------|-------------|----------------|
| Display (título hero) | 32px | Bold (700) | 1.2 (38px) | -0.5px |
| Heading 1 (página) | 28px | Bold (700) | 1.3 (36px) | -0.25px |
| Heading 2 (seção) | 24px | Bold (700) | 1.3 (31px) | 0 |
| Heading 3 (card title) | 20px | Bold (700) | 1.4 (28px) | 0 |
| Body Large (conteúdo principal) | 16px | Regular (400) | 1.5 (24px) | 0 |
| Body (padrão) | 14px | Regular (400) | 1.5 (21px) | 0 |
| Body Small (secundário) | 12px | Regular (400) | 1.4 (17px) | 0 |
| Label (botões, badges) | 14px | Medium (500) | 1.4 (20px) | 0 |
| Label Small (hint, placeholder) | 12px | Regular (400) | 1.3 (16px) | 0 |
| Caption (timestamp, meta) | 11px | Regular (400) | 1.4 (15px) | 0 |

### Usos Específicos
- **Títulos de página:** Display ou Heading 1
- **Nomes em cards:** Heading 3
- **Descrição de cards:** Body Small
- **Texto de input:** Body
- **Placeholder em input:** Label Small
- **Botões:** Label (Medium 500, 14px)
- **Badges/Pills:** Label Small
- **Timestamp chat:** Caption

---

## 3. Espaçamento (8px Unit System)

Todos os espaçamentos são múltiplos de 4px (e preferencialmente 8px para clareza visual):

| Token | Valor | Usos |
|-------|-------|------|
| `space-2` | 2px | Muito pequeno (raro) |
| `space-4` | 4px | Gaps entre elementos muito próximos |
| `space-8` | 8px | Gap padrão entre elementos (inline, entre seções mínimas) |
| `space-12` | 12px | Gap médio entre grupos |
| `space-16` | 16px | Padding padrão interno de cards, containers |
| `space-20` | 20px | Espaço maior entre seções |
| `space-24` | 24px | Padding de página, espaço substancial |
| `space-32` | 32px | Espaço grande entre seções principais |
| `space-48` | 48px | Espaço muito grande (entre blocos separados) |

### Aplicação
- **Padding de Button:** `space-16` (horizontal) × `space-12` (vertical)
- **Padding de Card:** `space-16`
- **Padding de Input:** `space-12`
- **Gap entre Cards (list):** `space-12`
- **Margem de página (topo/rodapé):** `space-24`
- **Margem de seção:** `space-20`

---

## 4. Componentes Core

### 4.1 Button

#### Button Primary (Roxo)
```
Appearance:
  - Background: #A78BFA (roxo primário)
  - Text: #FFFFFF (branco)
  - Padding: 16px (H) × 12px (V)
  - Border Radius: 8px
  - Font: Label (14px, Medium 500)
  - Shadow: Nenhuma (ou subtle em dark mode)

States:
  - Normal: Background #A78BFA
  - Hover: Background #9368F7 (roxo escuro)
  - Active/Pressed: Background #7C3AED (roxo ainda mais escuro)
  - Disabled: Background #D1D5DB (cinza claro), Text #9CA3AF (cinza médio), opacity 50%
  - Loading: Spinner branco inside, text desaparece

Sizes (variação de tamanho, mantém proporção):
  - Small (compact): 12px (V) × 14px (H)
  - Medium (default): 12px (V) × 16px (H)
  - Large (CTA): 14px (V) × 20px (H)
```

#### Button Secondary (Cinza)
```
Appearance:
  - Background: #F3F4F6 (cinza muito claro)
  - Text: #1F2937 (preto/cinza escuro)
  - Border: 1px solid #D1D5DB (cinza claro)
  - Padding: 16px (H) × 12px (V)
  - Border Radius: 8px

States:
  - Normal: Background #F3F4F6, Border #D1D5DB
  - Hover: Background #E5E7EB
  - Disabled: Background #F9FAFB, Text #D1D5DB
```

#### Button Danger (Vermelho)
```
Appearance:
  - Background: #EF4444 (vermelho)
  - Text: #FFFFFF (branco)
  - Padding: 16px (H) × 12px (V)
  - Border Radius: 8px

States:
  - Normal: Background #EF4444
  - Hover: Background #DC2626 (vermelho mais escuro)
  - Disabled: Background #FECACA (vermelho claro)
```

#### Button Ghost (Sem background)
```
Appearance:
  - Background: transparent
  - Text: #A78BFA (roxo)
  - Padding: 8px (H) × 4px (V)
  - No border

States:
  - Hover: Background #E9D5FF (roxo claro tint)
  - Active: Text #9368F7 (roxo escuro)
```

---

### 4.2 Input Text / TextArea

```
Appearance:
  - Background: #FFFFFF (branco) ou #F9FAFB (cinza muito claro)
  - Border: 1px solid #E5E7EB (cinza claro)
  - Border Radius: 6px
  - Padding: 12px (H) × 8px (V)
  - Font: Body (14px, Regular 400)
  - Placeholder: #9CA3AF (cinza médio)
  - Text: #1F2937 (preto/cinza escuro)

States:
  - Normal: Border #E5E7EB
  - Focus: Border #A78BFA (roxo), Shadow subtle (0 0 0 3px rgba(167,139,250,0.1))
  - Disabled: Background #F3F4F6, Text #D1D5DB, Border #E5E7EB
  - Error: Border #EF4444 (vermelho), Shadow 0 0 0 3px rgba(239,68,68,0.1)
  - Success: Border #10B981 (verde)

TextArea específico:
  - Min Height: 80px (para múltiplas linhas)
  - Resize: vertical apenas
```

---

### 4.3 Card

```
Appearance:
  - Background: #FFFFFF (branco)
  - Border: 1px solid #E5E7EB (cinza claro)
  - Border Radius: 8px
  - Padding: 16px
  - Shadow: 0 1px 3px rgba(0, 0, 0, 0.1) (subtle)

States:
  - Normal: Border #E5E7EB, Shadow subtle
  - Hover: Border #A78BFA (roxo claro), Shadow mais pronunciada (0 4px 6px rgba(0,0,0,0.1))
  - Selected/Active: Border #A78BFA (roxo primário), Background #E9D5FF (roxo tint)
  - Disabled: Background #F9FAFB, Border #D1D5DB, opacity 50%

Variações:
  - Card Pedido/Serviço: H auto, tipicamente 100px+ height, imagem/avatar topo-esq
  - Card Info (inline): Pode ser compacto, sem imagem
  - Card Expandível: Pode mostrar mais ao clicar
```

---

### 4.4 Badge / Pill

```
Appearance:
  - Background: #E9D5FF (roxo tint) — padrão
  - Text: #6B21A8 (roxo muito escuro)
  - Padding: 6px (H) × 4px (V)
  - Border Radius: 12px (arredondado)
  - Font: Label Small (12px, Medium 500)

Variações por Status:
  - "Aberto" (azul): Background #DBEAFE, Text #1E40AF
  - "Confirmado" (laranja): Background #FEF3C7, Text #92400E
  - "Em Andamento" (verde): Background #D1FAE5, Text #065F46
  - "Concluído" (cinza): Background #E5E7EB, Text #374151
  - "Cancelado" (vermelho): Background #FEE2E2, Text #7F1D1D
  - "Disputa" (vermelho escuro): Background #FEE2E2, Text #7F1D1D
```

---

### 4.5 Checkbox & Radio

```
Checkbox:
  - Size: 20px × 20px
  - Border: 2px solid #D1D5DB (cinza claro)
  - Border Radius: 4px
  - Checked: Background #A78BFA (roxo), ícone check branco (#FFFFFF)
  - Checked Hover: Background #9368F7
  - Unchecked Hover: Border #A78BFA (roxo)
  - Label: Body (14px), à direita, gap 8px

Radio:
  - Size: 20px × 20px
  - Border: 2px solid #D1D5DB (cinza claro)
  - Border Radius: 50%
  - Checked: Border #A78BFA, círculo interior #A78BFA, tamanho 8px
  - Label: Body (14px), à direita, gap 8px
```

---

### 4.6 Modal / Sheet

```
Appearance (Modal):
  - Overlay: rgba(0, 0, 0, 0.5) (semi-transparent)
  - Container Background: #FFFFFF (branco)
  - Border Radius: 12px (topo) ou 8px (geral)
  - Box Shadow: 0 20px 25px rgba(0, 0, 0, 0.15)
  - Width: 90% (mobile), 500px (desktop, max)
  - Animation: Fade in + scale (100ms)

Appearance (BottomSheet — mobile):
  - Overlay: rgba(0, 0, 0, 0.4)
  - Container: Fundo #FFFFFF
  - Border Radius: 12px (top only)
  - Height: 50-90vh (conforme conteúdo)
  - Animation: Slide up (150ms)

Header:
  - Background: #F9FAFB (cinza muito claro)
  - Padding: 16px
  - Border Bottom: 1px solid #E5E7EB
  - Título: Heading 3 (20px, Bold)
  - Ícone fechar (X): Topo-direito, cursor pointer, hover #A78BFA

Body:
  - Padding: 16px
  - Overflow-y: auto se necessário

Footer (se ação obrigatória):
  - Border Top: 1px solid #E5E7EB
  - Padding: 16px
  - Botões (Confirmar, Cancelar)
```

---

### 4.7 Dropdown / Select

```
Appearance:
  - Background: #FFFFFF (branco)
  - Border: 1px solid #E5E7EB (cinza claro)
  - Border Radius: 6px
  - Padding: 10px (H) × 8px (V)
  - Font: Body (14px)
  - Ícone chevron (topo-direito, #9CA3AF)

States:
  - Normal: Border #E5E7EB
  - Focus: Border #A78BFA, Shadow 0 0 0 3px rgba(167,139,250,0.1)
  - Disabled: Background #F3F4F6, Border #D1D5DB

Expanded (Menu):
  - Background: #FFFFFF
  - Border: 1px solid #D1D5DB
  - Box Shadow: 0 10px 15px rgba(0, 0, 0, 0.1)
  - Items: Body (14px), Padding 10px (H) × 8px (V)
  - Item Hover: Background #E9D5FF (roxo tint)
  - Item Selected: Background #E9D5FF, Text #6B21A8 (roxo escuro)
```

---

### 4.8 Avatar

```
Appearance:
  - Shape: Circle (border-radius 50%)
  - Size variações:
    - Small: 32px × 32px
    - Medium: 48px × 48px
    - Large: 64px × 64px
  - Border: 1px solid #E5E7EB (cinza claro)
  - Background: #E9D5FF (roxo tint) se sem imagem
  - Text (iniciais): Label (Medium 500), cor #6B21A8 (roxo escuro)

Com imagem:
  - Imagem cover (object-fit: cover)
  - Object-position: center
```

---

### 4.9 Stars Rating (1-5)

```
Appearance:
  - Size: 24px × 24px (padrão), 16px (small), 32px (large)
  - Color (filled): #F59E0B (amarelo/laranja)
  - Color (empty): #D1D5DB (cinza claro)
  - Gap: 4px entre stars
  - Interativo: Hover → preenchimento até a posição, cursor pointer
  - Click → confirma seleção (cor mais vibrante #FBBF24)

Estados:
  - Unselected: Stars vazias (outline)
  - Hover: Stars até posição preenchidas (muted)
  - Selected: Stars preenchidas (vibrante)
  - Readonly: Stars sem interação
```

---

### 4.10 Chat Bubble

```
Appearance (Message próprio — cliente/faxineira falando):
  - Background: #A78BFA (roxo primário)
  - Text: #FFFFFF (branco)
  - Border Radius: 16px (top) × 4px (bottom-right)
  - Padding: 12px (H) × 8px (V)
  - Align: Direita (right-aligned)
  - Font: Body (14px)
  - Max-width: 85% da tela

Appearance (Message outro — resposta):
  - Background: #E5E7EB (cinza claro)
  - Text: #1F2937 (preto/cinza escuro)
  - Border Radius: 4px (bottom-left) × 16px (top)
  - Padding: 12px (H) × 8px (V)
  - Align: Esquerda (left-aligned)
  - Font: Body (14px)
  - Max-width: 85% da tela

Timestamp:
  - Font: Caption (11px, Regular)
  - Color: #9CA3AF (cinza médio)
  - Position: Abaixo da bubble, pequeno

Indicador leitura (future):
  - Ícone checkmark duplo (opcional)
  - Position: Canto direito inferior da bubble própria
  - Color: #FFFFFF ou #A78BFA
```

---

### 4.11 Cronômetro / Timer

```
Appearance:
  - Display: XX:XX:XX (HH:MM:SS)
  - Font: 48px (muito grande), Mono ou Display Bold
  - Color: #1F2937 (preto/cinza escuro)
  - Background: #F9FAFB (cinza muito claro)
  - Padding: 20px
  - Border Radius: 12px
  - Texto abaixo: "Duração do serviço" (Body Small, secundário)

Variação (Regressivo — 24h para confirmação):
  - Font: 24px (médio)
  - Color: Se <4h, #EF4444 (vermelho) para alertar
  - Display: "24h 45m" ou "XXh XXm" formato
```

---

### 4.12 Spinner / Loader

```
Appearance:
  - Style: Anel giratório (circular progress)
  - Size: 32px × 32px (padrão), 24px (small), 48px (large)
  - Color: #A78BFA (roxo primário)
  - Stroke: 2px
  - Background ring: #E9D5FF (roxo tint)
  - Animation: Rotação contínua (1s por volta)

Variação (Linear):
  - Altura: 4px
  - Background: #E5E7EB (cinza claro)
  - Foreground: #A78BFA (roxo)
  - Border Radius: 2px
  - Width: 100% (container)

Com texto:
  - "Aguarde..." ou "Carregando..." (Body Small, embaixo)
  - Color: #9CA3AF (cinza médio)
```

---

### 4.13 Alert / Banner

```
Appearance (Info):
  - Background: #DBEAFE (azul tint)
  - Border Left: 3px solid #3B82F6 (azul)
  - Text: #1E40AF (azul escuro)
  - Padding: 12px (V) × 16px (H)
  - Border Radius: 4px
  - Font: Body Small (12px)
  - Ícone (i): #3B82F6 (azul)

Appearance (Error):
  - Background: #FEE2E2 (vermelho tint)
  - Border Left: 3px solid #EF4444 (vermelho)
  - Text: #7F1D1D (vermelho muito escuro)
  - Ícone (!): #EF4444 (vermelho)

Appearance (Success):
  - Background: #D1FAE5 (verde tint)
  - Border Left: 3px solid #10B981 (verde)
  - Text: #065F46 (verde escuro)
  - Ícone (✓): #10B981 (verde)

Appearance (Warning):
  - Background: #FEF3C7 (laranja tint)
  - Border Left: 3px solid #F59E0B (laranja)
  - Text: #92400E (laranja escuro)
  - Ícone (!): #F59E0B (laranja)

Fechar (X):
  - Position: Topo-direito
  - Color: Herdada (azul, vermelho, etc)
  - Hover: Opacity 70%
```

---

## 5. Componentes Compostos

### 5.1 Card Pedido/Serviço (Cliente e Faxineira)

```
Layout:
  ┌────────────────────────────┐
  │ [Avatar] Nome      | Status│
  │ Tipo + Tamanho             │
  │ Data/Hora | Valor          │
  │ ★★★★★ (rating opcional)   │
  └────────────────────────────┘

Componentes interiores:
  - Avatar: 40px (pequeno)
  - Status: Badge
  - Nome: Heading 3
  - Tipo/Tamanho: Body Small (cinza médio)
  - Data/Hora: Body Small (cinza médio)
  - Valor: Body (bold, preto)
  - Rating: Stars (16px, optional)

Padding: 16px (card)
Gap entre linhas: 8px
```

---

### 5.2 Timeline

```
Layout (vertical):
  ◯—— Pedido criado (data)
  ◯—— Pré-autorização (status)
  ◯—— Candidaturas (nomes)
  ◯—— Seleção (data)
  ◯—— Chegada confirmada (método)
  ◯—— Conclusão (hora)
  ◉—— Confirmação (automática)

Componentes:
  - Circle (◯ ou ◉): 16px × 16px
  - Normal: Background #E9D5FF, Border #A78BFA (roxo)
  - Completo (◉): Background #10B981 (verde), ícone check branco
  - Ativo: Background #A78BFA, Border 2px roxo escuro

  - Linha vertical: 2px solid #E5E7EB (cinza claro)
  - Texto ao lado: Body (14px), titulo + descrição
  - Font descrição: Body Small (12px, cinza médio)
```

---

### 5.3 Input + Label

```
Layout:
  ┌─────────────────────────┐
  │ Label (required *)      │
  │ ┌───────────────────────┐│
  │ │ Placeholder/Value     ││
  │ └───────────────────────┘│
  │ Helper text ou error     │
  └─────────────────────────┘

Componentes:
  - Label: Body Small (12px, Medium 500), color #1F2937
  - Required marker (*): Color #EF4444 (vermelho)
  - Input: Padrão (vide seção 4.2)
  - Helper text: Caption (11px, cinza médio), embaixo
  - Error text: Caption (11px, vermelho), embaixo se inválido
  - Gap Label-Input: 4px
```

---

## 6. Dark Mode (Futuro)

Se implementar (Fase 2+), manter consistência:
- Roxo primário mantém #A78BFA (ajustar apenas se necessário para contraste)
- Inverter grayscale (branco → preto)
- Manter semânticas (verde sucesso, vermelho erro)
- Media query: `@media (prefers-color-scheme: dark)` ou toggle manual

---

## 7. Sizing & Breakpoints

### Mobile (Expo — React Native)
- Não há breakpoints tradicionais (app mobile)
- Usar dimensões relativas (Dimensions.get('window'))
- Safe area insets (notch)

### Web Admin (Next.js)
```css
/* Breakpoints */
mobile: 320px — 640px
tablet: 641px — 1024px
desktop: 1025px+

/* Layout */
Mobile: Full width, single column
Tablet: 2 columns ou sidebar colapsável
Desktop: Sidebar + content (3 cols layout possível)
```

---

## 8. Shadows

```
Subtle (cards padrão):
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

Medium (cards hover, modais):
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)

Large (modais elevated):
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15)

XL (dropdowns, menus):
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)
```

---

## 9. Transições & Animações

```
Padrão (fade + scale):
  duration: 150ms
  easing: cubic-bezier(0.4, 0, 0.2, 1)

Entrada de modal:
  - Fade overlay: 0s → 1s (opacity 0 → 0.5)
  - Scale content: 100px → 100% (scale 0.95 → 1)
  Duration: 150ms

Hover de button:
  - Color transition: 50ms
  - Easing: ease-in-out

Spinner:
  - Rotação: 360° infinita
  - Duration: 1s
  - Linear (não ease)
```

---

## 10. Densidades de Layout

### Compact (mobile/default)
- Padding: 16px
- Gap Cards: 12px
- Height de button: 44px (thumb-friendly, min iOS)
- Height de input: 40px

### Regular (tablet/desktop)
- Padding: 20-24px
- Gap Cards: 16px
- Height de button: 40px
- Height de input: 36px

### Dense (admin web, tabelas)
- Padding: 12px
- Gap Cards: 8px
- Height row: 32px
- Font: 12px (body small)

---

## 11. Ícones

Usar set padronizado:
- **Feather Icons** (recomendado, minimal, 24px base)
- Ou **Heroicons** (similar)
- Cores: Herdadas do texto (primária, secundária, etc)
- Tamanho padrão: 20-24px
- Align: Vertical center com texto

Exemplos críticos:
- Checkmark: ✓ (sucesso)
- X: Close/Fechar
- Chevron: Expand/collapse
- Ícone "choquei": 👋 ou ícone localização
- Ícone "concluído": ✓✓ (duplo)
- Ícone "erro": ⚠️ ou exclamação

---

## 12. Acessibilidade

- **Contraste:** WCAG AA mínimo (4.5:1 para texto)
  - Roxo #A78BFA on white: ~3.8:1 (ligeiramente abaixo, usar para non-critical text)
  - Roxo #A78BFA on roxo tint: ~2:1 (OK para background accent)
  - Usar roxo escuro #6B21A8 para texto critical em roxo light background
- **Font size mínima:** 12px (caption), 14px (body padrão)
- **Touch targets:** Mínimo 44×44px (mobile)
- **Focus indicators:** Outline #A78BFA (2px sólida)
- **Alt text:** Todas imagens (avatares, fotos pedidos)
- **Labels:** Todos inputs devem ter `<label>`
- **Sem cor só:** Estados não podem ser só por cor (usar ícones/texto também)

---

## 13. Resumo de Tokens Chave

```javascript
// Design Tokens (CSS/SCSS variables)

// Cores
--color-primary: #A78BFA;
--color-primary-dark: #9368F7;
--color-primary-light: #E9D5FF;
--color-success: #10B981;
--color-error: #EF4444;
--color-warning: #F59E0B;
--color-info: #3B82F6;
--color-text-primary: #1F2937;
--color-text-secondary: #9CA3AF;
--color-border: #E5E7EB;
--color-background: #FFFFFF;
--color-surface: #F9FAFB;

// Tipografia
--font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
--font-size-body: 14px;
--font-size-body-large: 16px;
--font-size-heading: 20px;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;

// Espaçamento
--space-4: 4px;
--space-8: 8px;
--space-12: 12px;
--space-16: 16px;
--space-20: 20px;
--space-24: 24px;

// Bordas & Shadows
--radius: 8px;
--radius-round: 12px;
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
```

---

## Entrega para Figma

1. **Criar Library Compartilhada**
   - Colors (color styles)
   - Typographies (text styles)
   - Shadows (shadow effects)
   - Components (button, card, input, etc)

2. **Component Set Structure**
   - Button / Button Variants (primary, secondary, danger, small/medium/large)
   - Input / Input Variants
   - Card / Card Pedido
   - Badge / Badge Variants
   - Modal / Sheet
   - etc.

3. **Documentação no Figma**
   - Readme page com paleta, tipografia, espaçamento
   - Usage examples para cada componente
   - Do's and Don'ts

4. **Plugins Úteis**
   - Design Tokens (sincronizar tokens)
   - Themer (simular dark mode)

