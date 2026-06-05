---
name: image-meta
description: Detect image type and size using pure JavaScript
---

# Image-meta

Image-meta detects image type and dimensions using pure JavaScript, without requiring native dependencies.

## Usage

### Detect Image Type

```typescript
import { detectImageType } from 'image-meta'

const type = detectImageType(buffer)
// 'jpeg' | 'png' | 'gif' | 'webp' | 'svg' | etc.
```

### Get Image Dimensions

```typescript
import { getImageSize } from 'image-meta'

const { width, height } = getImageSize(buffer)
```

### Get Image Metadata

```typescript
import { getImageMeta } from 'image-meta'

const meta = getImageMeta(buffer)
// { type, width, height, ... }
```

## Key Points

- Pure JS: No native dependencies
- Fast: Efficient image parsing
- Multiple formats: Supports JPEG, PNG, GIF, WebP, SVG, etc.
- Type-safe: Full TypeScript support
- Universal: Works in Node.js, browser, and edge

<!--
Source references:
- https://github.com/unjs/image-meta
-->
