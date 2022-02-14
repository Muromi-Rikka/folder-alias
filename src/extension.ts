import * as vscode from "vscode";
import { addAlias, openFile } from "./command";
import { createTree } from "./menu/folder-alias-tree";

export function activate(context: vscode.ExtensionContext) {
  createTree();
  context.subscriptions.push(addAlias);
  context.subscriptions.push(openFile);
}

export function deactivate() {}
