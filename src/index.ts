/**
 * dsh-shiningweb-ui 插件 host 半入口。
 * 提供 ShiningService 网关（命名空间 `shining`），并注册 `shining` settings 命名空间。
 */
import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { ShiningService } from './gateway.ts'
import { SETTINGS_NAMESPACE, ShiningSettingsSchema } from './settings.ts'

export { ShiningService } from './gateway.ts'
export default ShiningService

/** Host plugin body：提供网关 + 注册 settings 命名空间。 */
export function apply(ctx: Context): void {
  new ShiningService(ctx, {})
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(settingsNamespace(SETTINGS_NAMESPACE), ShiningSettingsSchema)
  })
}
