import type { Uri } from "vscode";
import { defineExtension, useEventEmitter } from "reactive-vscode";
import { commands, FileDecoration, window, workspace } from "vscode";
import { addAlias, applyPreset, deleteAlias, deletePreset, refreshAliases, savePreset } from "./command";
import { useWorkspaceManager } from "./hooks/useWorkspaceManager";

const { activate, deactivate } = defineExtension(async () => {
  if (!workspace.workspaceFolders) {
    return;
  }

  const workspaceManager = useWorkspaceManager();
  const decorationChangeEvent = useEventEmitter<undefined | Uri | Uri[]>();

  // Register a single decoration provider for all workspace folders
  window.registerFileDecorationProvider({
    onDidChangeFileDecorations: decorationChangeEvent.event,
    provideFileDecoration(uri) {
      const instance = workspaceManager.findInstanceByUri(uri);
      if (!instance) {
        return;
      }

      const { fileAlias } = instance;
      const file = decodeURIComponent(uri.toString().replace(`${fileAlias.workspaceUri.toString()}/`, ""));
      const config = fileAlias.configFile.value[file];
      if (config) {
        return new FileDecoration(config.description, config.tooltip);
      }
    },
  });

  // Register commands once (not per-folder)
  addAlias(workspaceManager, decorationChangeEvent.emitter);
  applyPreset(workspaceManager, decorationChangeEvent.emitter);
  deleteAlias(workspaceManager, decorationChangeEvent.emitter);
  refreshAliases(workspaceManager, decorationChangeEvent.emitter);
  deletePreset(workspaceManager);
  savePreset(workspaceManager);

  // Set context to enable refresh command in command palette
  commands.executeCommand("setContext", "workspaceHasFolderAlias", true);
});

export { activate, deactivate };
