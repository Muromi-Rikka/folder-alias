---
name: mdbox
description: Simple markdown utilities
---

# Mdbox

Mdbox provides simple utilities for working with markdown files, including parsing, transforming, and rendering.

## Usage

### Parse Markdown

```typescript
import { parseMarkdown } from 'mdbox'

const ast = parseMarkdown('# Hello World')
```

### Transform Markdown

```typescript
import { transformMarkdown } from 'mdbox'

const transformed = transformMarkdown(markdown, {
  // Custom transformations
})
```

### Render Markdown

```typescript
import { renderMarkdown } from 'mdbox'

const html = renderMarkdown('# Hello World')
```

## Key Points

- Simple: Easy-to-use markdown utilities
- Flexible: Supports various markdown operations
- Type-safe: Full TypeScript support
- Lightweight: Minimal dependencies

<!--
Source references:
- https://github.com/unjs/mdbox
-->
