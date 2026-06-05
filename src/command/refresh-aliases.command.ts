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

    let totalRefreshed = 0;
    const allUris: vscode.Uri[] = [];

    for (const { folder, fileAlias } of instances) {
      const { resetConfig, configFile } = fileAlias;

      resetConfig();

      const configuredFiles = Object.keys(configFile.value);
      for (const filePath of configuredFiles) {
        const fullPath = join(folder.uri.fsPath, filePath);
        allUris.push(vscode.Uri.file(fullPath));
      }

      totalRefreshed += configuredFiles.length;
    }

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
