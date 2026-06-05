---
name: fs-memo
description: Easy persisted memo object for Node.js
---

# Fs-memo

Fs-memo provides an easy way to create persisted memo objects in Node.js, caching data to the filesystem.

## Usage

### Basic Memo

```typescript
import { createMemo } from 'fs-memo'

const memo = createMemo('./.cache')

memo.set('key', { data: 'value' })
const value = memo.get('key')
```

### Async Operations

```typescript
const memo = createMemo('./.cache')

await memo.setAsync('key', { data: 'value' })
const value = await memo.getAsync('key')
```

### TTL Support

```typescript
const memo = createMemo('./.cache', {
  ttl: 3600, // 1 hour
})

memo.set('key', 'value', { ttl: 1800 }) // Custom TTL
```

## Key Points

- Persisted: Data persists across restarts
- Simple: Easy-to-use API
- TTL: Time-to-live support
- Type-safe: Full TypeScript support
- Fast: Efficient caching

<!--
Source references:
- https://github.com/unjs/fs-memo
-->
