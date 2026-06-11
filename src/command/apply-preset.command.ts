import type { EventEmitter as VscodeEventEmitter } from "vscode";
import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import type { Preset } from "../typings/preset.typing";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";
import { getBuiltInPresets, getSelectedPresets, getUserPresets, saveSelectedPresets } from "../utils/preset.util";

interface PresetQuickPickItem extends vscode.QuickPickItem {
  preset: Preset;
  isBuiltIn: boolean;
}

function applyPreset(
  workspaceManager: UseWorkspaceManagerReturn,
  decorationChangeEvent: VscodeEventEmitter<undefined | vscode.Uri | vscode.Uri[]>,
) {
  useCommand("folder-alias.applyPreset", (uri?: vscode.Uri) => {
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
          title: vscode.l10n.t("Select workspace folder"),
        }).then((selected) => {
          if (selected) {
            const folder = folders.find(f => f.name === selected.label);
            if (folder) {
              applyPresetToFolder(folder.uri, workspaceManager, decorationChangeEvent);
            }
          }
        });
        return;
      }
    }

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
      detail: `${selectedNames.includes(p.name) ? "$(check) " : ""}Built-in · ${Object.keys(p.aliases).length} aliases`,
      preset: p,
      isBuiltIn: true,
    })),
    ...userPresets.map(p => ({
      label: `$(settings) ${p.name}`,
      description: p.description,
      detail: `${selectedNames.includes(p.name) ? "$(check) " : ""}Custom · ${Object.keys(p.aliases).length} aliases`,
      preset: p,
      isBuiltIn: false,
    })),
  ];

  if (items.length === 0) {
    vscode.window.showWarningMessage(vscode.l10n.t("No presets available."));
    return;
  }

  vscode.window.showQuickPick(items, {
    title: vscode.l10n.t("Select preset to apply"),
    placeHolder: vscode.l10n.t("Choose a preset to enable for this workspace"),
  }).then((selected) => {
    if (selected) {
      const currentSelected = getSelectedPresets(folderUri.fsPath);
      const presetName = selected.preset.name;

      if (currentSelected.includes(presetName)) {
        const newSelected = currentSelected.filter(n => n !== presetName);
        saveSelectedPresets(folderUri.fsPath, newSelected);
        vscode.window.showInformationMessage(
          vscode.l10n.t("Preset \"{0}\" removed.", presetName),
        );
      }
      else {
        const newSelected = [...currentSelected, presetName];
        saveSelectedPresets(folderUri.fsPath, newSelected);
        vscode.window.showInformationMessage(
          vscode.l10n.t("Preset \"{0}\" applied successfully.", presetName),
        );
      }

      decorationChangeEvent.fire(folderUri);
    }
  });
}

export { applyPreset };
