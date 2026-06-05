---
name: crossws
description: Cross-platform WebSocket servers for Node.js, Deno, Bun and Cloudflare Workers
---

# Crossws

Crossws provides cross-platform WebSocket server implementation that works consistently across Node.js, Deno, Bun, and Cloudflare Workers.

## Usage

### Basic WebSocket Server

```typescript
import { createWebSocketServer } from 'crossws'

const wss = createWebSocketServer({
  port: 3000,
})

wss.on('connection', (ws) => {
  ws.send('Hello!')
  
  ws.on('message', (message) => {
    console.log('Received:', message)
  })
})
```

### H3 Integration

```typescript
import { createServer } from 'h3'
import { createWebSocketHandler } from 'crossws'

const app = createServer()

app.use('/ws', createWebSocketHandler({
  onMessage(ws, message) {
    ws.send(`Echo: ${message}`)
  },
}))
```

### Cloudflare Workers

```typescript
export default {
  async fetch(request, env) {
    return createWebSocketHandler({
      onMessage(ws, message) {
        ws.send(message)
      },
    })(request)
  },
}
```

## Key Points

- Cross-platform: Works on Node.js, Deno, Bun, Cloudflare Workers
- Universal API: Same API across all platforms
- H3 integration: Works seamlessly with H3
- Type-safe: Full TypeScript support
- Lightweight: Minimal overhead

<!--
Source references:
- https://github.com/unjs/crossws
- https://crossws.unjs.io
-->
