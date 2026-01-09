import * as fs from "node:fs";
import { defineExtension } from "reactive-vscode";
import { joinURL } from "ufo";
import { commands, workspace } from "vscode";
import { addAlias, refreshAliases } from "./command";
import { useFileAlias } from "./file-alias";
import { writeConfig } from "./utils/file.util";

const { activate, deactivate } = defineExtension(async () => {
  if (!workspace.workspaceFolders) {
    return;
  }

  for (let index = 0; index < workspace.workspaceFolders.length; index++) {
    const ws = workspace.workspaceFolders[index];
    const workspaceDir: string = ws.uri.fsPath;

    const vscodeConfigPath = joinURL(workspaceDir, ".vscode", "folder-alias.json");
    const vscodePrivateConfigPath = joinURL(workspaceDir, ".vscode", "private-folder-alias.json");
    const rootConfigPath = joinURL(workspaceDir, "folder-alias.json");
    const rootPrivateConfigPath = joinURL(workspaceDir, "private-folder-alias.json");

    // 只在根目录创建配置文件，但如果.vscode目录下已存在配置文件，则不创建
    if (!fs.existsSync(vscodeConfigPath) && !fs.existsSync(rootConfigPath)) {
      writeConfig(rootConfigPath, {});
    }
    if (!fs.existsSync(vscodePrivateConfigPath) && !fs.existsSync(rootPrivateConfigPath)) {
      writeConfig(rootPrivateConfigPath, {});
    }

    const fileAlias = useFileAlias(ws.uri);
    addAlias(ws, fileAlias);
    refreshAliases(ws, fileAlias);
  }

  // Set context to enable refresh command in command palette
  commands.executeCommand("setContext", "workspaceHasFolderAlias", true);
});

export { activate, deactivate };
