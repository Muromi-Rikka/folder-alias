---
name: scule
description: String case conversion utilities
---

# Scule

Scule provides utilities for converting strings between different case formats (camelCase, kebab-case, PascalCase, etc.).

## Usage

### Case Conversion

```typescript
import { camelCase, kebabCase, pascalCase, snakeCase } from 'scule'

camelCase('hello-world') // 'helloWorld'
kebabCase('helloWorld') // 'hello-world'
pascalCase('hello-world') // 'HelloWorld'
snakeCase('helloWorld') // 'hello_world'
```

### Pluralization

```typescript
import { pluralize, singularize } from 'scule'

pluralize('user') // 'users'
singularize('users') // 'user'
```

### String Utilities

```typescript
import { titleCase, upperFirst, lowerFirst } from 'scule'

titleCase('hello world') // 'Hello World'
upperFirst('hello') // 'Hello'
lowerFirst('Hello') // 'hello'
```

## Key Points

- Multiple formats: Supports camelCase, kebab-case, PascalCase, snake_case
- Consistent: Handles edge cases and special characters
- Type-safe: Full TypeScript support
- Lightweight: Minimal dependencies
- Flexible: Works with various input formats

<!--
Source references:
- https://github.com/unjs/scule
-->
