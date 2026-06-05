---
name: ohash
description: Fast hashing library based on murmurhash3
---

# Ohash

Ohash is a super fast hashing library based on murmurhash3, written in vanilla JavaScript.

## Usage

### Basic Hashing

```typescript
import { hash } from 'ohash'

const hashValue = hash('hello world')
// Returns a numeric hash
```

### Object Hashing

```typescript
import { objectHash } from 'ohash'

const obj = { name: 'John', age: 30 }
const hashValue = objectHash(obj)
// Consistent hash for the same object structure
```

### SHA256 Hashing

```typescript
import { sha256 } from 'ohash'

const hashValue = await sha256('hello world')
// Returns SHA256 hash string
```

### Deterministic Hashing

```typescript
import { hash } from 'ohash'

// Same input always produces same hash
hash('test') === hash('test') // true
```

## Key Points

- Fast: Optimized murmurhash3 implementation
- Deterministic: Same input produces same hash
- Object support: Can hash objects and arrays
- Cross-platform: Works in Node.js, browser, and edge
- Multiple algorithms: Supports murmurhash3 and SHA256

<!--
Source references:
- https://github.com/unjs/ohash
-->
