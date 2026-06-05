---
name: fontaine
description: Automatic font fallback based on font metrics
---

# Fontaine

Fontaine automatically generates font fallback CSS based on font metrics, improving performance and reducing layout shift.

## Usage

### Generate Font Fallback

```typescript
import { generateFontFallback } from 'fontaine'

const fallback = await generateFontFallback({
  fontFamily: 'Inter',
  fallbacks: ['system-ui', 'sans-serif'],
})
```

### CSS Generation

```typescript
const css = generateFontFallback({
  fontFamily: 'Inter',
  fallbacks: ['system-ui'],
  metrics: {
    capHeight: 1356,
    ascent: 1638,
    descent: -410,
    lineGap: 0,
    unitsPerEm: 2048,
  },
})
```

### Vite Plugin

```typescript
import { fontaine } from 'fontaine/vite'

export default {
  plugins: [
    fontaine({
      fallbacks: ['system-ui'],
    }),
  ],
}
```

## Key Points

- Automatic: Generates fallback CSS automatically
- Metrics-based: Uses font metrics for accurate fallbacks
- Performance: Reduces layout shift
- Type-safe: Full TypeScript support
- Framework-agnostic: Works with any framework

<!--
Source references:
- https://github.com/unjs/fontaine
-->
