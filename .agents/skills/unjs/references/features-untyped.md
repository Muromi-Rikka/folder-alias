---
name: untyped
description: Generate types and markdown from config objects
---

# Untyped

Untyped generates TypeScript types and markdown documentation from configuration objects.

## Usage

### Generate Types

```typescript
import { generateTypes } from 'untyped'

const config = {
  port: 3000,
  host: 'localhost',
  features: {
    auth: true,
    cache: false,
  }
}

const types = generateTypes(config)
// Generates TypeScript type definitions
```

### Generate Documentation

```typescript
import { generateMarkdown } from 'untyped'

const markdown = generateMarkdown(config)
// Generates markdown documentation
```

### Schema Definition

```typescript
import { defineUntypedSchema } from 'untyped'

const schema = defineUntypedSchema({
  port: {
    type: 'number',
    default: 3000,
    description: 'Server port',
  },
  host: {
    type: 'string',
    default: 'localhost',
    description: 'Server host',
  },
})
```

## Key Points

- Type generation: Generate TypeScript types from config
- Documentation: Generate markdown docs
- Schema validation: Validate configuration
- Type-safe: Full TypeScript support
- Flexible: Works with various config formats

<!--
Source references:
- https://github.com/unjs/untyped
-->
