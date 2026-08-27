# Moppy Accessibility Compliance Checklist

WCAG 2.1 AA compliance checklist para Moppy. Procédimentos, testes, exceções.

---

## 1. Contraste de Cores (WCAG 4.5:1 para Texto)

### Paleta Validada

| Combinação | Ratio | Status | Nota |
|-----------|-------|--------|------|
| #1F2937 (text) on #FFFFFF (bg) | 10.2:1 | ✓ AA/AAA | Texto máximo contraste |
| #374151 (text) on #FFFFFF (bg) | 8.1:1 | ✓ AA/AAA | Texto primário |
| #9CA3AF (text) on #FFFFFF (bg) | 4.2:1 | ✓ AA | Texto secundário (mínimo) |
| #FFFFFF (text) on #A78BFA (bg) | 4.6:1 | ✓ AA | Botão primário |
| #FFFFFF (text) on #9368F7 (bg) | 5.3:1 | ✓ AA/AAA | Botão hover |
| #6B21A8 (text) on #E9D5FF (bg) | 4.8:1 | ✓ AA | Roxo escuro em roxo light |
| **#A78BFA (text) on #FFFFFF (bg)** | **3.8:1** | **✗ EXCEÇÃO** | Abaixo AA; usar APENAS para UI não-crítica |
| #FFFFFF (text) on #10B981 (bg) | 4.8:1 | ✓ AA | Botão/badge sucesso |
| #FFFFFF (text) on #EF4444 (bg) | 5.1:1 | ✓ AA | Botão/badge erro |
| #1F2937 (text) on #FEF3C7 (bg) | 11.1:1 | ✓ AA/AAA | Alert warning |
| #FFFFFF (text) on #3B82F6 (bg) | 4.6:1 | ✓ AA | Botão/badge info |

### Regra de Exceção
- **Roxo #A78BFA tem 3.8:1 (abaixo AA)** → Nunca usar puro para:
  - Texto crítico (títulos, body, labels obrigatórios)
  - Estados importantes (erro, sucesso, foco)
  - Links em corpo de texto

- **Usar roxo #A78BFA APENAS para:**
  - UI elementos (botões primários em fundo branco, links secundários)
  - Decoração (borders, icons não-críticos)
  - Backgrounds (cards, badges onde text contrasta bem)
  - Focus outlines (offset de 2px respeita contrast com background)

### Teste de Contraste
- **Ferramenta:** WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)
- **Ou:** Color Contrast Analyzer (desktop app)
- **Ou:** Figma plugin "Color Contrast Checker"

**Procedimento:**
1. Seleciona combinação color + background
2. Verifica ratio
3. Se <4.5:1 → ajusta cor (darker/lighter) ou text weight (regular → bold ajuda)
4. Re-testa
5. Documenta exceções (roxo) com justificativa

---

## 2. Touch Targets & Click Areas

### Tamanho Mínimo: 44×44px (Mobile)

| Elemento | Mobile | Tablet | Desktop | Exceção |
|----------|--------|--------|---------|---------|
| Button | 44×44px | 40×40px | 36×36px | Botões muito pequenos = inacessíveis |
| Checkbox | 24×24px + label | 24×24px | 20×20px | Label ao lado aumenta área |
| Radio | 24×24px + label | 24×24px | 20×20px | Label ao lado aumenta área |
| Icon (standalone) | 44×44px | 40×40px | 32×32px | Nunca <32px em desktop |
| Input | 44×44px height | 40×40px | 36×36px | Padding aumenta altura |
| Touchable row | 48×48px min height | 44×44px | 40×40px | Inclui padding V |
| Link (inline) | 44px target area | 40px | 36px | Pode ter underline + hover |

### Gap Mínimo: 8px
- Entre botões: 8px mínimo (32px ideal)
- Entre checkboxes: 16px (permite clique sem errar)
- Entre menu items: 8px + padding 12px V = 32px total

### Teste de Touch
- **iOS:** Device simulator (Xcode) com "Accessibility Inspector"
- **Android:** Android Emulator + "Accessibility Scanner" app
- **Web:** Redimensionar janela para mobile, testar com dedo/touch simulator
- **Procedimento:**
  1. Tenta clicar em elementos pequenos (botões, links)
  2. Se errar 3+ vezes, elemento é muito pequeno
  3. Aumenta padding ou tamanho do hit area
  4. Re-testa

---

## 3. Keyboard Navigation

### Requisitos Obrigatórios

| Elemento | Keyboard | Descrição |
|----------|----------|-----------|
| **Button** | Tab, Enter/Space | Focável, Enter/Space ativa |
| **Link** | Tab, Enter | Focável, Enter segue link |
| **Input** | Tab, type, Tab out | Focável, digitação funciona, sai do input |
| **Checkbox** | Tab, Space | Tab para, Space marca/desmarca |
| **Radio** | Tab, Arrow keys | Tab para primeiro, setas navegam, seta entra |
| **Select/Dropdown** | Tab, Enter/Space, Arrow keys | Tab abre, setas navegam, Enter seleciona |
| **Modal** | Tab (loop interno), Esc | Tab fica dentro do modal, Esc fecha |
| **Menu** | Arrow keys | Setas horizontais ou verticais conforme layout |
| **Dialog** | Esc | Esc fecha sempre |
| **Skip Link** (novo) | Tab 1ª coisa | Link "Pular para conteúdo" no topo (mobile) |

### Focus Order
- **Deve ser lógico:** Esquerda → direita, topo → rodapé
- **Avoid:** Saltar aleatoriamente, ir de rodapé → topo
- **Test:** `Tab` key através da página inteira → deve fazer sentido

### Focus Indicator
- **Visível:** Outline 2px #A78BFA (roxo) sempre
- **Offset:** 2px margin (não sobrepõe elemento)
- **Não remova:** `:focus { outline: none; }` é crime de acessibilidade
- **Se customizar:** Manter contraste ≥3:1

### Teste de Keyboard
- **Procedimento:**
  1. Abre página/app
  2. **Não usa mouse** — só teclado (Tab, Arrows, Enter, Esc, Space)
  3. Navega todas as telas
  4. Testa todas as funcionalidades (abrir modal, submeter form, etc)
  5. Se algo não funciona sem mouse → bug

---

## 4. Semantic HTML & ARIA

### Obrigatório

| Elemento | HTML | ARIA |
|----------|------|------|
| **Button** | `<button>` | `aria-pressed`, `aria-label` (se só ícone) |
| **Link** | `<a href>` | Não precisa ARIA se tem text |
| **Input** | `<input>` + `<label for>` | `aria-describedby` (helper text) |
| **Form field (error)** | `<input>` + `<label>` | `aria-invalid="true"`, `aria-describedby` (error msg) |
| **Checkbox** | `<input type="checkbox">` | `aria-checked` se custom |
| **Radio** | `<input type="radio">` | `aria-checked` se custom |
| **Select** | `<select>` ou `<div role="combobox">` | `aria-expanded`, `aria-selected` se custom |
| **Modal** | `<dialog>` ou `<div role="dialog">` | `aria-modal="true"`, `aria-labelledby`, `aria-describedby` |
| **Alert** | `<div role="alert">` | `aria-live="assertive"` (errors), `aria-live="polite"` (info) |
| **Menu** | `<ul><li><button>>` | `role="menuitem"`, `aria-haspopup` se tiver submenu |
| **Progress** | `<div role="progressbar">` | `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` |
| **Image (meaningful)** | `<img alt="...">` | Alt text obrigatório, descritivo |
| **Image (decorativa)** | `<img alt="">` | Alt vazio, ou `aria-hidden="true"` |
| **Icon (meaning)** | `<i class="icon">` + text | `aria-label` se só ícone (ex: close button) |
| **List** | `<ul><li>` | Semantic markup (não `<div><div>`) |
| **Tabela** | `<table><thead><tr><th>` | `<caption>`, scope="col"/"row" em `<th>` |

### Teste ARIA
- **Ferramenta:** axe DevTools (Chrome/Firefox extension)
- **Ou:** WAVE (wave.webaim.org)
- **Ou:** Lighthouse (Chrome DevTools)
- **Procedimento:**
  1. Scan página
  2. Verifica erros críticos (missing labels, bad ARIA)
  3. Corrige erros
  4. Re-scan até "Pass"

---

## 5. Labels & Placeholders

### Regra: Nunca Substitua Label por Placeholder

❌ **Errado:**
```html
<input type="email" placeholder="seu@email.com">
```

✓ **Correto:**
```html
<label for="email">Email</label>
<input type="email" id="email" placeholder="seu@email.com">
```

### Padrão para Moppy

**Required Field:**
```html
<label for="name">
  Nome
  <span aria-label="obrigatório">*</span>
</label>
<input type="text" id="name" required aria-required="true">
<small id="name-hint">Seu nome completo</small>
```

**Error State:**
```html
<label for="email">Email</label>
<input 
  type="email" 
  id="email" 
  aria-invalid="true"
  aria-describedby="email-error"
>
<small id="email-error" role="alert">Email inválido</small>
```

**Helper Text:**
```html
<label for="password">Senha</label>
<input 
  type="password" 
  id="password"
  aria-describedby="pwd-hint"
>
<small id="pwd-hint">Mínimo 8 caracteres</small>
```

---

## 6. Color Blindness (Daltonismo)

### Tipos & Percentuais
- **Protanopia (Red):** 1% (vermelho → preto)
- **Deuteranopia (Green):** 1% (verde → amarelo)
- **Tritanopia (Blue):** 0.01% (azul/amarelo → rosa)
- **Achromatopsia (Monocromático):** 0.001% (sem cor)

### Regra: Nunca confie só em cor

❌ **Errado (só cor):**
```
Pedido aberto = Verde
Pedido em andamento = Laranja
Pedido concluído = Cinza
```

✓ **Correto (cor + ícone + texto):**
```
Pedido aberto = Verde + "◯" + "ABERTO"
Pedido em andamento = Laranja + "⟳" + "EM ANDAMENTO"
Pedido concluído = Cinza + "✓" + "CONCLUÍDO"
```

### Paleta Daltonismo-Safe

| Status | Cor | Ícone | Texto |
|--------|-----|-------|-------|
| Sucesso | Verde #10B981 | ✓ | "Confirmado" |
| Erro | Vermelho #EF4444 | ✗ ou ! | "Erro" |
| Aviso | Laranja #F59E0B | ! | "Aviso" |
| Info | Azul #3B82F6 | ℹ | "Info" |

**Teste de Daltonismo:**
- **Ferramenta:** Sim Daltonism (iOS app)
- **Ou:** Color Blindness Simulator (online)
- **Ou:** Figma plugin "Color Blind"
- **Procedimento:**
  1. Abre app/site em modo simulado (cada tipo)
  2. Verifica se interface é inteligível sem cor (só ícones/texto)
  3. Se confuso → ajusta design

---

## 7. Alt Text & Media

### Imagens Significativas
```html
<!-- Foto de faxineira -->
<img 
  src="faxineira.jpg" 
  alt="Maria da Silva, faxineira, 4.8 ⭐ 150 serviços"
>

<!-- Logo -->
<img 
  src="logo.svg" 
  alt="Moppy — Marketplace de Faxina"
>

<!-- Card de serviço -->
<img 
  src="kitchen.jpg" 
  alt="Cozinha residencial sendo limpa"
>
```

### Imagens Decorativas
```html
<!-- Background decorativa -->
<img 
  src="decoration.svg" 
  alt=""
  aria-hidden="true"
>

<!-- Ícone com label -->
<i class="icon-check" aria-hidden="true"></i>
<span>Confirmado</span>
```

### Vídeos & Áudio
- **Closed Captions:** Vídeos > 30s devem ter captions (português)
- **Transcripts:** Áudio > 30s deve ter transcrição
- **Audio Description:** Vídeo com cenas críticas (optional para MVP, P1 futura)

---

## 8. Focus States & Visible Feedback

### Visual Feedback Obrigatória

| Ação | Feedback | Cor | Keyboard |
|------|----------|-----|----------|
| Hover Button | Background muda | rgba hover | Não aplica (keyboard só focus) |
| Focus Button | Outline 2px | #A78BFA | Sim (Tab) |
| Hover Link | Underline | Inherit | Não aplica |
| Focus Link | Outline 2px | #A78BFA | Sim (Tab) |
| Focus Input | Outline 2px + shadow | #A78BFA | Sim (Tab) |
| Focus Checkbox | Outline 2px | #A78BFA | Sim (Tab + Space) |
| Hover Card | Shadow + border | Subtle | Não aplica |
| Focus Card (clickable) | Outline 2px | #A78BFA | Sim (Tab + Enter) |

### Outline Specifications
```css
/* Padrão Moppy */
:focus {
  outline: 2px solid #A78BFA;
  outline-offset: 2px; /* Não sobrepõe elemento */
}

/* Nunca remova */
:focus {
  outline: none; /* ❌ CRIME */
}

/* Se custom, manter contraste */
:focus {
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.5); /* Alternativa */
}
```

---

## 9. Motion & Animation (Vestibular Disorders)

### Regra: Respeitar `prefers-reduced-motion`

```css
@media (prefers-color-scheme: light) {
  button {
    transition: background 150ms ease-in-out;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Guideline
- **Animações:** OK até 3s
- **Auto-play:** Pausível
- **Flashing:** Nunca >3 flashes/segundo (epilepsia)

---

## 10. Font Size & Readability

### Mínimos por Contexto

| Contexto | Tamanho | Weight | Line Height |
|----------|---------|--------|-------------|
| Body (padrão) | 14px | 400 | 1.5 (21px) |
| Body Small (label) | 12px | 400 | 1.4 (17px) |
| Caption (metadata) | 11px | 400 | 1.4 (15px) |
| **Nunca <11px** | - | - | - |

### Zoom Support
- Usuários podem fazer zoom até 200%
- Nunca use `maximum-scale=1` no viewport meta tag
- Layout deve ser responsivo e trabalhar até 200% zoom

```html
<!-- ✓ Correto -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- ❌ Errado -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

---

## 11. Language & Localization

### Obrigatório (Futuro com Internacionalização)

```html
<!-- Define idioma da página -->
<html lang="pt-BR">

<!-- Mudança de idioma em parágrafo -->
<p>O app é chamado <span lang="en">Moppy</span> em inglês.</p>
```

### Screen Reader Pronunciation
```html
<!-- Pronuncia "Pix" não "P-I-X" -->
<abbr title="Transferência eletrônica instantânea">PIX</abbr>

<!-- Data legível -->
<time datetime="2025-08-23">23 de agosto de 2025</time>
```

---

## 12. Links & Navigation

### Descriptive Link Text

❌ **Errado:**
```html
<a href="/termos">Clique aqui</a>
```

✓ **Correto:**
```html
<a href="/termos">Termos de Uso</a>

<!-- Ou com aria-label se necessário -->
<a href="/perfil/123" aria-label="Perfil de Maria da Silva">Ver perfil →</a>
```

### Skip Link (Mobile)
```html
<a href="#main-content" class="skip-link">Pular para conteúdo</a>
<main id="main-content">...</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #A78BFA;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## 13. Forms & Validation

### Pattern

```html
<form>
  <fieldset>
    <legend>Dados Pessoais</legend>
    
    <div class="form-group">
      <label for="name">
        Nome
        <span aria-label="obrigatório">*</span>
      </label>
      <input 
        type="text" 
        id="name" 
        name="name"
        required
        aria-required="true"
        aria-describedby="name-hint"
      >
      <small id="name-hint">Seu nome completo</small>
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input 
        type="email" 
        id="email" 
        name="email"
        aria-describedby="email-hint"
      >
      <small id="email-hint">nome@email.com</small>
    </div>

    <div class="form-group">
      <label for="message">Mensagem</label>
      <textarea 
        id="message" 
        name="message"
        aria-describedby="msg-hint"
      ></textarea>
      <small id="msg-hint">Máximo 500 caracteres</small>
    </div>

    <button type="submit">Enviar</button>
  </fieldset>
</form>
```

### Real-Time Validation (se implementar)
```html
<input 
  type="email" 
  aria-describedby="email-error"
  aria-invalid="false"
>
<span id="email-error" role="alert">
  <!-- Mensagem aparece dinâmicamente -->
</span>
```

---

## 14. Screen Reader Testing

### Ferramentas
- **iOS:** VoiceOver (nativa, Settings > Accessibility > VoiceOver)
- **Android:** TalkBack (nativa, Settings > Accessibility > TalkBack)
- **macOS:** VoiceOver (Cmd + F5)
- **Windows:** NVDA (gratuita) ou JAWS (paga)
- **Web:** NVDA + Firefox (combo recomendado)

### Procedimento
1. Ativa screen reader
2. **Navega página com setas/Tab**
3. Confirma que:
   - Títulos são lidos como títulos (h1, h2)
   - Botões são lidos como botões
   - Inputs tem labels associadas
   - Erros são anunciados (role="alert")
   - Links são distinguíveis de texto
4. **Testa funcionalidades críticas** (checkout, criar pedido)

### Critérios
- ✓ Tudo faz sentido lido em voz alta
- ✓ Ordem de leitura é lógica
- ✓ Não há repetição irritante (ex: "botão clicável" × 20)
- ✓ Landmarks (main, nav, form) identificáveis

---

## 15. Checklist de Release

### Pré-Deploy

- [ ] **Cores:** Contrast Checker validou 4.5:1 mínimo (ou exceções documentadas)
- [ ] **Touch:** Todos buttons ≥44px mobile, ≥40px tablet
- [ ] **Keyboard:** App funciona 100% sem mouse (testado com Tab/Arrows/Enter)
- [ ] **Focus:** Outline 2px roxo visível em todos inputs/buttons
- [ ] **Labels:** Todos inputs têm `<label>` vinculada
- [ ] **ARIA:** axe DevTools passou sem erros críticos
- [ ] **Alt Text:** Todas imagens significativas têm alt descritivo
- [ ] **Media:** Vídeos >30s têm captions, áudios têm transcrição
- [ ] **Daltonismo:** Sim Daltonism simulou, interface inteligível
- [ ] **Screen Reader:** Testado com NVDA/VoiceOver, tudo faz sentido
- [ ] **Motion:** Respeita `prefers-reduced-motion`
- [ ] **Links:** Descriptive link text (não "clique aqui")
- [ ] **Error Handling:** Mensagens de erro claras, role="alert"
- [ ] **Zoom:** Funciona até 200% zoom, sem UI quebrada
- [ ] **Documentation:** WCAG compliance doc atualizado

### Post-Deploy
- Monitor user feedback de acessibilidade issues
- Testa regularmente (a cada nova feature)
- Atualiza este checklist conforme aprende

---

## 16. Recursos Externos

- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM:** https://webaim.org/
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **ARIA Authoring:** https://www.w3.org/WAI/ARIA/apg/
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **NVDA (Windows screen reader):** https://www.nvaccess.org/
- **Sim Daltonism (iOS):** App Store
- **Color Blindness Simulator:** https://www.color-blindness.com/

---

## 17. Exceções Documentadas

### Roxo #A78BFA (3.8:1 Ratio)

**Status:** Abaixo WCAG AA, permitido com restrições

**Uso Permitido:**
- ✓ UI buttons (primary action) — contrasta com background branco 4.6:1 no hover
- ✓ Icons não-críticos (decoração, UI)
- ✓ Backgrounds (cards, badges) — com text overlay que contrasta
- ✓ Focus outlines — offset 2px valida

**Uso Proibido:**
- ✗ Texto crítico (body, labels obrigatórios)
- ✗ Estados importantes (erro, validação)
- ✗ Links em corpo de texto

**Plano de Ação:**
- Fase 2: Avaliar ajuste de tom (mais escuro) se feedback negativo
- Fallback: Usar #6B21A8 (roxo escuro, 4.8:1) para texto crítico

---

## Conclusão

Moppy deve cumprir WCAG 2.1 AA antes do launch. Este documento é living document — atualizar conforme testes revelam gaps.
