import type { UseFileAliasReturn } from "../file-alias";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";

function addAlias(workspace: vscode.WorkspaceFolder, fileAlias: UseFileAliasReturn) {
  const { publicConfig, privateConfig, configFile, resetConfig, savePrivate, savePublic, changeEmitter } = fileAlias;

  useCommand("folder-alias.addAlias", (uri: vscode.Uri) => {
    const relativelyPath = uri.path.substring(workspace.uri.path.length + 1);
    const inputConfig: vscode.InputBoxOptions = {
      title: "Input Your Alias",
      value: configFile.value[relativelyPath]
        ? configFile.value[relativelyPath].description
        : "folder-alias",
    };
    vscode.window.showQuickPick(["public", "private"]).then((scope) => {
      if (scope === "private") {
        vscode.window.showInputBox(inputConfig).then((alias) => {
          resetConfig();
          if (alias) {
            privateConfig.value[relativelyPath] = {
              ...privateConfig.value[relativelyPath],
              description: alias,
            };
            savePrivate();
            changeEmitter(uri);
          }
        });
      }
      else {
        vscode.window.showInputBox(inputConfig).then((alias) => {
          resetConfig();
          if (alias) {
            publicConfig.value[relativelyPath] = {
              ...publicConfig.value[relativelyPath],
              description: alias,
            };
            savePublic();
            changeEmitter(uri);
          }
        });
      }
    });
  });
}

export { addAlias };
