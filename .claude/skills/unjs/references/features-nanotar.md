---
name: nanotar
description: Tiny and fast Tar utils for any JavaScript runtime
---

# Nanotar

Nanotar provides tiny and fast Tar utilities that work across any JavaScript runtime (Node.js, browser, workers).

## Usage

### Create Archive

```typescript
import { createTar } from 'nanotar'

const tar = createTar()
tar.addFile('file.txt', content)
const archive = tar.build()
```

### Extract Archive

```typescript
import { extractTar } from 'nanotar'

const files = await extractTar(buffer)
```

### List Files

```typescript
import { listTar } from 'nanotar'

const files = await listTar(buffer)
```

## Key Points

- Tiny: Small bundle size
- Fast: Optimized performance
- Universal: Works in any runtime
- Type-safe: Full TypeScript support
- Simple: Easy-to-use API

<!--
Source references:
- https://github.com/unjs/nanotar
-->
