# Folder Alias - VS Code 扩展

[![版本](https://img.shields.io/visual-studio-marketplace/v/rikka.folder-alias)](https://marketplace.visualstudio.com/items?itemName=rikka.folder-alias)
[![下载量](https://img.shields.io/visual-studio-marketplace/d/rikka.folder-alias)](https://marketplace.visualstudio.com/items?itemName=rikka.folder-alias)
[![许可证](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)

**English** | [中文](./README.zh-CN.md)

一个强大的 VS Code 扩展，允许您为文件树中的文件和文件夹添加可自定义的别名和备注，让项目导航和组织更加直观。

![演示](./docs/images/simple.gif)

## 🌟 功能特性

- **可自定义别名**：为任何文件或文件夹添加有意义的名称和描述
- **双重配置**：支持公共（共享）和私有（个人）别名
- **视觉集成**：无缝集成到 VS Code 的文件资源管理器中
- **简易管理**：简单的右键界面用于添加和修改别名
- **持久存储**：别名保存在工作区内的 JSON 配置文件中

## 🚀 安装

### 从 VS Code 市场

1. 打开 VS Code
2. 进入 **扩展** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. 搜索 **"Folder Alias"**
4. 点击 **安装**
5. 提示时重新加载 VS Code

### 手动安装

1. 从 [发布页](https://github.com/Muromi-Rikka/folder-alias/releases) 下载最新的 `.vsix` 文件
2. 打开 VS Code
3. 进入 **扩展**
4. 点击 **...** (更多操作) → **从 VSIX 安装...**
5. 选择下载的 `.vsix` 文件

## 🎯 使用方法

### 添加别名

1. **右键点击** VS Code 资源管理器中的任何文件或文件夹
2. 选择 **"添加别名"**
3. 选择别名范围：
   - **公共**：保存在 `folder-alias.json`（可提交到版本控制）
   - **私有**：保存在 `private-folder-alias.json`（版本控制忽略）
4. 输入所需的别名/描述
5. 按 **Enter** 保存

### 修改别名

1. **右键点击** 已有别名的文件/文件夹
2. 选择 **"添加别名"**
3. 编辑现有文本或清空以删除别名
4. 按 **Enter** 更新

### 刷新别名

手动编辑 JSON 配置文件后，可以刷新文件资源管理器显示：

1. **右键点击** 资源管理器任意位置
2. 选择 **"刷新别名"**
3. 或使用 **命令面板** (`Ctrl+Shift+P` / `Cmd+Shift+P`) 并输入 "Refresh Aliases"
4. 文件资源管理器将重新加载所有别名配置

### 文件结构

扩展支持两种配置位置，具有智能优先级：

#### 配置优先级

扩展会**优先**使用 `.vscode` 目录而不是根目录：

- **`.vscode/folder-alias.json`** - 公共别名（最高优先级）
- **`.vscode/private-folder-alias.json`** - 私有别名（最高优先级）
- **`folder-alias.json`** - 公共别名（回退）
- **`private-folder-alias.json`** - 私有别名（回退）

**行为规则：**
- **读取**：如果 `.vscode/folder-alias.json` 存在，将使用该文件而不是根目录的 `folder-alias.json`
- **初始化**：扩展只会在根目录创建默认配置文件，如果 `.vscode` 目录中不存在对应的配置文件
- **保存**：保存别名时，扩展只在检测到 `.vscode` 目录已存在对应配置文件时才保存到 `.vscode` 目录，否则保存到根目录

#### 文件位置

您可以将别名配置组织在任一位置：

- **`.vscode/` 目录**：保持工作区根目录整洁有序
- **根目录**：传统位置，与现有设置兼容

#### 配置示例

```json
{
  "src/components/Button": {
    "description": "🎛️ 可复用按钮组件",
    "tooltip": "主要按钮组件，带变体样式"
  },
  "docs/api": {
    "description": "📚 API 文档",
    "tooltip": "REST API 端点文档"
  }
}
```

## 🛠️ 开发

### 前置要求

- Node.js (v18+)
- pnpm（推荐包管理器）
- VS Code

### 设置开发环境

```bash
# 克隆仓库
git clone https://github.com/Muromi-Rikka/folder-alias.git
cd folder-alias

# 安装依赖
pnpm install

# 构建扩展
pnpm build

# 开发模式运行（带监听）
pnpm dev
```

### 可用脚本

| 命令 | 描述 |
|---------|-------------|
| `pnpm build` | 构建扩展 |
| `pnpm dev` | 开发模式构建（带监听） |
| `pnpm test` | 运行测试 |
| `pnpm lint` | 运行 ESLint |
| `pnpm typecheck` | 运行 TypeScript 类型检查 |
| `pnpm pack` | 打包扩展 |
| `pnpm publish` | 发布到 VS Code 市场 |

### 调试

1. 在 VS Code 中打开项目
2. 按 `F5` 打开新的扩展开发宿主窗口
3. 对源代码进行更改
4. 重新加载 (`Ctrl+R` / `Cmd+R`) 扩展开发宿主以查看更改

## 📝 配置

### 扩展设置

扩展会自动创建和管理配置文件，无需额外设置。

### 工作区集成

为了团队协作，考虑添加到 `.gitignore`：

```gitignore
# 文件夹别名 - 个人别名
private-folder-alias.json
```

## 🔧 架构

### 核心组件

- **`src/index.ts`** - 扩展入口点和激活
- **`src/command/add-alias.command.ts`** - 添加/修改别名的命令处理器
- **`src/file-alias.ts`** - 文件装饰提供者和别名管理
- **`src/utils/file.util.ts`** - 配置管理的文件 I/O 工具

### 使用的技术

- **TypeScript** - 主要语言
- **reactive-vscode** - VS Code 扩展的响应式编程
- **tsdown** - TypeScript 构建工具
- **ESLint** - 代码检查
- **Vitest** - 测试框架

## 🤝 贡献

我们欢迎贡献！请查看我们的 [贡献指南](CONTRIBUTING.md) 了解详情。

### 贡献者快速开始

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 进行更改
4. 运行测试：`pnpm test`
5. 运行检查：`pnpm lint`
6. 提交更改：`git commit -am '添加新功能'`
7. 推送到分支：`git push origin feature/new-feature`
8. 提交拉取请求

## 📄 许可证

本项目采用 [GPLv3 许可证](LICENSE) 授权。

## 🐛 问题和支持

如果您遇到任何问题或有功能请求，请在 GitHub 上 [创建问题](https://github.com/Muromi-Rikka/folder-alias/issues)。

## 📈 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解详细的更改和更新历史。

---

**由 [Rikka](https://github.com/Muromi-Rikka) 用心制作 ❤️**
