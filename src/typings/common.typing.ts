import * as vscode from "vscode";
export interface FANode {
  uri: vscode.Uri;
  type: vscode.FileType;
}
export interface ConfigItem {
  description: string;
}
