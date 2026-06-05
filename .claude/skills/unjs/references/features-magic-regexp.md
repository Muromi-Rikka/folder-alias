---
name: magic-regexp
description: A compiled-away, type-safe, readable RegExp alternative
---

# Magic-regexp

Magic-regexp provides a type-safe, readable alternative to regular expressions that compiles away at build time.

## Usage

### Basic Pattern

```typescript
import { createRegExp, exactly, oneOrMore, digit } from 'magic-regexp'

const regexp = createRegExp(
  exactly('hello').and(oneOrMore(digit))
)
// /hello\d+/
```

### Type-Safe Groups

```typescript
import { createRegExp, exactly, group, word } from 'magic-regexp'

const regexp = createRegExp(
  exactly('user:').and(group(word))
)

const match = 'user:john'.match(regexp)
// match.groups.name is type-safe
```

### Complex Patterns

```typescript
import { createRegExp, exactly, maybe, char, oneOrMore } from 'magic-regexp'

const emailRegexp = createRegExp(
  oneOrMore(char).and('@').and(oneOrMore(char)).and('.').and(oneOrMore(char))
)
```

## Key Points

- Type-safe: Full TypeScript support with type inference
- Readable: More readable than raw regex
- Compiled: Compiles to native RegExp at build time
- Groups: Type-safe capture groups
- Flexible: Supports complex patterns

<!--
Source references:
- https://github.com/unjs/magic-regexp
- https://regexp.dev
-->
