import type { EventEmitter as VscodeEventEmitter } from "vscode";
import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import type { Preset } from "../typings/preset.typing";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";
import { getBuiltInPresets, getSelectedPresets, getUserPresets, resolveWorkspaceFolder, saveSelectedPresets } from "../utils/preset.util";

interface PresetQuickPickItem extends vscode.QuickPickItem {
  preset: Preset;
  isBuiltIn: boolean;
  picked?: boolean;
}

function applyPreset(
  workspaceManager: UseWorkspaceManagerReturn,
  decorationChangeEvent: VscodeEventEmitter<undefined | vscode.Uri | vscode.Uri[]>,
) {
  useCommand("folder-alias.applyPreset", async (uri?: vscode.Uri) => {
    const targetUri = await resolveWorkspaceFolder(uri, vscode.l10n.t("Select workspace folder"));
    if (!targetUri) return;
    applyPresetToFolder(targetUri, workspaceManager, decorationChangeEvent);
  });
}

function applyPresetToFolder(
  folderUri: vscode.Uri,
  workspaceManager: UseWorkspaceManagerReturn,
  decorationChangeEvent: VscodeEventEmitter<undefined | vscode.Uri | vscode.Uri[]>,
) {
  const instance = workspaceManager.findInstanceByUri(folderUri);
  if (!instance) {
    vscode.window.showWarningMessage(vscode.l10n.t("Selected folder is not a workspace folder."));
    return;
  }

  const builtInPresets = getBuiltInPresets();
  const userPresets = getUserPresets(folderUri.fsPath);
  const selectedNames = getSelectedPresets(folderUri.fsPath);

  const items: PresetQuickPickItem[] = [
    ...builtInPresets.map(p => ({
      label: `$(file) ${p.name}`,
      description: p.description,
      detail: `Built-in · ${Object.keys(p.aliases).length} aliases`,
      preset: p,
      isBuiltIn: true,
      picked: selectedNames.includes(p.name),
    })),
    ...userPresets.map(p => ({
      label: `$(settings) ${p.name}`,
      description: p.description,
      detail: `Custom · ${Object.keys(p.aliases).length} aliases`,
      preset: p,
      isBuiltIn: false,
      picked: selectedNames.includes(p.name),
    })),
  ];

  if (items.length === 0) {
    vscode.window.showWarningMessage(vscode.l10n.t("No presets available."));
    return;
  }

  const quickPick = vscode.window.createQuickPick<PresetQuickPickItem>();
  quickPick.title = vscode.l10n.t("Select presets to apply");
  quickPick.placeholder = vscode.l10n.t("Choose presets to enable for this workspace");
  quickPick.canSelectMany = true;
  quickPick.items = items;
  quickPick.selectedItems = items.filter(i => i.picked);

  quickPick.onDidAccept(() => {
    const newSelected = quickPick.selectedItems.map(i => i.preset.name);
    saveSelectedPresets(folderUri.fsPath, newSelected);
    decorationChangeEvent.fire(folderUri);
    vscode.window.showInformationMessage(
      vscode.l10n.t("Preset \"{0}\" applied successfully.", newSelected.join(", ")),
    );
    quickPick.dispose();
  });

  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}

export { applyPreset };
