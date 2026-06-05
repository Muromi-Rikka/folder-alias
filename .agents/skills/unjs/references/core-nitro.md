---
name: nitro
description: Universal web server framework that runs anywhere
---

# Nitro Server

Nitro is a universal web server framework that creates web servers running anywhere. It's built on top of H3 and provides deployment presets for various platforms.

## Usage

### Basic Nitro Server

```typescript
// server/api/hello.ts
export default defineEventHandler((event) => {
  return { message: 'Hello from Nitro' }
})
```

### Route Handlers

```typescript
// server/api/users/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const user = await getUserById(id)
  return user
})
```

### Middleware

```typescript
// server/middleware/auth.ts
export default defineEventHandler((event) => {
  const token = getHeader(event, 'authorization')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  // Attach user to event context
  event.context.user = verifyToken(token)
})
```

### Storage Integration

```typescript
import { useStorage } from '#nitro'

export default defineEventHandler(async (event) => {
  const storage = useStorage()
  const data = await storage.getItem('key')
  return { data }
})
```

## Key Points

- Universal deployment: Deploy to Node.js, Cloudflare, Vercel, Netlify, AWS Lambda, and more
- Auto-imports: Server routes and utilities are auto-imported
- Storage API: Built-in storage abstraction with multiple drivers
- Type-safe: Full TypeScript support with auto-generated types
- Production-ready: Optimized builds for each deployment target

<!--
Source references:
- https://github.com/unjs/nitro
- https://nitro.unjs.io
-->
