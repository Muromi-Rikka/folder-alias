---
name: vsce-release
description: Bump version, package, and publish the VS Code extension to the marketplace
disable-model-invocation: true
---

# VS Code Extension Release

This skill automates the release workflow for the `folder-alias` VS Code extension.

## Steps

1. **Pre-flight checks**:
   - Ensure working tree is clean (`git status`)
   - Run `pnpm run typecheck` to verify no type errors
   - Run `pnpm run lint` to verify lint passes

2. **Bump version**:
   - Run `pnpm run release` (uses `bumpp` for interactive version bump + publish)
   - This will prompt for version bump type (patch/minor/major)

3. **Verify**:
   - Confirm the new version is tagged in git
   - Confirm the package was published to the VS Code marketplace

## Usage

Run `/vsce-release` to start the release process.
