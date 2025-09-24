import type { UseFileAliasReturn } from "../file-alias";
import { useCommand } from "reactive-vscode";
import { joinURL } from "ufo";
import * as vscode from "vscode";

function refreshAliases(workspace: vscode.WorkspaceFolder, fileAlias: UseFileAliasReturn) {
  const { resetConfig, changeEmitter, configFile } = fileAlias;

  useCommand("folder-alias.refresh", () => {
    // Reset the configuration to reload from JSON files
    resetConfig();

    // Get all configured file paths from the refreshed config
    const configuredFiles = Object.keys(configFile.value);

    // Create URIs for all configured files
    const urisToRefresh: vscode.Uri[] = [];
    for (const filePath of configuredFiles) {
      const fullPath = joinURL(workspace.uri.fsPath, filePath);
      const uri = vscode.Uri.file(fullPath);
      urisToRefresh.push(uri);
    }

    // Emit change events for all configured files
    if (urisToRefresh.length > 0) {
      changeEmitter(urisToRefresh);
    }
    else {
      // If no files are configured, refresh the workspace root
      changeEmitter(workspace.uri);
    }

    // Show success message
    vscode.window.showInformationMessage(`Refreshed ${urisToRefresh.length} folder aliases`);
  });
}

export { refreshAliases };
