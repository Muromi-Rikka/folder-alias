import * as fs from "node:fs";
import { defineExtension } from "reactive-vscode";
import { joinURL } from "ufo";
import { workspace } from "vscode";
import { addAlias, addTooltip, delAlias } from "./command";
import { FileAlias } from "./file-alias";
import { writeConfig } from "./utils/file.util";
import { logger } from "./utils/logger.util";

const { activate, deactivate } = defineExtension(async (context) => {
  logger.info(workspace.workspaceFolders);
  if (!workspace.workspaceFolders) {
    return;
  }

  for (let index = 0; index < workspace.workspaceFolders.length; index++) {
    const ws = workspace.workspaceFolders[index];
    const workspaceDir: string = ws.uri.fsPath;
    logger.info(workspaceDir);
    const configPath = joinURL(workspaceDir, "folder-alias.json");
    if (!fs.existsSync(configPath)) {
      writeConfig(configPath, {});
    }
    const fileAlias = new FileAlias(ws.uri);
    await fileAlias.initWorkSpace();
    context.subscriptions.push(addAlias(ws, fileAlias));
    context.subscriptions.push(addTooltip(ws, fileAlias));
    context.subscriptions.push(delAlias(ws, fileAlias));
  }
});

export { activate, deactivate };
