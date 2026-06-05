---
name: unenv
description: Convert JavaScript code to be runtime agnostic
---

# Unenv

Unenv converts JavaScript code to be runtime agnostic by providing polyfills and shims for Node.js APIs in non-Node.js environments.

## Usage

### Basic Polyfills

```typescript
import { createUnenv } from 'unenv'

const unenv = createUnenv({
  // Automatically polyfills Node.js APIs
})

// Use Node.js APIs in edge environments
import { readFileSync } from 'fs'
import { join } from 'path'
```

### Custom Polyfills

```typescript
import { createUnenv } from 'unenv'

const unenv = createUnenv({
  polyfills: {
    'fs': 'memfs',
    'path': 'pathe',
  }
})
```

### Runtime Detection

```typescript
import { isNode, isEdge, isBrowser } from 'unenv'

if (isNode()) {
  // Node.js specific code
} else if (isEdge()) {
  // Edge runtime code
} else if (isBrowser()) {
  // Browser code
}
```

## Key Points

- Runtime agnostic: Write code that works everywhere
- Polyfills: Automatic Node.js API polyfills
- Edge support: Works in Cloudflare Workers, Vercel Edge, etc.
- Type-safe: Full TypeScript support
- Configurable: Custom polyfill mappings

<!--
Source references:
- https://github.com/unjs/unenv
-->
