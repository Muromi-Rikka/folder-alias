import { defineExtension } from "reactive-vscode";
import { commands, workspace } from "vscode";
import { addAlias, refreshAliases } from "./command";
import { useFileAlias } from "./file-alias";

const { activate, deactivate } = defineExtension(async () => {
  if (!workspace.workspaceFolders) {
    return;
  }

  for (let index = 0; index < workspace.workspaceFolders.length; index++) {
    const ws = workspace.workspaceFolders[index];

    const fileAlias = useFileAlias(ws.uri);

    addAlias(ws, fileAlias);
    refreshAliases(ws, fileAlias);
  }

  // Set context to enable refresh command in command palette
  commands.executeCommand("setContext", "workspaceHasFolderAlias", true);
});

export { activate, deactivate };
