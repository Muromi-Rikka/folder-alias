---
name: theme-colors
description: Easily generate color shades for themes
---

# Theme-colors

Theme-colors makes it easy to generate color shades for themes, creating consistent color palettes from base colors.

## Usage

### Generate Shades

```typescript
import { generateThemeColors } from 'theme-colors'

const colors = generateThemeColors({
  primary: '#3b82f6',
  secondary: '#8b5cf6',
})
```

### Custom Shades

```typescript
const colors = generateThemeColors({
  primary: '#3b82f6',
}, {
  shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
})
```

### CSS Variables

```typescript
import { generateCSSVariables } from 'theme-colors'

const css = generateCSSVariables({
  primary: '#3b82f6',
})
// Generates CSS custom properties
```

## Key Points

- Easy: Simple API for color generation
- Consistent: Creates consistent color palettes
- Flexible: Custom shade ranges
- CSS: Generates CSS variables
- Type-safe: Full TypeScript support

<!--
Source references:
- https://github.com/unjs/theme-colors
-->
