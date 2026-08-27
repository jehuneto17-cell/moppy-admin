# Moppy Design Tokens — Code Export

Design tokens em formatos prontos para colar em Expo (React Native), Next.js e Tailwind CSS.

---

## 1. CSS Variables

Copie para seu arquivo principal (ex: `globals.css`, `app.css`):

```css
/* ==================== COLORS ==================== */

/* Primary */
:root {
  --color-primary: #A78BFA;
  --color-primary-dark: #9368F7;
  --color-primary-darker: #7C3AED;
  --color-primary-light: #E9D5FF;
  --color-primary-very-dark: #6B21A8;

  /* Semantics */
  --color-success: #10B981;
  --color-success-light: #D1FAE5;
  --color-error: #EF4444;
  --color-error-light: #FEE2E2;
  --color-warning: #F59E0B;
  --color-warning-light: #FEF3C7;
  --color-info: #3B82F6;
  --color-info-light: #DBEAFE;

  /* Neutrals */
  --color-white: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-border: #E5E7EB;
  --color-text-secondary: #9CA3AF;
  --color-text-primary: #374151;
  --color-text-maximum: #1F2937;
  --color-text-disabled: #D1D5DB;
  --color-surface-hover: #F3F4F6;
  --color-surface-secondary: #E5E7EB;

  /* ==================== TYPOGRAPHY ==================== */

  --font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-family-fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Font Sizes */
  --font-size-display: 32px;
  --font-size-h1: 28px;
  --font-size-h2: 24px;
  --font-size-h3: 20px;
  --font-size-body-large: 16px;
  --font-size-body: 14px;
  --font-size-body-small: 12px;
  --font-size-label: 14px;
  --font-size-label-small: 12px;
  --font-size-caption: 11px;

  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-display: 1.2;
  --line-height-h1: 1.3;
  --line-height-h2: 1.3;
  --line-height-h3: 1.4;
  --line-height-body-large: 1.5;
  --line-height-body: 1.5;
  --line-height-body-small: 1.4;
  --line-height-label: 1.4;
  --line-height-caption: 1.4;

  /* Letter Spacing */
  --letter-spacing-display: -0.5px;
  --letter-spacing-h1: -0.25px;
  --letter-spacing-default: 0;

  /* ==================== SPACING ==================== */

  --space-xs: 4px;
  --space-s: 8px;
  --space-m: 12px;
  --space-l: 16px;
  --space-xl: 20px;
  --space-2xl: 24px;
  --space-3xl: 32px;
  --space-4xl: 48px;

  /* ==================== BORDER RADIUS ==================== */

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius: 8px;
  --radius-lg: 12px;
  --radius-round: 50%;

  /* ==================== SHADOWS ==================== */

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1);

  /* ==================== TRANSITIONS ==================== */

  --transition-fast: 50ms ease-in-out;
  --transition-default: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-modal: 150ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
}

/* ==================== TEXT STYLES ==================== */

.text-display {
  font-family: var(--font-family);
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-display);
  letter-spacing: var(--letter-spacing-display);
}

.text-h1 {
  font-family: var(--font-family);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-h1);
  letter-spacing: var(--letter-spacing-h1);
}

.text-h2 {
  font-family: var(--font-family);
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-h2);
}

.text-h3 {
  font-family: var(--font-family);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-h3);
}

.text-body-large {
  font-family: var(--font-family);
  font-size: var(--font-size-body-large);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-body-large);
}

.text-body {
  font-family: var(--font-family);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-body);
}

.text-body-small {
  font-family: var(--font-family);
  font-size: var(--font-size-body-small);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-body-small);
}

.text-label {
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-label);
}

.text-label-small {
  font-family: var(--font-family);
  font-size: var(--font-size-label-small);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-label);
}

.text-caption {
  font-family: var(--font-family);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-caption);
}

/* ==================== COMPONENT UTILITIES ==================== */

.button-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-l) var(--space-l) var(--space-m);
  border-radius: var(--radius);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-default);
}

.button-primary:hover {
  background-color: var(--color-primary-dark);
}

.button-primary:active {
  background-color: var(--color-primary-darker);
}

.button-primary:disabled {
  background-color: var(--color-text-disabled);
  color: var(--color-text-secondary);
  opacity: 50%;
  cursor: not-allowed;
}

.button-primary:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.button-secondary {
  background-color: var(--color-surface-hover);
  color: var(--color-text-maximum);
  border: 1px solid var(--color-text-disabled);
  padding: var(--space-l) var(--space-l) var(--space-m);
  border-radius: var(--radius);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--transition-default);
}

.button-secondary:hover {
  background-color: var(--color-surface-secondary);
}

.button-danger {
  background-color: var(--color-error);
  color: var(--color-white);
  padding: var(--space-l) var(--space-l) var(--space-m);
  border-radius: var(--radius);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-default);
}

.button-danger:hover {
  background-color: #DC2626;
}

.input-field {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-m) var(--space-l);
  font-size: var(--font-size-body);
  font-family: var(--font-family);
  color: var(--color-text-maximum);
  transition: border-color var(--transition-default);
}

.input-field:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
}

.input-field:disabled {
  background-color: var(--color-surface-hover);
  border-color: var(--color-border);
  color: var(--color-text-disabled);
}

.input-field.error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-l);
  box-shadow: var(--shadow-sm);
  transition: border-color var(--transition-default), box-shadow var(--transition-default);
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.badge {
  display: inline-block;
  background-color: var(--color-primary-light);
  color: var(--color-primary-very-dark);
  padding: 4px var(--space-m);
  border-radius: 12px;
  font-size: var(--font-size-label-small);
  font-weight: var(--font-weight-medium);
}

.badge.success {
  background-color: var(--color-success-light);
  color: #065F46;
}

.badge.error {
  background-color: var(--color-error-light);
  color: #7F1D1D;
}

.badge.warning {
  background-color: var(--color-warning-light);
  color: #92400E;
}

.badge.info {
  background-color: var(--color-info-light);
  color: #1E40AF;
}
```

---

## 2. JavaScript / TypeScript Constants

Para uso em Expo/React Native ou Next.js:

```javascript
// tokens.js or tokens.ts

export const colors = {
  primary: '#A78BFA',
  primaryDark: '#9368F7',
  primaryDarker: '#7C3AED',
  primaryLight: '#E9D5FF',
  primaryVeryDark: '#6B21A8',

  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  white: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',
  textSecondary: '#9CA3AF',
  textPrimary: '#374151',
  textMaximum: '#1F2937',
  textDisabled: '#D1D5DB',
  surfaceHover: '#F3F4F6',
  surfaceSecondary: '#E5E7EB',
};

export const typography = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',

  sizes: {
    display: 32,
    h1: 28,
    h2: 24,
    h3: 20,
    bodyLarge: 16,
    body: 14,
    bodySmall: 12,
    label: 14,
    labelSmall: 12,
    caption: 11,
  },

  weights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },

  lineHeights: {
    display: 1.2,
    h1: 1.3,
    h2: 1.3,
    h3: 1.4,
    bodyLarge: 1.5,
    body: 1.5,
    bodySmall: 1.4,
    label: 1.4,
    caption: 1.4,
  },

  letterSpacing: {
    display: -0.5,
    h1: -0.25,
    default: 0,
  },
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
};

export const radius = {
  sm: 4,
  md: 6,
  default: 8,
  lg: 12,
  round: '50%',
};

export const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 20px 25px rgba(0, 0, 0, 0.15)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)',
};

export const transitions = {
  fast: '50ms ease-in-out',
  default: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  modal: '150ms ease-in-out',
  slow: '300ms ease-in-out',
};

// Usage Example (React)
import { colors, typography, spacing } from './tokens';

const Button = () => (
  <button
    style={{
      backgroundColor: colors.primary,
      color: colors.white,
      padding: `${spacing.m}px ${spacing.l}px`,
      fontSize: typography.sizes.label,
      fontWeight: typography.weights.medium,
    }}
  >
    Click Me
  </button>
);
```

---

## 3. JSON Export

Salve como `tokens.json` para sincronizar com Figma/Design Tokens:

```json
{
  "colors": {
    "primary": "#A78BFA",
    "primaryDark": "#9368F7",
    "primaryDarker": "#7C3AED",
    "primaryLight": "#E9D5FF",
    "primaryVeryDark": "#6B21A8",
    "success": "#10B981",
    "successLight": "#D1FAE5",
    "error": "#EF4444",
    "errorLight": "#FEE2E2",
    "warning": "#F59E0B",
    "warningLight": "#FEF3C7",
    "info": "#3B82F6",
    "infoLight": "#DBEAFE",
    "white": "#FFFFFF",
    "surface": "#F9FAFB",
    "border": "#E5E7EB",
    "textSecondary": "#9CA3AF",
    "textPrimary": "#374151",
    "textMaximum": "#1F2937",
    "textDisabled": "#D1D5DB",
    "surfaceHover": "#F3F4F6",
    "surfaceSecondary": "#E5E7EB"
  },
  "typography": {
    "fontFamily": "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    "sizes": {
      "display": 32,
      "h1": 28,
      "h2": 24,
      "h3": 20,
      "bodyLarge": 16,
      "body": 14,
      "bodySmall": 12,
      "label": 14,
      "labelSmall": 12,
      "caption": 11
    },
    "weights": {
      "regular": 400,
      "medium": 500,
      "bold": 700
    },
    "lineHeights": {
      "display": 1.2,
      "h1": 1.3,
      "h2": 1.3,
      "h3": 1.4,
      "bodyLarge": 1.5,
      "body": 1.5,
      "bodySmall": 1.4,
      "label": 1.4,
      "caption": 1.4
    }
  },
  "spacing": {
    "xs": 4,
    "s": 8,
    "m": 12,
    "l": 16,
    "xl": 20,
    "2xl": 24,
    "3xl": 32,
    "4xl": 48
  },
  "radius": {
    "sm": 4,
    "md": 6,
    "default": 8,
    "lg": 12,
    "round": "50%"
  },
  "shadows": {
    "sm": "0 1px 3px rgba(0, 0, 0, 0.1)",
    "md": "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
    "lg": "0 20px 25px rgba(0, 0, 0, 0.15)",
    "xl": "0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)"
  }
}
```

---

## 4. Tailwind CSS Config

Para projetos Next.js using Tailwind:

```javascript
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A78BFA',
          dark: '#9368F7',
          darker: '#7C3AED',
          light: '#E9D5FF',
          'very-dark': '#6B21A8',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
        },
        surface: {
          DEFAULT: '#F9FAFB',
          hover: '#F3F4F6',
          secondary: '#E5E7EB',
        },
        text: {
          primary: '#374151',
          secondary: '#9CA3AF',
          maximum: '#1F2937',
          disabled: '#D1D5DB',
        },
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      fontSize: {
        display: ['32px', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        h1: ['28px', { lineHeight: '1.3', letterSpacing: '-0.25px' }],
        h2: ['24px', { lineHeight: '1.3' }],
        h3: ['20px', { lineHeight: '1.4' }],
        'body-lg': ['16px', { lineHeight: '1.5' }],
        body: ['14px', { lineHeight: '1.5' }],
        'body-sm': ['12px', { lineHeight: '1.4' }],
        label: ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '1.3' }],
        caption: ['11px', { lineHeight: '1.4' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        bold: '700',
      },
      spacing: {
        xs: '4px',
        s: '8px',
        m: '12px',
        l: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '48px',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '12px',
        round: '50%',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        lg: '0 20px 25px rgba(0, 0, 0, 0.15)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        fast: '50ms',
        default: '150ms',
        slow: '300ms',
      },
    },
  },
  plugins: [],
};
```

**Uso em Tailwind:**
```jsx
// Componente Next.js
export default function Button() {
  return (
    <button className="bg-primary text-white px-l py-m rounded font-medium hover:bg-primary-dark focus:outline focus:outline-2 focus:outline-primary focus:outline-offset-2">
      Click Me
    </button>
  );
}
```

---

## 5. React Native (Expo) StyleSheet

Para apps mobile Expo:

```javascript
// theme.ts ou tokens.native.ts

import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#A78BFA',
  primaryDark: '#9368F7',
  primaryDarker: '#7C3AED',
  primaryLight: '#E9D5FF',
  primaryVeryDark: '#6B21A8',
  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  white: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',
  textSecondary: '#9CA3AF',
  textPrimary: '#374151',
  textMaximum: '#1F2937',
  textDisabled: '#D1D5DB',
};

export const typography = {
  fontFamily: 'Inter',
  sizes: {
    display: 32,
    h1: 28,
    h2: 24,
    h3: 20,
    bodyLarge: 16,
    body: 14,
    bodySmall: 12,
    label: 14,
    labelSmall: 12,
    caption: 11,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
};

export const radius = {
  sm: 4,
  md: 6,
  default: 8,
  lg: 12,
};

export const styles = StyleSheet.create({
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.default,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    color: colors.white,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.medium,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderRadius: radius.default,
    borderWidth: 1,
    borderColor: colors.textDisabled,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    color: colors.textMaximum,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.medium,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.default,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.l,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    fontSize: typography.sizes.body,
    color: colors.textMaximum,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: spacing.m,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.primaryVeryDark,
    fontSize: typography.sizes.labelSmall,
    fontWeight: typography.weights.medium,
  },
  textDisplay: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    color: colors.textMaximum,
  },
  textH1: {
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    color: colors.textMaximum,
  },
  textH2: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.textMaximum,
  },
  textH3: {
    fontSize: typography.sizes.h3,
    fontWeight: typography.weights.bold,
    color: colors.textMaximum,
  },
  textBody: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.regular,
    color: colors.textPrimary,
  },
  textBodySmall: {
    fontSize: typography.sizes.bodySmall,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
  textCaption: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
});

// Usage Example (Expo)
import { View, Text, Pressable } from 'react-native';
import { colors, styles } from './theme';

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.buttonPrimary} onPress={onPress}>
      <Text style={styles.buttonPrimaryText}>{label}</Text>
    </Pressable>
  );
}
```

---

## 6. Como Usar

### Web (Next.js)
1. Copie CSS variables para `globals.css` ou `app.css`
2. Importe em componentes ou use classes `.button-primary`, `.card`, etc
3. Ou use `tailwind.config.js` para Tailwind classes

### Mobile (Expo)
1. Copie `theme.ts` para seu projeto
2. Importe `styles` e use em componentes:
   ```jsx
   import { styles } from '../theme';
   <View style={styles.buttonPrimary} />
   ```
3. Ou use `colors` e `spacing` diretamente:
   ```jsx
   <View style={{ backgroundColor: colors.primary, padding: spacing.l }} />
   ```

### Sync com Figma (Opcional)
1. Use **Figma Tokens Plugin**
2. Aponte para `tokens.json`
3. Plugin sincroniza tokens entre Figma e código automaticamente

---

## 7. Dark Mode (Futura Implementação)

Se implementar dark mode (Fase 2), criar arquivo separado:

```css
/* dark-theme.css */

@media (prefers-color-scheme: dark) {
  :root {
    --color-white: #1A1A1A;
    --color-surface: #2D2D2D;
    --color-border: #374151;
    --color-text-secondary: #9CA3AF;
    --color-text-primary: #F3F4F6;
    --color-text-maximum: #FFFFFF;
    --color-primary: #A78BFA; /* Mantém mesmo em dark */
  }
}
```

Ou em JavaScript:
```javascript
// Hook para dark mode (React)
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDark = () => setIsDark(!isDark);
  return { isDark, toggleDark };
}

// Aplicar:
<div style={{ backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }}>
  Content
</div>
```

---

## Referências

- **CSS Variables:** https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Tailwind Config:** https://tailwindcss.com/docs/theme
- **Figma Tokens Plugin:** https://www.figma.com/community/plugin/843461159747178978/Figma-Tokens
- **React Native Styling:** https://reactnative.dev/docs/stylesheet
