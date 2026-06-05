---
name: consola
description: Elegant console wrapper with multiple reporters
---

# Consola

Consola is an elegant console wrapper that provides better logging with multiple reporters and log levels.

## Usage

### Basic Logging

```typescript
import { consola } from 'consola'

consola.info('Info message')
consola.success('Success message')
consola.warn('Warning message')
consola.error('Error message')
```

### Custom Logger

```typescript
import { createConsola } from 'consola'

const logger = createConsola({
  level: 4, // Log level
  formatOptions: {
    date: true,
    colors: true,
  },
})

logger.info('Custom logger')
```

### Reporters

```typescript
import { createConsola } from 'consola'
import { BasicReporter, FancyReporter } from 'consola'

const logger = createConsola({
  reporters: [
    new FancyReporter(), // Pretty output
    new BasicReporter(), // Simple output
  ],
})
```

### Log Levels

```typescript
consola.level = 3 // Set log level

consola.debug('Debug message') // Only shown if level >= 4
consola.trace('Trace message') // Only shown if level >= 5
```

## Key Points

- Multiple reporters: Fancy, basic, browser, and custom reporters
- Log levels: Control verbosity with log levels
- Formatted output: Pretty formatted console output
- Type-safe: Full TypeScript support
- Universal: Works in Node.js, browser, and edge

<!--
Source references:
- https://github.com/unjs/consola
-->
