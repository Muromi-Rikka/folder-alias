---
name: jiti
description: Runtime TypeScript and ESM support for Node.js
---

# Jiti

Jiti provides runtime TypeScript and ESM support for Node.js, allowing you to require/import TypeScript files and ESM modules directly.

## Usage

### Require TypeScript Files

```typescript
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url)

const config = jiti('./config.ts')
// Automatically compiles TypeScript
```

### Import ESM in CommonJS

```typescript
const jiti = createJiti(__filename, {
  esmResolve: true,
})

const module = jiti('./esm-module.mjs')
```

### Custom Transform

```typescript
const jiti = createJiti(import.meta.url, {
  transform: (code) => {
    // Custom transformation
    return code
  },
})
```

### Cache Options

```typescript
const jiti = createJiti(import.meta.url, {
  cache: true,
  cacheDir: '.jiti',
})
```

## Key Points

- TypeScript: Runtime TypeScript compilation
- ESM: ESM support in CommonJS
- Fast: Caching for performance
- Type-safe: Full TypeScript support
- Flexible: Custom transforms and options

<!--
Source references:
- https://github.com/unjs/jiti
-->
