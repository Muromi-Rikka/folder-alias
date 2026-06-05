---
name: c12
description: Smart configuration loader
---

# C12

C12 is a smart configuration loader that merges configuration from multiple sources (files, environment variables, CLI arguments) with intelligent defaults.

## Usage

### Basic Usage

```typescript
import { loadConfig } from 'c12'

const config = await loadConfig({
  name: 'myapp',
  defaults: {
    port: 3000,
    host: 'localhost',
  },
})
```

### Multiple Sources

```typescript
const config = await loadConfig({
  name: 'myapp',
  // Loads from: myapp.config.ts, .myapprc, environment variables, etc.
  defaults: {
    port: 3000,
  },
})
```

### Type-Safe Config

```typescript
interface MyConfig {
  port: number
  host: string
}

const config = await loadConfig<MyConfig>({
  name: 'myapp',
})
```

## Key Points

- Smart merging: Intelligently merges config from multiple sources
- Type-safe: Full TypeScript support
- Flexible: Supports various config formats
- Environment-aware: Reads from environment variables
- CLI support: Can read from CLI arguments

<!--
Source references:
- https://github.com/unjs/c12
-->
