---
name: mlly
description: ECMAScript module utilities for Node.js
---

# Mlly

Mlly provides utilities for working with ECMAScript modules in Node.js, including resolution, analysis, and transformation.

## Usage

### Resolve Modules

```typescript
import { resolveModule } from 'mlly'

const resolved = await resolveModule('vue', {
  url: import.meta.url
})
```

### Check Module Type

```typescript
import { isESM, isCommonJS } from 'mlly'

if (await isESM('./module.js')) {
  // ESM module
}

if (await isCommonJS('./module.js')) {
  // CommonJS module
}
```

### Analyze Imports

```typescript
import { findStaticImports, findDynamicImports } from 'mlly'

const staticImports = findStaticImports(code)
const dynamicImports = findDynamicImports(code)
```

### Transform Imports

```typescript
import { transformModule } from 'mlly'

const transformed = await transformModule(code, {
  transform: (importee) => {
    // Transform import paths
    return importee.replace(/^@\//, './src/')
  }
})
```

## Key Points

- Module resolution: Resolve ESM and CJS modules
- Analysis: Analyze imports and exports
- Transformation: Transform module code
- Type detection: Detect module type
- Cross-platform: Works across different Node.js versions

<!--
Source references:
- https://github.com/unjs/mlly
-->
