import type { EventEmitter as VscodeEventEmitter } from "vscode";
import type { UseWorkspaceManagerReturn } from "../hooks/useWorkspaceManager";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";
import { deleteUserPreset, getSelectedPresets, getUserPresets, saveSelectedPresets } from "../utils/preset.util";

interface PresetQuickPickItem extends vscode.QuickPickItem {
  presetName: string;
}

function deletePreset(
  _workspaceManager: UseWorkspaceManagerReturn,
  decorationChangeEvent: VscodeEventEmitter<undefined | vscode.Uri | vscode.Uri[]>,
) {
  useCommand("folder-alias.deletePreset", async (uri?: vscode.Uri) => {
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
              deletePresetFromFolder(folder.uri, decorationChangeEvent);
            }
          }
        });
        return;
      }
    }

    deletePresetFromFolder(targetUri, decorationChangeEvent);
  });
}

function deletePresetFromFolder(
  folderUri: vscode.Uri,
  decorationChangeEvent: VscodeEventEmitter<undefined | vscode.Uri | vscode.Uri[]>,
) {
  const userPresets = getUserPresets(folderUri.fsPath);

  if (userPresets.length === 0) {
    vscode.window.showWarningMessage(vscode.l10n.t("No custom presets found in this workspace."));
    return;
  }

  const items: PresetQuickPickItem[] = userPresets.map(p => ({
    label: p.name,
    description: p.description,
    detail: `${Object.keys(p.aliases).length} aliases`,
    presetName: p.name,
  }));

  vscode.window.showQuickPick(items, {
    title: vscode.l10n.t("Select preset to delete"),
    placeHolder: vscode.l10n.t("Choose a custom preset to remove"),
  }).then((selected) => {
    if (selected) {
      deleteUserPreset(folderUri.fsPath, selected.presetName);

      const selectedPresets = getSelectedPresets(folderUri.fsPath);
      if (selectedPresets.includes(selected.presetName)) {
        saveSelectedPresets(
          folderUri.fsPath,
          selectedPresets.filter(n => n !== selected.presetName),
        );
        decorationChangeEvent.fire(folderUri);
      }

      vscode.window.showInformationMessage(
        vscode.l10n.t("Preset \"{0}\" deleted.", selected.presetName),
      );
    }
  });
}

export { deletePreset };
