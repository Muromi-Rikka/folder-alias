---
name: get-port-please
description: Get an available open port
---

# Get-port-please

Get-port-please finds an available open port on the system, useful for starting servers dynamically.

## Usage

### Get Available Port

```typescript
import { getPort } from 'get-port-please'

const port = await getPort()
// Returns an available port number
```

### Preferred Port

```typescript
const port = await getPort({ port: 3000 })
// Returns 3000 if available, or next available port
```

### Port Range

```typescript
const port = await getPort({
  port: 3000,
  portRange: [3000, 3100],
})
```

### Check Port Availability

```typescript
import { isPortAvailable } from 'get-port-please'

const available = await isPortAvailable(3000)
```

## Key Points

- Simple: Easy API for finding ports
- Flexible: Preferred port and range support
- Reliable: Checks port availability properly
- Type-safe: Full TypeScript support
- Fast: Efficient port checking

<!--
Source references:
- https://github.com/unjs/get-port-please
-->
