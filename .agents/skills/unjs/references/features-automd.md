---
name: automd
description: Automated markdown maintainer
---

# Automd

Automd is an automated markdown maintainer that helps keep documentation up to date by automatically updating markdown files based on code changes.

## Usage

### Basic Usage

```typescript
import { automd } from 'automd'

await automd({
  input: './README.md',
  output: './README.md',
})
```

### Custom Rules

```typescript
await automd({
  input: './README.md',
  rules: [
    {
      match: /<!-- API:start -->(.*?)<!-- API:end -->/s,
      replace: async () => {
        // Generate API documentation
        return generateAPI()
      },
    },
  ],
})
```

## Key Points

- Automated: Keeps markdown files in sync with code
- Flexible: Custom rules for different sections
- Type-safe: Full TypeScript support
- CI-friendly: Can be run in CI/CD pipelines

<!--
Source references:
- https://github.com/unjs/automd
- https://automd.unjs.io
-->
