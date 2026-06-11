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

vi.mock("vscode", () => ({
  env: {
    language: "en",
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

describe("getSelectedPresets", () => {
  it("returns empty array when file does not exist", async () => {
    const { getSelectedPresets } = await import("../preset.util");
    const result = getSelectedPresets(TEST_DIR);
    expect(result).toEqual([]);
  });

  it("reads selected presets from file", async () => {
    const { getSelectedPresets } = await import("../preset.util");
    const vscodeDir = join(TEST_DIR, ".vscode");
    mkdirSync(vscodeDir, { recursive: true });
    writeFileSync(join(vscodeDir, "folder-alias-selected-presets.json"), JSON.stringify(["AI Agents"]));

    const result = getSelectedPresets(TEST_DIR);
    expect(result).toEqual(["AI Agents"]);
  });
});

describe("saveSelectedPresets", () => {
  it("creates file with selected presets", async () => {
    const { saveSelectedPresets, getSelectedPresets } = await import("../preset.util");
    saveSelectedPresets(TEST_DIR, ["AI Agents"]);

    const result = getSelectedPresets(TEST_DIR);
    expect(result).toEqual(["AI Agents"]);
  });

  it("overwrites existing selection", async () => {
    const { saveSelectedPresets, getSelectedPresets } = await import("../preset.util");
    saveSelectedPresets(TEST_DIR, ["AI Agents"]);
    saveSelectedPresets(TEST_DIR, ["AI Agents"]);

    const result = getSelectedPresets(TEST_DIR);
    expect(result).toEqual(["AI Agents"]);
  });
});

describe("loadSelectedPresetAliases", () => {
  it("returns empty object when no presets selected", async () => {
    const { loadSelectedPresetAliases } = await import("../preset.util");
    const result = loadSelectedPresetAliases(TEST_DIR);
    expect(result).toEqual({});
  });

  it("loads aliases from selected presets", async () => {
    const { loadSelectedPresetAliases, saveSelectedPresets } = await import("../preset.util");
    saveSelectedPresets(TEST_DIR, ["AI Agents"]);

    const result = loadSelectedPresetAliases(TEST_DIR);
    expect(result[".claude/"]).toBeTruthy();
    expect(result[".cursor/"]).toBeTruthy();
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
