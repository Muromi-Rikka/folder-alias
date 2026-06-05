import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock reactive-vscode
const mockWatch = vi.fn();
const mockWorkspaceFolders = { value: [] as any[] };

vi.mock("reactive-vscode", () => ({
  useWorkspaceFolders: vi.fn(() => mockWorkspaceFolders),
  watch: vi.fn((...args: any[]) => mockWatch(...args)),
}));

// Mock useFileAlias
const mockDispose = vi.fn();
const mockUseFileAlias = vi.fn((uri: any) => ({
  workspaceUri: uri,
  publicConfig: { value: {} },
  privateConfig: { value: {} },
  configFile: { value: {} },
  resetConfig: vi.fn(),
  savePublic: vi.fn(),
  savePrivate: vi.fn(),
  changeEmitter: vi.fn(),
  dispose: mockDispose,
}));

vi.mock("../../file-alias", () => ({
  useFileAlias: (uri: any) => mockUseFileAlias(uri),
}));

// Mock logger
vi.mock("../../utils/logger.util", () => ({
  logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

function createMockFolder(name: string, uriString: string) {
  return {
    name,
    index: 0,
    uri: {
      toString: () => uriString,
      fsPath: uriString.replace("file://", ""),
    },
  };
}

describe("useWorkspaceManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWorkspaceFolders.value = [];
  });

  it("should create instances for initial workspace folders", async () => {
    const folder = createMockFolder("project-a", "file:///home/user/project-a");
    mockWorkspaceFolders.value = [folder];

    const { useWorkspaceManager } = await import("../useWorkspaceManager");
    const manager = useWorkspaceManager();

    expect(mockUseFileAlias).toHaveBeenCalledWith(folder.uri);
    expect(manager.getInstances()).toHaveLength(1);
  });

  it("should find instance by URI with longest prefix match", async () => {
    const folderA = createMockFolder("project-a", "file:///home/user/project-a");
    const folderB = createMockFolder("project-b", "file:///home/user/project-b");
    mockWorkspaceFolders.value = [folderA, folderB];

    const { useWorkspaceManager } = await import("../useWorkspaceManager");
    const manager = useWorkspaceManager();

    const fileUri = { toString: () => "file:///home/user/project-a/src/index.ts" };
    const instance = manager.findInstanceByUri(fileUri as any);

    expect(instance).toBeDefined();
    expect(instance!.folder.name).toBe("project-a");
  });

  it("should return undefined for URI not matching any folder", async () => {
    const folder = createMockFolder("project-a", "file:///home/user/project-a");
    mockWorkspaceFolders.value = [folder];

    const { useWorkspaceManager } = await import("../useWorkspaceManager");
    const manager = useWorkspaceManager();

    const fileUri = { toString: () => "file:///other/path/file.ts" };
    const instance = manager.findInstanceByUri(fileUri as any);

    expect(instance).toBeUndefined();
  });

  it("should prefer longest prefix match for nested folders", async () => {
    const parent = createMockFolder("parent", "file:///home/user/parent");
    const child = createMockFolder("child", "file:///home/user/parent/child");
    mockWorkspaceFolders.value = [parent, child];

    const { useWorkspaceManager } = await import("../useWorkspaceManager");
    const manager = useWorkspaceManager();

    const fileUri = { toString: () => "file:///home/user/parent/child/src/index.ts" };
    const instance = manager.findInstanceByUri(fileUri as any);

    expect(instance).toBeDefined();
    expect(instance!.folder.name).toBe("child");
  });

  it("should return empty instances when no workspace folders", async () => {
    mockWorkspaceFolders.value = [];

    const { useWorkspaceManager } = await import("../useWorkspaceManager");
    const manager = useWorkspaceManager();

    expect(manager.getInstances()).toHaveLength(0);

    const fileUri = { toString: () => "file:///some/path" };
    expect(manager.findInstanceByUri(fileUri as any)).toBeUndefined();
  });

  it("should create instances for multiple folders", async () => {
    const folderA = createMockFolder("project-a", "file:///home/user/project-a");
    const folderB = createMockFolder("project-b", "file:///home/user/project-b");
    const folderC = createMockFolder("project-c", "file:///home/user/project-c");
    mockWorkspaceFolders.value = [folderA, folderB, folderC];

    const { useWorkspaceManager } = await import("../useWorkspaceManager");
    const manager = useWorkspaceManager();

    expect(manager.getInstances()).toHaveLength(3);
    expect(mockUseFileAlias).toHaveBeenCalledTimes(3);
  });

  it("should register a watcher for workspace folder changes", async () => {
    mockWorkspaceFolders.value = [];

    const { useWorkspaceManager } = await import("../useWorkspaceManager");
    useWorkspaceManager();

    const { watch } = await import("reactive-vscode");
    expect(watch).toHaveBeenCalledWith(mockWorkspaceFolders, expect.any(Function));
  });
});
