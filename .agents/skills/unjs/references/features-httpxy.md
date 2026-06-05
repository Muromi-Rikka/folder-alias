---
name: httpxy
description: Full-featured HTTP and WebSocket proxy for Node.js
---

# Httpxy

Httpxy is a full-featured HTTP and WebSocket proxy for Node.js with support for request/response transformation, authentication, and more.

## Usage

### Basic Proxy

```typescript
import { createProxy } from 'httpxy'

const proxy = createProxy({
  target: 'https://api.example.com',
  changeOrigin: true,
})

proxy.listen(3000)
```

### Request Transformation

```typescript
const proxy = createProxy({
  target: 'https://api.example.com',
  onProxyReq(proxyReq, req, res) {
    // Modify request
    proxyReq.setHeader('X-Custom-Header', 'value')
  },
})
```

### Response Transformation

```typescript
const proxy = createProxy({
  target: 'https://api.example.com',
  onProxyRes(proxyRes, req, res) {
    // Modify response
  },
})
```

### WebSocket Support

```typescript
const proxy = createProxy({
  target: 'wss://ws.example.com',
  ws: true,
})
```

## Key Points

- Full-featured: Complete HTTP and WebSocket proxy
- Transformations: Request/response transformation hooks
- Authentication: Built-in auth support
- Type-safe: Full TypeScript support
- Flexible: Highly configurable

<!--
Source references:
- https://github.com/unjs/httpxy
-->
