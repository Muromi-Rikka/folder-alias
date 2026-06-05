---
name: uqr
description: Generate QR Code universally, in any runtime, to ANSI, Unicode or SVG
---

# Uqr

Uqr generates QR codes universally across any runtime, outputting to ANSI, Unicode, or SVG formats.

## Usage

### Generate QR Code

```typescript
import { generateQR } from 'uqr'

const qr = await generateQR('https://example.com')
```

### ANSI Output

```typescript
const qr = await generateQR('https://example.com', {
  format: 'ansi',
})
// Outputs ANSI-colored QR code for terminal
```

### SVG Output

```typescript
const qr = await generateQR('https://example.com', {
  format: 'svg',
})
// Returns SVG string
```

### Unicode Output

```typescript
const qr = await generateQR('https://example.com', {
  format: 'unicode',
})
// Returns Unicode QR code
```

## Key Points

- Universal: Works in any runtime
- Multiple formats: ANSI, Unicode, SVG
- Type-safe: Full TypeScript support
- Flexible: Various output formats
- Easy: Simple API

<!--
Source references:
- https://github.com/unjs/uqr
-->
