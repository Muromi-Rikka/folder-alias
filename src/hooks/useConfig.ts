import type { ComputedRef, Ref } from "reactive-vscode";
import type { RecordConfig } from "../typings/common.typing";
import type { ConfigLocation } from "../utils/file.util";
import { merge } from "es-toolkit";
import { computed, ref } from "reactive-vscode";
import { workspace } from "vscode";
import { readConfigWithVscodePriority, resolveConfigPath, writeConfig } from "../utils/file.util";

export interface UseConfigReturn {
  publicConfig: Ref<RecordConfig, RecordConfig>;
  privateConfig: Ref<RecordConfig, RecordConfig>;
  configFile: ComputedRef<RecordConfig>;
  resetConfig: () => void;
  savePublic: () => void;
  savePrivate: () => void;
}

export function useConfig(fileDir: string): UseConfigReturn {
  const publicConfig = ref(readConfigWithVscodePriority(fileDir, "folder-alias.json"));
  const privateConfig = ref(readConfigWithVscodePriority(fileDir, "private-folder-alias.json"));
  const configFile = computed<RecordConfig>(() => merge(merge({}, publicConfig.value), privateConfig.value));

  function getConfigLocation(): ConfigLocation {
    return workspace.getConfiguration("folder-alias").get<ConfigLocation>("configLocation", "auto");
  }

  function resetConfig() {
    publicConfig.value = readConfigWithVscodePriority(fileDir, "folder-alias.json");
    privateConfig.value = readConfigWithVscodePriority(fileDir, "private-folder-alias.json");
  }

  function savePublic() {
    const configPath = resolveConfigPath(fileDir, "folder-alias.json", getConfigLocation());
    writeConfig(configPath, publicConfig.value);
  }

  function savePrivate() {
    const configPath = resolveConfigPath(fileDir, "private-folder-alias.json", getConfigLocation());
    writeConfig(configPath, privateConfig.value);
  }

  return {
    publicConfig,
    privateConfig,
    configFile,
    resetConfig,
    savePublic,
    savePrivate,
  };
}
