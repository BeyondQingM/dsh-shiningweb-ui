/**
 * dsh-shiningweb-ui 插件 host 半入口。
 * 提供 ShiningService 网关（命名空间 `shining`），注册 `shining` settings 命名空间，
 * 并在 qq 启用时启动天圆地方 QQ 会话层（ShiningQqService）。
 */
import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { ShiningService } from './gateway.ts'
import { createQqAdapter, createQqModelCall, ShiningQqService } from './qq.ts'
import { SETTINGS_NAMESPACE } from './settings.ts'
import { ShiningSettingsSchema } from './settings-schema.ts'
import type { ShiningSettings } from './settings.ts'

export { ShiningService } from './gateway.ts'
export default ShiningService

/** Host plugin body：提供网关 + 注册 settings 命名空间 + 可选 QQ 会话层。 */
export function apply(ctx: Context): void {
  new ShiningService(ctx, {})
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(settingsNamespace(SETTINGS_NAMESPACE), ShiningSettingsSchema)
    // 读天圆地方 settings（含 qq/chat/独立模型配置）。
    const readSettings = (): ShiningSettings =>
      (settingsCtx.settings.get(settingsNamespace(SETTINGS_NAMESPACE)) as ShiningSettings | undefined) ?? {
        enabled: true, capabilityMode: 'pet',
        chat: { enabled: true, personaId: '', model: 'deepseek-chat', apiBase: 'https://api.deepseek.com', apiKey: '' },
        fileExplorer: { enabled: true, showHidden: false },
        git: { enabled: true, autoRefresh: 'off' },
        visual: { themeColor: 'galaxy-blue', glassBlur: 12 },
        qq: { enabled: false, appId: '', appSecret: '', groupAllow: [], personaPrompt: '' },
      }
    // qq 启用且已配置凭据时启动 QQ 会话层（connector 缺失则优雅跳过）。
    void (async () => {
      const s = readSettings()
      if (!s.qq?.enabled || !s.qq.appId || !s.qq.appSecret) return
      try {
        const adapter = await createQqAdapter(s.qq.appId, s.qq.appSecret)
        const svc = new ShiningQqService(adapter, createQqModelCall(), readSettings)
        ctx.provide('shiningQq', svc)
        ctx.effect(() => () => svc.dispose(), 'shining: qq lifecycle')
      } catch { /* 连接器不可用则跳过 QQ */ }
    })()
  })
}
