import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client';
import type { ShiningSettings } from '../settings.ts';
export type { ShiningSettings };
/** apply 时绑定 settingsScope。 */
export declare function bindSettingsScope(s: SettingsScope<ShiningSettings>): void;
/** 读取当前设置（随 settingsScope 变化重渲染）。 */
export declare function useSettings(): ShiningSettings;
/** 写入一个设置字段（经绑定 scope）。 */
export declare function writeSetting(field: string, value: unknown): Promise<void>;
/** 清除一个设置字段（回退到组合默认）。 */
export declare function clearSetting(field: string): Promise<void>;
