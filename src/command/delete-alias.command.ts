import { existsSync, readFileSync } from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { FileAlias } from "../file-alias";
import { readConfig, writeConfig } from "../utils/file.util";
const delAlias = (
  workspace: vscode.WorkspaceFolder,
  fileAlias: FileAlias
): vscode.Disposable => {
  const configPath = path.join(workspace.uri.fsPath, "folder-alias.json");
  if (!existsSync(configPath)) {
    throw new Error("不存在配置");
  }

  const originConfig = readConfig(configPath);

  return vscode.commands.registerCommand(
    "folder-alias.delAlias",
    (uri: vscode.Uri) => {
      const relativelyPath = uri.path.substring(workspace.uri.path.length + 1);
      console.log({ originConfig: originConfig[relativelyPath] });
      if (originConfig[relativelyPath]) {
        const _config = Object.assign({}, originConfig);
        delete _config[relativelyPath];
        writeConfig(configPath, _config);

        fileAlias.setConfig();
        fileAlias.changeEmitter.fire(uri);
      }
    }
  );
};

export { delAlias };
