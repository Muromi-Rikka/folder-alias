import type { UseFileAliasReturn } from "../file-alias";
import { join } from "pathe";
import { useCommand } from "reactive-vscode";
import * as vscode from "vscode";

function refreshAliases(workspace: vscode.WorkspaceFolder, fileAlias: UseFileAliasReturn) {
  const { resetConfig, changeEmitter, configFile } = fileAlias;

  useCommand("folder-alias.refresh", () => {
    resetConfig();

    const configuredFiles = Object.keys(configFile.value);

    const urisToRefresh: vscode.Uri[] = [];
    for (const filePath of configuredFiles) {
      const fullPath = join(workspace.uri.fsPath, filePath);
      const uri = vscode.Uri.file(fullPath);
      urisToRefresh.push(uri);
    }

    if (urisToRefresh.length > 0) {
      changeEmitter(urisToRefresh);
    }
    else {
      changeEmitter(workspace.uri);
    }

    vscode.window.showInformationMessage(`Refreshed ${urisToRefresh.length} folder aliases`);
  });
}

export { refreshAliases };
