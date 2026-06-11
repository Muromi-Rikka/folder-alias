import type { Uri } from "vscode";
import type { UseConfigReturn } from "./hooks/useConfig";
import { useEventEmitter, useFileSystemWatcher } from "reactive-vscode";
import { Disposable, FileDecoration, RelativePattern } from "vscode";
import { useConfig } from "./hooks/useConfig";
import { logger } from "./utils/logger.util";

// Monkey-patch FileDecoration.validate to allow extended badge support
// (VS Code's default validation rejects badges longer than 2 chars)
// @ts-expect-error - monkey-patching for extended badge support
const originalValidate = FileDecoration.validate;
// @ts-expect-error - monkey-patching for extended badge support
FileDecoration.validate = (d: FileDecoration): void => {
  if (d.badge && d.badge.length > 2) {
    logger.warn(`Badge "${d.badge}" exceeds 2 characters, may not display correctly`);
  }
  if (!d.color && !d.badge && !d.tooltip) {
    logger.warn("Empty file decoration provided");
    return;
  }
  try {
    originalValidate.call(FileDecoration, d);
  }
  catch {
    // Silently handle validation errors for extended badge support
  }
};

export interface UseFileAliasReturn extends UseConfigReturn {
  /** The workspace folder URI this instance manages */
  workspaceUri: Uri;
  /** Fire to notify VS Code that decorations changed for this instance */
  changeEmitter: (uri: Uri | Uri[]) => void;
  /** Dispose watchers and emitters for this folder instance */
  dispose: () => void;
}

export function useFileAlias(uri: Uri): UseFileAliasReturn {
  const { publicConfig, privateConfig, configFile, resetConfig, savePublic, savePrivate } = useConfig(uri.fsPath);

  const { watchers } = useFileSystemWatcher(
    new RelativePattern(uri, "{folder-alias.json,private-folder-alias.json,.vscode/folder-alias.json,.vscode/private-folder-alias.json,.vscode/folder-alias-selected-presets.json}"),
    { onDidChange: () => resetConfig() },
  );

  const changeEmitter = useEventEmitter<undefined | Uri | Uri[]>([]);

  const disposable = new Disposable(() => {
    for (const watcher of watchers.values()) {
      watcher.dispose();
    }
    changeEmitter.emitter.dispose();
  });

  return {
    workspaceUri: uri,
    changeEmitter: (uri: Uri | Uri[]) => changeEmitter.fire(uri),
    publicConfig,
    privateConfig,
    configFile,
    resetConfig,
    savePublic,
    savePrivate,
    dispose: () => disposable.dispose(),
  };
}
