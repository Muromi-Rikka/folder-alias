---
name: node-fetch-native
description: A better redistribution of node-fetch
---

# Node-fetch-native

Node-fetch-native is a better redistribution of node-fetch with improved ESM support and compatibility.

## Usage

### Basic Fetch

```typescript
import fetch from 'node-fetch-native'

const response = await fetch('https://api.example.com')
const data = await response.json()
```

### ESM Support

```typescript
// Works seamlessly in ESM modules
import fetch from 'node-fetch-native'

export async function getData() {
  const res = await fetch('https://api.example.com')
  return res.json()
}
```

## Key Points

- Better: Improved over original node-fetch
- ESM: Native ESM support
- Compatible: Drop-in replacement
- Type-safe: Full TypeScript support
- Reliable: Better error handling

<!--
Source references:
- https://github.com/unjs/node-fetch-native
-->
