# dsh-shiningweb-ui（璀璨星河）0.1.5-rc 迁移记录

日期：2026-09-13
版本：`v0.1.0-rc5`（从 `v0.1.0-rc4` 迁移）
目标运行时：`@deepseek-ai/dsh` 0.1.5-rc.1（内部包 0.1.5-rc.2，`@deepseek-ai/cordis` 4.0.2）
迁移前契约基线：`@deepseek-ai/*` 0.1.0-rc.8、`cordis` 4.0.1

---

## 1. 根因：不是单个 API 改名，而是"契约与运行时错位"

最初的症状是插件在 0.1.5 运行时下整体失效，但**代码里看不出问题**：

- `npm run typecheck` 双半 0 error
- `npx vitest run` 86 个用例全绿

原因是 `node_modules/@deepseek-ai/*` 停在 **0.1.0-rc.8**，而真实运行面是 **0.1.5-rc**。
类型检查与单测校验的是**旧契约**，所以全程"假绿"；破坏点只在真实运行时才暴露。

> **这是本次排障最重要的结论。** 依赖系列与目标 DSH 版本错开时，本地绿灯完全不构成"插件可用"的证据。
> 复现这条假绿只需一行：比对 `node_modules/@deepseek-ai/dsh-typert-protocol/package.json` 的
> `version` 与运行中的 `dsh --version`。

### 1.1 建立能看见真实错误的通道

为了拿到真实报错，先做了一条**一次性**的类型通道（验证完即已删除，不留在仓库里）：

1. 用目录 junction 把本机 DSH 运行时的嵌套依赖镜像成一份 `node_modules` 形状；
2. 写一个只做校验的 `tsconfig`，用 `compilerOptions.paths` 把 `@deepseek-ai/*` 指向该镜像。

两个关键坑（下次照做可省时间）：

- `moduleResolution: nodenext` **无法**解析 `paths` 指向的裸包目录 —— 它不会去读该目录的 `package.json`，
  会静默回退到本地 `node_modules`，于是你**以为**在校验新版本，其实还在旧版本上。
  必须改用 `moduleResolution: bundler`（配套 `module: esnext`）。
- 判断"到底解析到了哪个版本"不要靠猜：用 `tsc --traceResolution` 看 `Package ID` / 真实路径。

确认「契约版本可升级」后，正确做法是**升级依赖**而不是长期依赖本机镜像（见 §3）。

### 1.2 npm 上的版本其实是全的

排查中出现过一次误导：查 `@deepseek-ai/dsh-client-ui-slots` 只看到 0.1.1-rc.2，差点以为 0.1.5 没发布。
实际是**查错了包名**。0.1.5-rc.2 系列的客户端包是齐的（`dsh-client-ui-slots`、`dsh-client-ui-sidebar-right`
等在 `latest`/`next` tag 上都能拿到 0.1.5-rc.2）。升级前请用 `npm view <pkg> versions --json` 逐个确认，
不要凭单个包或 `npm view <pkg> version`（它返回 `latest` tag，可能落后于 `next`）下结论。

---

## 2. 逐项破坏点与处理

| # | 0.1.5 契约变化 | 影响 | 处理 | 位置 |
|---|---|---|---|---|
| B1 | `@deepseek-ai/dsh-client-runtime` **停止发布**（末版 0.1.1-rc.2） | client 的 `ClientContext`/`SessionId`/`WorkspaceId`/`SettingsScope` 全部找不到 | client 上下文类型改用 `Context as ClientContext` from **`@deepseek-ai/cordis`**（官方 client 包统一写法）；各 ctx 服务类型改从**声明它的包**导入 | `src/client/index.ts`、`src/client/dsh-context.ts`、`src/client/settings.ts` |
| B2 | 客户端服务按包拆分声明 | `ctx.slots` / `ctx.workspaces` / `ctx.sessions` / `ctx.sidebarRight` 在类型上"不存在" | `ctx.slots` ← `dsh-client-ui-renderer`；`ctx.workspaces` ← `dsh-api-workspace-controller`；`ctx.sessions` ← `dsh-api-session-controller`；`ctx.sidebarRight` ← `dsh-client-ui-sidebar-right`（用 `import type {} from '<pkg>/client'` 把合并拉进程序） | `src/client/index.ts`、`src/client/dsh-context.ts` |
| B3 | `settingsNamespace()` 工厂已移除 | host 注册设置命名空间直接报错 | `settings.register(SETTINGS_NAMESPACE as SettingsNamespace, schema)`；类型是 brand 后的 `SettingsNamespace`（`dsh-settings/types`） | `src/gateway.ts` |
| B4 | `TypertLookupFailure` 已移除，改 `RemoteError` + 可合并的失败码词表 | host 业务失败无处可抛 | 抛 `RemoteError`，并把 4 个业务码合并进 `RemoteErrorDetailsMap`；码统一为 `shining/*` 形态（与官方 `session/not-found` 一致）。**未声明的码会被网关归并成 `gateway/internal`，客户端丢失业务码与文案** | `src/types.ts`、`src/gateway.ts` |
| B5 | `ctx.workspaces.openPath` 已移除 | 文件栏"打开文件"失效 | 走现行标准：`fileAddressFor()` 构造 `dsh-resource://file/session/<id>/<path>`，交 `ctx.sidebarRight.openResource()` 在官方右侧栏打开 | `src/client/index.ts`、`src/client/workspace.ts` |
| B6 | 浏览器平台模块表变化 | 表外 `require()` 会 `missed the module table` | 逐字比对 `dsh-web-frontend` 引导代码（`function by(){return{...}}`）后对齐为 9 项 | `scripts/platform-modules.ts` |
| B7 | `exports["./remote"]` 的消费方制品 | 该导出指向**从未生成**的文件 —— 任何 `import '<pkg>/remote'` 在解析期即失败 | `gen-typert.mjs` 补生成 `lib/typert.remote-client.{js,d.ts}`，与官方 `./typert`(host) + `./remote`(消费方) 双制品布局一致 | `scripts/gen-typert.mjs` |

### 2.1 顺带清掉的两个隐患

- **`src/client/slots.ts` 整个删除。** 该文件是旧版为补 SlotMap 合并而写，且它**只含 `declare module` 而没有顶层
  import/export** —— 这种文件在 TS 里是**脚本**，其 `declare module` 会被解释为**环境模块声明**而非**模块增强**，
  把真实的 `@deepseek-ai/dsh-client-ui-slots` 整个遮蔽掉。症状极具误导性：
  `import type { PropsRuntime } ...` 报 TS2305 "has no exported member"，同时该文件自身报 TS2306 "is not a module"，
  多个组件一起炸，看起来像"上游包不兼容"。
  0.1.5 下 `sidebar.footer.action` / `settings.section` 的 merge 由上游包自带，因此该补丁文件彻底不再需要。
- **`scripts/install.mjs` 的路径处理。** 原实现传 `file:<绝对路径>`；`file:` specifier 无法转义含空格路径
  （引号会被当作路径的一部分），pnpm 会把它截断成 `F:/Coding` 并报 `ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND`。
  改为直接传绝对路径，由 pnpm 自己生成合法 `file:` 依赖。

---

## 3. 依赖版本对齐（真正的修复）

`package.json` 的 `peerDependencies` / `devDependencies` 全量提升到 **0.1.5-rc.2** 系列，
`@deepseek-ai/cordis` → `^4.0.2`，`@deepseek-ai/schemastery` → `^3.18.2`，并移除了 `dsh-client-runtime`。

要点：

- **每个** `@deepseek-ai/*` 依赖在 `peerDependencies` 与 `devDependencies` 中同范围镜像存在。
- `@deepseek-ai/dsh-util-workspace-path` 是**例外**：它放在 `dependencies` 而非 peer。
  本仓库的 client 构建按「生产依赖 = external」外置（`scripts/tsdown.client.ts` 的 `productionExternals`），
  若把它声明为生产依赖就会被外置，从而撞上 bundle 纯度门禁；官方多个 client 包
  （`ui-chat`、`ui-deliverables`、`ui-sidebar-files`）同样是把它**内联**进产物的。
  因此同步在 `INLINE_SAFE` 白名单里放行它 —— 它是纯函数式的路径/地址工具，属于跨包共享的 wire 词汇。
- `dsh.client.inject` 的包边补齐为 10 条，覆盖 client 半实际消费的全部服务
  （`ui-renderer` → `ctx.slots`、`api-*-controller` → `ctx.workspaces`/`ctx.sessions`、`ui-sidebar-right` → `ctx.sidebarRight` 等）。
- `.npmrc` 增加 `cache=.npm-cache`：沙箱/CI 下系统 npm 缓存目录可能不可写（EPERM）。

---

## 4. 设计与取舍说明

### 4.1 文件打开语义：改为官方右侧栏预览

0.1.5 取消了 `ctx.workspaces.openPath`，官方替代路径就是「资源地址 + 右侧 Sidebar」。
因此文件栏点击文件改为在官方右侧栏打开预览（与 `ui-sidebar-files`/`ui-sidebar-documentpreview` 同一机制）。
**此取舍已与用户确认**：保留右侧栏预览，不改回"用系统默认程序打开"。

### 4.2 `sidebarRight` 是软依赖

`ctx.sidebarRight` 只被"用官方 UI 打开文件"这一个动作消费，不值得为它让整个插件变成硬依赖。
因此它**不**进 `inject` 数组，改为在调用点用 `ctx.get('sidebarRight')` 读取并判空 ——
组合里没有该服务时，插件其余功能照常可用（与既有的 `ctx.get('remote.shining')` 同一模式）。

---

## 5. 验证证据

在本机 **DSH 0.1.5-rc.1 / 内部包 0.1.5-rc.2** 上实测：

| 验证项 | 命令 / 方式 | 结果 |
|---|---|---|
| host 类型 | `npx tsc -p tsconfig.host.json` | 0 error |
| client 类型 | `npx tsc -p tsconfig.client.json` | 0 error |
| 构建 | `npm run build` | 通过（含 bundle 纯度门禁） |
| 测试 | `npm run verify` | **16 文件 / 94 用例全绿** |
| 层组合 | 隔离 `DSH_HOME` 下 `dsh plugin --profile scratch add <dir>` + `--dump-config` | profile `bundles` 正确追加，配置出现 `# == dsh-shiningweb-ui` 层 |
| 三入口加载 | 经**包 exports** 真实 `import` | `apply` 可调用；`./typert` 15 invocations；`./remote` 15 descriptors；host/remote 描述符**逐条一致**，schema 全部可 `parse` |
| client 产物纯度 | 检查 `lib/client.js` | 仅 `require("react")` / `require("react/jsx-runtime")`；地址助手已内联 |

`--dump-config` 的期望输出片段：

```yaml
# == dsh-shiningweb-ui
- id: shiningweb-ui
  name: dsh-shiningweb-ui
```

### 5.1 新增的回归守卫

| 守卫 | 文件 | 防的是什么 |
|---|---|---|
| 契约硬事实（码词表、命名空间、平台模块表、模块增强） | `tests/runtime-contract-015.spec.ts` | 逐条锁住与 0.1.5 绑定的契约，被改回去立刻可见 |
| `declare module` 不得出现在脚本文件里 | 同上（扫全 `src` 树） | 防 §2.1 那类"环境模块声明遮蔽真实包"再次出现 |
| exports 目标必须存在 | `tests/typert-artifacts.spec.ts` | 防悬空 `exports`（曾指向从未生成的文件） |
| 制品必须是合法可解析 JS | `tests/build-hygiene.spec.ts` | 防 TS 语法（如 `as const`）混入 `.js` 产物 |
| manifest 与消费服务一致 | `tests/client-conventions.spec.ts` | 防 `dsh.client.inject` / peers 与 `inject` 漂移 |

---

## 6. 生效方式

插件目前**没有**安装到 `web` profile（本次修复只装在临时环境验证，未触碰正在运行的实例）。
需要生效时：

```sh
cd <插件目录>
npm run install:profile        # 等价于 dsh plugin --profile web add <插件目录>
```

然后**重启 `dsh web`**（会中断当前会话）。若 profile 依赖曾指向旧版本，建议连同 profile 目录的
`node_modules` 一起重装，避免残留 0.1.0-rc.8 的包。

自检（重启前就能做）：

```sh
dsh plugin --profile web add <插件目录>
dsh --profile web --dump-config | Select-String "shiningweb-ui"   # 应出现 # == dsh-shiningweb-ui
```

---

## 7. 尚未覆盖 / 后续可做

- **真实浏览器 UI 走查未做。** 要在带 web 应用的 profile 里实际启动并逐项点测（名册、路由、刷新、
  多标签、分栏、窄屏）。原因：`@deepseek-ai/dsh-web-app` 的部分依赖（如 `dsh-frontend-static`、
  `dsh-client-ui-question`）只存在于随 `@deepseek-ai/dsh` 一起分发的形态中，未从 registry 单独发布，
  无法在干净临时 profile 里组装出 web 应用。**这一步请在真实 profile 重启后补做**，重点看：
  侧边栏两个入口按钮、天圆地方聊天窗、文件栏、Git 工具栏、设置页「璀璨星河」分组。
- **QQ 链路未实测**（需要真实 AppID/AppSecret）——本次只保证 host 半能加载、typert 描述符一致。
- **`settings` 读写在真实运行时未实测**：`settingsScope.bind` 的 `decode` 逻辑有单测覆盖，
  但"写设置 → 重启后仍是新值"这条端到端路径建议在真机上确认一次。
- 若希望右侧栏预览进一步对齐官方（多标签复用、`title(address)` 语义），可考虑把文件栏整体迁到
  `ctx.sidebarRightTabs.register` + `sidebar.right.pane.tab` 席位，而不是自绘抽屉。
