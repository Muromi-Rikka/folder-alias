---
name: unimport
description: Auto-import APIs in modules
---

# Unimport

Unimport provides utilities for automatically importing APIs in modules, reducing boilerplate and improving developer experience.

## Usage

### Auto-Import Setup

```typescript
import { createUnimport } from 'unimport'

const { injectImports } = createUnimport({
  imports: [
    { name: 'ref', from: 'vue' },
    { name: 'computed', from: 'vue' },
    { name: 'useState', from: '#app' },
  ]
})
```

### Transform Code

```typescript
const code = `
const count = ref(0)
const doubled = computed(() => count.value * 2)
`

const transformed = injectImports(code)
// Automatically adds imports at the top
```

### Presets

```typescript
import { createUnimport, presetUno } from 'unimport'

const { injectImports } = createUnimport({
  presets: [
    presetUno(), // UnoCSS auto-imports
  ]
})
```

## Key Points

- Auto-imports: Automatically add imports
- Presets: Built-in presets for popular libraries
- Type-safe: Full TypeScript support
- Configurable: Custom import mappings
- Build-time: Works at build time

<!--
Source references:
- https://github.com/unjs/unimport
-->
