---
name: ipx
description: High performance, secure and easy to use image proxy based on Sharp and libvips
---

# IPX

IPX is a high-performance, secure image proxy built on Sharp and libvips, providing image transformation, optimization, and caching.

## Usage

### Basic Image Proxy

```typescript
import { createIPX } from 'ipx'

const ipx = createIPX({
  domains: ['example.com'],
})

// Transform image: /_ipx/w_300,h_200/example.com/image.jpg
```

### Image Transformations

```typescript
// Resize: /_ipx/w_300/image.jpg
// Crop: /_ipx/w_300,h_200,s_fill/image.jpg
// Quality: /_ipx/q_80/image.jpg
// Format: /_ipx/f_webp/image.jpg
```

### H3 Integration

```typescript
import { createServer } from 'h3'
import { ipx } from 'ipx/h3'

const app = createServer()
app.use('/_ipx/**', ipx({
  domains: ['example.com'],
}))
```

### Custom Transformations

```typescript
const ipx = createIPX({
  domains: ['example.com'],
  alias: {
    thumbnail: (img, { width, height }) => {
      return img.resize(width || 200, height || 200)
    },
  },
})
```

## Key Points

- High performance: Built on Sharp/libvips
- Secure: Domain whitelisting and validation
- Transformations: Resize, crop, format conversion, quality
- Caching: Built-in caching support
- Universal: Works with H3, Nitro, and standalone

<!--
Source references:
- https://github.com/unjs/ipx
-->
