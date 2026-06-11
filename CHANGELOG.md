# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Config file location setting (`folder-alias.configLocation`) with auto, vscode, and root save strategies

## [1.0.2]

### Added
- Delete alias command with confirmation dialog

## [1.0.1]

### Fixed
- Decode URI-encoded path segments in decoration provider lookup
- Remove `files` property from package.json to resolve vsce conflict with `.vscodeignore`
- Add type annotations to test config objects for typecheck compliance

### Added
- End-to-end tests for decoration provider with space-containing paths

## [1.0.0]

### Added
- Internationalization (i18n) support for English and Chinese
- Workspace manager for multi-workspace folder support
- Context menu grouping for Add Alias and Refresh Aliases
- CI/CD via GitHub Actions
- Unit tests for useConfig, file.util, and workspace manager

### Changed
- Migrated from lodash-es to es-toolkit for smaller bundle size
- Simplified findInstanceByUri with es-toolkit maxBy
- Simplified refresh-aliases URI collection with flatMap
- Migrated to vitest for testing
- Improved error handling in file I/O utilities
- Narrowed FileSystemWatcher scope for better performance

### Fixed
- Fixed `merge()` mutating publicConfig in computed
- Fixed cross-platform path handling in add-alias command
- Replaced ufo with pathe for file path operations
- Restored FileDecoration.validate with proper error handling
- Remove invalid icon reference from refresh command
- Fix lint issues in useWorkspaceManager (import order, arrow parens)

### Removed
- Dead code: `update.util.ts`, `config.ts`, unused types
- lodash-es dependency (replaced by es-toolkit)

## [0.1.3]

### Added
- `.vscode` directory configuration priority
- Smart initialization: only creates root-level config files when `.vscode` versions don't exist
- Improved file organization: keep workspace root clean by using `.vscode/` directory

## [0.1.0]

### Changed
- Migrated extension to use reactive-vscode for better maintainability
- Updated build and configuration files to modern standards

### Added
- New commands for managing aliases and tooltips

### Removed
- Deprecated templates and utilities

## [0.0.6]

### Added
- Templates: maven, gradle, spring boot, flutter, vite, vue-cli

## [0.0.5]

### Added
- Default project templates
- Optimized workspace and config loading
