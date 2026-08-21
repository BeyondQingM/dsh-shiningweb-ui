/** useSettings hook：订阅 settingsScope 快照，合并默认值。 */
import { useSyncExternalStore } from 'react'
import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client'
import type { ShiningSettings } from '../settings.ts'
import { DEFAULT_SHINING_SETTINGS } from '../settings.ts'

export type { ShiningSettings }

let scope: SettingsScope<ShiningSettings> | null = null

/** apply 时绑定 settingsScope。 */
export function bindSettingsScope(s: SettingsScope<ShiningSettings>): void {
  scope = s
}

function snapshot(): ShiningSettings {
  return scope?.getSnapshot().value ?? DEFAULT_SHINING_SETTINGS
}

/** 读取当前设置（随 settingsScope 变化重渲染）。 */
export function useSettings(): ShiningSettings {
  return useSyncExternalStore(
    (l) => { scope?.subscribe(l); return () => {} },
    snapshot,
  )
}
