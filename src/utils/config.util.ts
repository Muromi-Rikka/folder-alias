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

function getCommonConfig(dir: string) {
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

const hasFileList: HasFileItem[] = [
  {
    files: ["package.json"],
    template: "nodejs"
  },
  {
    files: ["angular.json"],
    template: "angular"
  },
  {
    files: [
      ".eslintrc",
      ".eslintrc.js",
      ".eslintrc.cjs",
      ".eslintrc.yaml",
      ".eslintrc.yml",
      ".eslintrc.json"
    ],
    template: "eslint"
  },
  {
    files: [
      ".prettierrc",
      ".prettierrc.json",
      ".prettierrc.yml",
      ".prettierrc.yaml",
      ".prettierrc.json5",
      ".prettierrc.js",
      ".prettierrc.cjs",
      "prettier.config.js",
      "prettier.config.cjs",
      ".prettierrc.toml"
    ],
    template: "prettier"
  },
  {
    files: [
      ".stylelintrc",
      "stylelint.config.js",
      "stylelint.config.cjs",
      ".stylelintrc.json",
      ".stylelintrc.yaml",
      ".stylelintrc.yml",
      ".stylelintrc.js"
    ],
    template: "stylelint"
  }
];

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
