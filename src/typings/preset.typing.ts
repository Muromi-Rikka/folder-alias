import type { ConfigItem } from './common.typing';

export interface Preset {
  name: string;
  description?: string;
  aliases: Record<string, ConfigItem>;
}
