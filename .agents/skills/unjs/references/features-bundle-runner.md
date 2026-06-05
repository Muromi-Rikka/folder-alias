---
name: bundle-runner
description: Run webpack bundles in Node.js with optional VM sandboxing
---

# Bundle-runner

Bundle-runner allows you to run webpack bundles in Node.js with optional VM sandboxing for security.

## Usage

### Run Bundle

```typescript
import { runBundle } from 'bundle-runner'

const result = await runBundle('./dist/bundle.js')
```

### With Sandbox

```typescript
const result = await runBundle('./dist/bundle.js', {
  sandbox: true, // Run in VM sandbox
})
```

### Custom Context

```typescript
const result = await runBundle('./dist/bundle.js', {
  context: {
    // Custom context variables
    API_URL: 'https://api.example.com',
  },
})
```

## Key Points

- Webpack: Runs webpack bundles
- Sandboxing: Optional VM sandbox for security
- Flexible: Custom context support
- Type-safe: Full TypeScript support
- Useful: Great for testing bundled code

<!--
Source references:
- https://github.com/unjs/bundle-runner
-->
