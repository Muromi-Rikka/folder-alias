import type { EventEmitter as VscodeEventEmitter } from "vscode";
import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import { join } from "pathe";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";

function refreshAliases(
  workspaceManager: UseWorkspaceManagerReturn,
  decorationChangeEvent: VscodeEventEmitter<undefined | vscode.Uri | vscode.Uri[]>,
) {
  useCommand("folder-alias.refresh", () => {
    const instances = workspaceManager.getInstances();

    // Reset all configs first
    for (const { fileAlias } of instances) {
      fileAlias.resetConfig();
    }

    // Collect all configured URIs
    const allUris = instances.flatMap(({ folder, fileAlias }) =>
      Object.keys(fileAlias.configFile.value).map(
        filePath => vscode.Uri.file(join(folder.uri.fsPath, filePath)),
      ),
    );

    const totalRefreshed = allUris.length;

    if (allUris.length > 0) {
      decorationChangeEvent.fire(allUris);
    }
    else {
      // Fire with undefined to trigger a full refresh
      decorationChangeEvent.fire(undefined);
    }

    vscode.window.showInformationMessage(vscode.l10n.t("Refreshed {0} folder aliases", totalRefreshed));
  });
}

export { refreshAliases };
