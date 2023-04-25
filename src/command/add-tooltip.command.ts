import { existsSync, readFileSync } from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { FileAlias } from "../file-alias";
import { RecordConfig } from "../typings/common.typing";
import { readConfig, writeConfig } from "../utils/file.util";

const addTooltip = (
  workspace: vscode.WorkspaceFolder,
  fileAlias: FileAlias
): vscode.Disposable => {
  const configPath = path.join(workspace.uri.fsPath, "folder-alias.json");
  if (!existsSync(configPath)) {
    throw new Error("不存在配置");
  }

  const privateConfigPath = path.resolve(
    workspace.uri.fsPath,
    "folder-alias.json"
  );
  const originConfig = readConfig(configPath);
  const commonConfig = existsSync(privateConfigPath)
    ? JSON.parse(readFileSync(privateConfigPath).toString())
    : {};
  const configFile: RecordConfig = { ...commonConfig, ...originConfig };

  return vscode.commands.registerCommand(
    "folder-alias.addTooltip",
    (uri: vscode.Uri) => {
      const relativelyPath = uri.path.substring(workspace.uri.path.length + 1);
      const filename = path.basename(configPath);
      const inputConfig: vscode.InputBoxOptions = {
        title: "Input Your Tooltip",
        value: configFile[relativelyPath]
          ? configFile[relativelyPath].tooltip
          : filename
      };

      vscode.window.showInputBox(inputConfig).then((alias) => {
        if (alias) {
          originConfig[relativelyPath] = {
            ...originConfig[relativelyPath],
            tooltip: alias
          };
          writeConfig(configPath, originConfig);
          fileAlias.setConfig();
          fileAlias.changeEmitter.fire(uri);
        }
      });
    }
  );
};

export { addTooltip };
