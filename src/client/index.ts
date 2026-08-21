/**
 * dsh-shiningweb-ui 插件 client 半入口。
 * apply：注册字典、挂载 shinining Remote、绑定 settingsScope、应用视觉。
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only：拉入各包的 Context/SlotMap merge（client bundle purity gate 会擦除）。
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { ShiningSettings } from '../settings.ts'
import { SETTINGS_NAMESPACE } from '../settings.ts'
import { dict, NS } from './locales.ts'
import { bindSettingsScope } from './settings.ts'
import { applyVisual } from './visual.ts'
import TYPERT_REMOTE from './remote.ts'

/** Required services。不注入 'remote.shining'（我们自己在 apply 里挂载，声明为依赖会死锁）。 */
export const inject = ['slots', 'remote', 'locale', 'settingsScope', 'connection']

/** Client plugin body。 */
export async function apply(ctx: ClientContext): Promise<void> {
  ctx.effect(() => ctx.locale.register(NS, dict), 'shining: dictionaries')

  // 挂载本插件的 Remote 命名空间（strict zod codec）。
  await ctx.remote.$mount(TYPERT_REMOTE)

  // 绑定设置命名空间，订阅并应用视觉主题。
  const scope = ctx.settingsScope.bind<ShiningSettings>({ namespace: SETTINGS_NAMESPACE })
  bindSettingsScope(scope)
  ctx.effect(() => scope.subscribe(() => applyVisual(scope.getSnapshot().value)), 'shining: visual subscription')
  applyVisual(scope.getSnapshot().value)

  // 槽位注册由后续任务（侧边栏入口 / shell.overlay / input.dock / settings.section）逐步加入。
}
