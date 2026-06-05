---
name: unctx
description: Composables pattern in vanilla JavaScript
---

# Unctx

Unctx brings the composables pattern from Vue to vanilla JavaScript, allowing you to create context-aware utilities.

## Usage

### Basic Context

```typescript
import { useContext, setContext } from 'unctx'

const contextKey = Symbol('my-context')

export function useMyContext() {
  return useContext(contextKey)
}

// Set context
setContext(contextKey, { value: 'hello' })

// Get context
const ctx = useMyContext()
```

### Async Context

```typescript
import { useContext, setContext } from 'unctx'

const contextKey = Symbol('async-context')

export async function useAsyncContext() {
  return await useContext(contextKey)
}

// Set context in async function
await setContext(contextKey, async () => {
  return { data: await fetchData() }
})
```

### Context with Fallback

```typescript
export function useMyContext() {
  return useContext(contextKey, () => {
    // Fallback if context not set
    return { default: true }
  })
}
```

## Key Points

- Composables pattern: Vue-like composables in vanilla JS
- Context-aware: Context is automatically available in nested calls
- Async support: Works with async functions
- Type-safe: Full TypeScript support
- Lightweight: Minimal dependencies

<!--
Source references:
- https://github.com/unjs/unctx
-->
