---
name: listhen
description: Elegant HTTP listener for Node.js and edge environments
---

# Listhen

Listhen is an elegant HTTP listener that provides a unified API for starting HTTP servers across different environments.

## Usage

### Basic Usage

```typescript
import { createServer } from 'h3'
import { listen } from 'listhen'

const app = createServer()
app.use('/', () => 'Hello World')

await listen(app, { port: 3000 })
```

### Configuration Options

```typescript
await listen(app, {
  port: 3000,
  hostname: '0.0.0.0',
  open: true, // Open browser automatically
  https: {
    cert: './cert.pem',
    key: './key.pem'
  },
  clipboard: true, // Copy URL to clipboard
})
```

### Environment-Specific Behavior

```typescript
await listen(app, {
  // Automatically detects environment
  // Uses native server in Node.js
  // Uses Cloudflare Workers API in Workers
  // Uses Deno.serve in Deno
})
```

## Key Points

- Cross-platform: Works in Node.js, Cloudflare Workers, Deno, Bun
- Auto-detection: Automatically uses the appropriate server API
- HTTPS support: Built-in SSL/TLS certificate handling
- Developer experience: Auto-open browser, clipboard integration
- Production-ready: Optimized for each runtime

<!--
Source references:
- https://github.com/unjs/listhen
-->
