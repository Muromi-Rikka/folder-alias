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
