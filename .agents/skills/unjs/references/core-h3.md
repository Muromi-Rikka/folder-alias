---
name: h3
description: Minimal HTTP framework for high performance and portability
---

# H3 Framework

H3 is a minimal HTTP framework built for high performance and portability. It provides a lightweight, framework-agnostic API for handling HTTP requests and responses.

## Usage

### Basic Server Setup

```typescript
import { createServer } from 'h3'
import { listen } from 'listhen'

const app = createServer()

app.use('/', () => 'Hello World')

listen(app)
```

### Route Handlers

```typescript
import { createServer, defineEventHandler, getQuery, getRouterParam } from 'h3'

const app = createServer()

// GET /hello
app.use('/hello', defineEventHandler(() => {
  return { message: 'Hello from H3' }
}))

// GET /user/:id
app.use('/user/:id', defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  return { id, query }
}))
```

### Request/Response Utilities

```typescript
import { defineEventHandler, readBody, setHeader, setResponseStatus } from 'h3'

app.use('/api/data', defineEventHandler(async (event) => {
  const body = await readBody(event)
  setHeader(event, 'Content-Type', 'application/json')
  setResponseStatus(event, 201)
  return { received: body }
}))
```

## Key Points

- Framework-agnostic: Works with any runtime (Node.js, Cloudflare Workers, Deno, Bun)
- Lightweight: Minimal overhead, high performance
- Type-safe: Full TypeScript support
- Composable: Middleware and utilities can be combined
- Universal: Same code runs across different environments

<!--
Source references:
- https://github.com/unjs/h3
- https://h3.unjs.io
-->
