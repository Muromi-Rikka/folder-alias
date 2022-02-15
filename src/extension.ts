import * as vscode from "vscode";
import { addAlias, openFile } from "./command";
import { createTree } from "./menu/folder-alias-tree";
import { changeConfig } from "./utils/update.util";

export function activate(context: vscode.ExtensionContext) {
  changeConfig();
  createTree();
  context.subscriptions.push(addAlias);
  context.subscriptions.push(openFile);
}

export function deactivate() {}
