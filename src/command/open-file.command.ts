import * as vscode from "vscode";
import { isBinary } from "istextorbinary";
const openFile = vscode.commands.registerCommand(
  "fileExplorer.openFile",
  (resource) => openResource(resource)
);
function openResource(resource: vscode.Uri): void {
  if (!isBinary(resource.fsPath)) {
    vscode.window.showTextDocument(resource);
  }
}
export { openFile };
