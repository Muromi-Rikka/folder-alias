---
name: pathe
description: Cross-platform path utilities
---

# Pathe

Pathe is a drop-in replacement for Node.js's `path` module that ensures paths are normalized and work across different platforms.

## Usage

### Basic Path Operations

```typescript
import { join, resolve, dirname, basename, extname } from 'pathe'

const path1 = join('src', 'utils', 'helper.ts')
// 'src/utils/helper.ts' (normalized)

const absolute = resolve('./src')
// Resolves to absolute path

const dir = dirname('/path/to/file.ts')
// '/path/to'

const name = basename('/path/to/file.ts')
// 'file.ts'

const ext = extname('/path/to/file.ts')
// '.ts'
```

### Path Normalization

```typescript
import { normalize } from 'pathe'

// Always uses forward slashes
normalize('path\\to\\file')
// 'path/to/file'
```

### Cross-Platform Compatibility

```typescript
import { join } from 'pathe'

// Works consistently across Windows, macOS, Linux
const path = join('C:', 'Users', 'file.txt')
// Normalized for current platform
```

## Key Points

- Cross-platform: Consistent behavior across OS
- Normalized: Always uses forward slashes internally
- Drop-in replacement: Compatible with Node.js path API
- Type-safe: Full TypeScript support
- Universal: Works in Node.js, browser, and edge

<!--
Source references:
- https://github.com/unjs/pathe
-->
