/** useSettings hook：订阅 settingsScope 快照，合并默认值。 */
import { useSyncExternalStore } from 'react';
import { DEFAULT_SHINING_SETTINGS } from "../settings.js";
let scope = null;
/** apply 时绑定 settingsScope。 */
export function bindSettingsScope(s) {
    scope = s;
}
/**
 * 深合并默认值：即使 scope 快照 value 是部分对象（`{}` 或子字段缺失），
 * 也返回完整结构。否则组件读 settings.chat.model 会 undefined/崩溃，
 * 表现为设置空字段 + 点不动。
 */
export function mergeSettings(partial) {
    if (!partial)
        return { ...DEFAULT_SHINING_SETTINGS };
    return {
        enabled: partial.enabled ?? DEFAULT_SHINING_SETTINGS.enabled,
        capabilityMode: partial.capabilityMode ?? DEFAULT_SHINING_SETTINGS.capabilityMode,
        chat: { ...DEFAULT_SHINING_SETTINGS.chat, ...(partial.chat ?? {}) },
        fileExplorer: { ...DEFAULT_SHINING_SETTINGS.fileExplorer, ...(partial.fileExplorer ?? {}) },
        git: { ...DEFAULT_SHINING_SETTINGS.git, ...(partial.git ?? {}) },
        visual: { ...DEFAULT_SHINING_SETTINGS.visual, ...(partial.visual ?? {}) },
        qq: { ...DEFAULT_SHINING_SETTINGS.qq, ...(partial.qq ?? {}) },
    };
}
// useSyncExternalStore 要求 getSnapshot 在数据未变时返回同一引用。
// mergeSettings 每次都会产生新对象，所以按底层 value 引用缓存合并结果，避免无限 re-render。
let lastSource;
let lastMerged;
function snapshot() {
    const value = scope?.getSnapshot().value;
    if (value === lastSource && lastMerged)
        return lastMerged;
    lastSource = value;
    lastMerged = mergeSettings(value);
    return lastMerged;
}
/** 读取当前设置（随 settingsScope 变化重渲染）。 */
export function useSettings() {
    return useSyncExternalStore((l) => (scope ? scope.subscribe(l) : () => { }), snapshot);
}
/** 写入一个设置字段（经绑定 scope）。 */
export async function writeSetting(field, value) {
    await scope?.set(field, value);
}
/** 清除一个设置字段（回退到组合默认）。 */
export async function clearSetting(field) {
    await scope?.unset(field);
}
