import { existsSync, renameSync } from "fs";
import { join } from "path";
import { firstWorkspace } from "./workspace.util";

function changeConfig(): void {
  const workspace = firstWorkspace();
  if (workspace) {
    const oldConfigPath = join(
      workspace.uri.fsPath,
      ".vscode/folder-alias.json"
    );
    if (existsSync(oldConfigPath)) {
      console.log("has old config");
      renameSync(
        oldConfigPath,
        join(workspace.uri.fsPath, "folder-alias.json")
      );
    }
  }
}

export { changeConfig };
