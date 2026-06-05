---
name: jimp-compact
description: Lightweight version of Jimp - image processing library written entirely in JavaScript
---

# Jimp-compact

Jimp-compact is a lightweight version of Jimp, providing image processing capabilities written entirely in JavaScript without native dependencies.

## Usage

### Load and Process Image

```typescript
import Jimp from 'jimp-compact'

const image = await Jimp.read('image.jpg')
image.resize(300, 300)
image.quality(80)
await image.writeAsync('output.jpg')
```

### Image Manipulation

```typescript
const image = await Jimp.read('image.jpg')

// Resize
image.resize(200, 200)

// Crop
image.crop(0, 0, 100, 100)

// Rotate
image.rotate(90)

// Blur
image.blur(5)
```

### Convert Format

```typescript
const image = await Jimp.read('image.jpg')
await image.writeAsync('output.png') // Convert to PNG
```

## Key Points

- Lightweight: Smaller bundle size than full Jimp
- Pure JS: No native dependencies
- Multiple formats: Supports JPEG, PNG, BMP, etc.
- Type-safe: Full TypeScript support
- Universal: Works in Node.js and browser

<!--
Source references:
- https://github.com/unjs/jimp-compact
-->
