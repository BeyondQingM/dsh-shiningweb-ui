import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client';
import type { ShiningSettings } from '../settings.ts';
export type { ShiningSettings };
/** apply 时绑定 settingsScope。 */
export declare function bindSettingsScope(s: SettingsScope<ShiningSettings>): void;
/**
 * 深合并默认值：即使 scope 快照 value 是部分对象（`{}` 或子字段缺失），
 * 也返回完整结构。否则组件读 settings.chat.model 会 undefined/崩溃，
 * 表现为设置空字段 + 点不动。
 */
export declare function mergeSettings(partial: Partial<ShiningSettings> | undefined): ShiningSettings;
/** 读取当前设置（随 settingsScope 变化重渲染）。 */
export declare function useSettings(): ShiningSettings;
/** 写入一个设置字段（经绑定 scope）。 */
export declare function writeSetting(field: string, value: unknown): Promise<void>;
/** 清除一个设置字段（回退到组合默认）。 */
export declare function clearSetting(field: string): Promise<void>;
