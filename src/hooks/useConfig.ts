import type { ComputedRef, Ref } from "reactive-vscode";
import type { RecordConfig } from "../typings/common.typing";
import { existsSync } from "node:fs";
import { merge } from "lodash-es";
import { join } from "pathe";
import { computed, ref } from "reactive-vscode";
import { readConfigWithVscodePriority, writeConfig } from "../utils/file.util";

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
  const configFile = computed<RecordConfig>(() => merge(publicConfig.value, privateConfig.value));

  function resetConfig() {
    publicConfig.value = readConfigWithVscodePriority(fileDir, "folder-alias.json");
    privateConfig.value = readConfigWithVscodePriority(fileDir, "private-folder-alias.json");
  }

  function savePublic() {
    const vscodeConfigPath = join(fileDir, ".vscode", "folder-alias.json");
    const rootConfigPath = join(fileDir, "folder-alias.json");

    // 只在.vscode目录下存在配置文件时保存到.vscode目录
    if (existsSync(vscodeConfigPath)) {
      writeConfig(vscodeConfigPath, publicConfig.value);
    }
    else {
      // 否则保存到根目录
      writeConfig(rootConfigPath, publicConfig.value);
    }
  }

  function savePrivate() {
    const vscodeConfigPath = join(fileDir, ".vscode", "private-folder-alias.json");
    const rootConfigPath = join(fileDir, "private-folder-alias.json");

    // 只在.vscode目录下存在配置文件时保存到.vscode目录
    if (existsSync(vscodeConfigPath)) {
      writeConfig(vscodeConfigPath, privateConfig.value);
    }
    else {
      // 否则保存到根目录
      writeConfig(rootConfigPath, privateConfig.value);
    }
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
