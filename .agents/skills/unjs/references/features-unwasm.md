---
name: unwasm
description: WebAssembly tools for JavaScript
---

# Unwasm

Unwasm provides tools for working with WebAssembly in JavaScript, making it easy to load and use WASM modules.

## Usage

### Load WASM Module

```typescript
import { loadWASM } from 'unwasm'

const wasm = await loadWASM('./module.wasm')
```

### Instantiate Module

```typescript
import { instantiateWASM } from 'unwasm'

const instance = await instantiateWASM(buffer, {
  imports: {
    // WASM imports
  },
})
```

### Compile WASM

```typescript
import { compileWASM } from 'unwasm'

const module = await compileWASM(buffer)
```

## Key Points

- WebAssembly: Tools for WASM modules
- Universal: Works in Node.js, browser, and workers
- Type-safe: Full TypeScript support
- Flexible: Various WASM operations
- Easy: Simple API for WASM usage

<!--
Source references:
- https://github.com/unjs/unwasm
-->
