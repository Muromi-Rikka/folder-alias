import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import { join } from "pathe";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";

interface AliasQuickPickItem extends vscode.QuickPickItem {
  filePath: string;
  workspaceFsPath: string;
}

function searchAlias(workspaceManager: UseWorkspaceManagerReturn) {
  useCommand("folder-alias.searchAlias", () => {
    const instances = workspaceManager.getInstances();
    const items: AliasQuickPickItem[] = [];

    for (const { folder, fileAlias } of instances) {
      const config = fileAlias.configFile.value;
      for (const [relativePath, item] of Object.entries(config)) {
        if (item.description) {
          items.push({
            label: item.description,
            description: relativePath,
            filePath: relativePath,
            workspaceFsPath: folder.uri.fsPath,
          });
        }
      }
    }

    if (items.length === 0) {
      vscode.window.showInformationMessage(
        vscode.l10n.t("No aliases found."),
      );
      return;
    }

    const quickPick = vscode.window.createQuickPick<AliasQuickPickItem>();
    quickPick.items = items;
    quickPick.placeholder = vscode.l10n.t("Search aliases...");

    quickPick.onDidAccept(() => {
      const selected = quickPick.selectedItems[0];
      if (selected) {
        const fullPath = join(selected.workspaceFsPath, selected.filePath);
        vscode.window.showTextDocument(vscode.Uri.file(fullPath));
      }
      quickPick.dispose();
    });

    quickPick.show();
  });
}

export { searchAlias };
