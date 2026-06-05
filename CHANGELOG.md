# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed
- Migrated to vitest for testing
- Added CI/CD via GitHub Actions
- Improved error handling in file I/O utilities
- Narrowed FileSystemWatcher scope for better performance

### Fixed
- Fixed `merge()` mutating publicConfig in computed
- Fixed cross-platform path handling in add-alias command
- Replaced ufo with pathe for file path operations
- Restored FileDecoration.validate with proper error handling

### Removed
- Dead code: `update.util.ts`, `config.ts`, unused types

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
