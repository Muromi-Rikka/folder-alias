import type { ComputedRef, Ref } from "reactive-vscode";
import type { RecordConfig } from "../typings/common.typing";
import { merge } from "lodash-es";
import { join } from "pathe";
import { computed, ref } from "reactive-vscode";
import { readConfig, writeConfig } from "../utils/file.util";

export interface UseConfigReturn {
  publicConfig: Ref<RecordConfig, RecordConfig>;
  privateConfig: Ref<RecordConfig, RecordConfig>;
  configFile: ComputedRef<RecordConfig>;
  resetConfig: () => void;
  savePublic: () => void;
  savePrivate: () => void;
}

export function useConfig(fileDir: string): UseConfigReturn {
  const configPath = join(fileDir, "folder-alias.json");
  const privateConfigPath = join(fileDir, "private-folder-alias.json");
  const publicConfig = ref(readConfig(configPath));
  const privateConfig = ref(readConfig(privateConfigPath));
  const configFile = computed<RecordConfig>(() => merge(publicConfig.value, privateConfig.value));
  function resetConfig() {
    publicConfig.value = readConfig(configPath);
    privateConfig.value = readConfig(privateConfigPath);
  }

  function savePublic() {
    writeConfig(configPath, publicConfig.value);
  }

  function savePrivate() {
    writeConfig(privateConfigPath, privateConfig.value);
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
