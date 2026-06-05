---
name: hookable
description: Awaitable hooks system for plugins and extensions
---

# Hookable

Hookable provides an awaitable hooks system that allows plugins and extensions to hook into application lifecycle events.

## Usage

### Basic Hooks

```typescript
import { createHooks } from 'hookable'

const hooks = createHooks()

// Register hook
hooks.hook('app:ready', async () => {
  console.log('App is ready')
})

// Call hook
await hooks.callHook('app:ready')
```

### Hook with Arguments

```typescript
hooks.hook('user:created', async (user) => {
  console.log('User created:', user.name)
})

await hooks.callHook('user:created', { name: 'John', id: 1 })
```

### Multiple Handlers

```typescript
hooks.hook('before:build', async () => {
  console.log('Hook 1')
})

hooks.hook('before:build', async () => {
  console.log('Hook 2')
})

// Both handlers are called
await hooks.callHook('before:build')
```

### Hook Context

```typescript
hooks.hook('request', async (event, context) => {
  // Access context
  console.log(context.method, context.url)
})

await hooks.callHook('request', event, { method: 'GET', url: '/' })
```

## Key Points

- Awaitable: Supports async hook handlers
- Type-safe: Full TypeScript support
- Multiple handlers: Can register multiple handlers per hook
- Context passing: Supports passing context to handlers
- Lightweight: Minimal overhead

<!--
Source references:
- https://github.com/unjs/hookable
-->
