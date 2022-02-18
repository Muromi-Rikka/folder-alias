import { existsSync } from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { FANode } from "../typings/common.typing";
import { readConfig, writeConfig } from "../utils/file.util";

const addIcon = (workspace: vscode.WorkspaceFolder) => {
  return vscode.commands.registerCommand(
    "folder-alias.addIcon",
    (uri: FANode) => {
      const hasMIcon = vscode.extensions.all.find(
        (ext) => ext.id === "PKief.material-icon-theme"
      );
      if (!hasMIcon) {
        vscode.window.showWarningMessage(
          "修改图标功能需要安装Material Icon Theme"
        );
        return;
      }
      vscode.window.showWarningMessage("功能待开发");
      return;
      const configPath = path.join(workspace.uri.fsPath, "folder-alias.json");
      if (existsSync(configPath)) {
        const relativelyPath = uri.uri.path.substring(
          workspace.uri.path.length + 1
        );
        const originConfig = readConfig(configPath);
        const inputConfig: vscode.QuickPickOptions = {
          title: "Select Your Icon",
          canPickMany: false
        };
        console.log(vscode.ThemeIcon.File.id);
        const quickpickList: Array<vscode.QuickPickItem & { data: string }> = [
          {
            label: "$(svg) javascript",
            data: "js"
          }
        ];
        vscode.window
          .showQuickPick(quickpickList, inputConfig)
          .then((alias) => {
            if (alias) {
              originConfig[relativelyPath] = {
                ...originConfig[relativelyPath],
                icon: alias.data
              };
              writeConfig(configPath, originConfig);
              vscode.commands.executeCommand("folder-alias.refresh");
            }
          });
      }
    }
  );
};
export { addIcon };
