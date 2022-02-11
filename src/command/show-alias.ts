import * as vscode from "vscode";
let showAlias = vscode.commands.registerCommand(
  "folder-alias.helloWorld",
  () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from folder-alias!");
  }
);

export { showAlias };
