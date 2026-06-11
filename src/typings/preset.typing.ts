import type { ConfigItem } from "./common.typing";

export interface PresetLocalized {
  name?: string;
  description?: string;
  aliases?: Record<string, ConfigItem>;
}

export interface Preset {
  name: string;
  description?: string;
  aliases: Record<string, ConfigItem>;
  localized?: Record<string, PresetLocalized>;
}
