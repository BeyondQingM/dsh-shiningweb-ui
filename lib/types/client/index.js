import { SETTINGS_NAMESPACE } from "../settings.js";
import { dict, NS } from "./locales.js";
import { bindSettingsScope, mergeSettings } from "./settings.js";
import { applyVisual } from "./visual.js";
import { createThemeOverrideController, getThemeService } from "./theme.js";
import TYPERT_REMOTE from "./remote.js";
import { setShiningRemote } from "./remote-types.js";
import { bindDshCtx } from "./dsh-context.js";
import { resolveCurrentWorkspaceRoot, setWorkspaceRoot, setOpenPath } from "./workspace.js";
import { ChatEntry, FilesEntry } from "./components/SidebarEntry.js";
import { ChatWindow } from "./components/ChatWindow.js";
import { FileExplorer } from "./components/FileExplorer.js";
import { GitManager } from "./components/GitManager.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
/** Required services。不注入 'remote.shining'（我们自己在 apply 里挂载，声明为依赖会死锁）。 */
// 注意：`ctx.workspaces`/`ctx.sessions` 必须在此声明，否则 cordis 属性访问会抛
// "cannot get property ... without inject"（runtime 在插件 apply 前已 provide 出这两个服务）。
export const inject = ['slots', 'remote', 'locale', 'settingsScope', 'connection', 'workspaces', 'sessions', 'theme'];
/** Client plugin body。 */
export async function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, dict), 'shining: dictionaries');
    // 挂载本插件的 Remote 命名空间（strict zod codec）。
    // 注意：不能用 ctx.remote.shining（服务属性访问会强制 inject，但我们自己 mount，无法预先 inject）；
    // 改用 ctx.get('remote.shining')（可选服务读取，不走 inject 检查）。
    await ctx.remote.$mount(TYPERT_REMOTE);
    const rem = ctx.get('remote.shining');
    setShiningRemote(rem);
    // 诊断：remote 是否真的绑上（未绑上则 git/chat/fs/qq 全程静默失效）。
    if (!rem)
        console.warn('[shining] remote.shining 未绑定——Git/聊天/文件/QQ 将不可用，请检查 host ShiningService 是否注册。');
    // 绑定 DSH 客户端上下文（天圆地方感知主窗口项目/会话 + 代发）。
    bindDshCtx(ctx);
    // 绑定设置命名空间，订阅并应用视觉主题。
    // 注意：必须提供 decode —— client bundle 不含 schemastery，无法 rehydrate host 的 schema 信封，
    // 缺省 decode 会让 settingsScope 不发布 value（UI 永远显示深合并默认值、写操作无法反映）。
    const scope = ctx.settingsScope.bind({
        namespace: SETTINGS_NAMESPACE,
        decode: (section) => mergeSettings(section),
    });
    bindSettingsScope(scope);
    // 全套 GUI 换肤：按设置的主题色覆盖官方 --dsw token 层（light/dark 双档自适应）；
    // 'follow' = 跟随 DSH，移除覆盖层还原原生观感。服务缺失时优雅跳过。
    const themeCtl = createThemeOverrideController(getThemeService(ctx));
    ctx.effect(() => scope.subscribe(() => {
        const value = scope.getSnapshot().value;
        applyVisual(value);
        themeCtl.apply(value?.visual.themeColor ?? 'galaxy-blue');
    }), 'shining: visual subscription');
    applyVisual(scope.getSnapshot().value);
    themeCtl.apply(scope.getSnapshot().value?.visual.themeColor ?? 'galaxy-blue');
    ctx.effect(() => () => themeCtl.dispose(), 'shining: theme override teardown');
    // 工作区根路径与打开文件回调（订阅 workspaces 列表，按最近活跃工作区解析）。
    const syncRoot = () => {
        const snapshot = ctx.workspaces.list.getSnapshot();
        setWorkspaceRoot(resolveCurrentWorkspaceRoot(snapshot));
    };
    syncRoot();
    ctx.effect(() => ctx.workspaces.list.subscribe(syncRoot), 'shining: workspace root');
    setOpenPath((path) => void ctx.workspaces.openPath(path));
    // 侧边栏脚部入口：天圆地方 / 文件。
    ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name: 'sidebar.footer.action', id: 'shining-chat', order: 30, locale: NS }, ChatEntry));
    ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name: 'sidebar.footer.action', id: 'shining-files', order: 31, locale: NS }, FilesEntry));
    // 天圆地方聊天窗（shell.overlay）。
    ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'shining-chat' }, ChatWindow));
    // 文件栏抽屉（shell.overlay）。
    ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'shining-files' }, FileExplorer));
    // Git 工具栏（conversation.input.dock）。order 10：介于 DSH 内置 todo(0) 与 queue(20) 之间。
    ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({ name: 'conversation.input.dock', id: 'shining-git', order: 10 }, GitManager));
    // 设置页（settings.section）。label 是设置左栏的可见名称；locale 只负责组件的 t 注入。
    ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'shining',
        order: 20,
        label: () => dict.zh.settingsTitle,
        locale: NS,
    }, SettingsPanel));
}
