import * as vscode from "vscode";
const firstWorkspace = () => {
  if (
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length >= 1
  ) {
    return vscode.workspace.workspaceFolders[0];
  }
  return null;
};
export { firstWorkspace };
