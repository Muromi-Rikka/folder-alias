import type { UseFileAliasReturn } from "../file-alias";
import { relative } from "pathe";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";

function addAlias(workspace: vscode.WorkspaceFolder, fileAlias: UseFileAliasReturn) {
  const { publicConfig, privateConfig, configFile, resetConfig, savePrivate, savePublic, changeEmitter } = fileAlias;

  useCommand("folder-alias.addAlias", (uri: vscode.Uri) => {
    const relativelyPath = relative(workspace.uri.fsPath, uri.fsPath);
    const inputConfig: vscode.InputBoxOptions = {
      title: "Input Your Alias",
      value: configFile.value[relativelyPath]
        ? configFile.value[relativelyPath].description
        : "folder-alias",
    };
    vscode.window.showQuickPick(["public", "private"]).then((scope) => {
      const isPrivate = scope === "private";
      const config = isPrivate ? privateConfig : publicConfig;
      const save = isPrivate ? savePrivate : savePublic;

      vscode.window.showInputBox(inputConfig).then((alias) => {
        resetConfig();
        if (alias) {
          config.value[relativelyPath] = {
            ...config.value[relativelyPath],
            description: alias,
          };
          save();
          changeEmitter(uri);
        }
      });
    });
  });
}

export { addAlias };
