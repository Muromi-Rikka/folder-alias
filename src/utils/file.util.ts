import { readFileSync, writeFileSync } from "fs";
import { RecordConfig, TemplateFile } from "../typings/common.typing";

function readConfig(configPath: string): RecordConfig {
  return JSON.parse(readFileSync(configPath).toString());
}

function writeConfig(configPath: string, config: RecordConfig): void {
  writeFileSync(configPath, JSON.stringify(config, null, 4));
}

function readTemplateFile(name: string): TemplateFile {
  return require(`../template/${name}.template.json`);
}

export { readConfig, writeConfig, readTemplateFile };
