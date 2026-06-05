---
name: nypm
description: Unified package manager for Node.js
---

# Nypm

Nypm provides a unified API for working with different package managers (npm, pnpm, yarn, bun) in Node.js.

## Usage

### Install Packages

```typescript
import { install } from 'nypm'

await install(['vue', 'react'], {
  packageManager: 'pnpm',
})
```

### Detect Package Manager

```typescript
import { detectPackageManager } from 'nypm'

const pm = await detectPackageManager()
// 'npm' | 'pnpm' | 'yarn' | 'bun'
```

### Run Scripts

```typescript
import { run } from 'nypm'

await run('build', {
  packageManager: 'pnpm',
})
```

### Add/Remove Packages

```typescript
import { addPackage, removePackage } from 'nypm'

await addPackage('vue', { dev: true })
await removePackage('vue')
```

## Key Points

- Unified API: Same API for all package managers
- Auto-detect: Automatically detects package manager
- Type-safe: Full TypeScript support
- Flexible: Works with npm, pnpm, yarn, bun
- Simple: Easy-to-use API

<!--
Source references:
- https://github.com/unjs/nypm
-->
