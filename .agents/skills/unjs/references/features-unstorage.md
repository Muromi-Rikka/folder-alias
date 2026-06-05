---
name: unstorage
description: Async key-value storage API with multiple drivers
---

# Unstorage

Unstorage provides an async key-value storage API with dozens of built-in drivers and a tiny core.

## Usage

### Basic Storage

```typescript
import { createStorage } from 'unstorage'

const storage = createStorage({
  driver: 'memory'
})

await storage.setItem('key', 'value')
const value = await storage.getItem('key')
await storage.removeItem('key')
```

### Multiple Drivers

```typescript
import { createStorage } from 'unstorage'

// Memory driver
const memoryStorage = createStorage({ driver: 'memory' })

// LocalStorage driver (browser)
const localStorage = createStorage({ driver: 'localStorage' })

// Redis driver
const redisStorage = createStorage({
  driver: 'redis',
  base: 'app:',
})

// Filesystem driver
const fsStorage = createStorage({
  driver: 'fs',
  base: './.data'
})
```

### Storage Operations

```typescript
// Set item
await storage.setItem('user:1', { name: 'John' })

// Get item
const user = await storage.getItem('user:1')

// Check if exists
const exists = await storage.hasItem('user:1')

// Get all keys
const keys = await storage.getKeys()

// Remove item
await storage.removeItem('user:1')

// Clear all
await storage.clear()
```

### Mounted Storage

```typescript
const storage = createStorage()

// Mount different drivers for different prefixes
storage.mount('/cache', createStorage({ driver: 'memory' }))
storage.mount('/db', createStorage({ driver: 'redis' }))
```

## Key Points

- Universal API: Same API across all drivers
- Multiple drivers: Memory, localStorage, Redis, filesystem, and more
- Async: All operations are async
- Type-safe: Full TypeScript support
- Extensible: Easy to create custom drivers

<!--
Source references:
- https://github.com/unjs/unstorage
-->
