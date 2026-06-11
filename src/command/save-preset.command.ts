import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";
import { saveUserPreset } from "../utils/preset.util";

function savePreset(
  workspaceManager: UseWorkspaceManagerReturn,
) {
  useCommand("folder-alias.saveAsPreset", (uri?: vscode.Uri) => {
    let targetUri: vscode.Uri | undefined = uri;

    if (!targetUri) {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        vscode.window.showWarningMessage(vscode.l10n.t("No workspace folder open."));
        return;
      }
      if (folders.length === 1) {
        targetUri = folders[0].uri;
      }
      else {
        const items: vscode.QuickPickItem[] = folders.map(f => ({
          label: f.name,
          description: f.uri.fsPath,
        }));
        vscode.window.showQuickPick(items, {
          title: vscode.l10n.t("Select workspace folder to save preset from"),
        }).then((selected) => {
          if (selected) {
            const folder = folders.find(f => f.name === selected.label);
            if (folder) {
              savePresetFromFolder(folder.uri, workspaceManager);
            }
          }
        });
        return;
      }
    }

    savePresetFromFolder(targetUri, workspaceManager);
  });
}

function savePresetFromFolder(
  folderUri: vscode.Uri,
  workspaceManager: UseWorkspaceManagerReturn,
) {
  const instance = workspaceManager.findInstanceByUri(folderUri);
  if (!instance) {
    vscode.window.showWarningMessage(vscode.l10n.t("Selected folder is not a workspace folder."));
    return;
  }

  const { fileAlias } = instance;
  const currentConfig = fileAlias.publicConfig.value;

  if (Object.keys(currentConfig).length === 0) {
    vscode.window.showWarningMessage(vscode.l10n.t("Current config is empty. Add some aliases first."));
    return;
  }

  vscode.window.showInputBox({
    title: vscode.l10n.t("Save current config as preset"),
    prompt: vscode.l10n.t("Enter a name for this preset"),
    placeHolder: vscode.l10n.t("my-preset"),
  }).then((name) => {
    if (name) {
      saveUserPreset(folderUri.fsPath, {
        name,
        aliases: { ...currentConfig },
      });
      vscode.window.showInformationMessage(
        vscode.l10n.t("Preset \"{0}\" saved successfully.", name),
      );
    }
  });
}

export { savePreset };
