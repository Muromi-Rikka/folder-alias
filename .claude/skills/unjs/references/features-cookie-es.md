---
name: cookie-es
description: ESM cookie serializer and deserializer
---

# Cookie-es

Cookie-es provides ESM cookie serialization and deserialization utilities for working with HTTP cookies.

## Usage

### Parse Cookies

```typescript
import { parseCookie } from 'cookie-es'

const cookies = parseCookie('name=value; path=/; domain=example.com')
// { name: 'value', path: '/', domain: 'example.com' }
```

### Serialize Cookies

```typescript
import { serializeCookie } from 'cookie-es'

const cookieString = serializeCookie('name', 'value', {
  path: '/',
  domain: 'example.com',
  maxAge: 3600,
})
```

### Set Cookie Header

```typescript
import { setCookie } from 'cookie-es'

setCookie(event, 'name', 'value', {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
})
```

### Get Cookie

```typescript
import { getCookie } from 'cookie-es'

const value = getCookie(event, 'name')
```

## Key Points

- ESM: Native ESM support
- Type-safe: Full TypeScript support
- Universal: Works in Node.js, browser, and edge
- H3 compatible: Works with H3 event handlers
- Flexible: Supports all cookie attributes

<!--
Source references:
- https://github.com/unjs/cookie-es
-->
