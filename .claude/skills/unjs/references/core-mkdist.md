---
name: mkdist
description: Generate distribution files from source
---

# Mkdist

Mkdist generates distribution files from source files, handling TypeScript compilation, copying assets, and maintaining directory structure.

## Usage

### Basic Usage

```typescript
import { mkdist } from 'mkdist'

await mkdist({
  srcDir: 'src',
  distDir: 'dist',
})
```

### TypeScript Compilation

```typescript
await mkdist({
  srcDir: 'src',
  distDir: 'dist',
  format: ['esm', 'cjs'],
  declaration: true,
})
```

### Copy Assets

```typescript
await mkdist({
  srcDir: 'src',
  distDir: 'dist',
  copy: ['**/*.css', '**/*.json'],
})
```

### Custom Transformations

```typescript
await mkdist({
  srcDir: 'src',
  distDir: 'dist',
  transform: {
    include: ['**/*.vue'],
    handler: async (file) => {
      // Custom transformation
    },
  },
})
```

## Key Points

- TypeScript: Compiles TypeScript to JavaScript
- Multiple formats: Supports ESM and CJS output
- Asset copying: Handles non-JS files
- Directory structure: Maintains source directory structure
- Extensible: Custom transformation support

<!--
Source references:
- https://github.com/unjs/mkdist
-->
