import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const TEST_DIR = join(__dirname, "__fixtures__");
let configLocation = "auto";

// Mock reactive-vscode's ref/computed to work outside VS Code
vi.mock("reactive-vscode", () => {
  function ref(initial: any) {
    let value = initial;
    return {
      get value() { return value; },
      set value(v: any) { value = v; },
    };
  }
  function computed(fn: () => any) {
    return {
      get value() { return fn(); },
    };
  }
  return { ref, computed };
});

// Mock the logger (used by file.util.ts)
vi.mock("../../utils/logger.util", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock("vscode", () => ({
  workspace: {
    getConfiguration: () => ({
      get: (_key: string, defaultValue: string) => configLocation || defaultValue,
    }),
  },
}));

beforeEach(() => {
  configLocation = "auto";
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("useConfig", () => {
  it("should load public and private configs", async () => {
    const publicData = { src: { description: "Public" } };
    const privateData = { lib: { description: "Private" } };

    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify(publicData));
    writeFileSync(join(TEST_DIR, "private-folder-alias.json"), JSON.stringify(privateData));

    const { useConfig } = await import("../useConfig");
    const config = useConfig(TEST_DIR);

    expect(config.publicConfig.value).toEqual(publicData);
    expect(config.privateConfig.value).toEqual(privateData);
  });

  it("should merge public and private with private taking priority", async () => {
    const publicData = { src: { description: "Public" }, shared: { description: "Shared" } };
    const privateData = { src: { description: "Private Override" } };

    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify(publicData));
    writeFileSync(join(TEST_DIR, "private-folder-alias.json"), JSON.stringify(privateData));

    const { useConfig } = await import("../useConfig");
    const config = useConfig(TEST_DIR);

    expect(config.configFile.value.src.description).toBe("Private Override");
    expect(config.configFile.value.shared.description).toBe("Shared");
  });

  it("should not mutate publicConfig when computing configFile", async () => {
    const publicData = { src: { description: "Public" } };
    const privateData = { src: { description: "Private" } };

    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify(publicData));
    writeFileSync(join(TEST_DIR, "private-folder-alias.json"), JSON.stringify(privateData));

    const { useConfig } = await import("../useConfig");
    const config = useConfig(TEST_DIR);

    // Access configFile to trigger merge
    const _ = config.configFile.value;

    // publicConfig should NOT be mutated
    expect(config.publicConfig.value.src.description).toBe("Public");
  });

  it("should re-read configs on resetConfig", async () => {
    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify({ src: { description: "V1" } }));

    const { useConfig } = await import("../useConfig");
    const config = useConfig(TEST_DIR);

    expect(config.publicConfig.value.src.description).toBe("V1");

    // Update file on disk
    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify({ src: { description: "V2" } }));

    config.resetConfig();
    expect(config.publicConfig.value.src.description).toBe("V2");
  });

  it("should save public config to root when configLocation is root", async () => {
    configLocation = "root";

    const { useConfig } = await import("../useConfig");
    const config = useConfig(TEST_DIR);
    config.publicConfig.value = { src: { description: "Root" } };

    config.savePublic();

    expect(JSON.parse(readFileSync(join(TEST_DIR, "folder-alias.json"), "utf-8"))).toEqual(config.publicConfig.value);
    expect(existsSync(join(TEST_DIR, ".vscode", "folder-alias.json"))).toBe(false);
  });

  it("should create .vscode and save private config there when configLocation is vscode", async () => {
    configLocation = "vscode";

    const { useConfig } = await import("../useConfig");
    const config = useConfig(TEST_DIR);
    config.privateConfig.value = { secret: { description: "Private" } };

    config.savePrivate();

    expect(JSON.parse(readFileSync(join(TEST_DIR, ".vscode", "private-folder-alias.json"), "utf-8"))).toEqual(config.privateConfig.value);
    expect(existsSync(join(TEST_DIR, "private-folder-alias.json"))).toBe(false);
  });
});
