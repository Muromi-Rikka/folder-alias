import { readFileSync, statSync, writeFileSync } from "fs";
import path = require("path");
import * as vscode from "vscode";
import { FANode } from "../typings/common.typing";

const addAlias = vscode.commands.registerCommand(
  "folder-alias.addAlias",
  (uri: FANode) => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    vscode.window.showInputBox().then((alias) => {
      const workspace: vscode.WorkspaceFolder = (vscode.workspace
        .workspaceFolders &&
        vscode.workspace.workspaceFolders[0]) as vscode.WorkspaceFolder;
      const relativelyPath = uri.uri.path.substring(
        workspace.uri.path.length + 1
      );
      const configPath = path.join(
        workspace.uri.fsPath,
        ".vscode/folder-alias.json"
      );
      if (statSync(configPath)) {
        const configFile = JSON.parse(readFileSync(configPath).toString());
        configFile[relativelyPath] = { description: alias };
        writeFileSync(configPath, JSON.stringify(configFile, null, 4));
      }
      vscode.commands.executeCommand("folder-alias.refresh");
    });
  }
);
export { addAlias };
