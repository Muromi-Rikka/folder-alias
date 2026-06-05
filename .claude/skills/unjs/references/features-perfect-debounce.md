---
name: perfect-debounce
description: Debounce promise-returning and async functions
---

# Perfect-debounce

Perfect-debounce provides debouncing for promise-returning and async functions, ensuring they're not called too frequently.

## Usage

### Basic Debounce

```typescript
import { debounce } from 'perfect-debounce'

const debouncedFn = debounce(async (value: string) => {
  await saveToDatabase(value)
}, 300)

await debouncedFn('test')
```

### Leading Edge

```typescript
const debouncedFn = debounce(async () => {
  await fetchData()
}, 300, {
  leading: true, // Execute immediately on first call
})
```

### Trailing Edge

```typescript
const debouncedFn = debounce(async () => {
  await saveData()
}, 300, {
  trailing: true, // Execute after delay
})
```

### Cancel

```typescript
const debouncedFn = debounce(async () => {
  await saveData()
}, 300)

debouncedFn.cancel() // Cancel pending execution
```

## Key Points

- Promise-aware: Works with async functions
- Flexible: Leading/trailing edge options
- Cancelable: Can cancel pending executions
- Type-safe: Full TypeScript support
- Reliable: Handles edge cases properly

<!--
Source references:
- https://github.com/unjs/perfect-debounce
-->
