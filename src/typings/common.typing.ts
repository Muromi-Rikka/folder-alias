import * as vscode from "vscode";
export interface FANode {
  uri: vscode.Uri;
  type: vscode.FileType;
}
export interface ConfigItem {
  description?: string;
  icon?: string;
  tooltip?: string;
}

export type RecordConfig = Record<string, ConfigItem>;

export interface TemplateFile {
  level: number;
  config: RecordConfig;
}
