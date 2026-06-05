---
name: serve-placeholder
description: Smart placeholder for missing assets
---

# Serve-placeholder

Serve-placeholder provides smart placeholders for missing assets, generating placeholder images, SVGs, or other content on the fly.

## Usage

### Image Placeholder

```typescript
import { createPlaceholder } from 'serve-placeholder'

const placeholder = createPlaceholder({
  width: 300,
  height: 200,
  text: 'Image',
})
```

### H3 Integration

```typescript
import { createServer } from 'h3'
import { placeholderMiddleware } from 'serve-placeholder'

const app = createServer()
app.use('/placeholder/**', placeholderMiddleware)
```

### Custom Placeholders

```typescript
const placeholder = createPlaceholder({
  width: 300,
  height: 200,
  backgroundColor: '#f0f0f0',
  textColor: '#333',
  text: 'Placeholder',
})
```

## Key Points

- Smart: Generates placeholders on demand
- Flexible: Customizable size, colors, text
- Fast: Efficient placeholder generation
- Universal: Works with H3, Nitro, and standalone
- Type-safe: Full TypeScript support

<!--
Source references:
- https://github.com/unjs/serve-placeholder
-->
