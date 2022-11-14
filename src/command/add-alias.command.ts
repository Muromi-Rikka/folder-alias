import { existsSync, readFileSync } from "fs";
import path = require("path");
import * as vscode from "vscode";
import { FileAlias } from "../file-alias";
import { RecordConfig } from "../typings/common.typing";
import { readConfig, writeConfig } from "../utils/file.util";

const addAlias = (workspace: vscode.WorkspaceFolder, fileAlias: FileAlias) =>
  vscode.commands.registerCommand(
    "folder-alias.addAlias",
    (uri: vscode.Uri) => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const configPath = path.join(workspace.uri.fsPath, "folder-alias.json");

      if (existsSync(configPath)) {
        const relativelyPath = uri.path.substring(
          workspace.uri.path.length + 1
        );
        const originConfig = readConfig(configPath);
        const privateConfigPath = path.resolve(
          workspace.uri.fsPath,
          "folder-alias.json"
        );
        let commonConfig = {};
        if (existsSync(privateConfigPath)) {
          commonConfig = JSON.parse(readFileSync(privateConfigPath).toString());
        }
        const configFile: RecordConfig = { ...originConfig, ...commonConfig };
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
            fileAlias.setConfig();
            fileAlias.changeEmitter.fire(uri);
          }
        });
      }
    }
  );
export { addAlias };
