import path = require("path");
import * as vscode from "vscode";
import * as fs from "fs";
import { addAlias, addIcon, openFile } from "./command";
import { createTree } from "./menu/folder-alias-tree";
import { changeConfig } from "./utils/update.util";
import { firstWorkspace } from "./utils/workspace.util";
import { writeConfig } from "./utils/file.util";
import { getCommonConfig } from "./utils/config.util";

export function activate(context: vscode.ExtensionContext) {
  const onceWorkspace = firstWorkspace();
  if (onceWorkspace) {
    const workspaceDir: string = onceWorkspace.uri.fsPath;
    const configPath = path.join(workspaceDir, "folder-alias.json");
    if (!fs.existsSync(configPath)) {
      writeConfig(configPath, {});
    }
    const commonConfig = getCommonConfig(workspaceDir);
    changeConfig(onceWorkspace);
    createTree(onceWorkspace, commonConfig);
    context.subscriptions.push(addAlias(onceWorkspace, commonConfig));
    context.subscriptions.push(addIcon(onceWorkspace));
    context.subscriptions.push(openFile);
  }
}

export function deactivate() {}
