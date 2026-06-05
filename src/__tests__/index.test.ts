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
    const configWithSpaces = { "folder 2": { description: "My Alias" } };

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
    const config = { "src/components": { description: "Components" } };

    const workspaceUri = "file:///home/user/project";
    const fileUri = { toString: () => "file:///home/user/project/src/components" };

    const rawPath = fileUri.toString().replace(`${workspaceUri}/`, "");
    // Simple paths have no encoding difference
    expect(rawPath).toBe("src/components");
    expect(config[rawPath]).toEqual({ description: "Components" });
  });

  it("should find config for paths with multiple special characters", async () => {
    const config = { "my folder/sub dir": { description: "Nested" } };

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
