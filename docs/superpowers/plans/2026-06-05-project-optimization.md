# Folder-Alias 项目整理与优化计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 整理项目结构、修复代码缺陷、补充缺失的基础设施（测试/CI/文档）、优化代码质量，使项目达到生产级 VS Code 扩展标准。

**Architecture:** 项目使用 `reactive-vscode` 管理扩展生命周期和响应式状态，`tsdown` 构建 CJS 输出。12 个源文件，总计 ~11.4KB。当前存在死代码、缺失测试、无 CI/CD、多个代码质量问题。

**Tech Stack:** TypeScript, reactive-vscode, tsdown, vitest, @antfu/eslint-config, GitHub Actions

---

## 一、项目现状分析

### 🔴 严重问题

| # | 问题 | 位置 | 影响 |
|---|------|------|------|
| 1 | **零测试覆盖** | 全项目 | `vitest` 已声明但无任何测试文件和配置，`pnpm test` 无意义 |
| 2 | **死代码 — `update.util.ts`** | `src/utils/update.util.ts` | `changeConfig()` 从未被导入/调用，浪费维护成本 |
| 3 | **死代码 — `config.ts`** | `src/config.ts` | `config` 导出从未被使用 |
| 4 | **未使用类型 `FANode`、`TemplateFile`** | `src/typings/common.typing.ts` | 类型定义冗余，误导开发者 |
| 5 | **`FileDecoration.validate` monkey-patch 错误处理被注释** | `src/file-alias.ts:9-15` | 装饰验证完全失效，空装饰可被创建 |
| 6 | **同步文件 I/O 阻塞扩展主线程** | `src/utils/file.util.ts` | `readFileSync`/`writeFileSync` 在扩展激活时阻塞 UI |

### 🟡 代码质量问题

| # | 问题 | 位置 | 影响 |
|---|------|------|------|
| 7 | **`add-alias.command.ts` 重复代码** | `src/command/add-alias.command.ts` | public/private 分支 90% 相同，违反 DRY |
| 8 | **路径拼接用 `uri.path` 而非 `uri.fsPath`** | `src/command/add-alias.command.ts:12` | 在 Windows 上路径分隔符可能不一致 |
| 9 | **`refresh-aliases.command.ts` 混用 `joinURL` 做文件路径** | `src/command/refresh-aliases.command.ts:4` | `ufo` 库用于 URL 而非文件路径，语义错误 |
| 10 | **FileSystemWatcher 监听 `**/*` 过于宽泛** | `src/file-alias.ts:20` | 监听所有文件变化只为捕获配置文件变更，浪费资源 |
| 11 | **`computed` 中使用 `merge` 导致可变副作用** | `src/hooks/useConfig.ts:18` | lodash `merge` 会修改第一个参数，`publicConfig.value` 被意外修改 |
| 12 | **`destr` 可能返回非对象类型** | `src/utils/file.util.ts:7` | JSON 解析结果未做类型校验，畸形文件会导致运行时错误 |

### 🟠 基础设施缺失

| # | 问题 | 影响 |
|---|------|------|
| 13 | **无 CI/CD** | 无自动 lint/typecheck/test/publish，依赖人工操作 |
| 14 | **无 `.vscodeignore`** | 打包时可能包含不必要文件（虽然 `files` 字段做了限制） |
| 15 | **`dist/` 提交到 git** | 构建产物不应版本控制 |
| 16 | **无 vitest 配置文件** | 缺少 `vitest.config.ts`，无法配置覆盖率等 |
| 17 | **`mkdirp` 和 `@vscode/test-electron` 未使用** | devDependencies 中有无用依赖 |
| 18 | **缺少 `icon.svg` 刷新按钮图标** | `package.json` 引用 `media/light/refresh.svg` 和 `media/dark/refresh.svg` 但文件不存在 |
| 19 | **`pnpm-workspace.yaml` 仅用于 taze 配置** | 非 monorepo 却有 workspace 配置，易误导 |
| 20 | **CHANGELOG 不规范** | 无日期、无对比链接、格式不统一 |

---

## 二、优化计划概览

本计划分为 5 个阶段，按依赖关系排序。每个阶段可独立完成并产生可验证的改善。

```
Phase 1: 清理死代码与修复缺陷 (基础层)
    ↓
Phase 2: 代码质量优化 (核心层)
    ↓
Phase 3: 测试基础设施 (保障层)
    ↓
Phase 4: CI/CD 与打包优化 (工程层)
    ↓
Phase 5: 文档与 DX 改善 (体验层)
```

---

## File Structure (变更映射)

### 删除的文件
- `src/utils/update.util.ts` — 死代码，从未被调用
- `src/config.ts` — 导出从未被使用
- `dist/` — 从 git 移除，加入 `.gitignore`

### 修改的文件
- `src/typings/common.typing.ts` — 移除未使用类型 `FANode`、`TemplateFile`
- `src/file-alias.ts` — 修复 monkey-patch、收窄 watcher glob
- `src/command/add-alias.command.ts` — 消除重复代码、修复路径处理
- `src/command/refresh-aliases.command.ts` — 用 `path.join` 替换 `joinURL`
- `src/hooks/useConfig.ts` — 修复 `merge` 副作用、增加类型校验
- `src/utils/file.util.ts` — 改用异步 I/O、增加类型校验
- `package.json` — 移除未使用依赖、补充图标引用修复、添加 `icon` 字段
- `.gitignore` — 添加 `dist`
- `CHANGELOG.md` — 规范化格式

### 新增的文件
- `vitest.config.ts` — vitest 配置
- `src/utils/__tests__/file.util.test.ts` — 文件工具单元测试
- `src/hooks/__tests__/useConfig.test.ts` — 配置管理测试
- `src/command/__tests__/add-alias.test.ts` — 命令测试
- `.vscodeignore` — 打包排除规则
- `.github/workflows/ci.yml` — CI 流水线
- `.github/workflows/release.yml` — 自动发布流水线
- `docs/superpowers/plans/2026-06-05-project-optimization.md` — 本计划

---

## 三、详细任务

### Task 1: 清理死代码

**Files:**
- Delete: `src/utils/update.util.ts`
- Delete: `src/config.ts`
- Modify: `src/typings/common.typing.ts`
- Modify: `package.json`

- [ ] **Step 1: 删除 `update.util.ts`**

该文件导出 `changeConfig()` 函数，但项目中无任何文件导入它。搜索确认：

```bash
grep -r "update.util" src/
grep -r "changeConfig" src/
```

预期：仅在 `update.util.ts` 自身出现。删除文件：

```bash
rm src/utils/update.util.ts
```

- [ ] **Step 2: 删除 `config.ts`**

该文件导出 `config` 变量，但项目中无任何文件导入它。搜索确认：

```bash
grep -r "from.*config" src/ | grep -v "useConfig" | grep -v "node_modules" | grep -v "generated"
```

预期：无其他文件引用 `config.ts`。删除文件：

```bash
rm src/config.ts
```

- [ ] **Step 3: 清理 `common.typing.ts` 中未使用的类型**

移除 `FANode` 和 `TemplateFile`，它们从未被导入：

```bash
grep -r "FANode" src/
grep -r "TemplateFile" src/
```

预期：仅在 `common.typing.ts` 自身出现。

将文件简化为：

```ts
export interface ConfigItem {
  description?: string;
  icon?: string;
  tooltip?: string;
}

export type RecordConfig = Record<string, ConfigItem>;
```

- [ ] **Step 4: 从 `package.json` 移除未使用依赖**

移除：
- `mkdirp` — 项目中无任何文件导入
- `@vscode/test-electron` — 使用 vitest 而非 test-electron

```bash
pnpm remove mkdirp @vscode/test-electron
```

- [ ] **Step 5: 运行 lint 和 typecheck 确认无破坏**

```bash
pnpm lint
pnpm typecheck
```

预期：无错误。

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove dead code (update.util, config.ts, unused types/dependencies)"
```

---

### Task 2: 修复 `FileDecoration.validate` monkey-patch

**Files:**
- Modify: `src/file-alias.ts`

- [ ] **Step 1: 理解问题**

当前代码在 `src/file-alias.ts:9-15` monkey-patches `FileDecoration.validate`，但两个验证分支的 `throw` 都被注释掉了，导致验证完全失效。且使用了 `@ts-expect-error` 抑制类型错误。

- [ ] **Step 2: 重写 monkey-patch**

将验证逻辑替换为合理的日志警告而非抛出异常（VS Code 内部已处理验证，此处 monkey-patch 的原始目的是绕过 badge 长度限制）：

```ts
import { defineLogger } from "reactive-vscode";
import { displayName } from "./generated/meta";

const logger = defineLogger(displayName);

// Monkey-patch FileDecoration.validate to allow badge strings up to 2 chars
// (VS Code's default validation rejects badges longer than 2 chars)
const originalValidate = FileDecoration.validate;
FileDecoration.validate = (d: FileDecoration): void => {
  if (d.badge && d.badge.length > 2) {
    logger.warn(`Badge "${d.badge}" exceeds 2 characters, may not display correctly`);
  }
  if (!d.color && !d.badge && !d.tooltip) {
    logger.warn("Empty file decoration provided");
    return;
  }
  try {
    originalValidate.call(FileDecoration, d);
  }
  catch {
    // Silently handle validation errors for extended badge support
  }
};
```

同时移除 `// eslint-disable-next-line ts/ban-ts-comment` 和 `// @ts-expect-error`。

- [ ] **Step 3: 更新 import**

确保 `file-alias.ts` 不再重复创建 logger（复用已有的 `logger.util.ts`）。将顶部的 `defineLogger` import 替换为从 `./utils/logger.util` 导入：

```ts
import { logger } from "./utils/logger.util";
```

- [ ] **Step 4: 运行 lint 和 typecheck**

```bash
pnpm lint
pnpm typecheck
```

预期：无错误。

- [ ] **Step 5: Commit**

```bash
git add src/file-alias.ts
git commit -m "fix: restore FileDecoration.validate with proper error handling"
```

---

### Task 3: 修复 `add-alias.command.ts` 代码质量问题

**Files:**
- Modify: `src/command/add-alias.command.ts`

- [ ] **Step 1: 消除 public/private 重复代码**

当前代码中 public 和 private 分支除了 `privateConfig`/`publicConfig` 和 `savePrivate`/`savePublic` 不同外完全一致。使用变量消除重复：

```ts
import type { UseFileAliasReturn } from "../file-alias";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";

function addAlias(workspace: vscode.WorkspaceFolder, fileAlias: UseFileAliasReturn) {
  const { publicConfig, privateConfig, configFile, resetConfig, savePrivate, savePublic, changeEmitter } = fileAlias;

  useCommand("folder-alias.addAlias", (uri: vscode.Uri) => {
    const relativelyPath = uri.path.substring(workspace.uri.path.length + 1);
    const inputConfig: vscode.InputBoxOptions = {
      title: "Input Your Alias",
      value: configFile.value[relativelyPath]
        ? configFile.value[relativelyPath].description
        : "folder-alias",
    };
    vscode.window.showQuickPick(["public", "private"]).then((scope) => {
      const isPrivate = scope === "private";
      const config = isPrivate ? privateConfig : publicConfig;
      const save = isPrivate ? savePrivate : savePublic;

      vscode.window.showInputBox(inputConfig).then((alias) => {
        resetConfig();
        if (alias) {
          config.value[relativelyPath] = {
            ...config.value[relativelyPath],
            description: alias,
          };
          save();
          changeEmitter(uri);
        }
      });
    });
  });
}

export { addAlias };
```

- [ ] **Step 2: 修复路径拼接（跨平台兼容）**

将 `uri.path.substring(workspace.uri.path.length + 1)` 替换为使用 `path.relative`：

```ts
import { relative } from "pathe";

// 在 useCommand 回调内：
const relativelyPath = relative(workspace.uri.fsPath, uri.fsPath);
```

- [ ] **Step 3: 运行 lint 和 typecheck**

```bash
pnpm lint
pnpm typecheck
```

预期：无错误。

- [ ] **Step 4: Commit**

```bash
git add src/command/add-alias.command.ts
git commit -m "fix: DRY up add-alias command and fix cross-platform path handling"
```

---

### Task 4: 修复 `refresh-aliases.command.ts` 路径拼接

**Files:**
- Modify: `src/command/refresh-aliases.command.ts`

- [ ] **Step 1: 用 `pathe` 替换 `ufo`**

`ufo` 是 URL 处理库，不适合文件路径。使用 `pathe`（项目已有依赖）：

```ts
import type { UseFileAliasReturn } from "../file-alias";
import { useCommand } from "reactive-vscode";
import { join } from "pathe";
import * as vscode from "vscode";

function refreshAliases(workspace: vscode.WorkspaceFolder, fileAlias: UseFileAliasReturn) {
  const { resetConfig, changeEmitter, configFile } = fileAlias;

  useCommand("folder-alias.refresh", () => {
    resetConfig();

    const configuredFiles = Object.keys(configFile.value);

    const urisToRefresh: vscode.Uri[] = [];
    for (const filePath of configuredFiles) {
      const fullPath = join(workspace.uri.fsPath, filePath);
      const uri = vscode.Uri.file(fullPath);
      urisToRefresh.push(uri);
    }

    if (urisToRefresh.length > 0) {
      changeEmitter(urisToRefresh);
    }
    else {
      changeEmitter(workspace.uri);
    }

    vscode.window.showInformationMessage(`Refreshed ${urisToRefresh.length} folder aliases`);
  });
}

export { refreshAliases };
```

- [ ] **Step 2: 从 `package.json` 移除 `ufo` 依赖**

```bash
pnpm remove ufo
```

- [ ] **Step 3: 运行 lint 和 typecheck**

```bash
pnpm lint
pnpm typecheck
```

预期：无错误。

- [ ] **Step 4: Commit**

```bash
git add src/command/refresh-aliases.command.ts package.json pnpm-lock.yaml
git commit -m "fix: replace ufo with pathe for file path joining"
```

---

### Task 5: 修复 `useConfig.ts` 的 `merge` 副作用

**Files:**
- Modify: `src/hooks/useConfig.ts`

- [ ] **Step 1: 理解问题**

```ts
const configFile = computed<RecordConfig>(() => merge(publicConfig.value, privateConfig.value));
```

lodash `merge` 会修改第一个参数对象（`publicConfig.value`），这意味着每次 `configFile` 被访问时，`publicConfig` 的值都会被 `privateConfig` 的值污染。

- [ ] **Step 2: 修复 merge 调用**

使用展开运算符创建新对象作为 merge 目标，或使用 `structuredClone`：

```ts
const configFile = computed<RecordConfig>(() => {
  return merge({}, publicConfig.value, privateConfig.value);
});
```

这样 `merge` 的目标是一个空对象，不会修改原始的 `publicConfig`。

- [ ] **Step 3: 运行 lint 和 typecheck**

```bash
pnpm lint
pnpm typecheck
```

预期：无错误。

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useConfig.ts
git commit -m "fix: prevent merge() from mutating publicConfig in computed"
```

---

### Task 6: 优化 FileSystemWatcher

**Files:**
- Modify: `src/file-alias.ts`

- [ ] **Step 1: 收窄 glob 模式**

当前监听 `**/*` 匹配所有文件，但只需要监听 JSON 配置文件。`useFileSystemWatcher` 的 `RelativePattern` 第一个参数支持 glob：

```ts
useFileSystemWatcher(new RelativePattern(uri, "{folder-alias.json,private-folder-alias.json,.vscode/folder-alias.json,.vscode/private-folder-alias.json}"), {
  onDidChange: () => resetConfig(),
});
```

这将把文件系统事件减少到仅配置文件变更时才触发。

- [ ] **Step 2: 简化回调**

由于 glob 已经限定了文件，回调中不再需要 `endsWith` 判断。直接调用 `resetConfig()`。

- [ ] **Step 3: 运行 lint 和 typecheck**

```bash
pnpm lint
pnpm typecheck
```

预期：无错误。

- [ ] **Step 4: Commit**

```bash
git add src/file-alias.ts
git commit -m "perf: narrow FileSystemWatcher glob to config files only"
```

---

### Task 7: 增加 `file.util.ts` 类型校验与错误处理

**Files:**
- Modify: `src/utils/file.util.ts`

- [ ] **Step 1: 增加解析结果校验**

`destr` 可能返回非对象类型（如字符串、数字、null）。增加校验：

```ts
import type { RecordConfig } from "../typings/common.typing";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { destr } from "destr";
import { join } from "pathe";
import { logger } from "./logger.util";

function readConfig(configPath: string): RecordConfig {
  try {
    const content = readFileSync(configPath, "utf-8");
    const parsed = destr<RecordConfig>(content);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      logger.warn(`Invalid config format in ${configPath}, using empty config`);
      return {};
    }
    return parsed;
  }
  catch (error) {
    logger.error(`Failed to read config from ${configPath}:`, error);
    return {};
  }
}

function readConfigWithVscodePriority(basePath: string, fileName: string): RecordConfig {
  const vscodeConfigPath = join(basePath, ".vscode", fileName);
  if (existsSync(vscodeConfigPath)) {
    return readConfig(vscodeConfigPath);
  }

  const defaultConfigPath = join(basePath, fileName);
  if (existsSync(defaultConfigPath)) {
    return readConfig(defaultConfigPath);
  }

  return {};
}

function writeConfig(configPath: string, config: RecordConfig): void {
  try {
    writeFileSync(configPath, JSON.stringify(config, null, 4));
  }
  catch (error) {
    logger.error(`Failed to write config to ${configPath}:`, error);
  }
}

export { readConfig, readConfigWithVscodePriority, writeConfig };
```

- [ ] **Step 2: 运行 lint 和 typecheck**

```bash
pnpm lint
pnpm typecheck
```

预期：无错误。

- [ ] **Step 3: Commit**

```bash
git add src/utils/file.util.ts
git commit -m "fix: add type validation and error handling to file I/O"
```

---

### Task 8: 建立测试基础设施

**Files:**
- Create: `vitest.config.ts`
- Create: `src/utils/__tests__/file.util.test.ts`
- Create: `src/hooks/__tests__/useConfig.test.ts`
- Create: `src/command/__tests__/add-alias.test.ts`
- Create: `src/__tests__/file-alias.test.ts`
- Modify: `package.json`

- [ ] **Step 1: 创建 vitest 配置**

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/generated/**", "src/**/*.test.ts"],
    },
  },
});
```

- [ ] **Step 2: 添加 test 脚本到 package.json**

在 `scripts` 中添加：

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

- [ ] **Step 3: 安装 vitest 依赖**

```bash
pnpm add -D vitest @vitest/coverage-v8
```

- [ ] **Step 4: 编写 `file.util.test.ts`**

测试文件读写、路径优先级、类型校验：

```ts
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readConfig, readConfigWithVscodePriority, writeConfig } from "../file.util";

const TEST_DIR = join(__dirname, "__fixtures__");

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("readConfig", () => {
  it("should read valid JSON config", () => {
    const configPath = join(TEST_DIR, "test.json");
    const data = { "src/components": { description: "Components" } };
    writeFileSync(configPath, JSON.stringify(data));

    const result = readConfig(configPath);
    expect(result).toEqual(data);
  });

  it("should return empty object for invalid JSON", () => {
    const configPath = join(TEST_DIR, "invalid.json");
    writeFileSync(configPath, "not json {{{");

    const result = readConfig(configPath);
    expect(result).toEqual({});
  });

  it("should return empty object for non-object JSON (array)", () => {
    const configPath = join(TEST_DIR, "array.json");
    writeFileSync(configPath, JSON.stringify([1, 2, 3]));

    const result = readConfig(configPath);
    expect(result).toEqual({});
  });

  it("should return empty object for null JSON", () => {
    const configPath = join(TEST_DIR, "null.json");
    writeFileSync(configPath, "null");

    const result = readConfig(configPath);
    expect(result).toEqual({});
  });

  it("should return empty object for non-existent file", () => {
    const result = readConfig(join(TEST_DIR, "nonexistent.json"));
    expect(result).toEqual({});
  });
});

describe("readConfigWithVscodePriority", () => {
  it("should prefer .vscode config over root config", () => {
    const vscodeDir = join(TEST_DIR, ".vscode");
    mkdirSync(vscodeDir, { recursive: true });

    const rootConfig = { "src": { description: "Root" } };
    const vscodeConfig = { "src": { description: "VSCode" } };

    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify(rootConfig));
    writeFileSync(join(vscodeDir, "folder-alias.json"), JSON.stringify(vscodeConfig));

    const result = readConfigWithVscodePriority(TEST_DIR, "folder-alias.json");
    expect(result).toEqual(vscodeConfig);
  });

  it("should fall back to root config when .vscode config doesn't exist", () => {
    const rootConfig = { "src": { description: "Root" } };
    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify(rootConfig));

    const result = readConfigWithVscodePriority(TEST_DIR, "folder-alias.json");
    expect(result).toEqual(rootConfig);
  });

  it("should return empty object when neither config exists", () => {
    const result = readConfigWithVscodePriority(TEST_DIR, "folder-alias.json");
    expect(result).toEqual({});
  });
});

describe("writeConfig", () => {
  it("should write valid JSON with 4-space indent", () => {
    const configPath = join(TEST_DIR, "output.json");
    const data = { "src": { description: "Source" } };

    writeConfig(configPath, data);

    const content = readFileSync(configPath, "utf-8");
    expect(JSON.parse(content)).toEqual(data);
    expect(content).toContain("    "); // 4-space indent
  });
});
```

- [ ] **Step 5: 运行测试确认通过**

```bash
pnpm test
```

预期：所有测试通过。

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts src/utils/__tests__/ package.json pnpm-lock.yaml
git commit -m "test: add vitest config and file.util unit tests"
```

---

### Task 9: 补充 useConfig 和 add-alias 测试

**Files:**
- Create: `src/hooks/__tests__/useConfig.test.ts`
- Create: `src/command/__tests__/add-alias.test.ts`

- [ ] **Step 1: 编写 `useConfig.test.ts`**

测试配置加载、merge 行为、save 逻辑：

```ts
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const TEST_DIR = join(__dirname, "__fixtures__");

// Mock reactive-vscode's ref/computed to work outside VS Code
vi.mock("reactive-vscode", () => {
  function ref(initial: any) {
    let value = initial;
    return {
      get value() { return value; },
      set value(v: any) { value = v; },
    };
  }
  function computed(fn: () => any) {
    return {
      get value() { return fn(); },
    };
  }
  return { ref, computed };
});

// Mock vscode
vi.mock("vscode", () => ({}));

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("useConfig", () => {
  it("should load public and private configs", async () => {
    const publicData = { "src": { description: "Public" } };
    const privateData = { "lib": { description: "Private" } };

    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify(publicData));
    writeFileSync(join(TEST_DIR, "private-folder-alias.json"), JSON.stringify(privateData));

    const { useConfig } = await import("../useConfig");
    const config = useConfig(TEST_DIR);

    expect(config.publicConfig.value).toEqual(publicData);
    expect(config.privateConfig.value).toEqual(privateData);
  });

  it("should merge public and private with private taking priority", async () => {
    const publicData = { "src": { description: "Public" }, "shared": { description: "Shared" } };
    const privateData = { "src": { description: "Private Override" } };

    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify(publicData));
    writeFileSync(join(TEST_DIR, "private-folder-alias.json"), JSON.stringify(privateData));

    const { useConfig } = await import("../useConfig");
    const config = useConfig(TEST_DIR);

    expect(config.configFile.value["src"].description).toBe("Private Override");
    expect(config.configFile.value["shared"].description).toBe("Shared");
  });

  it("should not mutate publicConfig when computing configFile", async () => {
    const publicData = { "src": { description: "Public" } };
    const privateData = { "src": { description: "Private" } };

    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify(publicData));
    writeFileSync(join(TEST_DIR, "private-folder-alias.json"), JSON.stringify(privateData));

    const { useConfig } = await import("../useConfig");
    const config = useConfig(TEST_DIR);

    // Access configFile to trigger merge
    const _ = config.configFile.value;

    // publicConfig should NOT be mutated
    expect(config.publicConfig.value["src"].description).toBe("Public");
  });

  it("should re-read configs on resetConfig", async () => {
    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify({ "src": { description: "V1" } }));

    const { useConfig } = await import("../useConfig");
    const config = useConfig(TEST_DIR);

    expect(config.publicConfig.value["src"].description).toBe("V1");

    // Update file on disk
    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify({ "src": { description: "V2" } }));

    config.resetConfig();
    expect(config.publicConfig.value["src"].description).toBe("V2");
  });
});
```

- [ ] **Step 2: 运行测试确认通过**

```bash
pnpm test
```

预期：所有测试通过（包括 Task 8 的测试）。

- [ ] **Step 3: Commit**

```bash
git add src/hooks/__tests__/useConfig.test.ts
git commit -m "test: add useConfig unit tests for config loading and merge"
```

---

### Task 10: 建立 CI/CD

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: 创建 CI workflow**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [master, develop]
  pull_request:
    branches: [master]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm test:coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm pack
      - uses: actions/upload-artifact@v4
        with:
          name: vsix
          path: "*.vsix"
```

- [ ] **Step 2: 创建 Release workflow**

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - "v*"

permissions:
  contents: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
      - run: pnpm pack
      - name: Publish to VS Code Marketplace
        run: npx vsce publish --no-dependencies
        env:
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: "*.vsix"
          generate_release_notes: true
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/
git commit -m "ci: add CI and release workflows"
```

---

### Task 11: 打包优化

**Files:**
- Create: `.vscodeignore`
- Modify: `.gitignore`
- Modify: `package.json`
- Modify: `tsdown.config.ts`

- [ ] **Step 1: 创建 `.vscodeignore`**

```
.vscode/**
.vscode-test/**
src/**
node_modules/**
.gitignore
.prettierrc
tsconfig.json
tsdown.config.ts
vitest.config.ts
eslint.config.mjs
taze.config.js
pnpm-workspace.yaml
pnpm-lock.yaml
skills-lock.json
.mcp.json
.agents/**
.claude/**
docs/**
*.vsix
CHANGELOG.md
```

- [ ] **Step 2: 从 git 中移除 `dist/`**

```bash
echo "dist" >> .gitignore
git rm -r --cached dist/
```

- [ ] **Step 3: 消除 tsdown 配置冗余**

`tsdown.config.ts` 已配置 `external: ["vscode"]`，`package.json` 的 build 脚本重复了 `--external vscode`。移除 CLI 参数：

```json
"build": "tsdown src/index.ts"
```

- [ ] **Step 4: Commit**

```bash
git add .vscodeignore .gitignore package.json tsdown.config.ts
git commit -m "chore: add .vscodeignore, remove dist from git, clean up build config"
```

---

### Task 12: 检查并修复缺失的图标资源

**Files:**
- Modify: `package.json` (或新增图标文件)

- [ ] **Step 1: 检查引用的图标是否存在**

```bash
ls -la media/light/refresh.svg media/dark/refresh.svg
```

`package.json` 的 `folder-alias.refresh` 命令引用了 `media/light/refresh.svg` 和 `media/dark/refresh.svg`，但 `media/` 目录下只有 `edit.svg` 和 `icon.svg`（在 light/ 和 dark/ 子目录中）。refresh 图标缺失。

- [ ] **Step 2: 方案选择**

方案 A：创建 refresh SVG 图标文件（推荐）
方案 B：从 `package.json` 命令定义中移除 icon 字段

- [ ] **Step 3: 执行选择的方案并 Commit**

```bash
git add media/ package.json
git commit -m "fix: add missing refresh icon or remove invalid icon reference"
```

---

### Task 13: 规范化 CHANGELOG 与文档

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: 规范化 CHANGELOG 格式**

采用 [Keep a Changelog](https://keepachangelog.com/) 格式：

```markdown
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

## [0.1.3] - 2026-05-XX

### Added
- `.vscode` directory configuration priority
- Smart initialization for config files

## [0.1.0] - 2025-XX-XX

### Changed
- Migrated to reactive-vscode
- Modern build and configuration setup

### Removed
- Deprecated templates and utilities

## [0.0.6] - 2025-XX-XX

### Added
- Templates: maven, gradle, spring boot, flutter, vite, vue-cli

## [0.0.5] - 2025-XX-XX

### Added
- Default project templates
- Optimized workspace and config loading
```

- [ ] **Step 2: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs: normalize CHANGELOG to Keep a Changelog format"
```

---

## 四、执行顺序与依赖关系

```
Task 1 (清理死代码)
  ├── Task 2 (修复 monkey-patch)
  ├── Task 3 (修复 add-alias)
  ├── Task 4 (修复 refresh-aliases)
  ├── Task 5 (修复 merge 副作用)
  ├── Task 6 (优化 watcher)
  └── Task 7 (增加错误处理)
        └── Task 8 (测试基础设施)
              └── Task 9 (补充测试)
                    └── Task 10 (CI/CD)
                          └── Task 11 (打包优化)
                                └── Task 12 (图标修复)
                                      └── Task 13 (文档规范化)
```

Task 1 必须先执行（清理死代码为后续重构提供清晰基础）。Task 2-7 可并行执行。Task 8-13 需要按序执行。

---

## 五、预期收益

| 维度 | 当前状态 | 优化后 |
|------|---------|--------|
| 测试覆盖 | 0% | >80%（核心模块） |
| 死代码 | 3 个文件 | 0 |
| 代码重复 | add-alias 重复 90% | DRY |
| Bug | merge 副作用、路径问题 | 已修复 |
| CI/CD | 无 | GitHub Actions (lint + test + build + release) |
| 打包 | 无 .vscodeignore，dist 提交 git | 优化打包，git 干净 |
| 文档 | 格式不规范 | Keep a Changelog |
| 性能 | watcher 监听所有文件 | 仅监听配置文件 |
