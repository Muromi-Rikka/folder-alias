---
name: changelogen
description: Generate beautiful changelogs using conventional commits
---

# Changelogen

Changelogen generates beautiful changelogs from conventional commits, automatically categorizing changes and formatting them nicely.

## Usage

### Basic Usage

```typescript
import { generateChangelog } from 'changelogen'

const changelog = await generateChangelog({
  from: 'v1.0.0',
  to: 'v1.1.0',
})
```

### Custom Configuration

```typescript
const changelog = await generateChangelog({
  from: 'v1.0.0',
  to: 'v1.1.0',
  types: {
    feat: { title: '🚀 Features' },
    fix: { title: '🐛 Bug Fixes' },
    perf: { title: '⚡ Performance' },
  },
})
```

### CLI Usage

```bash
changelogen --from v1.0.0 --to v1.1.0
```

## Key Points

- Conventional commits: Uses conventional commit format
- Categorized: Automatically categorizes changes
- Beautiful: Formatted output with emojis
- Type-safe: Full TypeScript support
- CI-friendly: Can be integrated into release workflows

<!--
Source references:
- https://github.com/unjs/changelogen
-->
