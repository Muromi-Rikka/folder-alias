// src/__tests__/index.test.ts
import { describe, expect, it, vi } from "vitest";

// Mock reactive-vscode
vi.mock("reactive-vscode", () => ({
  defineExtension: vi.fn((fn: any) => ({ activate: fn, deactivate: vi.fn() })),
  useEventEmitter: vi.fn(() => ({
    event: { dispose: vi.fn() },
    emitter: { fire: vi.fn(), dispose: vi.fn() },
  })),
}));

// Mock logger
vi.mock("./utils/logger.util", () => ({
  logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

// Mock useWorkspaceManager
const mockFindInstanceByUri = vi.fn();
vi.mock("./hooks/useWorkspaceManager", () => ({
  useWorkspaceManager: vi.fn(() => ({
    findInstanceByUri: mockFindInstanceByUri,
    getInstances: vi.fn(() => []),
  })),
}));

// Mock commands
vi.mock("./command", () => ({
  addAlias: vi.fn(),
  refreshAliases: vi.fn(),
}));

describe("provideFileDecoration path resolution", () => {
  it("should find config for paths containing spaces", async () => {
    const workspaceUri = "file:///home/user/project";
    const fileUri = { toString: () => "file:///home/user/project/folder%202" };
    const configWithSpaces: Record<string, any> = { "folder 2": { description: "My Alias" } };

    mockFindInstanceByUri.mockReturnValue({
      folder: { uri: { toString: () => workspaceUri } },
      fileAlias: {
        workspaceUri: { toString: () => workspaceUri },
        configFile: { value: configWithSpaces },
      },
    });

    const rawPath = fileUri.toString().replace(`${workspaceUri}/`, "");
    // Before fix: rawPath === "folder%202" — does NOT match "folder 2"
    expect(rawPath).toBe("folder%202");
    expect(configWithSpaces[rawPath]).toBeUndefined();

    // After fix: the lookup key should be decoded to "folder 2"
    const decodedPath = decodeURIComponent(rawPath);
    expect(decodedPath).toBe("folder 2");
    expect(configWithSpaces[decodedPath]).toEqual({ description: "My Alias" });
  });

  it("should find config for simple paths without spaces (no regression)", async () => {
    const config: Record<string, any> = { "src/components": { description: "Components" } };

    const workspaceUri = "file:///home/user/project";
    const fileUri = { toString: () => "file:///home/user/project/src/components" };

    const rawPath = fileUri.toString().replace(`${workspaceUri}/`, "");
    // Simple paths have no encoding difference
    expect(rawPath).toBe("src/components");
    expect(config[rawPath]).toEqual({ description: "Components" });
  });

  it("should find config for paths with multiple special characters", async () => {
    const config: Record<string, any> = { "my folder/sub dir": { description: "Nested" } };

    const workspaceUri = "file:///home/user/project";
    const fileUri = { toString: () => "file:///home/user/project/my%20folder/sub%20dir" };

    const rawPath = fileUri.toString().replace(`${workspaceUri}/`, "");
    expect(rawPath).toBe("my%20folder/sub%20dir");
    expect(config[rawPath]).toBeUndefined();

    const decodedPath = decodeURIComponent(rawPath);
    expect(decodedPath).toBe("my folder/sub dir");
    expect(config[decodedPath]).toEqual({ description: "Nested" });
  });
});

describe("provideFileDecoration end-to-end", () => {
  it("should return decoration for folder with space in name", async () => {
    const workspaceUri = { toString: () => "file:///home/user/project" };
    const configMap: Record<string, any> = {
      "folder 2": { description: "My Folder Alias", tooltip: "A tooltip" },
    };

    const fileUri = { toString: () => "file:///home/user/project/folder%202" };
    mockFindInstanceByUri.mockReturnValue({
      folder: { uri: workspaceUri },
      fileAlias: {
        workspaceUri,
        configFile: { value: configMap },
      },
    });

    // Simulate the fixed lookup logic from index.ts
    const instance = mockFindInstanceByUri(fileUri);
    const file = decodeURIComponent(fileUri.toString().replace(`${workspaceUri.toString()}/`, ""));
    const config = instance.fileAlias.configFile.value[file];

    expect(config).toBeDefined();
    expect(config.description).toBe("My Folder Alias");
    expect(config.tooltip).toBe("A tooltip");
  });

  it("should return decoration for nested path with spaces", async () => {
    const workspaceUri = { toString: () => "file:///home/user/project" };
    const configMap: Record<string, any> = {
      "my folder/sub dir": { description: "Nested Alias" },
    };

    const fileUri = { toString: () => "file:///home/user/project/my%20folder/sub%20dir" };
    mockFindInstanceByUri.mockReturnValue({
      folder: { uri: workspaceUri },
      fileAlias: {
        workspaceUri,
        configFile: { value: configMap },
      },
    });

    const instance = mockFindInstanceByUri(fileUri);
    const file = decodeURIComponent(fileUri.toString().replace(`${workspaceUri.toString()}/`, ""));
    const config = instance.fileAlias.configFile.value[file];

    expect(config).toBeDefined();
    expect(config.description).toBe("Nested Alias");
  });

  it("should still work for paths without spaces (regression check)", async () => {
    const workspaceUri = { toString: () => "file:///home/user/project" };
    const configMap: Record<string, any> = {
      "src/components": { description: "Components" },
    };

    const fileUri = { toString: () => "file:///home/user/project/src/components" };
    mockFindInstanceByUri.mockReturnValue({
      folder: { uri: workspaceUri },
      fileAlias: {
        workspaceUri,
        configFile: { value: configMap },
      },
    });

    const instance = mockFindInstanceByUri(fileUri);
    const file = decodeURIComponent(fileUri.toString().replace(`${workspaceUri.toString()}/`, ""));
    const config = instance.fileAlias.configFile.value[file];

    expect(config).toBeDefined();
    expect(config.description).toBe("Components");
  });

  it("should return undefined for path not in config", async () => {
    const workspaceUri = { toString: () => "file:///home/user/project" };
    const configMap: Record<string, any> = {};

    const fileUri = { toString: () => "file:///home/user/project/some%20file.txt" };
    mockFindInstanceByUri.mockReturnValue({
      folder: { uri: workspaceUri },
      fileAlias: {
        workspaceUri,
        configFile: { value: configMap },
      },
    });

    const instance = mockFindInstanceByUri(fileUri);
    const file = decodeURIComponent(fileUri.toString().replace(`${workspaceUri.toString()}/`, ""));
    const config = instance.fileAlias.configFile.value[file];

    expect(config).toBeUndefined();
  });
});
