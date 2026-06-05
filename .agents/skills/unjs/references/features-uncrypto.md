---
name: uncrypto
description: Universal crypto API for Node.js, browser, and edge
---

# Uncrypto

Uncrypto provides a universal crypto API that works consistently across Node.js, browser, and edge environments.

## Usage

### Basic Crypto Operations

```typescript
import { randomBytes, createHash, createHmac } from 'uncrypto'

// Generate random bytes
const bytes = randomBytes(32)

// Create hash
const hash = createHash('sha256')
hash.update('data')
const digest = hash.digest('hex')

// Create HMAC
const hmac = createHmac('sha256', 'secret')
hmac.update('data')
const signature = hmac.digest('hex')
```

### Encryption/Decryption

```typescript
import { encrypt, decrypt } from 'uncrypto'

const encrypted = await encrypt('data', 'secret-key')
const decrypted = await decrypt(encrypted, 'secret-key')
```

### Cross-Platform

```typescript
// Same API works in Node.js, browser, and edge
import { randomBytes } from 'uncrypto'

const bytes = randomBytes(16)
// Works everywhere
```

## Key Points

- Universal API: Same API across all environments
- Consistent: Works the same in Node.js, browser, and edge
- Type-safe: Full TypeScript support
- Standard algorithms: Supports standard crypto algorithms
- Secure: Uses platform-native crypto implementations

<!--
Source references:
- https://github.com/unjs/uncrypto
-->
