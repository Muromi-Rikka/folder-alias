---
name: pkg-types
description: Node.js utilities and TypeScript definitions for package.json and tsconfig.json
---

# Pkg-types

Pkg-types provides TypeScript definitions and utilities for working with package.json and tsconfig.json files.

## Usage

### Read Package.json

```typescript
import { readPackageJSON } from 'pkg-types'

const pkg = await readPackageJSON('./package.json')
```

### Write Package.json

```typescript
import { writePackageJSON } from 'pkg-types'

await writePackageJSON('./package.json', {
  name: 'my-package',
  version: '1.0.0',
})
```

### Read Tsconfig

```typescript
import { readTSConfig } from 'pkg-types'

const tsconfig = await readTSConfig('./tsconfig.json')
```

### Type Definitions

```typescript
import type { PackageJson } from 'pkg-types'

const pkg: PackageJson = {
  name: 'my-package',
  version: '1.0.0',
}
```

## Key Points

- Type-safe: Full TypeScript definitions
- Utilities: Helper functions for reading/writing
- Standard: Follows official JSON schemas
- Flexible: Supports various config formats
- Reliable: Handles edge cases

<!--
Source references:
- https://github.com/unjs/pkg-types
-->
