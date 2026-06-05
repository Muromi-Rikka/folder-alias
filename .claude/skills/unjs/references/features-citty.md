---
name: citty
description: Elegant CLI builder with type-safe commands
---

# Citty

Citty is an elegant CLI builder that provides a type-safe way to define commands, options, and arguments.

## Usage

### Basic CLI

```typescript
import { defineCommand, runMain } from 'citty'

const main = defineCommand({
  meta: {
    name: 'my-cli',
    version: '1.0.0',
  },
  args: {
    name: {
      type: 'positional',
      description: 'Name to greet',
      required: true,
    },
  },
  run({ args }) {
    console.log(`Hello, ${args.name}!`)
  },
})

runMain(main)
```

### Commands and Subcommands

```typescript
const main = defineCommand({
  subCommands: {
    build: defineCommand({
      args: {
        output: {
          type: 'string',
          alias: 'o',
          description: 'Output directory',
        },
      },
      run({ args }) {
        console.log(`Building to ${args.output}`)
      },
    }),
    dev: defineCommand({
      run() {
        console.log('Starting dev server...')
      },
    }),
  },
})
```

### Options and Flags

```typescript
const main = defineCommand({
  args: {
    verbose: {
      type: 'boolean',
      alias: 'v',
      description: 'Verbose output',
    },
    port: {
      type: 'number',
      default: 3000,
      description: 'Port number',
    },
  },
  run({ args }) {
    console.log(`Port: ${args.port}, Verbose: ${args.verbose}`)
  },
})
```

## Key Points

- Type-safe: Full TypeScript support with inferred types
- Elegant API: Clean and intuitive command definition
- Help generation: Automatic help text generation
- Subcommands: Support for nested commands
- Validation: Built-in argument validation

<!--
Source references:
- https://github.com/unjs/citty
-->
