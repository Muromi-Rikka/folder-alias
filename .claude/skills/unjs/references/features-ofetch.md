---
name: ofetch
description: Better fetch API for Node.js, browser, and workers
---

# Ofetch

Ofetch is a better fetch API that works on Node.js, browser, and workers with additional features like automatic JSON parsing and error handling.

## Usage

### Basic Fetch

```typescript
import { ofetch } from 'ofetch'

const data = await ofetch('https://api.example.com/users')
// Automatically parses JSON
```

### POST Request

```typescript
const result = await ofetch('https://api.example.com/users', {
  method: 'POST',
  body: {
    name: 'John',
    email: 'john@example.com'
  }
})
```

### Query Parameters

```typescript
const users = await ofetch('https://api.example.com/users', {
  query: {
    page: 1,
    limit: 10
  }
})
```

### Error Handling

```typescript
import { ofetch } from 'ofetch'

try {
  const data = await ofetch('https://api.example.com/users')
} catch (error) {
  // Handles HTTP errors automatically
  console.error(error.statusCode, error.message)
}
```

### Interceptors

```typescript
import { ofetch } from 'ofetch'

const api = ofetch.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer token'
  },
  onRequest({ request, options }) {
    // Modify request
  },
  onResponse({ response }) {
    // Handle response
  },
  onRequestError({ error }) {
    // Handle request error
  },
})
```

## Key Points

- Universal: Works in Node.js, browser, and workers
- Auto JSON: Automatically parses JSON responses
- Error handling: Throws errors for HTTP errors
- Interceptors: Request/response interceptors
- Type-safe: Full TypeScript support

<!--
Source references:
- https://github.com/unjs/ofetch
-->
