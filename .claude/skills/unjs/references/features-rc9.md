---
name: rc9
description: Read/write config couldn't be easier
---

# Rc9

Rc9 makes reading and writing configuration files extremely easy, supporting JSON, YAML, and other formats.

## Usage

### Read Config

```typescript
import { readRC } from 'rc9'

const config = readRC('myapp')
// Reads from: .myapprc, .myapprc.json, .myapprc.yaml, etc.
```

### Write Config

```typescript
import { writeRC } from 'rc9'

writeRC('myapp', {
  port: 3000,
  host: 'localhost',
})
```

### Custom File Name

```typescript
const config = readRC('myapp', {
  name: '.config',
})
```

## Key Points

- Easy: Simple API for config files
- Multiple formats: Supports JSON, YAML, etc.
- Type-safe: Full TypeScript support
- Flexible: Custom file names and locations

<!--
Source references:
- https://github.com/unjs/rc9
-->
