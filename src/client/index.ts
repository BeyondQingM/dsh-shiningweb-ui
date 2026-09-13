/**
 * dsh-shiningweb-ui 插件 client 半入口。
 * apply：注册字典、挂载 shinining Remote、绑定 settingsScope、应用视觉。
 */
// 0.1.5：`@deepseek-ai/dsh-client-runtime` 已停止发布（最后版本 0.1.1-rc.2），
// 其 client 上下文类型并入 cordis 自身 —— 官方 client 包统一 `import type { Context as ClientContext } from '@deepseek-ai/cordis'`。
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only：拉入各包的 Context/SlotMap merge（client bundle purity gate 会擦除）。
// 0.1.5：`ctx.slots` 由 dsh-client-ui-renderer 声明，`ctx.workspaces`/`ctx.sessions`
// 分别由 api-workspace-controller / api-session-controller 声明，`ctx.sidebarRight`
// 由 ui-sidebar-right 声明 —— 缺哪个 import，对应的 ctx 属性在类型上就不存在。
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type { ISidebarRight } from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type {} from '@deepseek-ai/dsh-api-workspace-controller/client'
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { ShiningSettings } from '../settings.ts'
import { SETTINGS_NAMESPACE } from '../settings.ts'
import { dict, NS } from './locales.ts'
import { bindSettingsScope, mergeSettings } from './settings.ts'
import { applyVisual } from './visual.ts'
import { createThemeOverrideController, getThemeService } from './theme.ts'
import TYPERT_REMOTE from './remote.ts'
import { setShiningRemote, type ShiningRemote } from './remote-types.ts'
import { bindDshCtx, getCurrentSessionId } from './dsh-context.ts'
import { resolveCurrentWorkspaceRoot, setWorkspaceRoot, setOpenPath, getWorkspaceRoot } from './workspace.ts'
import { fileAddressFor } from '@deepseek-ai/dsh-util-workspace-path'
import { ChatEntry, FilesEntry } from './components/SidebarEntry.tsx'
import { ChatWindow } from './components/ChatWindow.tsx'
import { FileExplorer } from './components/FileExplorer.tsx'
import { GitManager } from './components/GitManager.tsx'
import { SettingsPanel } from './components/SettingsPanel.tsx'

/** Required services。不注入 'remote.shining'（我们自己在 apply 里挂载，声明为依赖会死锁）。 */
// 注意：`ctx.workspaces`/`ctx.sessions` 必须在此声明，否则 cordis 属性访问会抛
// "cannot get property ... without inject"（runtime 在插件 apply 前已 provide 出这些服务）。
// `sidebarRight` 是唯一**故意不声明**的：见下方 setOpenPath 的 ctx.get 用法。
export const inject = [
  'slots', 'remote', 'locale', 'settingsScope', 'connection',
  'workspaces', 'sessions', 'theme',
]

/** Client plugin body。 */
export async function apply(ctx: ClientContext): Promise<void> {
  ctx.effect(() => ctx.locale.register(NS, dict), 'shining: dictionaries')

  // 挂载本插件的 Remote 命名空间（strict zod codec）。
  // 注意：不能用 ctx.remote.shining（服务属性访问会强制 inject，但我们自己 mount，无法预先 inject）；
  // 改用 ctx.get('remote.shining')（可选服务读取，不走 inject 检查）。
  await ctx.remote.$mount(TYPERT_REMOTE)
  const rem = ctx.get('remote.shining') as ShiningRemote | undefined
  setShiningRemote(rem)
  // 诊断：remote 是否真的绑上（未绑上则 git/chat/fs/qq 全程静默失效）。
  if (!rem) console.warn('[shining] remote.shining 未绑定——Git/聊天/文件/QQ 将不可用，请检查 host ShiningService 是否注册。')

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
  // 全套 GUI 换肤：按设置的主题色覆盖官方 --dsw token 层（light/dark 双档自适应）；
  // 'follow' = 跟随 DSH，移除覆盖层还原原生观感。服务缺失时优雅跳过。
  const themeCtl = createThemeOverrideController(getThemeService(ctx))
  ctx.effect(() => scope.subscribe(() => {
    const value = scope.getSnapshot().value
    applyVisual(value)
    themeCtl.apply(value?.visual.themeColor ?? 'galaxy-blue')
  }), 'shining: visual subscription')
  applyVisual(scope.getSnapshot().value)
  themeCtl.apply(scope.getSnapshot().value?.visual.themeColor ?? 'galaxy-blue')
  ctx.effect(() => () => themeCtl.dispose(), 'shining: theme override teardown')

  // 工作区根路径与打开文件回调（订阅 workspaces 列表，按最近活跃工作区解析）。
  const syncRoot = () => {
    const snapshot = ctx.workspaces.list.getSnapshot()
    setWorkspaceRoot(resolveCurrentWorkspaceRoot(snapshot))
  }
  syncRoot()
  ctx.effect(() => ctx.workspaces.list.subscribe(syncRoot), 'shining: workspace root')
  // 0.1.5：`ctx.workspaces.openPath` 已移除（打开文件不再是 workspaces 服务的职责）。
  // 现行标准是资源地址 + 右侧 Sidebar —— 文件资源地址为
  // `dsh-resource://file/session/<sessionId>/<path>`；由 sidebarRight 认领并开 tab。
  // 这里用 ctx.get 读成**可选**服务：只有"用官方 UI 打开文件"这一个动作依赖它，
  // 不值得为它让整个插件变成硬依赖（组合里没有 sidebarRight 时，其余功能照常可用）。
  setOpenPath((path) => {
    const sessionId = getCurrentSessionId()
    if (sessionId === undefined) return
    const opener = ctx.get('sidebarRight') as ISidebarRight | undefined
    if (opener === undefined) return
    opener.openResource(fileAddressFor(sessionId, getWorkspaceRoot(), path))
  })

  // 侧边栏脚部入口：天圆地方 / 文件。
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name: 'sidebar.footer.action', id: 'shining-chat', order: 30, locale: NS }, ChatEntry))
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name: 'sidebar.footer.action', id: 'shining-files', order: 31, locale: NS }, FilesEntry))

  // 天圆地方聊天窗（shell.overlay）。
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'shining-chat' }, ChatWindow))

  // 文件栏抽屉（shell.overlay）。
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'shining-files' }, FileExplorer))

  // Git 工具栏（conversation.input.dock）。order 10：介于 DSH 内置 todo(0) 与 queue(20) 之间。
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({ name: 'conversation.input.dock', id: 'shining-git', order: 10 }, GitManager))

  // 设置页（settings.section）。label 是设置左栏的可见名称；locale 只负责组件的 t 注入。
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'shining',
    order: 20,
    label: () => dict.zh.settingsTitle,
    locale: NS,
  }, SettingsPanel))
}
