import type { Uri, WorkspaceFolder } from "vscode";
import type { UseFileAliasReturn } from "../file-alias";
import { maxBy } from "es-toolkit";
import { useWorkspaceFolders, watch } from "reactive-vscode";
import { useFileAlias } from "../file-alias";
import { logger } from "../utils/logger.util";

export interface WorkspaceFolderInstance {
  folder: WorkspaceFolder;
  fileAlias: UseFileAliasReturn;
}

export interface UseWorkspaceManagerReturn {
  /** Find the folder instance whose root is the longest prefix of the given URI */
  findInstanceByUri: (uri: Uri) => WorkspaceFolderInstance | undefined;
  /** All active folder instances */
  getInstances: () => WorkspaceFolderInstance[];
}

export function useWorkspaceManager(): UseWorkspaceManagerReturn {
  const workspaceFolders = useWorkspaceFolders();

  // Map from folder URI string → instance
  const instances = new Map<string, WorkspaceFolderInstance>();

  function syncInstances() {
    const currentFolders = workspaceFolders.value ?? [];

    // Build set of current folder URIs
    const currentUris = new Set<string>();
    for (const folder of currentFolders) {
      currentUris.add(folder.uri.toString());
    }

    // Remove instances for folders that no longer exist
    for (const [uriStr, instance] of instances) {
      if (!currentUris.has(uriStr)) {
        instance.fileAlias.dispose();
        instances.delete(uriStr);
        logger.info(`Removed workspace folder: ${uriStr}`);
      }
    }

    // Add instances for new folders
    for (const folder of currentFolders) {
      const uriStr = folder.uri.toString();
      if (!instances.has(uriStr)) {
        const fileAlias = useFileAlias(folder.uri);
        instances.set(uriStr, { folder, fileAlias });
        logger.info(`Added workspace folder: ${uriStr}`);
      }
    }
  }

  // Initial sync
  syncInstances();

  // Watch for reactive changes — useWorkspaceFolders returns a reactive ref
  watch(workspaceFolders, () => {
    syncInstances();
  });

  function findInstanceByUri(uri: Uri): WorkspaceFolderInstance | undefined {
    const uriStr = uri.toString();

    const candidates = Array.from(instances.values()).filter(
      instance => uriStr.startsWith(`${instance.folder.uri.toString()}/`),
    );

    return maxBy(candidates, instance => instance.folder.uri.toString().length);
  }

  function getInstances(): WorkspaceFolderInstance[] {
    return Array.from(instances.values());
  }

  return { findInstanceByUri, getInstances };
}
