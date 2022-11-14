import { existsSync, renameSync } from "fs";
import { join } from "path";
import { WorkspaceFolder } from "vscode";

function changeConfig(workspace: WorkspaceFolder): void {
  const oldConfigPath = join(workspace.uri.fsPath, ".vscode/folder-alias.json");
  if (existsSync(oldConfigPath)) {
    renameSync(oldConfigPath, join(workspace.uri.fsPath, "folder-alias.json"));
  }
}

export { changeConfig };
