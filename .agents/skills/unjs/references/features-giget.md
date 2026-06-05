---
name: giget
description: Download templates and git repositories
---

# Giget

Giget downloads templates and git repositories with support for various sources and authentication.

## Usage

### Download from GitHub

```typescript
import { downloadTemplate } from 'giget'

await downloadTemplate('github:user/repo', {
  dir: './my-project'
})
```

### Download Specific Branch/Tag

```typescript
await downloadTemplate('github:user/repo#main', {
  dir: './my-project'
})

await downloadTemplate('github:user/repo#v1.0.0', {
  dir: './my-project'
})
```

### Download Subdirectory

```typescript
await downloadTemplate('github:user/repo/templates/vue', {
  dir: './my-project'
})
```

### Custom Registry

```typescript
await downloadTemplate('my-registry:template-name', {
  dir: './my-project',
  registry: 'https://my-registry.com'
})
```

## Key Points

- Multiple sources: GitHub, GitLab, Bitbucket, and custom registries
- Authentication: Supports tokens and SSH keys
- Subdirectories: Can download specific subdirectories
- Caching: Built-in template caching
- Type-safe: Full TypeScript support

<!--
Source references:
- https://github.com/unjs/giget
-->
