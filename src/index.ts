/**
 * dsh-shiningweb-ui 插件 host 半入口。
 * 注册 `shining` settings 命名空间；ShiningService 网关见 gateway.ts（Task 3）。
 */
import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { SETTINGS_NAMESPACE, ShiningSettingsSchema } from './settings.ts'

/** Host plugin body：注册 settings 命名空间。 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(settingsNamespace(SETTINGS_NAMESPACE), ShiningSettingsSchema)
  })
}
