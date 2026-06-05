export interface ConfigItem {
  description?: string;
  icon?: string;
  tooltip?: string;
}

export type RecordConfig = Record<string, ConfigItem>;
