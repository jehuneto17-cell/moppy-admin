# Moppy Component Specifications

Detalhes de anatomia, estados, sizing e acessibilidade para cada componente core e composto.

---

## 1. Button

### Anatomia
```
┌─────────────────────┐
│  [Icon?] Label [Icon?]│
└─────────────────────┘
```
- Label: Label (14px, Medium 500)
- Icon (opcional): 16-20px, esquerda ou direita, gap 8px
- Padding: 16px (H) × 12px (V)
- Border Radius: 8px

### Variantes

#### Button Primary
- **Normal:** Background #7C3AED, Text #FFFFFF
- **Hover:** Background #9368F7
- **Active:** Background #7C3AED
- **Disabled:** Background #D1D5DB, Text #9CA3AF, opacity 50%
- **Loading:** Spinner branco, label desaparece
- **Focus:** Outline 2px #7C3AED, offset 2px

#### Button Secondary
- **Normal:** Background #F3F4F6, Text #1F2937, Border 1px #D1D5DB
- **Hover:** Background #E5E7EB
- **Disabled:** Background #F9FAFB, Text #D1D5DB
- **Focus:** Outline 2px #7C3AED, offset 2px

#### Button Danger
- **Normal:** Background #EF4444, Text #FFFFFF
- **Hover:** Background #DC2626
- **Disabled:** Background #FECACA, Text #7F1D1D
- **Focus:** Outline 2px #EF4444, offset 2px

#### Button Ghost
- **Normal:** Background transparent, Text #7C3AED
- **Hover:** Background #E9D5FF
- **Active:** Text #9368F7
- **Focus:** Outline 2px #7C3AED, offset 2px

### Tamanhos
- **Small:** 12px (V) × 14px (H), Label 12px
- **Medium (default):** 12px (V) × 16px (H), Label 14px
- **Large (CTA):** 14px (V) × 20px (H), Label 16px

### Estados
- Normal, Hover, Active, Disabled, Loading, Focus

### Acessibilidade
- Touch: 44×44px mínimo (mobile)
- Keyboard: Tab, Enter, Space
- ARIA: `button`, `aria-pressed`, `aria-loading`
- Focus: Outline 2px #7C3AED
- Label obrigatório (text ou aria-label)

---

## 2. Input Text / TextArea

### Anatomia
```
┌──────────────────────┐
│ Placeholder/Value    │
│ Helper text ou error │
└──────────────────────┘
```
- Padding: 12px (H) × 8px (V)
- Border Radius: 6px
- Border: 1px solid #E5E7EB
- Font: Body (14px, Regular 400)

### Estados
- **Normal:** Border #E5E7EB, Background #FFFFFF
- **Focus:** Border #7C3AED, Shadow 0 0 0 3px rgba(167,139,250,0.1)
- **Disabled:** Background #F3F4F6, Border #E5E7EB, Text #D1D5DB
- **Error:** Border #EF4444, Shadow 0 0 0 3px rgba(239,68,68,0.1)
- **Success:** Border #10B981
- **Filled:** Background #F9FAFB

### Variantes
- **Text:** Standard textinput
- **Number:** Input numérico (spinners opcionais)
- **Email:** Validation regex
- **Password:** Mascarado, ícone "mostrar/ocultar"
- **TextArea:** Min-height 80px, resize vertical apenas

### Tamanhos
- **Compact:** 32px height (mobile)
- **Regular:** 40px height (default)
- **Dense:** 32px height (admin tables)

### Acessibilidade
- Label obrigatório
- `aria-label` ou `<label for>`
- Error messages: `aria-describedby`
- Helper text: `aria-helptext` (optional)
- Placeholder ≠ label (não substituir)
- Focus: Outline 2px #7C3AED

---

## 3. Card

### Anatomia
```
┌────────────────────────┐
│ [Header Image/Avatar]  │
│ ┌────────────────────┐ │
│ │ Title              │ │
│ │ Descrição/Meta     │ │
│ │ [Action Button]    │ │
│ └────────────────────┘ │
└────────────────────────┘
```
- Padding: 16px
- Border: 1px solid #E5E7EB
- Border Radius: 8px
- Background: #FFFFFF
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

### Estados
- **Normal:** Border #E5E7EB, Shadow subtle
- **Hover:** Border #7C3AED, Shadow 0 4px 6px rgba(0,0,0,0.1)
- **Selected/Active:** Border #7C3AED, Background #E9D5FF
- **Disabled:** Background #F9FAFB, Border #D1D5DB, opacity 50%
- **Focus:** Outline 2px #7C3AED (se clickable)

### Variantes
- **Card Default:** Padrão neutro
- **Card Pedido/Serviço:** Avatar + status badge + preço
- **Card Candidata:** Avatar + nome + nota + distância + botão
- **Card Info:** Compacto, sem imagem (inline)
- **Card Expandível:** Clique para expandir conteúdo

### Tamanhos
- **Compact:** ~80px height, metadata mínima
- **Regular:** ~100-120px height, info completa
- **Large:** ~150px height, imagem grande

### Acessibilidade
- Se clickable: `role="button"`, `tabindex="0"`, `aria-pressed`
- Focus: Outline 2px #7C3AED
- Informações críticas: Texto, não só cor
- Alt text: Imagens obrigatório

---

## 4. Badge / Pill

### Anatomia
```
┌──────────────────┐
│ Label + Icon (opt)│
└──────────────────┘
```
- Padding: 6px (H) × 4px (V)
- Border Radius: 12px (arredondado)
- Font: Label Small (12px, Medium 500)
- Border: None (ou 1px subtle)

### Variantes por Status
| Status | Background | Text |
|--------|-----------|------|
| Default | #E9D5FF | #6B21A8 |
| Info (Aberto) | #DBEAFE | #1E40AF |
| Warning (Aguardando) | #FEF3C7 | #92400E |
| Success (Confirmado) | #D1FAE5 | #065F46 |
| Secondary (Concluído) | #E5E7EB | #374151 |
| Danger (Cancelado) | #FEE2E2 | #7F1D1D |

### Tamanhos
- **Small:** 4px (V) × 6px (H), font 10px
- **Medium (default):** 4px (V) × 6px (H), font 12px
- **Large:** 6px (V) × 8px (H), font 14px

### Acessibilidade
- Semântica: Status deve ser óbvio (ícone + cor + texto)
- Alt text se ícone: aria-label
- Se dismissible: botão X com `aria-label="Remover"`

---

## 5. Checkbox & Radio

### Checkbox
```
┌─────┐  Label
│  ✓  │
└─────┘
```
- Size: 20px × 20px
- Border: 2px solid #D1D5DB
- Border Radius: 4px
- Checked Icon: ✓ (branco, #FFFFFF)
- Label: Body (14px), direita, gap 8px

**Estados:**
- **Unchecked:** Border #D1D5DB, Background transparent
- **Unchecked Hover:** Border #7C3AED
- **Checked:** Background #7C3AED, Icon branco
- **Checked Hover:** Background #9368F7
- **Disabled:** Background #F3F4F6, Border #D1D5DB
- **Focus:** Outline 2px #7C3AED, offset 2px

### Radio
```
◯ Label
```
- Size: 20px × 20px
- Border: 2px solid #D1D5DB
- Border Radius: 50%
- Checked: Círculo interior #7C3AED, 8px diameter
- Label: Body (14px), direita, gap 8px

**Estados:**
- **Unchecked:** Border #D1D5DB, Background transparent
- **Unchecked Hover:** Border #7C3AED
- **Checked:** Border #7C3AED, círculo interior #7C3AED
- **Disabled:** Border #D1D5DB, Background #F3F4F6
- **Focus:** Outline 2px #7C3AED, offset 2px

### Acessibilidade
- Label obrigatório (linked via `for` ou aria-label)
- Keyboard: Tab, Space (check), Arrow keys (radio)
- ARIA: `role="checkbox"` / `role="radio"`, `aria-checked`
- Focus: Outline 2px #7C3AED

---

## 6. Modal / BottomSheet

### Modal (Desktop/Tablet)
```
┌────────────────────┐
│ Overlay (α=0.5)    │
│ ┌────────────────┐ │
│ │ Header  [X]    │ │
│ │────────────────│ │
│ │ Body (scroll)  │ │
│ │────────────────│ │
│ │ Footer Actions │ │
│ └────────────────┘ │
└────────────────────┘
```

**Overlay:**
- Background: rgba(0, 0, 0, 0.5)
- Dismissable: Click fora fecha

**Container:**
- Background: #FFFFFF
- Border Radius: 12px
- Box Shadow: 0 20px 25px rgba(0, 0, 0, 0.15)
- Width: 90% (mobile), 500px max (desktop)
- Animation: Fade in + scale (150ms)

**Header:**
- Background: #F9FAFB
- Padding: 16px
- Border Bottom: 1px solid #E5E7EB
- Title: Heading 3 (20px, Bold)
- Close (X): Topo-direito, hover #7C3AED

**Body:**
- Padding: 16px
- Overflow-y: auto if needed
- Max-height: 70vh

**Footer:**
- Border Top: 1px solid #E5E7EB
- Padding: 16px
- Buttons: Primary + Secondary (gap 8px)

### BottomSheet (Mobile)
- Overlay: rgba(0, 0, 0, 0.4)
- Border Radius: 12px (top only)
- Height: 50-90vh conforme conteúdo
- Animation: Slide up (150ms)
- Dismiss: Swipe down, click fora, botão X

### Acessibilidade
- `role="dialog"`, `aria-modal="true"`
- Focus trap: Tab dentro do modal apenas
- Keyboard: Esc fecha
- ARIA label: `aria-labelledby` (header id)
- ARIA describe (opcional): `aria-describedby`

---

## 7. Dropdown / Select

### Anatomy
```
┌──────────────────────┐
│ Selected Item  [∨]   │
└──────────────────────┘

┌──────────────────────┐
│ Item 1               │
│ Item 2 (selected)    │
│ Item 3               │
└──────────────────────┘
```

**Closed:**
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border Radius: 6px
- Padding: 10px (H) × 8px (V)
- Font: Body (14px)
- Chevron: #9CA3AF (topo-direito)

**States:**
- **Normal:** Border #E5E7EB
- **Focus:** Border #7C3AED, Shadow 0 0 0 3px rgba(167,139,250,0.1)
- **Disabled:** Background #F3F4F6, Border #D1D5DB, Text #D1D5DB
- **Expanded:** Border #7C3AED, chevron rotado

**Menu (Expanded):**
- Background: #FFFFFF
- Border: 1px solid #D1D5DB
- Box Shadow: 0 10px 15px rgba(0, 0, 0, 0.1)
- Max-height: 300px, scroll if overflow
- Z-index: Acima de outros elementos

**Menu Items:**
- Padding: 10px (H) × 8px (V)
- Font: Body (14px)
- Border Bottom: None entre items (ou 1px #E5E7EB subtle)
- **Hover:** Background #E9D5FF
- **Selected:** Background #E9D5FF, Text #6B21A8, checkmark opcional

### Tamanhos
- **Compact:** 32px height
- **Regular:** 40px height
- **Dense:** 32px height

### Acessibilidade
- Label obrigatório
- `aria-label` ou linked `<label>`
- Keyboard: Tab, Enter (open), Arrow keys (navigate), Escape (close)
- ARIA: `role="combobox"`, `aria-expanded`, `aria-selected`
- Focus: Outline 2px #7C3AED

---

## 8. Avatar

### Anatomy
```
┌─────┐
│ IMG │  ou  AB
│     │
└─────┘
```

**Imagem:**
- Shape: Circle (border-radius 50%)
- Object-fit: cover
- Object-position: center
- Border: 1px solid #E5E7EB

**Fallback (Iniciais):**
- Background: #E9D5FF
- Text: Label Small (12px, Medium 500), cor #6B21A8
- Text-align: center, vertical-align

### Tamanhos
| Tamanho | Dimensão | Font |
|---------|----------|------|
| Small | 32px × 32px | 11px |
| Medium | 48px × 48px | 14px |
| Large | 64px × 64px | 16px |
| XLarge | 80px × 80px | 18px |

### Estados
- **Normal:** Border #E5E7EB
- **Focus:** Outline 2px #7C3AED (se clickable)
- **Online (status):** Dot verde #10B981 (4px), bottom-right
- **Offline:** Dot cinza #9CA3AF
- **Away:** Dot laranja #F59E0B

### Acessibilidade
- Alt text obrigatório (imagem)
- Se online/offline: aria-label descreve status
- Se clickable: `role="button"`, `tabindex="0"`

---

## 9. Stars / Rating (1-5)

### Anatomy
```
★ ★ ★ ★ ☆
```
- Size: 24px × 24px (padrão)
- Gap: 4px entre stars
- Color (filled): #F59E0B (amarelo/laranja)
- Color (empty): #D1D5DB (cinza)

### Tamanhos
- **Small:** 16px × 16px
- **Medium (default):** 24px × 24px
- **Large:** 32px × 32px

### Estados (Interativo)
- **Hover:** Stars até posição preenchidas (cor muted #FCD34D)
- **Click:** Confirma seleção (cor vibrante #F59E0B)
- **Readonly:** Sem interação, stars estáticas

### Variantes
- **Editable:** Hover/click preenche progessivamente
- **Readonly:** Exibe nota fixa (avaliação publicada)
- **Text (opcional):** "4.5 de 5" abaixo ou ao lado

### Acessibilidade
- Keyboard: Tab, Arrow keys (Left/Right para select), Enter (confirmar)
- ARIA: `role="slider"`, `aria-label="Rating"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Screen reader: "4 de 5 stars" pronunciation

---

## 10. Chat Bubble

### Sent Message (Cliente/Faxineira falando)
```
                    ┌─────────────┐
                    │ Sua mensagem│
                    └─────────────┘
                    2:45 PM
```
- Background: #7C3AED
- Text: #FFFFFF
- Border Radius: 16px (top) × 4px (bottom-right)
- Padding: 12px (H) × 8px (V)
- Align: Direita
- Font: Body (14px)
- Max-width: 85%
- Timestamp (Caption, 11px, #9CA3AF): Abaixo

### Received Message (Outro)
```
┌─────────────┐
│ Sua resposta│
└─────────────┘
2:45 PM
```
- Background: #E5E7EB
- Text: #1F2937
- Border Radius: 4px (bottom-left) × 16px (top)
- Padding: 12px (H) × 8px (V)
- Align: Esquerda
- Font: Body (14px)
- Max-width: 85%

### System Message
- Background: transparent
- Text: #9CA3AF (cinza médio), Body Small (12px)
- Align: Center
- Ex: "Chat iniciado", "Serviço confirmado"

### Indicadores
- **Typing:** Três pontinhos animados (#7C3AED)
- **Read receipt:** ✓✓ (duplo checkmark, branco ou roxo escuro)
- **Sent:** ✓ (único checkmark)

### Acessibilidade
- Mensagens em `role="article"` com timestamp
- ARIA live region para mensagens novas
- Alt text: Emojis/imagens descritos

---

## 11. Timeline

### Anatomy
```
◯—— Evento 1 (data)
◯—— Evento 2 (status)
◉—— Evento 3 ✓ (completo)
```

- Circle: 16px × 16px
- Linha: 2px solid #E5E7EB (vertical)
- Gap (circle-to-circle): 16px
- Text: Body (14px) + Body Small (12px, descrição)

### States
| Estado | Circle Color | Circle Icon | Text |
|--------|-------------|------------|------|
| Normal | #E9D5FF | - | #374151 |
| Active | #7C3AED | - | #1F2937 (bold) |
| Complete | #10B981 | ✓ (branco) | #374151 |
| Error | #EF4444 | ✗ | #7F1D1D |
| In Progress | #7C3AED | ◉ (filled) | #1F2937 |

### Layout
- Title: Body (14px, Medium 500)
- Description: Body Small (12px, #9CA3AF)
- Timestamp (opcional): Caption (11px, #9CA3AF)
- Gap entre eventos: 24px

### Tamanhos
- **Compact:** 12px circles, 1.5px lines
- **Regular:** 16px circles, 2px lines
- **Large:** 20px circles, 2.5px lines

### Acessibilidade
- `role="list"`, items `role="listitem"`
- Status descrito em texto (não só cor)
- ARIA: `aria-current` para active event

---

## 12. Spinner / Loader

### Circular (Padrão)
```
    ◌
  ◌   ◌
  ◌   ◌
    ◌
```
- Size: 32px × 32px (padrão)
- Stroke: 2px
- Color (foreground): #7C3AED
- Color (background ring): #E9D5FF (subtle)
- Animation: Rotação 360° infinita, 1s per rotation

### Tamanhos
| Tamanho | Dimensão | Stroke |
|---------|----------|--------|
| Small | 24px | 2px |
| Medium | 32px | 2px |
| Large | 48px | 3px |

### Linear (Progress Bar)
- Height: 4px
- Background: #E5E7EB
- Foreground: #7C3AED
- Border Radius: 2px
- Width: 100% (container)
- Animation: Indefinite ou progress 0-100%

### Com Texto
- Label: Body Small (12px, #9CA3AF)
- Position: Abaixo do spinner
- Text: "Carregando...", "Aguarde..."

### Variações
- **Indeterminate:** Rotação contínua (async load)
- **Determinate:** % progress visual (upload, multi-step)
- **Pulse:** Fade in/out (subtle loading hint)

### Acessibilidade
- `aria-label="Carregando"` ou `aria-busy="true"`
- Live region: `aria-live="polite"` + status text
- Screen reader: "Página carregando, por favor aguarde"

---

## 13. Alert / Banner

### Info
```
ℹ  Informação importante
[X]
```
- Background: #DBEAFE
- Border Left: 3px solid #3B82F6
- Text: #1E40AF
- Icon: ℹ (#3B82F6)
- Padding: 12px (V) × 16px (H)
- Border Radius: 4px
- Font: Body Small (12px)

### Error
- Background: #FEE2E2
- Border: #EF4444
- Text: #7F1D1D
- Icon: ! (#EF4444)

### Success
- Background: #D1FAE5
- Border: #10B981
- Text: #065F46
- Icon: ✓ (#10B981)

### Warning
- Background: #FEF3C7
- Border: #F59E0B
- Text: #92400E
- Icon: ! (#F59E0B)

### Layout
```
┌───────────────────────────────┐
│ [Icon] Message text [Close X] │
└───────────────────────────────┘
```
- Icon: 20px, esquerda
- Message: Body Small (12px), esquerda, gap 8px
- Close: X (12px), direita, hover opacity 70%, click dismiss

### States
- **Normal:** Visível
- **Dismissing:** Fade out (150ms)
- **Dismissed:** Hidden
- **Persistent:** Sem close button (informação crítica)

### Variantes
- **Inline:** Compact, pode estar dentro de cards
- **Toast:** Floating, topo/rodapé, auto-dismiss 5s
- **Banner:** Full-width, sem close (critical messages)

### Acessibilidade
- `role="alert"` (WCAG compliant)
- ARIA live: `aria-live="assertive"` (errors), `aria-live="polite"` (info)
- Close button: `aria-label="Fechar aviso"`
- Icon description: `aria-label`

---

## 14. Image Upload

### Anatomy
```
┌────────────────┐
│  [+] Adicionar │  ou  ┌──────┐
│   imagem       │      │ IMG  │
└────────────────┘      └──────┘
```

**Upload Area (vazio):**
- Border: 2px dashed #D1D5DB
- Background: #F9FAFB
- Padding: 24px
- Border Radius: 8px
- Icon: + (#9CA3AF, 32px)
- Text: Body Small (12px, #9CA3AF)
- Align: center

**Upload Area (drag-over):**
- Border: 2px dashed #7C3AED
- Background: #E9D5FF (subtle)

**Uploaded Image:**
- Display: Thumbnail 80×80px
- Border: 1px solid #E5E7EB
- Border Radius: 8px
- Object-fit: cover
- Delete button (X): Topo-direito, hover #EF4444

### Validação
- File types: .jpg, .png, .webp (mime types validar)
- Max size: 5MB (exibir mensagem se exceder)
- Dimensions: 1:1 ratio ideal (crop preview optional)
- Error: Background #FEE2E2, Text #7F1D1D, ícone ⚠

### States
- **Empty:** Placeholder com instrução
- **Uploading:** Spinner + "Enviando..."
- **Uploaded:** Thumbnail + delete option
- **Error:** Message vermelha + retry button

### Acessibilidade
- Input: `<input type="file">` hidden, linked via label
- Label: Body Small (12px, visível)
- ARIA: `aria-label="Selecionar imagem"`, `aria-describedby` (size, format)
- Keyboard: Tab + Enter (open file picker)
- Focus: Outline 2px #7C3AED na upload area

---

## 15. Cronômetro / Timer

### Display
```
02:45:30
Duração do serviço
```
- Font: 48px, Bold (700)
- Color: #1F2937
- Format: HH:MM:SS
- Background: #F9FAFB
- Padding: 20px
- Border Radius: 12px
- Gap subtitle: 8px

### Subtitle
- Font: Body Small (12px, #9CA3AF)
- Text: "Duração do serviço" ou "Tempo restante"
- Align: center

### Countdown Timer (Regressivo)
- Font: 24px (médio)
- Format: "24h 45m" ou "XXh XXm"
- **Normal:** #1F2937
- **Alert (<4h):** #EF4444 (blink opcional)
- **Critical (<1h):** #EF4444 + bold

### Variantes
- **Cronômetro (regressivo):** Conta pra cima (tempo passado)
- **Countdown:** Conta pra baixo (tempo restante)
- **Paused:** Cinza escuro, "Pausado" abaixo
- **Complete:** Verde #10B981, ícone ✓

### Acessibilidade
- ARIA: `aria-label="Cronômetro: 2 horas 45 minutos"` (atualizar a cada mudança)
- Live region: `aria-live="off"` (não ler continuamente)
- Screen reader: Texto legível, não só números

---

## 16. Progress Bar (Linear)

### Anatomy
```
┌────────────────────────────────┐
│ ████████░░░░░░░░░░░░░░░░░░░░░░ │
│ Passo 3 de 8                    │
└────────────────────────────────┘
```
- Height: 4px
- Background: #E5E7EB (track)
- Foreground: #7C3AED (progress)
- Border Radius: 2px
- Width: 100% (container)
- Padding (container): 16px

### Label (opcional)
- Font: Body Small (12px, #9CA3AF)
- Position: Abaixo
- Format: "Passo X de Y" ou "XX% completo"

### States
- **Normal:** Progress 0-100%, foreground #7C3AED
- **Complete:** 100%, foreground #10B981, ícone ✓
- **Error:** Foreground #EF4444 (se falha)
- **Indeterminate:** Animação slide (enquanto carregando)

### Tamanhos
- **Thin:** 2px height (subtle)
- **Regular:** 4px height (padrão)
- **Thick:** 6px height (emphasis)

### Acessibilidade
- `role="progressbar"`
- ARIA: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Label: `aria-label` ou linked `<label>`
- Screen reader: "Passo 3 de 8, 37% completo"

---

## 17. Divider

### Anatomy
```
─────────────────────────────────
```
- Height: 1px
- Color: #E5E7EB (cinza claro)
- Margin: 12px (V) × 0 (H)

### Variantes
- **Horizontal:** Default (full-width)
- **Vertical:** 1px width, height variável
- **With Text (opcional):** 
  ```
  ─────────── Ou ───────────
  ```
  - Text: Body Small (12px, #9CA3AF)
  - Gap: 8px (left + right)

### Tamanhos
- **Compact:** Margin 8px
- **Regular:** Margin 12px
- **Large:** Margin 16px

### Acessibilidade
- Semântico: `<hr>` para separação estrutural
- Ou `<div role="separator">` para visual
- Não necessita aria-label (puramente visual)

---

## Componentes Compostos (7)

### 1. Card Pedido/Serviço

**Layout:**
```
┌────────────────────┐
│ [Avatar] Nome | Badge Status
│ Tipo + Tamanho
│ Data/Hora | Valor
│ ★★★★★ (rating opt)
│ [Botão CTA]
└────────────────────┘
```

**Componentes:**
- Avatar (40px)
- Title: Heading 3 (20px, Bold)
- Meta: Body Small (12px, #9CA3AF)
- Badge (status)
- Rating (Stars, 16px, optional)
- Button (primary ou secondary)
- Padding: 16px
- Gap: 8px entre elementos

---

### 2. Card Candidata/Faxineira

**Layout:**
```
┌────────────────────┐
│ [Avatar M]  Nome
│ ★ 4.8 (100 reviews)
│ 2.5 km de você
│ [Contratar/Ver Perfil]
└────────────────────┘
```

**Componentes:**
- Avatar (48px)
- Name: Heading 3 (20px)
- Rating + count: Body Small (12px)
- Distance: Body Small (12px, #9CA3AF)
- Button (primary)
- Padding: 16px
- Gap: 8px

---

### 3. Input + Label

**Layout:**
```
Label (required *)
┌──────────────────┐
│ Placeholder      │
└──────────────────┘
Helper text ou error
```

**Componentes:**
- Label: Body Small (12px, Medium 500)
- Required marker (*): #EF4444
- Input (padrão)
- Helper text (Caption, #9CA3AF) ou error (Caption, #EF4444)
- Gap Label-Input: 4px

---

### 4. Button com Ícone

**Anatomy:**
```
┌──────────────────────┐
│ [←] Voltar    [✓]   │
└──────────────────────┘
```
- Icon: 16-20px
- Position: Left ou right
- Gap: 8px
- Rest: Button specs padrão

---

### 5. Tab Bar (Mobile)

**Layout:**
```
┌─────────────────────────────┐
│ [●] Tab | [○] Tab | [○] Tab │
│    Label  Label    Label     │
└─────────────────────────────┘
```

**Per Tab:**
- Icon: 24px (active) ou 20px (inactive)
- Label: Label Small (12px)
- Active: Icon + Label #7C3AED, Background #E9D5FF subtle
- Inactive: Icon + Label #9CA3AF
- Padding: 8px (H) × 12px (V)
- Flex: equal width
- Gap icon-label: 4px

---

### 6. Sidebar (Web Admin)

**Layout:**
```
┌────────────────┐
│ LOGO           │
│ ┌────────────┐ │
│ │ Dashboard  │ │  (active)
│ ├────────────┤ │
│ │ Pedidos    │ │
│ │ Disputas   │ │
│ │ Financeiro │ │
│ └────────────┘ │
│ ┌────────────┐ │
│ │ Sair       │ │
│ └────────────┘ │
└────────────────┘
```

**Componentes:**
- Logo: 40px × 40px
- Menu items: Body (14px), padding 12px (V) × 16px (H)
- Active: Background #E9D5FF, Text #6B21A8
- Inactive: Text #374151, hover Background #F3F4F6
- Icon: 20px, left, gap 12px
- Border left (active): 3px #7C3AED
- Divider: 1px #E5E7EB
- Width: 240px (desktop), 64px (collapsed)

---

### 7. Table Row (Admin)

**Layout:**
```
┌────────────────────────────────────────────┐
│ Checkbox │ Data │ Cliente │ Valor │ Status │
└────────────────────────────────────────────┘
```

**Componentes:**
- Checkbox (20px)
- Cells: Body Small (12px), padding 12px
- Height: 48px (compact) ou 40px (regular)
- Hover: Background #F9FAFB
- Border bottom: 1px #E5E7EB
- Clickable row: Cursor pointer, click → detalhe modal
- Focus: Outline 2px #7C3AED (se keyboard nav)

---

## 18. DatePicker

**Anatomia:**
```
┌──────────────────────┐
│ ▼ DD / MM / YYYY     │
└──────────────────────┘
   (native picker mobile,
    calendar modal web)
```

**Estados:**
- Normal: Input com placeholder "DD / MM / YYYY"
- Focused: Border #7C3AED, outline
- Filled: Mostra data selecionada
- Disabled: Opacity 50%, cursor not-allowed
- Error: Border #EF4444, helper text vermelho

**Acessibilidade:** ARIA type="date", semantic input, keyboard (arrow keys mobile/web)

**Tamanhos:**
- Height: 40px (regular), 36px (compact)
- Width: 100% container (responsivo)
- Padding: 12px (V) × 16px (H)

---

## 19. TimePicker

**Anatomia:**
```
┌──────────────────┐
│ ▼ HH : MM        │
└──────────────────┘
```

**Estados:** Similar DatePicker (Normal, Focused, Filled, Disabled, Error)

**Tamanho:** 44×44px (mobile touch target)

---

## 20. KPI Card

**Anatomia:**
```
┌────────────────────┐
│ Label (Body Small) │
│ 1,234 (Display)    │
│ ↑ 5% (Body Small)  │
└────────────────────┘
```

**Componentes:**
- Label: Label Small, cor #9CA3AF
- Valor: Display (32px, bold)
- Trend: Body Small, ícone + cor (verde sucesso, vermelho erro)

**Tamanhos:**
- Width: 120px (compact), 160px (regular), 200px (expanded)
- Height: 80px (content-fit)
- Padding: 16px
- Gap (dentro): 8px

**Estados:**
- Normal: Background branco, valores visíveis
- Hover: Background #F9FAFB
- Loading: Skeleton (cinza #E5E7EB, shimmer animation)
- Empty: Ícone cinzento, "Sem dados" (Body Small)
- Error: Border #EF4444, ícone alertas

---

## 21. Table

**Anatomia:**
```
┌──────┬──────┬──────────┐
│ Col1 │ Col2 │ Col3     │
├──────┼──────┼──────────┤
│ Row1 │ Row1 │ Row1     │
│ Row2 │ Row2 │ Row2     │
└──────┴──────┴──────────┘
```

**Componentes:**
- Header Row: Background #F3F4F6, Bold (700), border bottom 1px
- Data Row: Height 48px, border bottom 1px #E5E7EB
- Células: Body (14px), padding 12px (H) × 16px (V)
- Hover: Background #F9FAFB
- Selectable: Checkbox coluna 1
- Sortable: Header clicável → ícone ▲/▼

**Responsiveness:** Scroll horizontal em mobile (<640px)

**Estados:**
- Normal: Linhas com dados, alternâncias de cor por linha (branco / #F9FAFB)
- Loading: Skeleton rows (5-10 linhas cinzentas #E5E7EB com shimmer)
- Empty: Ícone centro, mensagem "Nenhum resultado", height 200px (centrado)
- Error: Ícone de erro, mensagem + botão "Tentar Novamente"
- Sorted: Coluna ativa mostra ícone ▲/▼, header bold

**Tamanhos:**
- Variante Regular: Row height 48px (padrão)
- Variante Compact: Row height 36px (admin, muitos dados)
- Min column width: 80px
- Max table width: 100% container, scroll interno em mobile

---

## Referências

- **DESIGN-SYSTEM.md** — Paleta, tipografia, espaçamento, princípios
- **ACCESSIBILITY-CHECKLIST.md** — WCAG compliance, testing
- **TOKENS-CODE.md** — CSS, JS, JSON export
