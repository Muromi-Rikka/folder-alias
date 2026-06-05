import type { EventEmitter as VscodeEventEmitter } from "vscode";
import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import { relative } from "pathe";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";

function addAlias(
  workspaceManager: UseWorkspaceManagerReturn,
  decorationChangeEvent: VscodeEventEmitter<undefined | vscode.Uri | vscode.Uri[]>,
) {
  useCommand("folder-alias.addAlias", (uri: vscode.Uri) => {
    const instance = workspaceManager.findInstanceByUri(uri);
    if (!instance) {
      vscode.window.showWarningMessage(vscode.l10n.t("Selected file is not inside any workspace folder."));
      return;
    }

    const { folder, fileAlias } = instance;
    const { publicConfig, privateConfig, configFile, resetConfig, savePrivate, savePublic } = fileAlias;

    const relativelyPath = relative(folder.uri.fsPath, uri.fsPath);
    const inputConfig: vscode.InputBoxOptions = {
      title: vscode.l10n.t("Input Your Alias"),
      value: configFile.value[relativelyPath]
        ? configFile.value[relativelyPath].description
        : "folder-alias",
    };
    vscode.window.showQuickPick([
      vscode.l10n.t("public"),
      vscode.l10n.t("private"),
    ]).then((scope) => {
      const isPrivate = scope === vscode.l10n.t("private");
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
          decorationChangeEvent.fire(uri);
        }
      });
    });
  });
}

export { addAlias };
