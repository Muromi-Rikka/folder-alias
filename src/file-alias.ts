import type {
  Uri,
} from "vscode";
import type { RecordConfig } from "./typings/common.typing";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  EventEmitter,
  FileDecoration,
  RelativePattern,
  window,
  workspace,
} from "vscode";
import { logger } from "./utils/logger.util";

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
FileDecoration.validate = (d: FileDecoration): void => {
  if (d.badge && d.badge.length !== 1 && d.badge.length !== 2) {
    // throw new Error(`The 'badge'-property must be undefined or a short character`);
  }
  if (!d.color && !d.badge && !d.tooltip) {
    throw new Error(`The decoration is empty`);
  }
};

export class FileAlias {
  changeEmitter: EventEmitter<undefined | Uri | Uri[]>;
  _uri: Uri;
  config: RecordConfig;

  private getFileDecoration(uri: Uri) {
    const file = uri.toString().replace(`${this._uri.toString()}/`, "");
    if (this.config[file]) {
      logger.info(file, JSON.stringify(this.config[file]));
      return new FileDecoration(this.config[file].description);
    }
  }

  private fileChange(uri: Uri) {
    if (uri.fsPath.endsWith("folder-alias.json")) {
      this.setConfig();
    }
  }

  async initWorkSpace() {
    const watcher = workspace.createFileSystemWatcher(
      new RelativePattern(this._uri, "**/*"),
    );
    watcher.onDidChange(this.fileChange, this);

    window.registerFileDecorationProvider({
      onDidChangeFileDecorations: this.changeEmitter.event,
      provideFileDecoration: uri => this.getFileDecoration(uri),
    });
  }

  public setConfig() {
    const privateConfigPath = path.resolve(
      this._uri.fsPath,
      "folder-alias.json",
    );

    if (existsSync(privateConfigPath)) {
      const privateConfig = JSON.parse(
        readFileSync(privateConfigPath).toString(),
      );
      this.config = privateConfig;
    }
  }

  constructor(uri: Uri) {
    this.changeEmitter = new EventEmitter();
    this._uri = uri;
    this.config = {};
    this.setConfig();
  }
}
