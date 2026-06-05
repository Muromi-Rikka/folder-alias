---
name: unpdf
description: Utilities to work with PDFs in Node.js, browser and workers
---

# Unpdf

Unpdf provides utilities for working with PDFs across Node.js, browser, and workers environments.

## Usage

### Parse PDF

```typescript
import { parsePDF } from 'unpdf'

const pdf = await parsePDF(buffer)
```

### Extract Text

```typescript
import { extractText } from 'unpdf'

const text = await extractText(buffer)
```

### Get Metadata

```typescript
import { getPDFMetadata } from 'unpdf'

const metadata = await getPDFMetadata(buffer)
// { pages: number, title: string, ... }
```

### Generate PDF

```typescript
import { generatePDF } from 'unpdf'

const pdf = await generatePDF(html)
```

## Key Points

- Universal: Works in Node.js, browser, and workers
- Multiple operations: Parse, extract, generate PDFs
- Type-safe: Full TypeScript support
- Flexible: Various PDF operations
- Reliable: Handles different PDF formats

<!--
Source references:
- https://github.com/unjs/unpdf
-->
