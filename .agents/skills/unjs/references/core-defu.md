---
name: defu
description: Recursive default property assignment
---

# Defu

Defu recursively assigns default properties to objects. It's lightweight, fast, and handles nested objects intelligently.

## Usage

### Basic Merging

```typescript
import { defu } from 'defu'

const defaults = { a: 1, b: 2 }
const user = { b: 3, c: 4 }

const result = defu(user, defaults)
// { a: 1, b: 3, c: 4 }
```

### Nested Objects

```typescript
const defaults = {
  api: {
    baseURL: 'https://api.example.com',
    timeout: 5000
  }
}

const config = {
  api: {
    timeout: 10000
  }
}

const result = defu(config, defaults)
// { api: { baseURL: 'https://api.example.com', timeout: 10000 } }
```

### Arrays

```typescript
// Arrays are replaced, not merged
const defaults = { items: [1, 2] }
const user = { items: [3] }

const result = defu(user, defaults)
// { items: [3] }
```

### Customizer Function

```typescript
import { defuFn } from 'defu'

const result = defuFn(
  { port: process.env.PORT },
  { port: 3000 }
)
```

## Key Points

- Recursive: Deep merges nested objects
- Fast: Optimized performance
- Type-safe: Full TypeScript support
- Array handling: Arrays are replaced, not merged
- Null-aware: Handles null/undefined values correctly

<!--
Source references:
- https://github.com/unjs/defu
-->
