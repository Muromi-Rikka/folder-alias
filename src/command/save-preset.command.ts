import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";
import { resolveWorkspaceFolder, saveUserPreset } from "../utils/preset.util";

function savePreset(
  workspaceManager: UseWorkspaceManagerReturn,
) {
  useCommand("folder-alias.saveAsPreset", async (uri?: vscode.Uri) => {
    const targetUri = await resolveWorkspaceFolder(uri, vscode.l10n.t("Select workspace folder to save preset from"));
    if (!targetUri) return;
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
