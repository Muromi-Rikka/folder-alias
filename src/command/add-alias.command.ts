import type { FileAlias } from "../file-alias";
import type { RecordConfig } from "../typings/common.typing";
import { existsSync } from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { readConfig, writeConfig } from "../utils/file.util";

function addAlias(workspace: vscode.WorkspaceFolder, fileAlias: FileAlias): vscode.Disposable {
  const configPath = path.join(workspace.uri.fsPath, "folder-alias.json");
  if (!existsSync(configPath)) {
    throw new Error("不存在配置");
  }

  const privateConfigPath = path.resolve(
    workspace.uri.fsPath,
    "folder-alias.json",
  );
  const originConfig = readConfig(configPath);
  const commonConfig = existsSync(privateConfigPath)
    ? readConfig(privateConfigPath)
    : {};
  const configFile: RecordConfig = { ...commonConfig, ...originConfig };

  return vscode.commands.registerCommand(
    "folder-alias.addAlias",
    (uri: vscode.Uri) => {
      const relativelyPath = uri.path.substring(workspace.uri.path.length + 1);
      const filename = path.basename(configPath);
      const inputConfig: vscode.InputBoxOptions = {
        title: "Input Your Alias",
        value: configFile[relativelyPath]
          ? configFile[relativelyPath].description
          : filename,
      };
      vscode.window.showInputBox(inputConfig).then((alias) => {
        if (alias) {
          originConfig[relativelyPath] = {
            ...originConfig[relativelyPath],
            description: alias,
          };
          writeConfig(configPath, originConfig);
          fileAlias.setConfig();
          fileAlias.changeEmitter.fire(uri);
        }
      });
    },
  );
}

export { addAlias };
