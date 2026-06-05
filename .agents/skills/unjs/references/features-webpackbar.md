---
name: webpackbar
description: Elegant progress bar and profiler for webpack 3, 4 and 5
---

# Webpackbar

Webpackbar provides an elegant progress bar and profiler for webpack builds, showing build progress and timing information.

## Usage

### Basic Usage

```typescript
import WebpackBar from 'webpackbar'

module.exports = {
  plugins: [
    new WebpackBar(),
  ],
}
```

### Custom Configuration

```typescript
new WebpackBar({
  name: 'Building',
  color: 'green',
  profile: true, // Show profiling info
})
```

### Profiling

```typescript
new WebpackBar({
  profile: true,
  // Shows detailed timing for each plugin/loader
})
```

## Key Points

- Progress bar: Visual build progress
- Profiling: Detailed timing information
- Customizable: Colors, names, etc.
- Compatible: Works with webpack 3, 4, 5
- Useful: Better developer experience

<!--
Source references:
- https://github.com/unjs/webpackbar
-->
