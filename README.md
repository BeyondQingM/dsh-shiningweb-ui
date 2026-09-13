# dsh-shiningweb-ui（璀璨星河）

一个为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 打造的 UI 增强插件：独立的 AI 人格空间「天圆地方」、类 VS Code 文件栏、Git 分支管理、QQ 群接入、记忆与朋友圈，以及一套会**真正改变界面观感**的视觉主题。所有模块可在设置面板独立开关。

- 版本：`v0.1.0-rc5`
- 目标运行时：**DSH 0.1.5-rc**（`@deepseek-ai/dsh` ≥ 0.1.5-rc.1；插件依赖 `0.1.5-rc.2` 系列包与 `@deepseek-ai/cordis` ≥ 4.0.2）
- 许可证：[MIT](LICENSE)

## ✨ 功能特性

| 模块 | 说明 |
|------|------|
| **天圆地方** | 独立 AI 聊天空间：独立的模型与人格配置、立绘背景、记忆、朋友圈 |
| **分级能力模式** | 萌宠 / 助理 / 超级助理，渐进式权限；超级助理可代发任务给 DSH 会话并接入 QQ |
| **QQ 群接入** | 让「天圆地方」作为 QQ 机器人接入群聊/私聊，回复使用天圆地方独立人格 |
| **文件栏** | 侧边栏文件树：展开/折叠（懒加载）、右键菜单、搜索过滤、用系统应用打开文件 |
| **Git 分支管理** | 会话输入框上方的工具栏：切换/创建分支、拉取更新、显示未提交文件数 |
| **视觉主题** | `星河蓝 / 晨曦金 / 极光紫` 三套主题经 DSH 官方 token 覆盖层**换肤整个 Web GUI**（侧边栏、对话区、输入区、按钮、滚动条等），明暗模式自适应；另含聊天窗星野、可视化主题选择卡片、毛玻璃强度与背景立绘。选「跟随 DSH」一键还原原生观感 |

## 🎨 视觉主题

在设置面板 → 「璀璨星河」→「视觉主题」的**主题卡片**中选择，或调节毛玻璃强度。切换后**立即生效**（无需重启）：

**全套换肤（整个 Web GUI）**：基于 DSH 官方 `ctx.theme.overrideTokens` token 覆盖层，每套主题提供约 38 个官方 token 的 light/dark 双档值——背景层级、文字层级、描边、品牌色、按钮全系、交互悬停、侧边栏、对话气泡、输入框、菜单/选择器、滚动条、提示层。DSH 明暗模式切换时自动适配对应档位。

**插件自有界面**：
- **天圆地方聊天窗**：星野层（纯 CSS 星点 + 主题色晕染，深浅模式各自优化）、用户气泡与发送按钮渐变、面板描边与辉光、输入框聚焦光圈
- **侧边栏入口 / 文件栏 / Git 栏 / 朋友圈 / QQ 会话**：主题色描边、悬停、聚焦与图标着色

**跟随 DSH**：选择该卡片即移除 token 覆盖层，整个 GUI 还原 DSH 原生观感；插件卸载时覆盖层自动释放。

## 📦 安装

**前置条件**

- 已安装 DeepSeek Harness（`dsh`），使用 `web` profile。
- Node.js ≥ 22，`git` 在系统 PATH。

**安装到 profile**

```sh
# 从 GitHub 安装（推荐，仓库已包含构建产物 lib/）
dsh plugin --profile web add "github:BeyondQingM/dsh-shiningweb-ui"

# 或从本地源码目录安装
npm run install:profile        # 推荐：脚本会处理路径含空格的坑（见下）
```

> **⚠️ 路径含空格时不要直接执行 `dsh plugin add <目录>`。** 该命令会**按空格拆参数**，
> 例如 `F:\Coding Projects\...\dsh-shiningweb-ui` 会被拆成 `Coding` / `Other` /
> `dsh-shiningweb-ui` 三个依赖写进 profile，前两个指向不存在的目录。
> 同理不要用 `dsh plugin add "file:<目录>"` —— `file:` specifier 无法转义空格，
> pnpm 会截断成 `F:/Coding` 并报 `ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND`。
> 请改用 `npm run install:profile`：它会在 `%LOCALAPPDATA%\dsh-plugin-install-links\`
> 下建一个无空格的目录链接再安装。

安装完成后，**重启 `dsh web`** 使插件生效（重启会中断当前会话）。

> 仓库已预构建 `lib/` 产物，安装即用、无需本地构建。若从源码目录安装并自行修改了源码，需先执行构建：`npm install && npm run build` 重新生成 `lib/`。

## 🎮 使用说明

安装重启后：

1. **天圆地方聊天窗**：点击侧边栏脚部的「天圆地方」按钮打开。可上传立绘、配置独立模型、切换模式。
2. **文件栏**：点击侧边栏脚部的「文件」按钮，左侧滑出文件树抽屉。右键文件/文件夹可新建、重命名、删除、复制路径；展开目录为懒加载。
3. **Git 工具栏**：位于会话输入框上方，显示当前分支与未提交文件数，支持下拉切换、创建分支、拉取。
4. **朋友圈 / QQ 会话**：在天圆地方聊天窗顶部的标签页切换；「QQ 会话」在超级助理模式下可见。

## ⚙️ 设置

在 DSH 设置面板 → 「璀璨星河」分组中集中管理：

- **启用**：总开关。
- **能力模式**：萌宠 / 助理 / 超级助理。
- **天圆地方**：独立模型的 Base URL、API Key、模型名、立绘上传。
- **文件栏**：显示隐藏文件。
- **Git 分支管理**：自动刷新间隔（关闭 / 10s / 30s / 1m）。
- **视觉主题**：主题卡片（跟随 DSH / 星河蓝 / 晨曦金 / 极光紫）、毛玻璃强度（0–24px）。
- **QQ 群接入**（仅超级助理模式可见）：启用、AppID、AppSecret、群号白名单、QQ 人格提示词。

> 独立模型的 API Key 与 QQ 凭据保存在本机 DSH 设置文档中，请在「天圆地方」模型配置处自行妥善保管。

## 🛠️ 开发与构建

仓库已提交构建产物 `lib/`（host ESM bundle + client bundle + typert 制品），安装后开箱即用。如需参与开发：

```sh
npm install          # 安装开发依赖（0.1.5-rc.2 契约；旧 rc 版本会让 typecheck 假绿）
npm run verify       # typecheck + build + 全量测试
npm run build        # 仅构建 lib/
npm run gen:typert   # 重新生成客户端 remote 与 host typert 制品
npm run install:profile  # 安装到默认 web profile（等价于 dsh plugin add）
```

> **版本对齐很重要**：本插件的 `peerDependencies`/`devDependencies` 必须与目标 DSH 运行时同一 `0.1.5-rc.*` 系列。
> 若两者错开（例如依赖停在 `0.1.0-rc.8`、运行时已是 `0.1.5-rc`），`npm run typecheck`/`test` 会针对旧契约**全部通过**，
> 而插件在真实运行时才失败 —— 排查时请先比对 `node_modules/@deepseek-ai/dsh-*` 的实际版本与运行中的 `@deepseek-ai/dsh` 版本。
> `tests/runtime-contract-015.spec.ts` 固化了与 0.1.5 契约绑定的硬事实，作为该类回归的守卫。

- **host / client 分层**：`src/index.ts` 为 host 半入口（ShiningService 网关 + settings 注册 + 可选 QQ 会话层），`src/client/index.ts` 为 client 半入口（slot/settings/remote 挂载）。
- **Remote 契约**：host 方法返回「裸业务值」，失败时抛 `RemoteError`（业务码为 `shining/*`，在 `src/types.ts` 里合并进 `RemoteErrorDetailsMap`），由 Typert 网关统一包成 `{ ok, value }` / `{ ok: false, error }`，勿在插件里再包一层。
- **视觉主题**：`src/client/visual.ts` 将主题色板写入 `--shining-*` CSS 变量，各组件在 `.module.css` 中消费。

## ⚠️ 注意事项

- **QQ 接入**需在「超级助理」模式下配置 AppID/AppSecret，并可选安装记忆依赖 [@modusensus/dsh-mneme](https://github.com/modusensus/dsh-mneme) 以启用记忆检索。
- **记忆**的读侧依赖 dsh-mneme；若未安装，天圆地方仅使用自身记录的记忆。
- 部分能力（如 QQ 富媒体消息、内嵌编辑器）仍在增强中，详见仓库 issue 与后续版本。

## 📄 许可证

本项目基于 MIT 许可证开源。第三方开源项目的代码/版权声明见 [ATTRIBUTION.md](ATTRIBUTION.md)。
