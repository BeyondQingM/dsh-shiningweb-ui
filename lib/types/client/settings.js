/** useSettings hook：订阅 settingsScope 快照，合并默认值。 */
import { useSyncExternalStore } from 'react';
import { DEFAULT_SHINING_SETTINGS } from "../settings.js";
let scope = null;
/** apply 时绑定 settingsScope。 */
export function bindSettingsScope(s) {
    scope = s;
}
function snapshot() {
    return scope?.getSnapshot().value ?? DEFAULT_SHINING_SETTINGS;
}
/** 读取当前设置（随 settingsScope 变化重渲染）。 */
export function useSettings() {
    return useSyncExternalStore((l) => { scope?.subscribe(l); return () => { }; }, snapshot);
}
/** 写入一个设置字段（经绑定 scope）。 */
export async function writeSetting(field, value) {
    await scope?.set(field, value);
}
/** 清除一个设置字段（回退到组合默认）。 */
export async function clearSetting(field) {
    await scope?.unset(field);
}
