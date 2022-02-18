import { readFileSync, writeFileSync } from "fs";
import { ConfigItem } from "../typings/common.typing";

function readConfig(configPath: string): Record<string, ConfigItem> {
  return JSON.parse(readFileSync(configPath).toString());
}

function writeConfig(
  configPath: string,
  config: Record<string, ConfigItem>
): void {
  writeFileSync(configPath, JSON.stringify(config, null, 4));
}

export { readConfig, writeConfig };
