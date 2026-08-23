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
import type {} from './slots.ts'
import type { ShiningSettings } from '../settings.ts'
import { SETTINGS_NAMESPACE } from '../settings.ts'
import { dict, NS } from './locales.ts'
import { bindSettingsScope, mergeSettings } from './settings.ts'
import { applyVisual } from './visual.ts'
import TYPERT_REMOTE from './remote.ts'
import { setShiningRemote, type ShiningRemote } from './remote-types.ts'
import { bindDshCtx } from './dsh-context.ts'
import { setWorkspaceRoot, setOpenPath } from './workspace.ts'
import { ChatEntry, FilesEntry } from './components/SidebarEntry.tsx'
import { ChatWindow } from './components/ChatWindow.tsx'
import { FileExplorer } from './components/FileExplorer.tsx'
import { GitManager } from './components/GitManager.tsx'
import { SettingsPanel } from './components/SettingsPanel.tsx'

/** Required services。不注入 'remote.shining'（我们自己在 apply 里挂载，声明为依赖会死锁）。 */
// 注意：`ctx.workspaces`/`ctx.sessions` 必须在此声明，否则 cordis 属性访问会抛
// "cannot get property ... without inject"（runtime 在插件 apply 前已 provide 出这两个服务）。
export const inject = ['slots', 'remote', 'locale', 'settingsScope', 'connection', 'workspaces', 'sessions']

/** Client plugin body。 */
export async function apply(ctx: ClientContext): Promise<void> {
  ctx.effect(() => ctx.locale.register(NS, dict), 'shining: dictionaries')

  // 挂载本插件的 Remote 命名空间（strict zod codec）。
  // 注意：不能用 ctx.remote.shining（服务属性访问会强制 inject，但我们自己 mount，无法预先 inject）；
  // 改用 ctx.get('remote.shining')（可选服务读取，不走 inject 检查）。
  await ctx.remote.$mount(TYPERT_REMOTE)
  setShiningRemote(ctx.get('remote.shining') as ShiningRemote | undefined)

  // 绑定 DSH 客户端上下文（天圆地方感知主窗口项目/会话 + 代发）。
  bindDshCtx(ctx)

  // 绑定设置命名空间，订阅并应用视觉主题。
  // 注意：必须提供 decode —— client bundle 不含 schemastery，无法 rehydrate host 的 schema 信封，
  // 缺省 decode 会让 settingsScope 不发布 value（UI 永远显示深合并默认值、写操作无法反映）。
  const scope = ctx.settingsScope.bind<ShiningSettings>({
    namespace: SETTINGS_NAMESPACE,
    decode: (section) => mergeSettings(section as Partial<ShiningSettings> | undefined),
  })
  bindSettingsScope(scope)
  ctx.effect(() => scope.subscribe(() => applyVisual(scope.getSnapshot().value)), 'shining: visual subscription')
  applyVisual(scope.getSnapshot().value)

  // 工作区根路径与打开文件回调（v0.1 单工作区假设，订阅 workspaces 列表）。
  const syncRoot = () => setWorkspaceRoot(ctx.workspaces.list.getSnapshot().items[0]?.path ?? '')
  syncRoot()
  ctx.effect(() => ctx.workspaces.list.subscribe(syncRoot), 'shining: workspace root')
  setOpenPath((path) => void ctx.workspaces.openPath(path))

  // 侧边栏脚部入口：天圆地方 / 文件。
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name: 'sidebar.footer.action', id: 'shining-chat', order: 30, locale: NS }, ChatEntry))
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name: 'sidebar.footer.action', id: 'shining-files', order: 31, locale: NS }, FilesEntry))

  // 天圆地方聊天窗（shell.overlay）。
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'shining-chat' }, ChatWindow))

  // 文件栏抽屉（shell.overlay）。
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'shining-files' }, FileExplorer))

  // Git 工具栏（conversation.input.dock）。order 10：介于 DSH 内置 todo(0) 与 queue(20) 之间。
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({ name: 'conversation.input.dock', id: 'shining-git', order: 10 }, GitManager))

  // 设置页（settings.section）。
  ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: 'shining', order: 20, locale: NS }, SettingsPanel))
}
