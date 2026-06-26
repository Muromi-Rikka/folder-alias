import type { Uri } from "vscode";
import type { RecordConfig } from "../typings/common.typing";
import type { Preset } from "../typings/preset.typing";
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { destr } from "destr";
import { merge } from "es-toolkit";
import { join } from "pathe";
import { env, l10n, window, workspace } from "vscode";
import { logger } from "./logger.util";

const BUILT_IN_PRESETS_DIR = existsSync(join(__dirname, "..", "media", "presets"))
  ? join(__dirname, "..", "media", "presets")
  : join(__dirname, "..", "..", "media", "presets");

let builtInCache: Preset[] | null = null;
const userPresetsCache = new Map<string, Preset[]>();
const selectedPresetsCache = new Map<string, string[]>();

function getWorkspaceLanguage(): string {
  const lang = env.language;
  if (lang.startsWith("zh")) {
    return "zh-cn";
  }
  return "en";
}

function localizePreset(preset: Preset): Preset {
  const lang = getWorkspaceLanguage();
  if (lang === "en" || !preset.localized) {
    return preset;
  }

  const localized = preset.localized[lang];
  if (!localized) {
    return preset;
  }

  return {
    ...preset,
    name: localized.name ?? preset.name,
    description: localized.description ?? preset.description,
    aliases: localized.aliases
      ? merge(merge({}, preset.aliases), localized.aliases)
      : preset.aliases,
  };
}

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
  if (builtInCache) {
    return builtInCache;
  }
  if (!existsSync(BUILT_IN_PRESETS_DIR)) {
    return [];
  }
  const files = readdirSync(BUILT_IN_PRESETS_DIR).filter(f => f.endsWith(".json"));
  const presets: Preset[] = [];
  for (const file of files) {
    const preset = readPresetFile(join(BUILT_IN_PRESETS_DIR, file));
    if (preset) {
      presets.push(localizePreset(preset));
    }
  }
  builtInCache = presets;
  return presets;
}

function getUserPresetsDir(workspacePath: string): string {
  return join(workspacePath, ".vscode", "folder-alias-presets");
}

function getUserPresets(workspacePath: string): Preset[] {
  if (existsSync(workspacePath)) {
    const cached = userPresetsCache.get(workspacePath);
    if (cached) {
      return cached;
    }
  }
  const dir = getUserPresetsDir(workspacePath);
  if (!existsSync(dir)) {
    return [];
  }
  const files = readdirSync(dir).filter(f => f.endsWith(".json"));
  const presets: Preset[] = [];
  for (const file of files) {
    const preset = readPresetFile(join(dir, file));
    if (preset) {
      presets.push(localizePreset(preset));
    }
  }
  userPresetsCache.set(workspacePath, presets);
  return presets;
}

function toSafeFilename(name: string): string {
  const safe = name.replace(/[^\w-]/g, "_").toLowerCase();
  if (!safe || !/\w/.test(safe)) {
    throw new Error(`Invalid preset name: "${name}" produces empty filename`);
  }
  return safe;
}

async function resolveWorkspaceFolder(uri?: Uri, title?: string): Promise<Uri | undefined> {
  if (uri) {
    return uri;
  }
  const folders = workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    window.showWarningMessage(l10n.t("No workspace folder open."));
    return undefined;
  }
  if (folders.length === 1) {
    return folders[0].uri;
  }
  const items = folders.map(f => ({
    label: f.name,
    description: f.uri.fsPath,
  }));
  const selected = await window.showQuickPick(items, {
    title: title || l10n.t("Select workspace folder"),
  });
  if (!selected) {
    return undefined;
  }
  const folder = folders.find(f => f.name === selected.label);
  return folder?.uri;
}

function invalidatePresetCache(workspacePath?: string): void {
  if (workspacePath) {
    userPresetsCache.delete(workspacePath);
    selectedPresetsCache.delete(workspacePath);
  }
  else {
    builtInCache = null;
    userPresetsCache.clear();
    selectedPresetsCache.clear();
  }
}

function saveUserPreset(workspacePath: string, preset: Preset): void {
  const dir = getUserPresetsDir(workspacePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const safeName = toSafeFilename(preset.name);
  const filePath = join(dir, `${safeName}.json`);
  writeFileSync(filePath, JSON.stringify(preset, null, 4));
  userPresetsCache.delete(workspacePath);
}

function deleteUserPreset(workspacePath: string, presetName: string): boolean {
  const dir = getUserPresetsDir(workspacePath);
  if (!existsSync(dir)) {
    return false;
  }
  const safeName = toSafeFilename(presetName);
  const filePath = join(dir, `${safeName}.json`);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
    userPresetsCache.delete(workspacePath);
    return true;
  }
  return false;
}

function getSelectedPresetsPath(workspacePath: string): string {
  return join(workspacePath, ".vscode", "folder-alias-selected-presets.json");
}

function getSelectedPresets(workspacePath: string): string[] {
  if (existsSync(workspacePath)) {
    const cached = selectedPresetsCache.get(workspacePath);
    if (cached) {
      return cached;
    }
  }
  const filePath = getSelectedPresetsPath(workspacePath);
  if (!existsSync(filePath)) {
    return [];
  }
  try {
    const content = readFileSync(filePath, "utf-8");
    const parsed = destr<string[]>(content);
    if (!Array.isArray(parsed)) {
      return [];
    }
    selectedPresetsCache.set(workspacePath, parsed);
    return parsed;
  }
  catch {
    return [];
  }
}

function saveSelectedPresets(workspacePath: string, presetNames: string[]): void {
  const dir = join(workspacePath, ".vscode");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const filePath = getSelectedPresetsPath(workspacePath);
  writeFileSync(filePath, JSON.stringify(presetNames, null, 4));
  selectedPresetsCache.delete(workspacePath);
}

function loadSelectedPresetAliases(workspacePath: string): RecordConfig {
  const selectedNames = getSelectedPresets(workspacePath);
  if (selectedNames.length === 0) {
    return {};
  }

  const allPresets = [...getBuiltInPresets()];
  const userPresets = getUserPresets(workspacePath);
  allPresets.push(...userPresets);

  const result: RecordConfig = {};
  for (const name of selectedNames) {
    const preset = allPresets.find(p => p.name === name);
    if (preset) {
      Object.assign(result, preset.aliases);
    }
  }
  return result;
}

export {
  deleteUserPreset,
  getBuiltInPresets,
  getSelectedPresets,
  getUserPresets,
  invalidatePresetCache,
  loadSelectedPresetAliases,
  resolveWorkspaceFolder,
  saveSelectedPresets,
  saveUserPreset,
  toSafeFilename,
};
