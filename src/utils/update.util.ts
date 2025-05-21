import type { WorkspaceFolder } from "vscode";
import { existsSync, renameSync } from "node:fs";
import { join } from "node:path";
import { logger } from "./logger.util";

function changeConfig(workspace: WorkspaceFolder): void {
  const oldConfigPath = join(workspace.uri.fsPath, ".vscode/folder-alias.json");
  if (existsSync(oldConfigPath)) {
    logger.warn("has old config");
    renameSync(oldConfigPath, join(workspace.uri.fsPath, "folder-alias.json"));
  }
}

export { changeConfig };
