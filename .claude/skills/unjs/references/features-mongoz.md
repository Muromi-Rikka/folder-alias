---
name: mongoz
description: Zero config MongoDB server
---

# Mongoz

Mongoz provides a zero-config MongoDB server setup, making it easy to run MongoDB locally for development and testing.

## Usage

### Start Server

```typescript
import { startMongoz } from 'mongoz'

const server = await startMongoz({
  port: 27017,
  dataDir: './.mongoz',
})
```

### Stop Server

```typescript
await server.stop()
```

### CLI Usage

```bash
mongoz start
mongoz stop
```

## Key Points

- Zero config: No configuration needed
- Local development: Perfect for local MongoDB setup
- Easy: Simple API for starting/stopping
- Type-safe: Full TypeScript support
- Portable: Self-contained MongoDB instance

<!--
Source references:
- https://github.com/unjs/mongoz
-->
