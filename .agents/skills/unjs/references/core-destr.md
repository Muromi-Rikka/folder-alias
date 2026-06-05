---
name: destr
description: Fast and secure JSON.parse alternative
---

# Destr

Destr is a faster, secure, and convenient alternative to `JSON.parse()` with additional features like handling non-JSON strings.

## Usage

### Basic Parsing

```typescript
import { destr } from 'destr'

const json = '{"name": "John", "age": 30}'
const result = destr(json)
// { name: 'John', age: 30 }
```

### Non-JSON Strings

```typescript
// Handles non-JSON strings gracefully
destr('true') // true
destr('false') // false
destr('null') // null
destr('undefined') // undefined
destr('123') // 123
destr('"string"') // 'string'
```

### Strict Mode

```typescript
import { destr } from 'destr'

// Strict mode only parses valid JSON
const result = destr('{"valid": true}', { strict: true })
```

### Fallback Value

```typescript
const result = destr(invalidJson, { fallback: {} })
// Returns {} if parsing fails
```

## Key Points

- Fast: Optimized parsing performance
- Secure: Protects against prototype pollution
- Convenient: Handles edge cases automatically
- Type-safe: Full TypeScript support
- Flexible: Supports strict mode and fallbacks

<!--
Source references:
- https://github.com/unjs/destr
-->
