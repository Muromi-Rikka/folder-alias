import type { Uri } from "vscode";
import type { UseConfigReturn } from "./hooks/useConfig";
import { useEventEmitter, useFsWatcher } from "reactive-vscode";
import { FileDecoration, RelativePattern, window } from "vscode";
import { useConfig } from "./hooks/useConfig";

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
FileDecoration.validate = (d: FileDecoration): void => {
  if (d.badge && d.badge.length !== 1 && d.badge.length !== 2) {
    // throw new Error(`The 'badge'-property must be undefined or a short character`);
  }
  if (!d.color && !d.badge && !d.tooltip) {
    // throw new Error(`The decoration is empty`);
  }
};
export interface UseFileAliasReturn extends UseConfigReturn {
  changeEmitter: (uri: Uri | Uri[]) => void;
}
export function useFileAlias(uri: Uri): UseFileAliasReturn {
  const { publicConfig, privateConfig, configFile, resetConfig, savePublic, savePrivate } = useConfig(uri.fsPath);
  const watcher = useFsWatcher(new RelativePattern(uri, "**/*"));
  watcher.onDidChange((uri) => {
    if (uri.fsPath.endsWith("folder-alias.json") || uri.fsPath.endsWith("private-folder-alias.json")) {
      resetConfig();
    }
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
