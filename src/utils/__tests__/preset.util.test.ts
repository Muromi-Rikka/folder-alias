import type { RecordConfig } from "../../typings/common.typing";
import type { Preset } from "../../typings/preset.typing";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "pathe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../logger.util", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

const TEST_DIR = join(__dirname, "__fixtures_preset__");

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("getBuiltInPresets", () => {
  it("returns array of built-in presets", async () => {
    const { getBuiltInPresets } = await import("../preset.util");
    const presets = getBuiltInPresets();
    expect(Array.isArray(presets)).toBe(true);
    expect(presets.length).toBeGreaterThan(0);
  });

  it("each preset has name and aliases", async () => {
    const { getBuiltInPresets } = await import("../preset.util");
    const presets = getBuiltInPresets();
    for (const preset of presets) {
      expect(preset.name).toBeTruthy();
      expect(preset.aliases).toBeTruthy();
      expect(typeof preset.aliases).toBe("object");
    }
  });
});

describe("getUserPresets", () => {
  it("returns empty array when directory does not exist", async () => {
    const { getUserPresets } = await import("../preset.util");
    const presets = getUserPresets(join(TEST_DIR, "nonexistent"));
    expect(presets).toEqual([]);
  });

  it("reads valid preset files from directory", async () => {
    const { getUserPresets } = await import("../preset.util");
    const presetDir = join(TEST_DIR, ".vscode", "folder-alias-presets");
    mkdirSync(presetDir, { recursive: true });
    const preset: Preset = {
      name: "My Preset",
      aliases: { "src/": { description: "S" } },
    };
    writeFileSync(join(presetDir, "my-preset.json"), JSON.stringify(preset));

    const presets = getUserPresets(TEST_DIR);
    expect(presets.length).toBe(1);
    expect(presets[0].name).toBe("My Preset");
  });

  it("skips invalid preset files", async () => {
    const { getUserPresets } = await import("../preset.util");
    const presetDir = join(TEST_DIR, ".vscode", "folder-alias-presets");
    mkdirSync(presetDir, { recursive: true });
    writeFileSync(join(presetDir, "bad.json"), JSON.stringify({ invalid: true }));

    const presets = getUserPresets(TEST_DIR);
    expect(presets).toEqual([]);
  });
});

describe("mergePresetIntoConfig", () => {
  it("replaces config with preset entries", async () => {
    const { mergePresetIntoConfig } = await import("../preset.util");
    const existing: RecordConfig = {
      "src/": { description: "Existing src" },
    };
    const preset: Preset = {
      name: "test",
      aliases: {
        "lib/": { description: "Preset lib" },
      },
    };
    const result = mergePresetIntoConfig(existing, preset);
    expect(result["src/"]).toBeUndefined();
    expect(result["lib/"].description).toBe("Preset lib");
  });

  it("does not mutate the original config", async () => {
    const { mergePresetIntoConfig } = await import("../preset.util");
    const existing: RecordConfig = {};
    const preset: Preset = {
      name: "test",
      aliases: { "a/": { description: "A" } },
    };
    mergePresetIntoConfig(existing, preset);
    expect(existing["a/"]).toBeUndefined();
  });
});

describe("saveUserPreset", () => {
  it("creates preset directory and file", async () => {
    const { saveUserPreset } = await import("../preset.util");
    const preset: Preset = {
      name: "Test Preset",
      aliases: { "src/": { description: "S" } },
    };
    saveUserPreset(TEST_DIR, preset);

    const presetDir = join(TEST_DIR, ".vscode", "folder-alias-presets");
    expect(existsSync(presetDir)).toBe(true);
    const filePath = join(presetDir, "test_preset.json");
    expect(existsSync(filePath)).toBe(true);
    const content = JSON.parse(readFileSync(filePath, "utf-8"));
    expect(content.name).toBe("Test Preset");
  });
});

describe("deleteUserPreset", () => {
  it("deletes an existing preset file", async () => {
    const { deleteUserPreset, saveUserPreset } = await import("../preset.util");
    const preset: Preset = {
      name: "Delete Me",
      aliases: { "src/": { description: "S" } },
    };
    saveUserPreset(TEST_DIR, preset);
    const result = deleteUserPreset(TEST_DIR, "Delete Me");
    expect(result).toBe(true);
    const filePath = join(TEST_DIR, ".vscode", "folder-alias-presets", "delete-me.json");
    expect(existsSync(filePath)).toBe(false);
  });

  it("returns false when preset does not exist", async () => {
    const { deleteUserPreset } = await import("../preset.util");
    const result = deleteUserPreset(TEST_DIR, "Nonexistent");
    expect(result).toBe(false);
  });

  it("returns false when directory does not exist", async () => {
    const { deleteUserPreset } = await import("../preset.util");
    const result = deleteUserPreset(join(TEST_DIR, "nonexistent"), "Preset");
    expect(result).toBe(false);
  });
});
