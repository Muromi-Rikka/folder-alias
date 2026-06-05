---
name: unhead
description: Universal document head tag manager
---

# Unhead

Unhead is a universal document `<head>` tag manager that works across frameworks, providing a consistent API for managing head tags.

## Usage

### Basic Usage

```typescript
import { createHead } from 'unhead'

const head = createHead()

head.push({
  title: 'My Page',
  meta: [
    { name: 'description', content: 'Page description' },
  ],
})
```

### Vue Integration

```typescript
import { createHead } from '@unhead/vue'

const app = createApp(App)
app.use(createHead())
```

### React Integration

```typescript
import { HeadProvider } from '@unhead/react'

<HeadProvider>
  <App />
</HeadProvider>
```

### SSR Support

```typescript
const head = createHead()

// Render head tags for SSR
const headTags = head.renderToString()
```

## Key Points

- Universal: Works with Vue, React, Svelte, etc.
- Type-safe: Full TypeScript support
- SSR: Server-side rendering support
- Flexible: Supports all head tags
- Reactive: Updates head tags reactively

<!--
Source references:
- https://github.com/unjs/unhead
-->
