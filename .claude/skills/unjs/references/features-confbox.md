---
name: confbox
description: Compact and high quality YAML, TOML, JSONC and JSON5 parsers
---

# Confbox

Confbox provides compact and high-quality parsers for YAML, TOML, JSONC, and JSON5 configuration formats.

## Usage

### Parse YAML

```typescript
import { parseYAML } from 'confbox'

const config = parseYAML(yamlString)
```

### Parse TOML

```typescript
import { parseTOML } from 'confbox'

const config = parseTOML(tomlString)
```

### Parse JSONC/JSON5

```typescript
import { parseJSONC, parseJSON5 } from 'confbox'

const config = parseJSONC(jsoncString)
const config5 = parseJSON5(json5String)
```

### Stringify

```typescript
import { stringifyYAML, stringifyTOML } from 'confbox'

const yaml = stringifyYAML(config)
const toml = stringifyTOML(config)
```

## Key Points

- Multiple formats: Supports YAML, TOML, JSONC, JSON5
- High quality: Robust parsing with error handling
- Compact: Minimal bundle size
- Type-safe: Full TypeScript support
- Fast: Optimized parsing performance

<!--
Source references:
- https://github.com/unjs/confbox
-->
