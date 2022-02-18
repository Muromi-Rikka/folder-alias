import { existsSync } from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { FANode } from "../typings/common.typing";
import { readConfig, writeConfig } from "../utils/file.util";

const addIcon = (workspace: vscode.WorkspaceFolder) => {
  return vscode.commands.registerCommand(
    "folder-alias.addIcon",
    (uri: FANode) => {
      const configPath = path.join(workspace.uri.fsPath, "folder-alias.json");
      if (existsSync(configPath)) {
        const relativelyPath = uri.uri.path.substring(
          workspace.uri.path.length + 1
        );
        const originConfig = readConfig(configPath);
        const inputConfig: vscode.InputBoxOptions = {
          title: "Select Your Icon"
        };
        vscode.window.showInputBox(inputConfig).then((alias) => {
          if (alias) {
            originConfig[relativelyPath] = {
              ...originConfig[relativelyPath],
              icon: alias
            };
            writeConfig(configPath, originConfig);
            vscode.commands.executeCommand("folder-alias.refresh");
          }
        });
      }
    }
  );
};
export { addIcon };
