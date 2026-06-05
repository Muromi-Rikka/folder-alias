---
name: ufo
description: URL utilities for parsing, formatting, and manipulation
---

# UFO

UFO provides URL utilities for parsing, formatting, and manipulating URLs in a type-safe way.

## Usage

### Parsing URLs

```typescript
import { parseURL } from 'ufo'

const url = parseURL('https://example.com/path?query=value#hash')
// {
//   protocol: 'https:',
//   host: 'example.com',
//   pathname: '/path',
//   search: '?query=value',
//   hash: '#hash'
// }
```

### Building URLs

```typescript
import { joinURL } from 'ufo'

const url = joinURL('https://example.com', 'api', 'users')
// 'https://example.com/api/users'
```

### Query String Manipulation

```typescript
import { parseQuery, stringifyQuery } from 'ufo'

const query = parseQuery('?name=John&age=30')
// { name: 'John', age: '30' }

const queryString = stringifyQuery({ name: 'John', age: 30 })
// 'name=John&age=30'
```

### URL Normalization

```typescript
import { normalizeURL } from 'ufo'

normalizeURL('https://example.com//path//to//file')
// 'https://example.com/path/to/file'
```

## Key Points

- Type-safe: Full TypeScript support
- Cross-platform: Works in Node.js, browser, and edge
- Normalized: Consistent URL formatting
- Query handling: Easy query string parsing/stringifying
- Relative URLs: Handles relative and absolute URLs

<!--
Source references:
- https://github.com/unjs/ufo
-->
