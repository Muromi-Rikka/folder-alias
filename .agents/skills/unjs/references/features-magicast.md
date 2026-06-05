---
name: magicast
description: Programmatically modify JavaScript and TypeScript source codes
---

# Magicast

Magicast allows you to programmatically modify JavaScript and TypeScript source code using a simple API, preserving formatting and comments.

## Usage

### Parse and Modify

```typescript
import { parseModule, generateCode } from 'magicast'

const mod = parseModule(`
export default {
  name: 'test',
  version: '1.0.0'
}
`)

mod.exports.default.name = 'new-name'
mod.exports.default.version = '2.0.0'

const code = generateCode(mod).code
```

### Add Imports

```typescript
import { parseModule, addVitePlugin } from 'magicast'

const mod = parseModule(configCode)

addVitePlugin(mod, {
  from: 'vite-plugin-vue',
  imported: 'vue',
  localName: 'vuePlugin',
})
```

### Modify Exports

```typescript
const mod = parseModule(`
export const config = { port: 3000 }
`)

mod.exports.config.port = 4000
```

## Key Points

- Preserves formatting: Maintains original code style
- Type-safe: Full TypeScript support
- AST-based: Uses Babel AST under the hood
- Simple API: Easy to use for common operations
- Flexible: Can modify any part of the code

<!--
Source references:
- https://github.com/unjs/magicast
-->
