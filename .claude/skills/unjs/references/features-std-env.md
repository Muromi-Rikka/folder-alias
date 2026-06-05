---
name: std-env
description: Standard environment variables utilities
---

# Std-env

Std-env provides utilities for working with standard environment variables across different platforms and runtimes.

## Usage

### Environment Detection

```typescript
import { isDevelopment, isProduction, isTest } from 'std-env'

if (isDevelopment) {
  console.log('Development mode')
}

if (isProduction) {
  console.log('Production mode')
}
```

### Platform Detection

```typescript
import { isWindows, isLinux, isMacOS } from 'std-env'

if (isWindows) {
  // Windows-specific code
}
```

### Runtime Detection

```typescript
import { isNode, isDeno, isBun } from 'std-env'

if (isNode) {
  // Node.js specific
}
```

### CI Detection

```typescript
import { isCI, isGitHubActions, isVercel } from 'std-env'

if (isCI) {
  console.log('Running in CI')
}
```

## Key Points

- Standard detection: Consistent environment detection
- Cross-platform: Works on all platforms
- CI support: Detects various CI environments
- Type-safe: Full TypeScript support
- Lightweight: Minimal dependencies

<!--
Source references:
- https://github.com/unjs/std-env
-->
