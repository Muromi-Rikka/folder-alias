import type { RecordConfig } from "../typings/common.typing";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { destr } from "destr";
import { join } from "pathe";

function readConfig(configPath: string): RecordConfig {
  return destr(readFileSync(configPath).toString());
}

function readConfigWithVscodePriority(basePath: string, fileName: string): RecordConfig {
  // 先检查 .vscode 目录下是否有配置文件
  const vscodeConfigPath = join(basePath, ".vscode", fileName);
  if (existsSync(vscodeConfigPath)) {
    return readConfig(vscodeConfigPath);
  }

  // 如果没有，则使用原来的路径
  const defaultConfigPath = join(basePath, fileName);
  if (existsSync(defaultConfigPath)) {
    return readConfig(defaultConfigPath);
  }

  // 如果两个路径都不存在，返回空对象
  return {};
}

function writeConfig(configPath: string, config: RecordConfig): void {
  writeFileSync(configPath, JSON.stringify(config, null, 4));
}

export { readConfig, readConfigWithVscodePriority, writeConfig };
