import type { RecordConfig } from "../typings/common.typing";
import { readFileSync, writeFileSync } from "node:fs";

function readConfig(configPath: string): RecordConfig {
  return JSON.parse(readFileSync(configPath).toString());
}

function writeConfig(configPath: string, config: RecordConfig): void {
  writeFileSync(configPath, JSON.stringify(config, null, 4));
}

export { readConfig, writeConfig };
