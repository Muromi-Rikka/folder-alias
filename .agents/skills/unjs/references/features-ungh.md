---
name: ungh
description: Unlimited access to GitHub API
---

# Ungh

Ungh provides unlimited access to the GitHub API with automatic rate limit handling and caching.

## Usage

### Fetch Repository

```typescript
import { fetchRepo } from 'ungh'

const repo = await fetchRepo('unjs/unjs')
```

### Fetch Releases

```typescript
import { fetchReleases } from 'ungh'

const releases = await fetchReleases('unjs/unjs')
```

### Fetch Contributors

```typescript
import { fetchContributors } from 'ungh'

const contributors = await fetchContributors('unjs/unjs')
```

### Custom API Calls

```typescript
import { githubFetch } from 'ungh'

const data = await githubFetch('/repos/unjs/unjs')
```

## Key Points

- Unlimited: Handles rate limits automatically
- Caching: Built-in caching for performance
- Type-safe: Full TypeScript support
- Simple: Easy-to-use API
- Reliable: Handles errors gracefully

<!--
Source references:
- https://github.com/unjs/ungh
-->
