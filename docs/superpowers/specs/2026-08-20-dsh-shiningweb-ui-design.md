# dsh-shiningweb-ui（璀璨星河）v0.1 设计文档

日期：2026-08-20
证据基线：官方仓库 `deepseek-ai/deepseek-harness` @ `141eb6fef83422698aef7a981029e843e8161534`（master，rc.8 演进中）；已安装 `@deepseek-ai/*` rc.6 包（`D:\npm-global\node_modules\@deepseek-ai\dsh\node_modules\@deepseek-ai`）。

## 1. 目标与范围

DSH 第三方 bundle 插件「璀璨星河」，v0.1 包含四个可在设置面板独立开关的模块：

1. **天圆地方**：独立 AI 聊天空间（全屏浮层、立绘背景、独立模型配置、人格预留）。
2. **类 VS Code 文件栏**：左侧抽屉文件树（懒加载、扩展名图标、右键菜单、搜索过滤、Git 状态标记）。
3. **Git 分支快速管理**：会话输入框上方工具栏（分支下拉/切换/创建/pull/未提交计数）。
4. **视觉增强基础**：主题色（3 预设）、背景图、毛玻璃强度，经 CSS 变量全局生效。

本阶段交付：完整源码 + 构建产物（host lib + client bundle + typert 制品）+ 安装/验证脚本 + README。**不**在本次会话内重启 dsh web 服务（会中断当前会话），安装与 GUI 验证由用户择机执行。

## 2. 运行面判定

- host：fs/git/独立模型 chat 调用（Node 能力）、settings 命名空间注册、Typert Remote 网关。
- client：全部 UI（sidebar 入口、shell.overlay 面板、settings 页、input.dock 工具栏）、本地存储（IndexedDB 聊天历史、localStorage 立绘/背景）、设置绑定与视觉应用。
- 结论：**host + client 双面 bundle**，声明 `dsh.client.platform: "web"`。

## 3. 架构总览

单 npm 包 `dsh-shiningweb-ui`，双面结构（仿 `@deepseek-ai/dsh-client-ui-message-feedback` / `dsh-client-ui-theme`）：

```
dsh-shiningweb-ui/
├── package.json            # dsh.bundle.patch + dsh.client + exports["./client"|"./typert"|"./remote"|"./types"]
├── cordis.patch.yml        # - insert: [{ id: shiningweb-ui, name: dsh-shiningweb-ui }]
├── tsconfig.base.json / tsconfig.host.json / tsconfig.client.json / tsconfig.json
├── tsdown.config.ts        # clientBundle('dsh-shiningweb-ui', ['lib/types/index.js'])
├── scripts/
│   ├── tsdown.client.ts    # 从官方仓库 vendor 的 clientBundle 助手（MIT，注明来源与 commit）
│   ├── platform-modules.ts # vendor PLATFORM_MODULES / PRELOADED_CLIENT_EXTERNALS（来自官方 web/src/platform.ts）
│   └── gen-typert.mjs      # 从 src/types.ts 单一数据源生成 typert.host / typert.remote-client 制品
├── src/
│   ├── index.ts            # host 半：ShiningService（TypertRemoteService 网关）+ settings 命名空间注册
│   ├── settings.ts         # settings 命名空间 'shining' + schemastery schema（单一事实源）
│   ├── types.ts            # 业务 request/result 类型 + zod schema（typert 生成的数据源）
│   ├── client/
│   │   ├── index.tsx       # apply(ctx)：挂 remote、绑 settingsScope、注册 5 处槽位、视觉应用
│   │   ├── locales.ts      # zh/en 字典（NS: 'shining'）
│   │   ├── store.ts        # overlay 面板开关（useSyncExternalStore）
│   │   ├── storage.ts      # IndexedDB（聊天历史）+ localStorage（立绘/背景，压缩限尺寸）
│   │   ├── settings.ts     # useSettings hook（settingsScope snapshot 订阅）
│   │   ├── components/     # SidebarEntry / ChatWindow / FileExplorer / GitManager / SettingsPanel
│   │   └── hooks/          # useChat / useFileTree / useGitBranch
│   └── css-modules.d.ts
├── tests/                  # host 单测（vitest）+ client 测试（jsdom + SlotTestRuntime）
└── README.md               # 安装/验证命令（仅给经全新 profile 验证过的推荐命令）
```

## 4. 槽位映射（client 面）

| 模块 | 槽位（当前正式版确认） | kind/scope | 说明 |
|---|---|---|---|
| 天圆地方入口按钮 | `sidebar.footer.action` | list/root | 与设置并排的脚部按钮，wide 显示「天圆地方」+ 拱门 SVG |
| 文件栏入口按钮 | `sidebar.footer.action` | list/root | 第二个脚部按钮 |
| 天圆地方聊天窗 | `shell.overlay` | list/root | 全屏遮罩，entry 主动开启 pointer-events |
| 文件栏抽屉 | `shell.overlay` | list/root | 左侧滑出面板（固定视口高度内滚动） |
| Git 工具栏 | `conversation.input.dock` | list/session | 输入框上方整行，owner 为 `InputZone` |
| 设置页 | `settings.section` | list/root | id `shining`，一页承载全部开关与配置 |

约束确认：`sidebar.workspaces` 为 single 且被 ui-workspace 占用，故入口放脚部（用户已确认）；不注册 `root` 单槽；不注册 `sidebar` 单槽（会替换整个侧边栏）。

每个入口组件读取 `useSettings()`，对应开关关闭时渲染 null（entry 保留但内容消失）。

## 5. Host 半设计

### 5.1 settings 命名空间 `shining`

经 `ctx.inject(['settings'], sctx => sctx.settings.register(settingsNamespace('shining'), ShiningSettingsSchema))` 注册（ui-theme 模式）。schema 用 `@deepseek-ai/schemastery` 的 `z`（**不是** zod）：

```ts
// src/settings.ts（单一事实源，host/client 共享类型）
export const SETTINGS_NAMESPACE = 'shining'
export const ShiningSettingsSchema = s.object({
  enabled: s.boolean().default(true),
  chat: s.object({
    enabled: s.boolean().default(true),
    personaId: s.string().default(''),
    model: s.string().default('deepseek-chat'),
    apiBase: s.string().default('https://api.deepseek.com'),
    apiKey: s.string().default(''),
  }).default({}),
  fileExplorer: s.object({
    enabled: s.boolean().default(true),
    showHidden: s.boolean().default(false),
  }).default({}),
  git: s.object({
    enabled: s.boolean().default(true),
    autoRefresh: s.union(['off', '10s', '30s', '1m']).default('off'),
  }).default({}),
  visual: s.object({
    themeColor: s.union(['galaxy-blue', 'dawn-gold', 'aurora-purple']).default('galaxy-blue'),
    glassBlur: s.number().min(0).max(24).default(12),
  }).default({}),
})
```

说明：apiKey 存 host settings 文档（比 spec 的 localStorage 更安全），后续增强点迁移 credentials 库；立绘/背景大图仍存 localStorage。

### 5.2 ShiningService（Typert Remote 网关，namespace `shining`）

仿 `MessageFeedbackService`（`packages/feedback/message-feedback/src/index.ts`）：

```ts
export class ShiningService extends TypertRemoteService {
  static Config: s<Config> = s.object({})          // v0.1 无部署级配置
  constructor(ctx: Context, config: Config) {
    super(ctx, 'shining')
  }
  @Remote('fsList')     fsList(request: FsListRequest): Promise<FsListResult>
  @Remote('fsRead')     fsRead(request: FsReadRequest): Promise<FsReadResult>
  @Remote('fsWrite')    fsWrite(request: FsWriteRequest): Promise<FsWriteResult>
  @Remote('fsCreateFile') fsCreateFile(request: FsPathRequest): Promise<FsOpResult>
  @Remote('fsCreateDir')  fsCreateDir(request: FsPathRequest): Promise<FsOpResult>
  @Remote('fsRename')   fsRename(request: FsRenameRequest): Promise<FsOpResult>
  @Remote('fsDelete')   fsDelete(request: FsPathRequest): Promise<FsOpResult>
  @Remote('gitStatus')  gitStatus(request: GitStatusRequest): Promise<GitStatusResult>
  @Remote('gitCheckout') gitCheckout(request: GitBranchRequest): Promise<GitOpResult>
  @Remote('gitCreateBranch') gitCreateBranch(request: GitCreateBranchRequest): Promise<GitOpResult>
  @Remote('gitPull')    gitPull(request: GitPathRequest): Promise<GitOpResult>
  @Remote('chat')       chat(request: ChatRequest): Promise<ChatResult>
}
```

要点：
- 方法签名：**单个 request 对象参数**（wire args 由网关按参数名绑定），返回 `{ ok: true, value } | { ok: false, error: { code, ... } }` 业务联合（成功/失败辅助函数）。
- fs：`node:fs/promises`；git：`node:child_process` spawn `git`（`git branch --format` / `checkout` / `checkout -b` / `pull` / `status --porcelain`）。**不依赖** `dsh-tool-fs`/`dsh-tool-git`（agent 工具，UI 调不到）。
- chat：`fetch` 独立模型 API（unary 非流式补全，规避浏览器 CORS 与 key 暴露）。
- **路径安全**：所有 fs/git path 解析为绝对路径后，必须等于或位于客户端传入的 `root`（工作区）之内，否则拒绝（`path-root-escape` 业务错误）。防目录穿越。
- 部署级可变值（超时、git 二进制路径等）走 `static Config`，不硬编码。

### 5.3 Typert 制品（手写 + 生成脚本）

typert 生成器是仓库内建 tsdown 集成，第三方插件不可直接复用 → 用 `scripts/gen-typert.mjs` 从 `src/types.ts` 的 zod schema 单一数据源生成：

- `lib/typert.host.js` + `lib/typert.host.d.ts`（`TYPERT: unknown`）：格式与 `dsh-message-feedback/lib/typert.host.js` 一致（package/face/schemas/invocations/model），由 `dsh-typert-loader` 自动扫描 `./typert` 导出注册（已读 loader 源码确认校验规则，fail-loud）。
- `lib/typert.remote-client.js` + `.d.ts`：`{ package, descriptors }`，strict zod codec（客户端 `$mount` 强制 strict，已确认），由 client 侧 `ctx.remote.$mount()` 挂载，`'remote.shining'` 成为可注入服务。

手写风险由 loader/网关的严格校验兜底：格式错误会在激活时报错，不会静默失败。

## 6. Client 半设计

### 6.1 apply(ctx)（`src/client/index.tsx`）

```ts
export const inject = ['slots', 'remote', 'remote.shining', 'locale', 'settingsScope', 'connection']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'shining: dictionaries')
  const host = ctx.settingsScope.bind<ShiningSettings>({ namespace: SETTINGS_NAMESPACE })
  installThemeEffect(ctx, host)          // 视觉：订阅 host → 写 document.documentElement CSS 变量
  // 5 处 ctx.slots.inject(key, () => { const dispose = ctx.slots.register({...}, Component); return cleanup })
}
```

- 类型贡献全部 type-only import（`@deepseek-ai/dsh-client-ui-conversation/client`、`ui-settings/client`、`ui-sidebar/client`、`ui-layout/client`、`client-connection/client`、`typert-protocol`）→ 擦除后不触 client bundle purity gate。
- 值 import 仅限平台模块（react/jsx-runtime、`@deepseek-ai/dsh-client-ui-slots`）与包内代码；zod 随 remote 制品 inline（官方模板同款）。
- 所有注册、监听、DOM、style 均随 fiber dispose 清理。

### 6.2 组件与数据流

- `store.ts`：模块级 overlay 开关（`chatOpen` / `filesOpen`），`useSyncExternalStore` 订阅；入口按钮写、overlay 读。连接重置不改面板状态。
- `ChatWindow`：全屏遮罩 + 毛玻璃（`glassBlur` 变量）；立绘背景（默认渐变占位图，上传→canvas 压缩→Base64→localStorage，限 2MB）；顶部角色名 + 人格标签（`personas` 数组预留，v0.1 提供 1 个默认角色 + 设置内可编辑 systemPrompt）；消息列表（IndexedDB 按角色分桶）；底部输入 + 发送；独立模型配置区（apiBase/apiKey/model）。
- `FileExplorer`：左侧抽屉（`shell.overlay`，宽度受容器/视口限制、内部滚动、Escape/aria 支持）；根 = 当前会话工作区 path（`useWorkspaces` 取 workspace.path）；懒加载展开（点击才 `fsList`）；扩展名 SVG 图标（js/py/json/md/txt/html/…）；右键菜单（新建文件/文件夹、重命名、删除、复制路径，`contextmenu` 事件）；顶部搜索框实时过滤；文件名旁 Git 状态字母（M/A/D/U）；打开文件 → 客户端调用现有 `ctx.workspaces.openPath(path)`（host browse 能力，系统默认应用打开，v0.1 不做内嵌编辑器，**无需**为此新增 Remote 方法）。
- `GitManager`（`conversation.input.dock`）：分支下拉（当前高亮）、切换、创建（输入框+按钮）、pull、未提交文件数；操作中进度提示，完成后通知文件树刷新（store 事件）；`autoRefresh` 按设置定时刷新。
- `SettingsPanel`（`settings.section`）：全部开关与配置；开关写 `host.set/unset`；密码框写 apiKey。
- 视觉：3 主题色预设 → `--dsw-*` 兼容的 CSS 变量覆盖（尽量复用 ui-theme 的 alias token 命名）；背景上传（localStorage）+ 预设动态背景（CSS 动画）；毛玻璃强度 → blur 变量。全部经 `document.documentElement.style.setProperty`，随 fiber 清理。

### 6.3 样式

- 组件样式：CSS Modules（`*.module.css`，tsdown helper 编译为 hash class + `style[data-plugin]` 注入）。
- 全局/主题：`*.css?inline`（编译文本，由插件在 apply 中注入 `<style>` 并随 dispose 移除）。

## 7. 构建与工程

- **tsdown helper**：从官方仓库 vendor `packages/client/tsdown.client.ts`（MIT，注明来源 commit `141eb6fe`），并 vendor 其依赖 `PLATFORM_MODULES`/`PRELOADED_CLIENT_EXTERNALS`（来自 `packages/client/web/src/platform.ts`，内容为：react/jsx-runtime/react-dom/cordis/ui-slots/ui-primitives + `dsh-client-runtime/client`）。**不手写 loader 协议**。依赖 tsdown + lightningcss。
- **双 tsc program**：`tsconfig.host.json`（src → lib/types，排除 client 面值依赖）与 `tsconfig.client.json`（含 client 源码 + CSS module 声明）；host/client 的 Context declaration merge 互不污染。
- `package.json` 契约见 §3；`files` 与 exports 一致；peer 声明 react/cordis/slots/runtime/ui-settings/locale/api-remotes/typert-protocol/client-connection，依赖声明 schemastery/zod。
- scripts：`typecheck`（双 program）、`build`（tsc + tsdown + gen-typert）、`test`、`verify`、`bundle`/`watch`（tsdown）。

## 8. 安装与验证

### 8.1 安装（用户择机执行）

```sh
dsh plugin --profile web add "file:F:\余程安学习资料\dsh-shiningweb-ui"
# 重启 dsh web（会中断当前会话）
```

`dsh plugin` 为 profile 目录的 pnpm 转发层，自动对账 `dsh.profile.bundles`；不手写 profile manifest。也可发布到 npm/GitHub 后用 `dsh plugin --profile web add <pkg|github:...>`。

### 8.2 验证矩阵

- 基线：`pnpm typecheck` / `pnpm build` / `pnpm test` / `pnpm verify` / `git diff --check`。
- host：单测覆盖 schema、网关方法（fs/git 在临时目录中往返、失败分支、目录穿越拒绝）、disposer。
- 真实组合：`dsh plugin --profile scratch add <path>`（全新 scratch profile）→ `dsh --profile scratch --dump-config` 断言插件层与行 id；headless 真实小任务。
- client：jsdom + SlotTestRuntime 断言 5 处注册、渲染、session 隔离、dispose 清理。
- GUI（用户侧）：web profile 重启后——设置页出现「璀璨星河」；脚部两个按钮；聊天窗立绘/收发；文件树展开/右键/搜索；Git 工具栏分支操作；主题色/背景/毛玻璃切换；逐模块关闭开关验证隐藏。

## 9. v0.1 边界（不做，标注后续增强点）

- 流式输出（chat 为 unary；后续可用专用 HTTP route/SSE）。
- 内嵌编辑器（打开文件走系统默认应用）。
- 文件拖拽、Git 冲突 UI、远程分支管理。
- apiKey 迁移 credentials 库、设置秘密 redact。
- 侧边栏顶部入口（待 DSH 开放 section 槽位）。

## 10. 风险与假设

- 客户端 strict codec 依赖 zod 随 bundle inline —— 官方模板同款，已验证。
- host SRC 模式可用，但按官方模式仍产出 `./typert` 制品走严格路径（loader 校验 fail-loud）。
- `conversation.input.dock` 为 session 槽：无会话时不渲染（符合"输入框上方"语义）。
- file: 安装为 pnpm symlink —— 开发期改动源码需重新 build 后刷新/重启。
- 本工作区当前非 git 仓库：将 `git init` 作为插件仓库，规范提交（spec/plan/code 分开）。
