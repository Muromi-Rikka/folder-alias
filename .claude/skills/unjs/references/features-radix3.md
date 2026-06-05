---
name: radix3
description: Lightweight and fast router based on Radix Tree
---

# Radix3

Radix3 is a lightweight and fast router for JavaScript based on Radix Tree data structure.

## Usage

### Basic Routing

```typescript
import { createRouter } from 'radix3'

const router = createRouter()

router.insert('/users', { handler: 'users' })
router.insert('/users/:id', { handler: 'user' })
router.insert('/posts/:slug', { handler: 'post' })

const match = router.lookup('/users/123')
// { handler: 'user', params: { id: '123' } }
```

### Route Matching

```typescript
const router = createRouter({
  routes: {
    '/users': { handler: 'users' },
    '/users/:id': { handler: 'user' },
    '/posts/:slug': { handler: 'post' },
  }
})

const result = router.lookup('/users/123')
// { handler: 'user', params: { id: '123' } }
```

### Wildcard Routes

```typescript
router.insert('/files/*', { handler: 'files' })

const match = router.lookup('/files/path/to/file.txt')
// { handler: 'files', params: { _: 'path/to/file.txt' } }
```

## Key Points

- Fast: Radix Tree provides O(k) lookup time
- Lightweight: Minimal dependencies
- Flexible: Supports params, wildcards, and custom matching
- Type-safe: Full TypeScript support
- Universal: Works in Node.js, browser, and edge

<!--
Source references:
- https://github.com/unjs/radix3
-->
