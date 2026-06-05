import type { EventEmitter as VscodeEventEmitter } from "vscode";
import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import { relative } from "pathe";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";

function deleteAlias(
  workspaceManager: UseWorkspaceManagerReturn,
  decorationChangeEvent: VscodeEventEmitter<undefined | vscode.Uri | vscode.Uri[]>,
) {
  useCommand("folder-alias.deleteAlias", (uri: vscode.Uri) => {
    const instance = workspaceManager.findInstanceByUri(uri);
    if (!instance) {
      vscode.window.showWarningMessage(vscode.l10n.t("Selected file is not inside any workspace folder."));
      return;
    }

    const { folder, fileAlias } = instance;
    const { publicConfig, privateConfig, configFile, resetConfig, savePrivate, savePublic } = fileAlias;

    const relativelyPath = relative(folder.uri.fsPath, uri.fsPath);
    const existingEntry = configFile.value[relativelyPath];

    if (!existingEntry) {
      vscode.window.showWarningMessage(vscode.l10n.t("No alias found for \"{0}\".", relativelyPath));
      return;
    }

    vscode.window.showQuickPick([
      vscode.l10n.t("public"),
      vscode.l10n.t("private"),
    ]).then((scope) => {
      if (!scope) {
        return;
      }

      const isPrivate = scope === vscode.l10n.t("private");
      const config = isPrivate ? privateConfig : publicConfig;
      const save = isPrivate ? savePrivate : savePublic;

      // Check that the entry exists in the selected scope
      if (!config.value[relativelyPath]) {
        vscode.window.showWarningMessage(vscode.l10n.t("No alias found for \"{0}\".", relativelyPath));
        return;
      }

      vscode.window.showWarningMessage(
        vscode.l10n.t("Are you sure you want to delete the alias for \"{0}\"?", relativelyPath),
        { modal: true },
        vscode.l10n.t("Delete"),
        vscode.l10n.t("Cancel"),
      ).then((choice) => {
        if (choice !== vscode.l10n.t("Delete")) {
          return;
        }

        resetConfig();
        delete config.value[relativelyPath];
        save();
        decorationChangeEvent.fire(uri);
        vscode.window.showInformationMessage(vscode.l10n.t("Deleted alias for \"{0}\".", relativelyPath));
      });
    });
  });
}

export { deleteAlias };
