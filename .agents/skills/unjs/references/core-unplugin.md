---
name: unplugin
description: Unified plugin system for Vite, Rollup, webpack, esbuild, and more
---

# Unplugin

Unplugin provides a unified plugin system that works across Vite, Rollup, webpack, esbuild, Rspack, Farm, Rolldown, and Bun.

## Usage

### Create Plugin

```typescript
import { createUnplugin } from 'unplugin'

export default createUnplugin((options) => {
  return {
    name: 'my-plugin',
    transformInclude(id) {
      return id.endsWith('.custom')
    },
    transform(code, id) {
      // Transform code
      return code
    },
  }
})
```

### Vite Integration

```typescript
// vite.config.ts
import myPlugin from './my-plugin'

export default {
  plugins: [myPlugin.vite()],
}
```

### Rollup Integration

```typescript
// rollup.config.js
import myPlugin from './my-plugin'

export default {
  plugins: [myPlugin.rollup()],
}
```

### Webpack Integration

```typescript
// webpack.config.js
import myPlugin from './my-plugin'

module.exports = {
  plugins: [myPlugin.webpack()],
}
```

## Key Points

- Universal: Works with multiple bundlers
- Type-safe: Full TypeScript support
- Flexible: Supports various hook types
- Compatible: Same API across bundlers
- Powerful: Full access to bundler APIs

<!--
Source references:
- https://github.com/unjs/unplugin
-->
