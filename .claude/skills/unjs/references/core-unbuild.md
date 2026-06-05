---
name: unbuild
description: Unified JavaScript build system
---

# Unbuild

Unbuild is a unified JavaScript build system that provides a consistent build experience across different package types.

## Usage

### Basic Configuration

```typescript
// build.config.ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
```

### Multiple Entry Points

```typescript
export default defineBuildConfig({
  entries: [
    'src/index',
    'src/cli',
    {
      input: 'src/runtime/',
      outDir: 'dist/runtime',
    },
  ],
})
```

### TypeScript Declaration

```typescript
export default defineBuildConfig({
  declaration: true,
  // Generates .d.ts files
})
```

### Build Hooks

```typescript
export default defineBuildConfig({
  hooks: {
    'build:before': () => {
      console.log('Building...')
    },
    'build:done': () => {
      console.log('Build complete!')
    },
  },
})
```

## Key Points

- Unified API: Same config for libraries, CLIs, and apps
- TypeScript: Built-in declaration file generation
- Multiple formats: Supports ESM, CJS, and UMD
- Rollup-based: Uses Rollup under the hood
- Extensible: Plugin system for custom build steps

<!--
Source references:
- https://github.com/unjs/unbuild
-->
