import type { Uri } from "vscode";
import type { UseConfigReturn } from "./hooks/useConfig";
import { useEventEmitter, useFileSystemWatcher } from "reactive-vscode";
import { FileDecoration, RelativePattern, window } from "vscode";
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
  changeEmitter: (uri: Uri | Uri[]) => void;
}
export function useFileAlias(uri: Uri): UseFileAliasReturn {
  const { publicConfig, privateConfig, configFile, resetConfig, savePublic, savePrivate } = useConfig(uri.fsPath);
  useFileSystemWatcher(new RelativePattern(uri, "{folder-alias.json,private-folder-alias.json,.vscode/folder-alias.json,.vscode/private-folder-alias.json}"), {
    onDidChange: () => resetConfig(),
  });
  function getFileDecoration(_uri: Uri) {
    const file = _uri.toString().replace(`${uri.toString()}/`, "");
    if (configFile.value[file]) {
      return new FileDecoration(configFile.value[file].description, configFile.value[file].tooltip);
    }
  }
  const changeEmitter = useEventEmitter<undefined | Uri | Uri[]>([]);
  window.registerFileDecorationProvider({
    onDidChangeFileDecorations: changeEmitter.event,
    provideFileDecoration: uri => getFileDecoration(uri),
  });

  return {
    changeEmitter: (uri: Uri | Uri[]) => changeEmitter.fire(uri),
    publicConfig,
    privateConfig,
    configFile,
    resetConfig,
    savePublic,
    savePrivate,
  };
}
