import { existsSync, readFileSync, writeFileSync } from "fs";
import path = require("path");
import * as vscode from "vscode";
import { FANode } from "../typings/common.typing";
import { firstWorkspace } from "../utils/workspace.util";

const addAlias = vscode.commands.registerCommand(
  "folder-alias.addAlias",
  (uri: FANode) => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    vscode.window.showInputBox().then((alias) => {
      const workspace = firstWorkspace();
      if (workspace) {
        const relativelyPath = uri.uri.path.substring(
          workspace.uri.path.length + 1
        );
        const configPath = path.join(workspace.uri.fsPath, "folder-alias.json");
        if (existsSync(configPath)) {
          const configFile = JSON.parse(readFileSync(configPath).toString());
          configFile[relativelyPath] = { description: alias };
          writeFileSync(configPath, JSON.stringify(configFile, null, 4));
        }
        vscode.commands.executeCommand("folder-alias.refresh");
      }
    });
  }
);
export { addAlias };
