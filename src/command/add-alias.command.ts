import { existsSync } from "fs";
import path = require("path");
import * as vscode from "vscode";
import { FANode, RecordConfig } from "../typings/common.typing";
import { readConfig, writeConfig } from "../utils/file.util";

const addAlias = (
  workspace: vscode.WorkspaceFolder,
  commonConfig: RecordConfig
) =>
  vscode.commands.registerCommand("folder-alias.addAlias", (uri: FANode) => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    const configPath = path.join(workspace.uri.fsPath, "folder-alias.json");
    if (existsSync(configPath)) {
      const relativelyPath = uri.uri.path.substring(
        workspace.uri.path.length + 1
      );
      const originConfig = readConfig(configPath);
      const configFile = { ...originConfig, ...commonConfig };
      const filename = configPath.split(path.sep)[
        configPath.split(path.sep).length - 1
      ];
      const inputConfig: vscode.InputBoxOptions = {
        title: "Input Your Alias",
        value: configFile[relativelyPath]
          ? configFile[relativelyPath].description
          : filename
      };
      vscode.window.showInputBox(inputConfig).then((alias) => {
        if (alias) {
          originConfig[relativelyPath] = {
            ...originConfig[relativelyPath],
            description: alias
          };
          writeConfig(configPath, originConfig);
          vscode.commands.executeCommand("folder-alias.refresh");
        }
      });
    }
  });
export { addAlias };
