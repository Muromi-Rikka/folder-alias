import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the logger (uses reactive-vscode's defineLogger)
vi.mock("../logger.util", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

const TEST_DIR = join(__dirname, "__fixtures__");

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("readConfig", () => {
  it("should read valid JSON config", async () => {
    const { readConfig } = await import("../file.util");
    const configPath = join(TEST_DIR, "test.json");
    const data = { "src/components": { description: "Components" } };
    writeFileSync(configPath, JSON.stringify(data));

    const result = readConfig(configPath);
    expect(result).toEqual(data);
  });

  it("should return empty object for invalid JSON", async () => {
    const { readConfig } = await import("../file.util");
    const configPath = join(TEST_DIR, "invalid.json");
    writeFileSync(configPath, "not json {{{");

    const result = readConfig(configPath);
    expect(result).toEqual({});
  });

  it("should return empty object for non-object JSON (array)", async () => {
    const { readConfig } = await import("../file.util");
    const configPath = join(TEST_DIR, "array.json");
    writeFileSync(configPath, JSON.stringify([1, 2, 3]));

    const result = readConfig(configPath);
    expect(result).toEqual({});
  });

  it("should return empty object for null JSON", async () => {
    const { readConfig } = await import("../file.util");
    const configPath = join(TEST_DIR, "null.json");
    writeFileSync(configPath, "null");

    const result = readConfig(configPath);
    expect(result).toEqual({});
  });

  it("should return empty object for non-existent file", async () => {
    const { readConfig } = await import("../file.util");
    const result = readConfig(join(TEST_DIR, "nonexistent.json"));
    expect(result).toEqual({});
  });
});

describe("readConfigWithVscodePriority", () => {
  it("should prefer .vscode config over root config", async () => {
    const { readConfigWithVscodePriority } = await import("../file.util");
    const vscodeDir = join(TEST_DIR, ".vscode");
    mkdirSync(vscodeDir, { recursive: true });

    const rootConfig = { src: { description: "Root" } };
    const vscodeConfig = { src: { description: "VSCode" } };

    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify(rootConfig));
    writeFileSync(join(vscodeDir, "folder-alias.json"), JSON.stringify(vscodeConfig));

    const result = readConfigWithVscodePriority(TEST_DIR, "folder-alias.json");
    expect(result).toEqual(vscodeConfig);
  });

  it("should fall back to root config when .vscode config doesn't exist", async () => {
    const { readConfigWithVscodePriority } = await import("../file.util");
    const rootConfig = { src: { description: "Root" } };
    writeFileSync(join(TEST_DIR, "folder-alias.json"), JSON.stringify(rootConfig));

    const result = readConfigWithVscodePriority(TEST_DIR, "folder-alias.json");
    expect(result).toEqual(rootConfig);
  });

  it("should return empty object when neither config exists", async () => {
    const { readConfigWithVscodePriority } = await import("../file.util");
    const result = readConfigWithVscodePriority(TEST_DIR, "folder-alias.json");
    expect(result).toEqual({});
  });
});

describe("writeConfig", () => {
  it("should write valid JSON with 4-space indent", async () => {
    const { writeConfig } = await import("../file.util");
    const configPath = join(TEST_DIR, "output.json");
    const data = { src: { description: "Source" } };

    writeConfig(configPath, data);

    const content = readFileSync(configPath, "utf-8");
    expect(JSON.parse(content)).toEqual(data);
    expect(content).toContain("    ");
  });
});
