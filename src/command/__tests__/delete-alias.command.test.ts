import { beforeEach, describe, expect, it, vi } from "vitest";

let commandHandler: ((uri: any) => void) | undefined;

// Mock reactive-vscode
vi.mock("reactive-vscode", () => ({
  useCommand: vi.fn((_id: string, handler: any) => { commandHandler = handler; }),
}));

// Mock vscode
const mockShowWarningMessage = vi.fn();
const mockShowInformationMessage = vi.fn();
const mockShowQuickPick = vi.fn();
vi.mock("vscode", () => ({
  window: {
    showWarningMessage: (...args: any[]) => mockShowWarningMessage(...args),
    showInformationMessage: (...args: any[]) => mockShowInformationMessage(...args),
    showQuickPick: (...args: any[]) => mockShowQuickPick(...args),
  },
  l10n: {
    t: (key: string, ...args: any[]) => {
      let result = key;
      args.forEach((arg, i) => {
        result = result.replace(`{${i}}`, String(arg));
      });
      return result;
    },
  },
}));

function createMockUri(fsPath: string) {
  return { fsPath, toString: () => `file:///${fsPath.replace(/\\/g, "/")}` } as any;
}

function createMockInstance(config: Record<string, any> = {}, overrides: Record<string, any> = {}) {
  const publicConfig: Record<string, any> = {};
  const privateConfig: Record<string, any> = {};

  for (const [key, value] of Object.entries(config)) {
    if (key.startsWith("private:")) {
      privateConfig[key.replace("private:", "")] = value;
    }
    else {
      publicConfig[key] = value;
    }
  }

  const resetConfig = vi.fn();
  const savePublic = vi.fn();
  const savePrivate = vi.fn();

  const fileAlias = {
    publicConfig: { value: publicConfig },
    privateConfig: { value: privateConfig },
    configFile: {
      get value() {
        return { ...publicConfig, ...privateConfig };
      },
    },
    resetConfig,
    savePublic,
    savePrivate,
    ...overrides,
  };

  return {
    folder: { uri: { fsPath: "/workspace/project" } },
    fileAlias,
    _savePublic: savePublic,
    _savePrivate: savePrivate,
    _resetConfig: resetConfig,
  };
}

describe("deleteAlias", () => {
  let mockWorkspaceManager: any;
  let mockDecorationChangeEvent: any;

  beforeEach(() => {
    vi.clearAllMocks();
    commandHandler = undefined;
    mockWorkspaceManager = {
      findInstanceByUri: vi.fn(),
    };
    mockDecorationChangeEvent = { fire: vi.fn() };
  });

  it("should show warning when no instance found", async () => {
    const { deleteAlias } = await import("../delete-alias.command");
    mockWorkspaceManager.findInstanceByUri.mockReturnValue(undefined);
    deleteAlias(mockWorkspaceManager, mockDecorationChangeEvent);

    commandHandler!(createMockUri("/workspace/project/file.txt"));

    expect(mockShowWarningMessage).toHaveBeenCalledWith(
      expect.stringContaining("not inside any workspace"),
    );
  });

  it("should show warning when no alias exists for the file", async () => {
    const { deleteAlias } = await import("../delete-alias.command");
    const instance = createMockInstance({});
    mockWorkspaceManager.findInstanceByUri.mockReturnValue(instance);
    deleteAlias(mockWorkspaceManager, mockDecorationChangeEvent);

    commandHandler!(createMockUri("/workspace/project/some-file"));

    expect(mockShowWarningMessage).toHaveBeenCalledWith(
      expect.stringContaining("No alias found"),
    );
  });

  it("should delete alias from public config after confirmation", async () => {
    const { deleteAlias } = await import("../delete-alias.command");
    const instance = createMockInstance({
      "src/components": { description: "UI Components" },
    });
    mockWorkspaceManager.findInstanceByUri.mockReturnValue(instance);
    deleteAlias(mockWorkspaceManager, mockDecorationChangeEvent);

    mockShowQuickPick.mockResolvedValue("public");
    mockShowWarningMessage.mockResolvedValue("Delete");

    commandHandler!(createMockUri("/workspace/project/src/components"));

    await vi.waitFor(() => {
      expect(instance._savePublic).toHaveBeenCalled();
    });

    expect(instance.fileAlias.publicConfig.value["src/components"]).toBeUndefined();
    expect(instance._resetConfig).toHaveBeenCalled();
    expect(mockDecorationChangeEvent.fire).toHaveBeenCalled();
    expect(mockShowInformationMessage).toHaveBeenCalledWith(
      expect.stringContaining("Deleted alias"),
    );
  });

  it("should delete alias from private config when private scope selected", async () => {
    const { deleteAlias } = await import("../delete-alias.command");
    const instance = createMockInstance({
      "private:src/utils": { description: "Utilities" },
    });
    mockWorkspaceManager.findInstanceByUri.mockReturnValue(instance);
    deleteAlias(mockWorkspaceManager, mockDecorationChangeEvent);

    mockShowQuickPick.mockResolvedValue("private");
    mockShowWarningMessage.mockResolvedValue("Delete");

    commandHandler!(createMockUri("/workspace/project/src/utils"));

    await vi.waitFor(() => {
      expect(instance._savePrivate).toHaveBeenCalled();
    });

    expect(instance.fileAlias.privateConfig.value["src/utils"]).toBeUndefined();
  });

  it("should not delete when user cancels confirmation", async () => {
    const { deleteAlias } = await import("../delete-alias.command");
    const instance = createMockInstance({
      "src/components": { description: "UI Components" },
    });
    mockWorkspaceManager.findInstanceByUri.mockReturnValue(instance);
    deleteAlias(mockWorkspaceManager, mockDecorationChangeEvent);

    mockShowQuickPick.mockResolvedValue("public");
    mockShowWarningMessage.mockResolvedValue("Cancel");

    commandHandler!(createMockUri("/workspace/project/src/components"));

    await vi.waitFor(() => {
      expect(mockShowWarningMessage).toHaveBeenCalled();
    });

    expect(instance._savePublic).not.toHaveBeenCalled();
    expect(instance.fileAlias.publicConfig.value["src/components"]).toEqual({
      description: "UI Components",
    });
  });

  it("should not delete when scope picker is dismissed", async () => {
    const { deleteAlias } = await import("../delete-alias.command");
    const instance = createMockInstance({
      "src/components": { description: "UI Components" },
    });
    mockWorkspaceManager.findInstanceByUri.mockReturnValue(instance);
    deleteAlias(mockWorkspaceManager, mockDecorationChangeEvent);

    mockShowQuickPick.mockResolvedValue(undefined);

    commandHandler!(createMockUri("/workspace/project/src/components"));

    await vi.waitFor(() => {
      expect(mockShowQuickPick).toHaveBeenCalled();
    });

    expect(instance._savePublic).not.toHaveBeenCalled();
    expect(instance._savePrivate).not.toHaveBeenCalled();
  });

  it("should warn when alias exists globally but not in selected scope", async () => {
    const { deleteAlias } = await import("../delete-alias.command");
    const instance = createMockInstance({
      "src/components": { description: "UI Components" },
    });
    mockWorkspaceManager.findInstanceByUri.mockReturnValue(instance);
    deleteAlias(mockWorkspaceManager, mockDecorationChangeEvent);

    mockShowQuickPick.mockResolvedValue("private");

    commandHandler!(createMockUri("/workspace/project/src/components"));

    await vi.waitFor(() => {
      expect(mockShowWarningMessage).toHaveBeenCalledWith(
        expect.stringContaining("No alias found"),
      );
    });

    expect(instance._savePrivate).not.toHaveBeenCalled();
  });
});
