# Moppy Design System

Design System completo para Moppy. Paleta, tipografia, espaçamento, componentes, dark mode, breakpoints, acessibilidade.

---

## 1. Visão Geral

**Moppy** é um marketplace de limpeza residencial. Design System minimalista, acessível, inclusivo e consistente para:
- Mobile (Expo/React Native) — clientes e faxineiras
- Web admin (Next.js) — gestão de pedidos, disputas, financeiro

**Identidade Visual:**
- Logo: Gota d'água branca (#FFFFFF)
- Cor primária: Roxo #7C3AED (contrast-optimized, 5.2:1 with white)
- Paleta neutra: Cinzas (accessibility-first)
- Semânticas: Verde (sucesso), Vermelho (erro), Laranja (warning), Azul (info)

**Usuários:** 25-60 clientes, 20-65 faxineiras (idade 25-60, design inclusivo obrigatório)

---

## 2. Princípios de Design

1. **Minimalista** — Menos é mais. Sem ornamenta. Espaçamento claro, hierarquia visual óbvia.
2. **Acessível** — WCAG 2.1 AA mínimo. Contraste 4.5:1, touch targets 44×44px, keyboard navigation.
3. **Inclusivo** — Fontes legíveis (16px+), cores respeitam daltonismo, funciona em redes lentas.
4. **Consistente** — Componentes reutilizáveis. Mesmas regras, mesmos tokens, em todas as plataformas.

---

## 3. Paleta de Cores

### Primária
| Token | Cor | Hex | Contraste* | Uso |
|-------|-----|-----|----------|-----|
| Primary | Roxo | #7C3AED | 5.2:1 ✓ | Botões primários, headers, destaque, focus |
| Primary Dark | Roxo escuro | #6D28D9 | 6.8:1 ✓ | Hover, active, variantes dark |
| Primary Light | Roxo claro | #EDE9FE | — | Background suave, badges, tint |
| Primary Very Dark | Roxo muito escuro | #4C1D95 | 8.1:1 ✓ | Texto crítico em roxo light bg |
*Contraste com #FFFFFF (branco), WCAG AA mínimo 4.5:1

### Neutros (Grayscale)
| Token | Cor | Hex | Uso |
|-------|-----|-----|-----|
| White | Branco | #FFFFFF | Fundo principal, cards |
| Surface | Cinza muito claro | #F9FAFB | Cards, inputs, superfícies elevadas |
| Border | Cinza claro | #E5E7EB | Bordas, dividers, linhas |
| Text Secondary | Cinza médio | #9CA3AF | Descrições, placeholders, subtextos |
| Text Primary | Cinza escuro | #374151 | Texto corpo, legibilidade alta |
| Text Maximum | Preto | #1F2937 | Headers, títulos, máximo contraste |

### Semânticas
| Token | Status | Cor | Hex | Background |
|-------|--------|-----|-----|------------|
| Success | ✓ | Verde | #10B981 | #D1FAE5 |
| Error | ✗ | Vermelho | #EF4444 | #FEE2E2 |
| Warning | ⚠ | Laranja | #F59E0B | #FEF3C7 |
| Info | ℹ | Azul | #3B82F6 | #DBEAFE |

### Dark Mode (Futuro)
Se implementar (Fase 2+):
- Background: #1F2937 → #1A1A1A
- Surface: #111827 → #2D2D2D
- Text Primary: #F3F4F6 (branco suave)
- Text Secondary: #9CA3AF (mantém)
- Roxo: #A78BFA (mantém, funciona em dark)
- Borders: #374151 (cinza escuro)

---

## 4. Tipografia

### Font Family
- **Primária:** Inter (Google Fonts)
- **Fallback:** -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Pesos:** 400 (Regular), 500 (Medium), 700 (Bold)

### Escala Tipográfica

| Nome | Tamanho | Peso | Line Height | Letter Spacing | Uso |
|------|---------|------|-------------|----------------|-----|
| Display Large | 40px | Bold (700) | 1.2 (48px) | -0.5px | Título hero máximo, splash screen |
| Display | 32px | Bold (700) | 1.2 (38px) | -0.5px | Título hero, destaque máximo |
| Heading 1 | 28px | Bold (700) | 1.3 (36px) | -0.25px | Título página |
| Heading 2 | 24px | Bold (700) | 1.3 (31px) | 0 | Seção principal |
| Heading 3 | 20px | Bold (700) | 1.4 (28px) | 0 | Card title, subtítulo |
| Body Large | 16px | Regular (400) | 1.5 (24px) | 0 | Conteúdo principal |
| Body | 14px | Regular (400) | 1.5 (21px) | 0 | Padrão, descrição |
| Body Small | 12px | Regular (400) | 1.4 (17px) | 0 | Secundário, metadata |
| Label | 14px | Medium (500) | 1.4 (20px) | 0 | Botões, badges |
| Label Small | 12px | Regular (400) | 1.3 (16px) | 0 | Hint, placeholder, helper |
| Caption | 11px | Regular (400) | 1.4 (15px) | 0 | Timestamp, meta, muito pequeno |

### Usos Específicos
- **Títulos página:** Display ou Heading 1
- **Nomes em cards:** Heading 3
- **Descrição cards:** Body Small
- **Texto input:** Body
- **Placeholder input:** Label Small
- **Botões:** Label (Medium 500, 14px)
- **Badges/Pills:** Label Small
- **Timestamp chat:** Caption

---

## 5. Espaçamento (8px Unit System)

Todos espaçamentos múltiplos de 4px (preferir 8px para clarity).

| Token | Valor | Usos |
|-------|-------|------|
| XS | 4px | Gaps muito próximos |
| S | 8px | Gap padrão (inline, seções mínimas) |
| M | 12px | Gap médio entre grupos |
| L | 16px | Padding interno cards, containers |
| XL | 20px | Espaço seções |
| 2XL | 24px | Padding página, espaço substancial |
| 3XL | 32px | Espaço grande entre seções |
| 4XL | 48px | Espaço muito grande |

### Aplicação
- **Padding Button:** 16px (H) × 12px (V)
- **Padding Card:** 16px
- **Padding Input:** 12px
- **Gap Cards (list):** 12px
- **Margem página:** 24px
- **Margem seção:** 20px

---

## 6. Border & Radius

### Border Radius
- **Small:** 4px — Checkboxes, inputs pequenos
- **Medium:** 6px — Inputs padrão
- **Default:** 8px — Cards, modals, buttons
- **Round:** 12px — Badges, pills, modals topo
- **Circle:** 50% — Avatares

### Borders
- **Standard:** 1px solid #E5E7EB (cinza claro)
- **Thick:** 2px solid (checkboxes, focus)
- **Heavy:** 3px solid (alerts left border)

---

## 7. Shadows (Elevation System)

| Nome | Valor | Uso |
|------|-------|-----|
| Subtle | 0 1px 3px rgba(0, 0, 0, 0.1) | Cards padrão, inputs |
| Medium | 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06) | Cards hover, buttons |
| Large | 0 20px 25px rgba(0, 0, 0, 0.15) | Modais, sheets |
| XL | 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1) | Dropdowns, menus |

---

## 8. Transições & Animações

| Tipo | Duration | Easing |
|------|----------|--------|
| Default (fade + scale) | 150ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Modal entrada | 150ms | ease-in-out |
| Hover button | 50ms | ease-in-out |
| Spinner | 1s | linear (infinita) |

---

## 9. Componentes Base

Cada componente tem:
- Anatomia (partes, hierarquia)
- Estados (normal, hover, active, disabled, loading, error, focus)
- Tamanhos (S, M, L quando aplicável)
- Variantes (color, tipo)
- Acessibilidade

*(Vide COMPONENT-SPECS.md para detalhes completos)*

**Componentes Core (17):**
1. Button (primary, secondary, danger, ghost, small/medium/large)
2. Input Text / TextArea
3. Card (padrão, hoverable, clickable, selected)
4. Badge / Pill (status variants)
5. Checkbox & Radio
6. Modal / BottomSheet
7. Dropdown / Select
8. Avatar (image, fallback)
9. Stars / Rating (1-5, interactive, readonly)
10. Chat Bubble (sent, received, system)
11. Timeline (circles, labels)
12. Spinner / Loader
13. Alert / Banner (info, success, error, warning, dismissible)
14. Image Upload
15. Cronômetro / Timer
16. Progress Bar (linear)
17. Divider

**Componentes Compostos (7):**
1. Card Pedido/Serviço (header, avatar, status, preço, action)
2. Card Candidata/Faxineira (avatar, nome, nota, distância, botão)
3. Input + Label (stacked ou inline)
4. Botão com Ícone
5. Tab Bar (mobile, 4-5 tabs)
6. Sidebar (web admin, menu)
7. Table Row (admin)

---

## 10. Breakpoints (Responsive)

### Mobile (Expo)
- **Default:** <640px
- Layout: Full width, single column, tabs bottom
- Font: 14px (body), 12px (small)
- Touch: 44×44px min

### Tablet
- **640px — 1024px**
- Layout: 2 colunas ou sidebar colapsável
- Font: 14-16px
- Touch: 40×40px

### Desktop
- **>1024px**
- Layout: Sidebar + content (3 cols possível)
- Font: 16px (body), 14px (small)
- Click: 32×32px min

---

## 11. Densidades de Layout

### Compact (mobile/default)
- Padding: 16px
- Gap Cards: 12px
- Height Button: 44px
- Height Input: 40px
- Altura Row: 48px

### Regular (tablet/desktop)
- Padding: 20-24px
- Gap Cards: 16px
- Height Button: 40px
- Height Input: 36px
- Altura Row: 40px

### Dense (admin tables)
- Padding: 12px
- Gap Cards: 8px
- Height Button: 32px
- Height Input: 32px
- Altura Row: 32px
- Font: 12px (body small)

---

## 12. Ícones

**Set:** Feather Icons (recomendado) ou Heroicons
- **Tamanho padrão:** 20-24px
- **Cores:** Herdadas do texto (primária, secundária, error, success)
- **Align:** Vertical center com texto
- **Gap icon-text:** 8px

**Ícones Críticos:**
- Checkmark: ✓ (sucesso)
- Close/X: Fechar
- Chevron: Expand/collapse
- Location: Localização
- Double Checkmark: ✓✓ (confirmação dupla)
- Alert: ⚠️ (aviso/erro)
- Message: Chat
- Clock: Tempo/cronômetro

---

## 13. Acessibilidade

### Contraste (WCAG 2.1 AA)
- **Texto/Background:** Mínimo 4.5:1
  - Roxo #A78BFA on white: ~3.8:1 (ligeiramente abaixo → usar para non-critical text)
  - Roxo #A78BFA on roxo tint: ~2:1 (OK para background accent)
  - Roxo escuro #6B21A8 on roxo light: ~4.8:1 (OK para texto crítico)
- **UI Components:** Mínimo 3:1 (borders, icons)

### Touch & Keyboard
- **Touch targets:** 44×44px mínimo (mobile)
- **Keyboard navigation:** Tab, Shift+Tab, Enter, Space, Arrows
- **Focus indicators:** Outline #A78BFA (2px sólida) + offset 2px
- **Skip to content:** Link acessível (mobile/web)

### Content
- **Font size mínima:** 12px (caption), 14px (body padrão)
- **Labels:** Todos inputs devem ter `<label>`
- **Alt text:** Todas imagens (avatares, fotos pedidos)
- **Sem cor só:** Estados não podem ser só por cor (usar ícones/texto)

### Daltonismo
- Testar com Sim Daltonism (iOS) ou similar
- Nunca confiar só em cor para distinguir estado
- Verde + ✓, Vermelho + ✗, Laranja + ⚠

---

## 14. Resumo de Tokens Chave

```css
/* Cores */
--color-primary: #A78BFA;
--color-primary-dark: #9368F7;
--color-primary-light: #E9D5FF;
--color-primary-very-dark: #6B21A8;
--color-success: #10B981;
--color-error: #EF4444;
--color-warning: #F59E0B;
--color-info: #3B82F6;
--color-text-primary: #1F2937;
--color-text-secondary: #9CA3AF;
--color-border: #E5E7EB;
--color-background: #FFFFFF;
--color-surface: #F9FAFB;

/* Tipografia */
--font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-size-display: 32px;
--font-size-heading-1: 28px;
--font-size-heading-2: 24px;
--font-size-heading-3: 20px;
--font-size-body-large: 16px;
--font-size-body: 14px;
--font-size-body-small: 12px;
--font-size-label: 14px;
--font-size-caption: 11px;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;

/* Espaçamento */
--space-xs: 4px;
--space-s: 8px;
--space-m: 12px;
--space-l: 16px;
--space-xl: 20px;
--space-2xl: 24px;
--space-3xl: 32px;
--space-4xl: 48px;

/* Bordas & Shadows */
--radius-sm: 4px;
--radius-md: 6px;
--radius: 8px;
--radius-lg: 12px;
--radius-round: 50%;
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1);

/* Transições */
--transition-default: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-modal: 150ms ease-in-out;
--transition-hover: 50ms ease-in-out;
```

---

## 15. Documentação de Entrega para Figma

### Structure Esperada
1. **Cover** — Logo, title, versão
2. **Colors** — Paleta completa (light + dark)
3. **Typography** — Scale, specimens, weights
4. **Spacing** — Grid 8px, tokens aplicados
5. **Shadows** — Elevação system
6. **Components** — Button, Input, Card, etc (17 bases + 7 compostos)
7. **Patterns** — Forms, lists, modals
8. **Usage** — Do's & Don'ts (screenshots, exemplos reais)

### Library Setup
- **Color Styles:** Primária, secundárias, semânticas, dark mode
- **Text Styles:** Display, Heading 1-3, Body Large/Normal/Small, Label, Caption
- **Shadow Styles:** sm, md, lg, xl
- **Components (Main):** Button, Input, Card, Badge, etc
- **Component Sets:** Variantes (primary/secondary/danger, small/medium/large)

### Dark Mode Support
- Toggle automático via `@media (prefers-color-scheme: dark)`
- Ou manual via component variant
- Manter saturação, inverter luminosidade

---

## 16. Ferramentas & Plugins Recomendados (Figma)

- **Design Tokens** — Sync tokens com código
- **Themer** — Simular dark mode
- **Color Contrast Checker** — Validar WCAG
- **Figma Tokens** — Export para CSS/JS

---

## Referências Rápidas

- **DESIGN-TOKENS-SKETCH.md** — Especificação original detalhada
- **COMPONENT-SPECS.md** — Anatomia, estados, sizing de cada componente
- **ACCESSIBILITY-CHECKLIST.md** — WCAG compliance checklist
- **TOKENS-CODE.md** — Export CSS, JS, JSON, Tailwind
- **FIGMA-PROMPT.md** — Prompt pronto pra Claude Designer
