import { existsSync } from "fs";
import { RecordConfig } from "../typings/common.typing";
import { readTemplateFile } from "./file.util";

function extensionConfig(
  templateName: string,
  config: RecordConfig
): RecordConfig {
  const template = { ...readTemplateFile(templateName), ...config };
  return template.config;
}

function getCommonConfig(dir: string): RecordConfig {
  const allConfig = projectHasType(dir)
    .map((item) => readTemplateFile(item))
    .sort((x, y) => x.level - y.level)
    .map((item) => {
      return item.config;
    });
  return Object.assign({}, ...allConfig);
}

interface HasFileItem {
  files: string[];
  template: string;
}

const hasFileList: HasFileItem[] = require("../template/data.json");

function projectHasType(dir: string) {
  const typeList: string[] = ["default"];
  hasFileList.forEach((item) => {
    if (hasFile(dir, item.files)) {
      typeList.push(item.template);
    }
  });

  return typeList;
}

function hasFile(dir: string, files: string[]): boolean {
  return files.some((file) => {
    return existsSync(`${dir}/${file}`);
  });
}

export { extensionConfig, projectHasType, getCommonConfig };
