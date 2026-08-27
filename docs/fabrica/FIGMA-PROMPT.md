# Figma Design System Prompt (Moppy)

Prompt pronto para colar no Claude Designer ou usar em Figma.

---

## Prompt Completo

```
Crie um Design System completo em Figma para Moppy, um marketplace de limpeza residencial.

## Identidade
- Logo: Gota d'água branca
- Cor primária: Roxo #A78BFA
- Paleta: Roxo primário, cinzas neutros, semânticas (verde, vermelho, laranja, azul)
- Tipografia: Inter (fallback system), pesos 400/500/700
- Estilo: Minimalista, acessível, WCAG AA

## Paleta de Cores

### Primária
- Primary #A78BFA (roxo)
- Primary Dark #9368F7 (hover/active)
- Primary Light #E9D5FF (tint/background)
- Primary Very Dark #6B21A8 (texto crítico)

### Neutros
- White #FFFFFF
- Surface #F9FAFB
- Border #E5E7EB
- Text Secondary #9CA3AF
- Text Primary #374151
- Text Maximum #1F2937

### Semânticas
- Success #10B981 (bg: #D1FAE5)
- Error #EF4444 (bg: #FEE2E2)
- Warning #F59E0B (bg: #FEF3C7)
- Info #3B82F6 (bg: #DBEAFE)

## Tipografia

Font Family: Inter (fallback: -apple-system, BlinkMacSystemFont, Segoe UI)

Escala:
- Display: 32px Bold (1.2 line-height, -0.5 letter-spacing)
- Heading 1: 28px Bold (1.3 line-height, -0.25 letter-spacing)
- Heading 2: 24px Bold (1.3 line-height)
- Heading 3: 20px Bold (1.4 line-height)
- Body Large: 16px Regular (1.5 line-height)
- Body: 14px Regular (1.5 line-height)
- Body Small: 12px Regular (1.4 line-height)
- Label: 14px Medium (1.4 line-height)
- Label Small: 12px Regular (1.3 line-height)
- Caption: 11px Regular (1.4 line-height)

## Espaçamento (8px Unit System)

- XS: 4px
- S: 8px
- M: 12px
- L: 16px
- XL: 20px
- 2XL: 24px
- 3XL: 32px
- 4XL: 48px

## Componentes Base (Criar com variantes)

### 1. Button
Variantes: Primary, Secondary, Danger, Ghost
Tamanhos: Small (12×14px), Medium (12×16px), Large (14×20px)
Estados: Normal, Hover, Active, Disabled, Loading, Focus
Padding (medium): 16px (H) × 12px (V)
Border Radius: 8px
Font: Label (14px Medium)
- Primary: #A78BFA background, #FFF text, hover #9368F7
- Secondary: #F3F4F6 background, #1F2937 text, 1px #D1D5DB border
- Danger: #EF4444 background, #FFF text, hover #DC2626
- Ghost: transparent, #A78BFA text, hover #E9D5FF background
Focus: Outline 2px #A78BFA, offset 2px

### 2. Input Text
States: Normal, Focus, Disabled, Error, Success
Padding: 12px (H) × 8px (V)
Border Radius: 6px
Border: 1px solid #E5E7EB
Font: Body (14px)
Placeholder: #9CA3AF
- Focus: Border #A78BFA, shadow 0 0 0 3px rgba(167,139,250,0.1)
- Error: Border #EF4444, shadow 0 0 0 3px rgba(239,68,68,0.1)
- Disabled: Background #F3F4F6, border #E5E7EB, text #D1D5DB
TextArea variant: Min-height 80px, resize vertical

### 3. Card
Padding: 16px
Border: 1px solid #E5E7EB
Border Radius: 8px
Background: #FFFFFF
Shadow: 0 1px 3px rgba(0,0,0,0.1)
States: Normal, Hover, Selected, Disabled, Focus
- Hover: Border #A78BFA, shadow 0 4px 6px rgba(0,0,0,0.1)
- Selected: Border #A78BFA, background #E9D5FF
- Focus: Outline 2px #A78BFA

### 4. Badge
Padding: 6px (H) × 4px (V)
Border Radius: 12px
Font: Label Small (12px)
Variantes (por status):
- Default: bg #E9D5FF, text #6B21A8
- Info: bg #DBEAFE, text #1E40AF
- Success: bg #D1FAE5, text #065F46
- Warning: bg #FEF3C7, text #92400E
- Danger: bg #FEE2E2, text #7F1D1D

### 5. Checkbox
Size: 20×20px
Border: 2px solid #D1D5DB
Border Radius: 4px
States: Unchecked, Checked, Disabled
- Unchecked: Border #D1D5DB, transparent background, hover border #A78BFA
- Checked: Background #A78BFA, check icon #FFF
- Checked Hover: Background #9368F7
Label: Body (14px), right align, gap 8px
Focus: Outline 2px #A78BFA

### 6. Radio
Size: 20×20px
Border: 2px solid #D1D5DB
Border Radius: 50%
States: Unchecked, Checked, Disabled
- Unchecked: Border #D1D5DB, transparent, hover border #A78BFA
- Checked: Border #A78BFA, inner circle 8px #A78BFA
Label: Body (14px), right align, gap 8px
Focus: Outline 2px #A78BFA

### 7. Modal
Overlay: rgba(0,0,0,0.5)
Container: 90% width (mobile), 500px max (desktop), border-radius 12px
Shadow: 0 20px 25px rgba(0,0,0,0.15)
Header: Background #F9FAFB, padding 16px, border-bottom 1px #E5E7EB, title Heading 3, close X hover #A78BFA
Body: Padding 16px, overflow-y auto, max-height 70vh
Footer: Border-top 1px #E5E7EB, padding 16px, buttons horizontal (gap 8px)
Animation: Fade in + scale 150ms

### 8. Dropdown / Select
Closed: Background #FFF, border 1px #E5E7EB, padding 10px (H) × 8px (V), border-radius 6px
Font: Body (14px)
Chevron: #9CA3AF (right align)
States: Normal, Focus, Disabled, Expanded
- Focus: Border #A78BFA, shadow 0 0 0 3px rgba(167,139,250,0.1)
- Disabled: Background #F3F4F6, border #D1D5DB
Expanded menu: Background #FFF, border 1px #D1D5DB, shadow 0 10px 15px rgba(0,0,0,0.1), max-height 300px scroll
Menu items: Padding 10px (H) × 8px (V), hover background #E9D5FF, selected background #E9D5FF + text #6B21A8

### 9. Avatar
Shape: Circle (50% border-radius)
Sizes: Small 32px, Medium 48px, Large 64px, XLarge 80px
Image variant: Object-fit cover, object-position center
Fallback (initials): Background #E9D5FF, text Label Small 12px #6B21A8, center-aligned
Border: 1px solid #E5E7EB
Status indicators (optional): Online (green dot #10B981 bottom-right), offline (gray #9CA3AF)

### 10. Stars / Rating
Size: 24×24px (default), 16px (small), 32px (large)
Color filled: #F59E0B (orange/yellow)
Color empty: #D1D5DB
Gap: 4px between stars
States: Empty, Hover, Selected, Readonly
- Hover: Stars to position filled (muted #FCD34D)
- Selected: Vibrante #F59E0B
- Readonly: Static, no interaction
Keyboard: Arrow keys to select, Enter to confirm

### 11. Chat Bubble
Sent (right-align):
- Background #A78BFA, text #FFF
- Border Radius: 16px (top) × 4px (bottom-right)
- Padding: 12px (H) × 8px (V)
- Max-width: 85%
- Timestamp (Caption, 11px, #9CA3AF) below

Received (left-align):
- Background #E5E7EB, text #1F2937
- Border Radius: 4px (bottom-left) × 16px (top)
- Padding: 12px (H) × 8px (V)
- Max-width: 85%
- Timestamp below

System message: Centered, transparent bg, text #9CA3AF, Body Small

Typing indicator: Three dots animated, color #A78BFA
Read receipts (optional): ✓✓ checkmark (white or dark roxo)

### 12. Timeline
Circle: 16×16px
Line: 2px solid #E5E7EB (vertical)
States per circle:
- Normal: Background #E9D5FF, border #A78BFA
- Active: Background #A78BFA, border 2px #9368F7
- Complete: Background #10B981, icon ✓ #FFF
- Error: Background #EF4444
Text (right of circle): Title Body (14px), description Body Small (12px, #9CA3AF)
Gap circle-to-circle: 16px
Full gap between events: 24px

### 13. Spinner / Loader
Circular (default): 32×32px, stroke 2px
Color: #A78BFA (foreground), #E9D5FF (background ring)
Animation: 360° rotation infinita, 1s per rotation
Sizes: Small 24px, Medium 32px, Large 48px
Linear variant: Height 4px, width 100%, background #E5E7EB, foreground #A78BFA, border-radius 2px
With text (optional): "Carregando..." Body Small (12px) below

### 14. Alert / Banner
Info: Background #DBEAFE, border-left 3px #3B82F6, text #1E40AF, icon ℹ #3B82F6
Error: Background #FEE2E2, border-left 3px #EF4444, text #7F1D1D, icon ! #EF4444
Success: Background #D1FAE5, border-left 3px #10B981, text #065F46, icon ✓ #10B981
Warning: Background #FEF3C7, border-left 3px #F59E0B, text #92400E, icon ! #F59E0B
Padding: 12px (V) × 16px (H)
Border Radius: 4px
Font: Body Small (12px)
Layout: [Icon] Message text [Close X]
Close button: Hover opacity 70%, click dismisses

### 15. Image Upload
Empty state: Border 2px dashed #D1D5DB, background #F9FAFB, padding 24px, icon + (32px, #9CA3AF)
Drag-over: Border #A78BFA dashed, background #E9D5FF
Uploaded: Thumbnail 80×80px, border 1px #E5E7EB, border-radius 8px, delete button X (hover #EF4444)
Error: Background #FEE2E2, text #7F1D1D
States: Empty, Uploading (spinner), Uploaded, Error

### 16. Cronômetro / Timer
Display: 48px Bold font, color #1F2937
Format: HH:MM:SS (regressivo) ou HH:MM (countdown)
Background: #F9FAFB, padding 20px, border-radius 12px
Subtitle: Body Small (12px, #9CA3AF) "Duração do serviço"
Alert (<4h): Text #EF4444
Complete: Text #10B981, icon ✓

### 17. Progress Bar
Height: 4px
Background: #E5E7EB (track)
Foreground: #A78BFA (progress)
Border Radius: 2px
Width: 100%
Label (optional): Body Small (12px) below, "Passo X de Y" format
Complete state: Foreground #10B981, icon ✓
ARIA: role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax

## Componentes Compostos

### Card Pedido/Serviço
Layout: Avatar (40px) + Name + Type/Size + Date + Price + Stars + Button
Padding: 16px, gap 8px
- Avatar: 40px circle left
- Name: Heading 3 (20px)
- Type/Size: Body Small (12px, #9CA3AF)
- Date/Time: Body Small (12px, #9CA3AF)
- Price: Body (14px, bold)
- Rating: Stars 16px (optional)
- Button: Primary or secondary
- Badge (status): Top right

### Card Candidata/Faxineira
Layout: Avatar (48px) + Name + Rating + Distance + Button
- Avatar: 48px circle
- Name: Heading 3 (20px)
- Rating: "★ 4.8 (100 reviews)" Body Small (12px)
- Distance: "2.5 km de você" Body Small (12px, #9CA3AF)
- Button: Primary "Contratar" or "Ver Perfil"
- Padding: 16px, gap 8px

### Input + Label
Layout: Label (top) + Input (middle) + Helper/Error (bottom)
- Label: Body Small (12px, Medium 500), required * #EF4444
- Input: Standard input specs
- Helper text: Caption (11px, #9CA3AF)
- Error text: Caption (11px, #EF4444)
- Gap Label-Input: 4px

### Button com Ícone
Icon (left or right): 16-20px, gap 8px
- Left: [icon] Label
- Right: Label [icon]
Rest: Button standard specs

### Tab Bar (Mobile)
Layout: Horizontal tabs, equal width, flex
Per tab: Icon (24px active, 20px inactive) + Label (Label Small 12px)
Gap: 4px icon-label
Padding: 8px (H) × 12px (V)
- Active: Icon + text #A78BFA, background #E9D5FF subtle
- Inactive: Icon + text #9CA3AF
Border bottom (optional): 2px #A78BFA on active tab
Height: 56px total (common mobile standard)

### Sidebar (Web Admin)
Width: 240px (expanded), 64px (collapsed)
Logo: 40×40px top
Menu items: Icon (20px) + Label (Body 14px), padding 12px (V) × 16px (H)
- Active: Background #E9D5FF, text #6B21A8, border-left 3px #A78BFA
- Inactive: Text #374151, hover #F3F4F6
Divider: 1px #E5E7EB between sections
Bottom: Log out or settings button

## Dark Mode (Optional for Phase 2)

If implementing, use component variants or CSS @media
- Background: #1F2937 → #1A1A1A
- Surface: #111827 → #2D2D2D
- Text: #FFFFFF or #F3F4F6
- Text secondary: #9CA3AF (maintain)
- Primary: #A78BFA (maintain, works on dark)
- Borders: #374151 (dark gray)

## Responsive Breakpoints

- Mobile: <640px (full-width, single-column)
- Tablet: 640-1024px (2-col or collapsible sidebar)
- Desktop: >1024px (sidebar + content, 3-col possible)

Adjust font sizes, padding, heights per breakpoint:
- Mobile button: 44px height, 14px font
- Desktop button: 40px height, 14px font
- Touch targets: 44×44px min (mobile), 40×40px (tablet), 32×32px (desktop)

## Structure

Organize in Figma as:
1. Colors (color styles)
2. Typography (text styles)
3. Effects (shadows)
4. Components (17 base + 7 composites, with variants)
5. Patterns (common layouts: form, list, modal)
6. Usage (do's & don'ts, real-world examples)

## Accessibility

- Contrast: WCAG 2.1 AA (4.5:1 text/background minimum)
- Roxo #A78BFA on white: 3.8:1 (acceptable for non-critical)
- Roxo #6B21A8 on roxo light: 4.8:1 (use for critical text)
- Focus states: Outline 2px #A78BFA, offset 2px
- Touch: 44×44px minimum (mobile)
- Icons: Always paired with text (no color-only states)
- Labels: All inputs must have visible labels
- Alt text: All images described

## Export

Once built, export:
1. Design System tokens (CSS, JSON)
2. Component library (shared library link)
3. Documentation page (usage examples, do's/don'ts)
4. Dark mode variants (if implemented)

Start with the color palette and typography styles, then build out the 17 base components with their variants (primary/secondary/danger, sizes, states). Keep everything modular and reusable. Add the 7 composite components once the base is solid. Include detailed annotations and documentation on each component.
```

---

## Uso

1. Abra Figma
2. Crie um novo arquivo (ou use existente)
3. Abra Claude Designer (ou AI features)
4. Cole o prompt acima completo
5. Claude gerará o design system com todos os componentes
6. Refine cores, tipografia, spacing conforme necessário
7. Publique como biblioteca compartilhada

---

## Alternativa: Prompt Conciso (se quiser passo a passo)

```
Etapa 1: Crie a paleta de cores para Moppy
- Primária: Roxo #A78BFA (e variações dark/light)
- Neutros: Branco, cinzas (#F9FAFB, #E5E7EB, #9CA3AF, #374151, #1F2937)
- Semânticas: Verde #10B981, Vermelho #EF4444, Laranja #F59E0B, Azul #3B82F6
- Crie color styles para cada uma

Etapa 2: Crie a tipografia Inter
- Display 32px Bold
- Heading 1 28px Bold
- Heading 2 24px Bold
- Heading 3 20px Bold
- Body Large 16px Regular
- Body 14px Regular
- Body Small 12px Regular
- Label 14px Medium
- Caption 11px Regular

Etapa 3: Crie componentes base
Comece com: Button (4 variantes), Input, Card, Badge
Inclua todos os estados (normal, hover, active, disabled, loading, focus)

Etapa 4: Crie componentes intermediários
Checkbox, Radio, Modal, Dropdown, Avatar, Stars, Chat Bubble, Timeline, Spinner, Alert

Etapa 5: Crie componentes compostos
Card Pedido, Card Candidata, Input+Label, Tab Bar, Sidebar

Etapa 6: Documente com exemplos de uso (do's & don'ts)

Etapa 7: Publique como shared library
```

---

## Prompts por Tela (Copiáveis para Claude Designer)

### Cliente — Home (2.4)
```
Crie a tela Home do cliente Moppy. Layout: Header "Moppy" com avatar, 
Tab bar (Home/Histórico/Perfil), FAB "+" roxo para criar pedido. 
Corpo: lista de próximos serviços em Cards (data, faxineira, valor, status badge).
Se vazio: ilustração + "Crie seu primeiro pedido". Paleta: branco bg, roxo #7C3AED accent, 
Inter 14px. Touch target 44px mínimo. Dark mode suportado.
```

### Cliente — Criar Pedido (5 Passos, 2.5-2.12)
```
Wizard de 5 passos para criar pedido. Passo 1: Escolher endereço (dropdown + "Novo").
Passo 2: Tipo limpeza (radio buttons: Padrão/Pesada/Roupa). Passo 3: Tamanho (seletor dropdown).
Passo 4: Adicionais (checkboxes). Passo 5: Data/Hora (date/time picker).
Cada passo: progress bar (1/5 → 5/5), botões "Próximo"/"Anterior". 
Cores: roxo #7C3AED, cinza neutro. Input 40px altura. Passo 6: Revisar preço (leitura).
Passo 7: Checkout com escolha de cartão. Paleta Moppy.
```

### Cliente — Candidatas & Escolha (2.13-2.14)
```
Tela de Lista de Candidatas. Header "Candidatas para seu pedido". Cards com avatar 
(60px), nome (Body), nota 1-5 stars (color-coded), distância em km, nº de serviços. 
Ordenação: Default (nota), Distância, Histórico (3 buttons). Card clicável → Detalhe 
Candidata (modal ou slide). Detalhe: avatar grande, bio, avaliações recentes, 
botão "Escolher" (roxo). Paleta Moppy. Card hover gray bg.
```

### Cliente — Chat (2.15)
```
Tela de Chat Cliente ↔ Faxineira. Header: nome da faxineira + status online/offline.
Corpo: mensagens em bubbles (cliente: roxo #7C3AED fundo, faxineira: cinza claro).
Timestamps (Body Small, cinza). Input bar bottom: TextField + send button (roxo).
Aviso fixo: "Pagamento fora do app não tem garantia" (amber alert box).
Dark mode: bubbles inverte contraste, input bg cinza escuro. Acessibilidade: ARIA live region.
```

### Cliente — Confirmação Conclusão (2.17)
```
Modal após serviço concluído. Título: "Está tudo certo?". Resumo: faxineira, 
data, valor, foto da faxineira (100px avatar). Botões: "Sim, confirmo" (verde/roxo), 
"Tive um problema" (vermelho). Se "Sim": vai para Avaliação (2.19). 
Se "Problema": abre Disputa (2.18). Timer 24h opcional na corner. Paleta Moppy.
```

### Cliente — Avaliação (2.19)
```
Modal de Rating pós-serviço. Stars interativas 1-5 (touchable, amarelo quando selecionado).
TextField: "Deixe um comentário (opcional)" (min-height 60px). Botão "Enviar Avaliação" 
(roxo). Validação: stars obrigatório. Feedback: "Obrigado! Sua avaliação foi enviada."
Dark mode: input bg cinza escuro, text branco. WCAG AA contrast.
```

### Faxineira — Feed de Pedidos (3.5)
```
Tela de Feed/Busca de Pedidos. Header: "Buscar Trabalho". Tabs/Filters: Tipo, Tamanho, Data.
Cards (scrollable): bairro + tipo limpeza + tamanho + distância (km) + valor bruto.
Card clicável → Detalhe Pedido (3.6 modal/slide). Vazio state: ilustração + "Nenhum pedido 
na sua região". Pull-to-refresh. Paleta Moppy. Card hover gray. Candidate button (roxo).
```

### Faxineira — Execução (Chegada, 3.9)
```
Tela de Confirmação de Chegada. Cenário 1: Cliente disponível → "Código gerado. 
Digite o código de 4 dígitos". Input numérico 4 chars (auto-format), btn "Confirmar" 
(roxo). Cenário 2: Cliente ausente (10min timeout) → "Tire uma foto + confirme GPS". 
Buttons: "Tirar Foto" (câmera ícone) + "Confirmar Localização" (GPS ícone). Status 
spinner. Erro se GPS fora raio. Paleta Moppy. Touch targets 48px+.
```

### Faxineira — Carteira (3.14)
```
Tela Carteira/Ganhos. Header: "Minha Carteira". Cards: "A Liberar" (roxo bg, valor grande), 
"Disponível" (verde bg, valor grande). Breakdown: Serviços concluídos (number), Comissão app 
(-15%), Taxa Asaas. Botão "Solicitar Saque" (verde) → modal de saque (mín R$20, PIX, 
validação chave). Histórico de saques (table: data, valor, status). Paleta Moppy.
```

### Admin — Dashboard (4.2)
```
Painel Admin Web (Next.js). Header: Logo Moppy + Avatar admin. Grid de KPI Cards (4×2):
"Pedidos Hoje" (number grande), "Receita Mês", "Taxa Conclusão" (%), "Disputas Pendentes".
Sidebar esq: Menu items (Aprovações, Pedidos, Disputas, Financeiro, Preços, Score-P1).
Ativo item: fundo roxo #7C3AED, text branco. Paleta Moppy. Responsivo (sidebar collapse <640px).
Dark mode: bg #1a1a1a, text #f3f4f6, roxo mantém. WCAG AA.
```

### Template (Copiar e Adaptar)
```
[NOME TELA]

Crie a tela [Nome] para Moppy. Layout: [descrição visual]. Componentes: [lista]. 
Estados: [Normal/Hover/Error/etc]. Tipografia: [estilos usados]. 
Paleta: Roxo #7C3AED primária, cinzas neutros, semânticas. 
Touch targets: 44px mínimo mobile. Dark mode: [descrever]. Acessibilidade: WCAG AA.
Reference: [descrição visual rápida].
```

---

## Notas

- **Figma Tokens Plugin:** Sincroniza tokens com código automaticamente
- **Themer Plugin:** Simula dark mode em tempo real
- **Storybook:** Use para documentação de componentes (integra com Figma)
- **Code Connect:** Mapeie componentes Figma para código React (Expo/Next.js)
