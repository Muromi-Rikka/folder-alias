import * as fs from "node:fs";
import { defineExtension } from "reactive-vscode";
import { joinURL } from "ufo";
import { workspace } from "vscode";
import { addAlias } from "./command";
import { useFileAlias } from "./file-alias";
import { writeConfig } from "./utils/file.util";

const { activate, deactivate } = defineExtension(async () => {
  if (!workspace.workspaceFolders) {
    return;
  }

  for (let index = 0; index < workspace.workspaceFolders.length; index++) {
    const ws = workspace.workspaceFolders[index];
    const workspaceDir: string = ws.uri.fsPath;
    const configPath = joinURL(workspaceDir, "folder-alias.json");
    const privateConfigPath = joinURL(workspaceDir, "private-folder-alias.json");
    if (!fs.existsSync(configPath)) {
      writeConfig(configPath, {});
    }
    if (!fs.existsSync(privateConfigPath)) {
      writeConfig(privateConfigPath, {});
    }

    const fileAlias = useFileAlias(ws.uri);
    addAlias(ws, fileAlias);
  }
});

export { activate, deactivate };
