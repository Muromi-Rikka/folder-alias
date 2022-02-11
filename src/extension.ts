import * as vscode from "vscode";
import { addAlias } from "./command";
import { createTree } from "./menu/folder-alias-tree";

export function activate(context: vscode.ExtensionContext) {
  createTree();

  context.subscriptions.push(addAlias);
}

export function deactivate() {}
