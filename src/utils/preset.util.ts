import type { RecordConfig } from "../typings/common.typing";
import type { Preset } from "../typings/preset.typing";
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { destr } from "destr";
import { merge } from "es-toolkit";
import { join } from "pathe";
import { logger } from "./logger.util";

const BUILT_IN_PRESETS_DIR = existsSync(join(__dirname, "..", "media", "presets"))
  ? join(__dirname, "..", "media", "presets")
  : join(__dirname, "..", "..", "media", "presets");

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
  const safeName = preset.name.replace(/[^\w-]/g, "_").toLowerCase();
  const filePath = join(dir, `${safeName}.json`);
  writeFileSync(filePath, JSON.stringify(preset, null, 4));
}

function deleteUserPreset(workspacePath: string, presetName: string): boolean {
  const dir = getUserPresetsDir(workspacePath);
  if (!existsSync(dir)) {
    return false;
  }
  const safeName = presetName.replace(/[^\w-]/g, "_").toLowerCase();
  const filePath = join(dir, `${safeName}.json`);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
    return true;
  }
  return false;
}

function mergePresetIntoConfig(_existing: RecordConfig, preset: Preset): RecordConfig {
  return { ...preset.aliases };
}

export {
  deleteUserPreset,
  getBuiltInPresets,
  getUserPresets,
  mergePresetIntoConfig,
  saveUserPreset,
};
