# Preset System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a preset system to folder-alias that ships built-in presets (monorepo, single-project, nextjs, vue) and lets users save/apply/delete their own presets per workspace.

**Architecture:** Presets are JSON files with a standard schema. Built-in presets live in `media/presets/`, user presets in `.vscode/folder-alias-presets/`. Commands use QuickPick for selection and merge preset aliases into the public config additively.

**Tech Stack:** TypeScript, reactive-vscode, es-toolkit, pathe, vscode API

---

## File Structure

| File | Responsibility |
|------|---------------|
| `media/presets/monorepo.json` | Built-in monorepo preset |
| `media/presets/single-project.json` | Built-in single-project preset |
| `media/presets/nextjs.json` | Built-in Next.js preset |
| `media/presets/vue.json` | Built-in Vue preset |
| `src/typings/preset.typing.ts` | Preset type definitions |
| `src/utils/preset.util.ts` | Read built-in + user presets, save/delete user presets |
| `src/command/apply-preset.command.ts` | ApplyPreset command logic |
| `src/command/save-preset.command.ts` | SaveAsPreset command logic |
| `src/command/delete-preset.command.ts` | DeletePreset command logic |
| `src/command/index.ts` | Export new commands |
| `src/index.ts` | Register new commands |
| `src/utils/__tests__/preset.util.test.ts` | Tests for preset utilities |
| `l10n/bundle.l10n.json` | English strings |
| `l10n/bundle.l10n.zh-cn.json` | Chinese strings |
| `package.nls.json` | English NLS |
| `package.nls.zh-cn.json` | Chinese NLS |
| `package.json` | New commands + menus |

---

### Task 1: Define Preset Types

**Covers:** [S2, S3]

**Files:**
- Create: `src/typings/preset.typing.ts`

- [ ] **Step 1: Create preset type definitions**

```typescript
import type { ConfigItem } from "./common.typing";

export interface Preset {
  name: string;
  description?: string;
  aliases: Record<string, ConfigItem>;
}
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS (no errors in new file)

- [ ] **Step 3: Commit**

```bash
git add src/typings/preset.typing.ts
git commit -m "feat(preset): add Preset type definition"
```

---

### Task 2: Create Built-in Preset JSON Files

**Covers:** [S4]

**Files:**
- Create: `media/presets/monorepo.json`
- Create: `media/presets/single-project.json`
- Create: `media/presets/nextjs.json`
- Create: `media/presets/vue.json`

- [ ] **Step 1: Create monorepo preset**

```json
{
  "name": "Monorepo",
  "description": "Alias structure for pnpm/yarn workspace monorepos",
  "aliases": {
    "packages/": { "description": "📦", "tooltip": "Shared packages" },
    "apps/": { "description": "🚀", "tooltip": "Applications" },
    "libs/": { "description": "📚", "tooltip": "Internal libraries" },
    "shared/": { "description": "🔗", "tooltip": "Shared utilities" },
    "tools/": { "description": "🛠️", "tooltip": "Build tools and scripts" },
    "config/": { "description": "⚙️", "tooltip": "Workspace configuration" }
  }
}
```

- [ ] **Step 2: Create single-project preset**

```json
{
  "name": "Single Project",
  "description": "Standard Node/Python project structure",
  "aliases": {
    "src/": { "description": "📁", "tooltip": "Source code" },
    "tests/": { "description": "🧪", "tooltip": "Test files" },
    "docs/": { "description": "📖", "tooltip": "Documentation" },
    "config/": { "description": "⚙️", "tooltip": "Configuration files" },
    "scripts/": { "description": "📜", "tooltip": "Build and utility scripts" },
    "dist/": { "description": "📦", "tooltip": "Build output" }
  }
}
```

- [ ] **Step 3: Create Next.js preset**

```json
{
  "name": "Next.js",
  "description": "Alias structure for Next.js applications",
  "aliases": {
    "app/": { "description": "📄", "tooltip": "App router pages" },
    "components/": { "description": "🧩", "tooltip": "React components" },
    "lib/": { "description": "📚", "tooltip": "Utility libraries" },
    "public/": { "description": "🌐", "tooltip": "Static assets" },
    "styles/": { "description": "🎨", "tooltip": "CSS and style files" },
    "hooks/": { "description": "🪝", "tooltip": "Custom React hooks" },
    "api/": { "description": "🔌", "tooltip": "API routes" }
  }
}
```

- [ ] **Step 4: Create Vue preset**

```json
{
  "name": "Vue",
  "description": "Alias structure for Vue applications",
  "aliases": {
    "src/": { "description": "📁", "tooltip": "Source code root" },
    "components/": { "description": "🧩", "tooltip": "Vue components" },
    "views/": { "description": "📄", "tooltip": "Page views" },
    "store/": { "description": "🗄️", "tooltip": "Vuex/Pinia store" },
    "composables/": { "description": "🪝", "tooltip": "Vue composables" },
    "assets/": { "description": "🎨", "tooltip": "Static assets" },
    "utils/": { "description": "🛠️", "tooltip": "Utility functions" }
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add media/presets/
git commit -m "feat(preset): add built-in preset files for monorepo, single-project, nextjs, vue"
```

---

### Task 3: Implement Preset Utility Functions

**Covers:** [S2, S6]

**Files:**
- Create: `src/utils/preset.util.ts`
- Create: `src/utils/__tests__/preset.util.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
import { describe, expect, it } from "vitest";
import type { Preset } from "../../typings/preset.typing";
import type { RecordConfig } from "../../typings/common.typing";
import { getBuiltInPresets, getUserPresets, mergePresetIntoConfig, saveUserPreset, deleteUserPreset } from "../preset.util";

describe("preset.util", () => {
  describe("getBuiltInPresets", () => {
    it("returns array of built-in presets", () => {
      const presets = getBuiltInPresets();
      expect(Array.isArray(presets)).toBe(true);
      expect(presets.length).toBeGreaterThan(0);
    });

    it("each preset has name and aliases", () => {
      const presets = getBuiltInPresets();
      for (const preset of presets) {
        expect(preset.name).toBeTruthy();
        expect(preset.aliases).toBeTruthy();
        expect(typeof preset.aliases).toBe("object");
      }
    });
  });

  describe("mergePresetIntoConfig", () => {
    it("adds preset entries without removing existing ones", () => {
      const existing: RecordConfig = {
        "src/": { description: "Existing src" },
      };
      const preset: Preset = {
        name: "test",
        aliases: {
          "src/": { description: "Preset src" },
          "lib/": { description: "Preset lib" },
        },
      };
      const result = mergePresetIntoConfig(existing, preset);
      expect(result["src/"].description).toBe("Existing src");
      expect(result["lib/"].description).toBe("Preset lib");
    });

    it("does not mutate the original config", () => {
      const existing: RecordConfig = {};
      const preset: Preset = {
        name: "test",
        aliases: { "a/": { description: "A" } },
      };
      mergePresetIntoConfig(existing, preset);
      expect(existing["a/"]).toBeUndefined();
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- --reporter=verbose src/utils/__tests__/preset.util.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement preset utility functions**

```typescript
import type { Preset } from "../typings/preset.typing";
import type { RecordConfig } from "../typings/common.typing";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { destr } from "destr";
import { join } from "pathe";
import { merge } from "es-toolkit";
import { logger } from "./logger.util";

const BUILT_IN_PRESETS_DIR = join(__dirname, "..", "media", "presets");

function readPresetFile(filePath: string): Preset | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    const parsed = destr<Preset>(content);
    if (
      typeof parsed !== "object"
      || parsed === null
      || Array.isArray(parsed)
      || !parsed.name
      || !parsed.aliases
    ) {
      logger.warn(`Invalid preset format in ${filePath}`);
      return null;
    }
    return parsed;
  }
  catch (error) {
    logger.error(`Failed to read preset from ${filePath}:`, error);
    return null;
  }
}

function getBuiltInPresets(): Preset[] {
  if (!existsSync(BUILT_IN_PRESETS_DIR)) {
    return [];
  }
  const files = readdirSync(BUILT_IN_PRESETS_DIR).filter(f => f.endsWith(".json"));
  const presets: Preset[] = [];
  for (const file of files) {
    const preset = readPresetFile(join(BUILT_IN_PRESETS_DIR, file));
    if (preset) {
      presets.push(preset);
    }
  }
  return presets;
}

function getUserPresetsDir(workspacePath: string): string {
  return join(workspacePath, ".vscode", "folder-alias-presets");
}

function getUserPresets(workspacePath: string): Preset[] {
  const dir = getUserPresetsDir(workspacePath);
  if (!existsSync(dir)) {
    return [];
  }
  const files = readdirSync(dir).filter(f => f.endsWith(".json"));
  const presets: Preset[] = [];
  for (const file of files) {
    const preset = readPresetFile(join(dir, file));
    if (preset) {
      presets.push(preset);
    }
  }
  return presets;
}

function saveUserPreset(workspacePath: string, preset: Preset): void {
  const dir = getUserPresetsDir(workspacePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const safeName = preset.name.replace(/[^a-zA-Z0-9-_]/g, "_").toLowerCase();
  const filePath = join(dir, `${safeName}.json`);
  writeFileSync(filePath, JSON.stringify(preset, null, 4));
}

function deleteUserPreset(workspacePath: string, presetName: string): boolean {
  const dir = getUserPresetsDir(workspacePath);
  if (!existsSync(dir)) {
    return false;
  }
  const safeName = presetName.replace(/[^a-zA-Z0-9-_]/g, "_").toLowerCase();
  const filePath = join(dir, `${safeName}.json`);
  if (existsSync(filePath)) {
    const { unlinkSync } = require("node:fs");
    unlinkSync(filePath);
    return true;
  }
  return false;
}

function mergePresetIntoConfig(existing: RecordConfig, preset: Preset): RecordConfig {
  return merge({}, existing, preset.aliases);
}

export {
  deleteUserPreset,
  getBuiltInPresets,
  getUserPresets,
  mergePresetIntoConfig,
  saveUserPreset,
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- --reporter=verbose src/utils/__tests__/preset.util.test.ts`
Expected: PASS

- [ ] **Step 5: Run full test suite**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/utils/preset.util.ts src/utils/__tests__/preset.util.test.ts
git commit -m "feat(preset): implement preset utility functions with tests"
```

---

### Task 4: Implement ApplyPreset Command

**Covers:** [S5, S6]

**Files:**
- Create: `src/command/apply-preset.command.ts`

- [ ] **Step 1: Create apply-preset command**

```typescript
import type { EventEmitter as VscodeEventEmitter } from "vscode";
import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";
import { getBuiltInPresets, getUserPresets, mergePresetIntoConfig } from "../utils/preset.util";

interface PresetQuickPickItem extends vscode.QuickPickItem {
  preset: import("../typings/preset.typing").Preset;
  isBuiltIn: boolean;
}

function applyPreset(
  workspaceManager: UseWorkspaceManagerReturn,
  decorationChangeEvent: VscodeEventEmitter<undefined | vscode.Uri | vscode.Uri[]>,
) {
  useCommand("folder-alias.applyPreset", (uri?: vscode.Uri) => {
    let targetUri: vscode.Uri | undefined = uri;

    if (!targetUri) {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        vscode.window.showWarningMessage(vscode.l10n.t("No workspace folder open."));
        return;
      }
      if (folders.length === 1) {
        targetUri = folders[0].uri;
      }
      else {
        const items: vscode.QuickPickItem[] = folders.map(f => ({
          label: f.name,
          description: f.uri.fsPath,
        }));
        vscode.window.showQuickPick(items, {
          title: vscode.l10n.t("Select workspace folder"),
        }).then((selected) => {
          if (selected) {
            const folder = folders.find(f => f.name === selected.label);
            if (folder) {
              applyPresetToFolder(folder.uri, workspaceManager, decorationChangeEvent);
            }
          }
        });
        return;
      }
    }

    applyPresetToFolder(targetUri, workspaceManager, decorationChangeEvent);
  });
}

function applyPresetToFolder(
  folderUri: vscode.Uri,
  workspaceManager: UseWorkspaceManagerReturn,
  decorationChangeEvent: VscodeEventEmitter<undefined | vscode.Uri | vscode.Uri[]>,
) {
  const instance = workspaceManager.findInstanceByUri(folderUri);
  if (!instance) {
    vscode.window.showWarningMessage(vscode.l10n.t("Selected folder is not a workspace folder."));
    return;
  }

  const { fileAlias } = instance;
  const builtInPresets = getBuiltInPresets();
  const userPresets = getUserPresets(folderUri.fsPath);

  const items: PresetQuickPickItem[] = [
    ...builtInPresets.map(p => ({
      label: `$(file) ${p.name}`,
      description: p.description,
      detail: `Built-in · ${Object.keys(p.aliases).length} aliases`,
      preset: p,
      isBuiltIn: true,
    })),
    ...userPresets.map(p => ({
      label: `$(settings) ${p.name}`,
      description: p.description,
      detail: `Custom · ${Object.keys(p.aliases).length} aliases`,
      preset: p,
      isBuiltIn: false,
    })),
  ];

  if (items.length === 0) {
    vscode.window.showWarningMessage(vscode.l10n.t("No presets available."));
    return;
  }

  vscode.window.showQuickPick(items, {
    title: vscode.l10n.t("Select preset to apply"),
    placeHolder: vscode.l10n.t("Choose a preset to merge into your aliases"),
  }).then((selected) => {
    if (selected) {
      const merged = mergePresetIntoConfig(fileAlias.publicConfig.value, selected.preset);
      fileAlias.publicConfig.value = merged;
      fileAlias.savePublic();
      decorationChangeEvent.fire(folderUri);
      vscode.window.showInformationMessage(
        vscode.l10n.t("Preset \"{0}\" applied successfully.", selected.preset.name),
      );
    }
  });
}

export { applyPreset };
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/command/apply-preset.command.ts
git commit -m "feat(preset): implement applyPreset command"
```

---

### Task 5: Implement SaveAsPreset Command

**Covers:** [S5]

**Files:**
- Create: `src/command/save-preset.command.ts`

- [ ] **Step 1: Create save-preset command**

```typescript
import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";
import { saveUserPreset } from "../utils/preset.util";

function savePreset(
  workspaceManager: UseWorkspaceManagerReturn,
) {
  useCommand("folder-alias.saveAsPreset", (uri?: vscode.Uri) => {
    let targetUri: vscode.Uri | undefined = uri;

    if (!targetUri) {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        vscode.window.showWarningMessage(vscode.l10n.t("No workspace folder open."));
        return;
      }
      if (folders.length === 1) {
        targetUri = folders[0].uri;
      }
      else {
        const items: vscode.QuickPickItem[] = folders.map(f => ({
          label: f.name,
          description: f.uri.fsPath,
        }));
        vscode.window.showQuickPick(items, {
          title: vscode.l10n.t("Select workspace folder to save preset from"),
        }).then((selected) => {
          if (selected) {
            const folder = folders.find(f => f.name === selected.label);
            if (folder) {
              savePresetFromFolder(folder.uri, workspaceManager);
            }
          }
        });
        return;
      }
    }

    savePresetFromFolder(targetUri, workspaceManager);
  });
}

function savePresetFromFolder(
  folderUri: vscode.Uri,
  workspaceManager: UseWorkspaceManagerReturn,
) {
  const instance = workspaceManager.findInstanceByUri(folderUri);
  if (!instance) {
    vscode.window.showWarningMessage(vscode.l10n.t("Selected folder is not a workspace folder."));
    return;
  }

  const { fileAlias } = instance;
  const currentConfig = fileAlias.publicConfig.value;

  if (Object.keys(currentConfig).length === 0) {
    vscode.window.showWarningMessage(vscode.l10n.t("Current config is empty. Add some aliases first."));
    return;
  }

  vscode.window.showInputBox({
    title: vscode.l10n.t("Save current config as preset"),
    prompt: vscode.l10n.t("Enter a name for this preset"),
    placeHolder: vscode.l10n.t("my-preset"),
  }).then((name) => {
    if (name) {
      saveUserPreset(folderUri.fsPath, {
        name,
        aliases: { ...currentConfig },
      });
      vscode.window.showInformationMessage(
        vscode.l10n.t("Preset \"{0}\" saved successfully.", name),
      );
    }
  });
}

export { savePreset };
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/command/save-preset.command.ts
git commit -m "feat(preset): implement saveAsPreset command"
```

---

### Task 6: Implement DeletePreset Command

**Covers:** [S5]

**Files:**
- Create: `src/command/delete-preset.command.ts`

- [ ] **Step 1: Create delete-preset command**

```typescript
import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";
import { deleteUserPreset, getUserPresets } from "../utils/preset.util";

interface PresetQuickPickItem extends vscode.QuickPickItem {
  presetName: string;
}

function deletePreset(
  workspaceManager: UseWorkspaceManagerReturn,
) {
  useCommand("folder-alias.deletePreset", (uri?: vscode.Uri) => {
    let targetUri: vscode.Uri | undefined = uri;

    if (!targetUri) {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        vscode.window.showWarningMessage(vscode.l10n.t("No workspace folder open."));
        return;
      }
      if (folders.length === 1) {
        targetUri = folders[0].uri;
      }
      else {
        const items: vscode.QuickPickItem[] = folders.map(f => ({
          label: f.name,
          description: f.uri.fsPath,
        }));
        vscode.window.showQuickPick(items, {
          title: vscode.l10n.t("Select workspace folder"),
        }).then((selected) => {
          if (selected) {
            const folder = folders.find(f => f.name === selected.label);
            if (folder) {
              deletePresetFromFolder(folder.uri);
            }
          }
        });
        return;
      }
    }

    deletePresetFromFolder(targetUri);
  });
}

function deletePresetFromFolder(folderUri: vscode.Uri) {
  const userPresets = getUserPresets(folderUri.fsPath);

  if (userPresets.length === 0) {
    vscode.window.showWarningMessage(vscode.l10n.t("No custom presets found in this workspace."));
    return;
  }

  const items: PresetQuickPickItem[] = userPresets.map(p => ({
    label: p.name,
    description: p.description,
    detail: `${Object.keys(p.aliases).length} aliases`,
    presetName: p.name,
  }));

  vscode.window.showQuickPick(items, {
    title: vscode.l10n.t("Select preset to delete"),
    placeHolder: vscode.l10n.t("Choose a custom preset to remove"),
  }).then((selected) => {
    if (selected) {
      deleteUserPreset(folderUri.fsPath, selected.presetName);
      vscode.window.showInformationMessage(
        vscode.l10n.t("Preset \"{0}\" deleted.", selected.presetName),
      );
    }
  });
}

export { deletePreset };
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/command/delete-preset.command.ts
git commit -m "feat(preset): implement deletePreset command"
```

---

### Task 7: Update Command Index and Register Commands

**Covers:** [S5]

**Files:**
- Modify: `src/command/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Update command index exports**

```typescript
import { addAlias } from "./add-alias.command";
import { applyPreset } from "./apply-preset.command";
import { deleteAlias } from "./delete-alias.command";
import { deletePreset } from "./delete-preset.command";
import { refreshAliases } from "./refresh-aliases.command";
import { savePreset } from "./save-preset.command";

export {
  addAlias,
  applyPreset,
  deleteAlias,
  deletePreset,
  refreshAliases,
  savePreset,
};
```

- [ ] **Step 2: Register new commands in index.ts**

Add imports and register the three new commands after existing ones:

```typescript
import { addAlias, applyPreset, deleteAlias, deletePreset, refreshAliases, savePreset } from "./command";

// ... existing code ...

// Register commands once (not per-folder)
addAlias(workspaceManager, decorationChangeEvent.emitter);
deleteAlias(workspaceManager, decorationChangeEvent.emitter);
refreshAliases(workspaceManager, decorationChangeEvent.emitter);
applyPreset(workspaceManager, decorationChangeEvent.emitter);
savePreset(workspaceManager);
deletePreset(workspaceManager);
```

- [ ] **Step 3: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 4: Run tests**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/command/index.ts src/index.ts
git commit -m "feat(preset): register applyPreset, saveAsPreset, deletePreset commands"
```

---

### Task 8: Update package.json with Commands and Menus

**Covers:** [S5]

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add new commands to package.json contributes**

Add to the `commands` array:

```json
{
  "command": "folder-alias.applyPreset",
  "title": "%command.applyPreset%"
},
{
  "command": "folder-alias.saveAsPreset",
  "title": "%command.saveAsPreset%"
},
{
  "command": "folder-alias.deletePreset",
  "title": "%command.deletePreset%"
}
```

Add to `menus.explorer/context`:

```json
{
  "command": "folder-alias.applyPreset",
  "when": "explorerResourceIsFolder",
  "group": "1_modification"
},
{
  "command": "folder-alias.saveAsPreset",
  "when": "explorerResourceIsFolder",
  "group": "1_modification"
},
{
  "command": "folder-alias.deletePreset",
  "when": "explorerResourceIsFolder",
  "group": "1_modification"
}
```

Add to `menus.commandPalette`:

```json
{
  "command": "folder-alias.applyPreset"
},
{
  "command": "folder-alias.saveAsPreset"
},
{
  "command": "folder-alias.deletePreset"
}
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat(preset): register commands and menus in package.json"
```

---

### Task 9: Update Localization Files

**Covers:** [S5]

**Files:**
- Modify: `l10n/bundle.l10n.json`
- Modify: `l10n/bundle.l10n.zh-cn.json`
- Modify: `package.nls.json`
- Modify: `package.nls.zh-cn.json`

- [ ] **Step 1: Add English strings**

`l10n/bundle.l10n.json` — add:
```json
"Select workspace folder": "Select workspace folder",
"Select preset to apply": "Select preset to apply",
"Choose a preset to merge into your aliases": "Choose a preset to merge into your aliases",
"Preset \"{0}\" applied successfully.": "Preset \"{0}\" applied successfully.",
"No presets available.": "No presets available.",
"Select workspace folder to save preset from": "Select workspace folder to save preset from",
"Save current config as preset": "Save current config as preset",
"Enter a name for this preset": "Enter a name for this preset",
"my-preset": "my-preset",
"Preset \"{0}\" saved successfully.": "Preset \"{0}\" saved successfully.",
"Current config is empty. Add some aliases first.": "Current config is empty. Add some aliases first.",
"Select preset to delete": "Select preset to delete",
"Choose a custom preset to remove": "Choose a custom preset to remove",
"No custom presets found in this workspace.": "No custom presets found in this workspace.",
"Preset \"{0}\" deleted.": "Preset \"{0}\" deleted."
```

`package.nls.json` — add:
```json
"command.applyPreset": "Apply Preset",
"command.saveAsPreset": "Save Config as Preset",
"command.deletePreset": "Delete Preset"
```

- [ ] **Step 2: Add Chinese strings**

`l10n/bundle.l10n.zh-cn.json` — add:
```json
"Select workspace folder": "选择工作区文件夹",
"Select preset to apply": "选择要应用的预设",
"Choose a preset to merge into your aliases": "选择要合并到别名中的预设",
"Preset \"{0}\" applied successfully.": "预设 \"{0}\" 已成功应用。",
"No presets available.": "没有可用的预设。",
"Select workspace folder to save preset from": "选择要从其保存预设的工作区文件夹",
"Save current config as preset": "将当前配置保存为预设",
"Enter a name for this preset": "输入预设名称",
"my-preset": "我的预设",
"Preset \"{0}\" saved successfully.": "预设 \"{0}\" 已成功保存。",
"Current config is empty. Add some aliases first.": "当前配置为空。请先添加一些别名。",
"Select preset to delete": "选择要删除的预设",
"Choose a custom preset to remove": "选择要删除的自定义预设",
"No custom presets found in this workspace.": "在此工作区中未找到自定义预设。",
"Preset \"{0}\" deleted.": "预设 \"{0}\" 已删除。"
```

`package.nls.zh-cn.json` — add:
```json
"command.applyPreset": "应用预设",
"command.saveAsPreset": "将配置保存为预设",
"command.deletePreset": "删除预设"
```

- [ ] **Step 3: Run tests**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add l10n/ package.nls.json package.nls.zh-cn.json
git commit -m "feat(preset): add localization strings for preset commands"
```

---

### Task 10: Final Verification

**Covers:** [S2, S3, S4, S5, S6, S7]

**Files:** None

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 3: Run lint**

Run: `pnpm lint`
Expected: PASS

- [ ] **Step 4: Build the extension**

Run: `pnpm build`
Expected: PASS, output in `dist/index.cjs`

- [ ] **Step 5: Verify built-in presets are included in bundle**

Check that `media/presets/*.json` files exist and are readable.

- [ ] **Step 6: Commit any lint fixes**

```bash
git add -A
git commit -m "chore(preset): final lint and build verification"
```
