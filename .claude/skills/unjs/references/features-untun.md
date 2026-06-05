---
name: untun
description: Tunnel your local HTTP(s) server to the world powered by Cloudflare Quick Tunnels
---

# Untun

Untun creates tunnels for your local HTTP(s) server using Cloudflare Quick Tunnels, making local development accessible from the internet.

## Usage

### Create Tunnel

```typescript
import { createTunnel } from 'untun'

const tunnel = await createTunnel({
  url: 'http://localhost:3000',
})

console.log(tunnel.url) // Public URL
```

### Stop Tunnel

```typescript
await tunnel.stop()
```

### CLI Usage

```bash
untun http://localhost:3000
```

## Key Points

- Cloudflare: Uses Cloudflare Quick Tunnels
- Easy: Simple API for creating tunnels
- Secure: HTTPS support
- Type-safe: Full TypeScript support
- Useful: Great for local development and testing

<!--
Source references:
- https://github.com/unjs/untun
-->
