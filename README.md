# Folder Alias - VS Code Extension

[![Version](https://img.shields.io/visual-studio-marketplace/v/rikka.folder-alias)](https://marketplace.visualstudio.com/items?itemName=rikka.folder-alias)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/rikka.folder-alias)](https://marketplace.visualstudio.com/items?itemName=rikka.folder-alias)
[![License](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)

**English** | [中文](./README.zh-CN.md)

A powerful VS Code extension that allows you to add customizable aliases and remarks to files and folders in your file tree, making project navigation and organization more intuitive.

![Demo](./docs/images/simple.gif)

## 🌟 Features

- **Customizable Aliases**: Add meaningful names and descriptions to any file or folder
- **Dual Configuration**: Support for both public (shared) and private (personal) aliases
- **Visual Integration**: Seamlessly integrated into VS Code's file explorer
- **Easy Management**: Simple right-click interface for adding and modifying aliases
- **Persistent Storage**: Aliases are saved in JSON configuration files within your workspace

## 🚀 Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"Folder Alias"**
4. Click **Install**
5. Reload VS Code when prompted

### Manual Installation

1. Download the latest `.vsix` file from [releases](https://github.com/Muromi-Rikka/folder-alias/releases)
2. Open VS Code
3. Go to **Extensions**
4. Click **...** (More Actions) → **Install from VSIX...**
5. Select the downloaded `.vsix` file

## 🎯 Usage

### Adding an Alias

1. **Right-click** on any file or folder in the VS Code Explorer
2. Select **"Add Alias"**
3. Choose the alias scope:
   - **Public**: Saved in `folder-alias.json` (can be committed to version control)
   - **Private**: Saved in `private-folder-alias.json` (ignored by version control)
4. Enter your desired alias/description
5. Press **Enter** to save

### Modifying an Alias

1. **Right-click** on a file/folder that already has an alias
2. Select **"Add Alias"**
3. Edit the existing text or clear it to remove the alias
4. Press **Enter** to update

### Refreshing Aliases

After manually editing the JSON configuration files, you can refresh the file explorer display:

1. **Right-click** anywhere in the Explorer
2. Select **"Refresh Aliases"**
3. Or use **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`) and type "Refresh Aliases"
4. The file explorer will reload all alias configurations from the JSON files

### File Structure

The extension supports two configuration locations with smart priority:

#### Configuration Priority

The extension will **prioritize** `.vscode` directory over root directory:

- **`.vscode/folder-alias.json`** - Public aliases (highest priority)
- **`.vscode/private-folder-alias.json`** - Private aliases (highest priority)
- **`folder-alias.json`** - Public aliases (fallback)
- **`private-folder-alias.json`** - Private aliases (fallback)

**Behavior Rules:**
- **Reading**: If `.vscode/folder-alias.json` exists, it will be used instead of root `folder-alias.json`
- **Initialization**: The extension will only create configuration files in the root directory if no corresponding files exist in `.vscode`
- **Saving**: When saving aliases, the extension will save to `.vscode` only if the corresponding file already exists there, otherwise to root directory

#### File Locations

You can organize your aliases in either location:

- **`.vscode/` directory**: Keeps your workspace root clean and organized
- **Root directory**: Traditional location, compatible with existing setups

#### Example Configuration

```json
{
  "src/components/Button": {
    "description": "🎛️ Reusable Button Component",
    "tooltip": "Primary button component with variants"
  },
  "docs/api": {
    "description": "📚 API Documentation",
    "tooltip": "REST API endpoints documentation"
  }
}
```

## 🛠️ Development

### Prerequisites

- Node.js (v18+)
- pnpm (preferred package manager)
- VS Code

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/Muromi-Rikka/folder-alias.git
cd folder-alias

# Install dependencies
pnpm install

# Build the extension
pnpm build

# Run in development mode (with watch)
pnpm dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Build the extension |
| `pnpm dev` | Build in watch mode for development |
| `pnpm test` | Run tests |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm pack` | Package the extension |
| `pnpm publish` | Publish to VS Code Marketplace |

### Debugging

1. Open the project in VS Code
2. Press `F5` to open a new Extension Development Host window
3. Make changes to the source code
4. Reload (`Ctrl+R` / `Cmd+R`) the Extension Development Host to see changes

## 📝 Configuration

### Extension Settings

The extension automatically creates and manages configuration files in your workspace. No additional settings are required.

### Workspace Integration

For team collaboration, consider adding this to your `.gitignore`:

```gitignore
# Folder Alias - Personal aliases
private-folder-alias.json
```

## 🔧 Architecture

### Core Components

- **`src/index.ts`** - Extension entry point and activation
- **`src/command/add-alias.command.ts`** - Command handler for adding/modifying aliases
- **`src/file-alias.ts`** - File decoration provider and alias management
- **`src/utils/file.util.ts`** - File I/O utilities for configuration management

### Technologies Used

- **TypeScript** - Primary language
- **reactive-vscode** - Reactive programming for VS Code extensions
- **tsdown** - Build tool for TypeScript
- **ESLint** - Code linting
- **Vitest** - Testing framework

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Run linting: `pnpm lint`
6. Commit your changes: `git commit -am 'Add new feature'`
7. Push to the branch: `git push origin feature/new-feature`
8. Submit a pull request

## 📄 License

This project is licensed under the [GPLv3 License](LICENSE).

## 🐛 Issues and Support

If you encounter any issues or have feature requests, please [create an issue](https://github.com/Muromi-Rikka/folder-alias/issues) on GitHub.

## 📈 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes and updates.

---

**Made with ❤️ by [Rikka](https://github.com/Muromi-Rikka)**
