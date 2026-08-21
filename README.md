# dsh-shiningweb-ui（璀璨星河）

DSH 插件：独立聊天空间（天圆地方）、类 VS Code 文件栏、Git 分支快速管理、视觉增强基础。所有模块可在设置面板独立开关。

- Host 半：`ShiningService`（Typert Remote 命名空间 `shining`）+ `shining` settings 命名空间。
- Client 半：5 处槽位注册（`sidebar.footer.action` 入口 ×2、`shell.overlay` 聊天窗/文件抽屉、`conversation.input.dock` Git 工具栏、`settings.section` 设置页）。

## 前置条件

- Node ≥ 22、`git` 在 PATH、npm。
- 已运行 `dsh web`（profile `web`）。

## 构建

```sh
npm install
npm run build
```

产物：`lib/index.js`（host 半）、`lib/client.js`（client bundle，`window.__ModuleLoader__.load` 格式）、`lib/typert.host.js`（host `./typert` 制品）、`src/client/remote.ts`（client remote 贡献，由 `scripts/gen-typert.mjs` 生成）。

## 安装（本地开发，重启生效）

```sh
node scripts/install.mjs web
# 或 dsh plugin --profile web add "file:<本目录>"
```

安装后**重启 dsh web**（会中断当前会话）。`dsh plugin add` 为 profile 目录的 pnpm 转发层，自动对账 `dsh.profile.bundles`。

## 验证

```sh
npm run verify
```

GUI 验证清单（重启后）：
1. 设置页出现「璀璨星河」分组（settings.section）。
2. 侧边栏脚部出现「天圆地方」「文件」两个按钮（sidebar.footer.action）。
3. 点击「天圆地方」弹出全屏聊天窗（立绘背景、消息收发、独立模型配置）。
4. 点击「文件」弹出左侧文件树抽屉（展开/右键菜单/搜索/打开文件）。
5. 会话输入框上方出现 Git 工具栏（分支下拉/切换/创建/pull/未提交计数）。
6. 设置面板逐模块关闭开关，界面相应部分隐藏。
7. 切换主题色/毛玻璃强度，界面颜色与模糊变化。

## v0.1 边界（后续增强点）

- chat 为 unary 非流式；后续可加 SSE 流式。
- 打开文件用系统默认应用（host `openPath`）；不做内嵌编辑器。
- 无文件拖拽、Git 冲突/远程分支 UI。
- `apiKey` 存 settings 文档（后续迁 credentials 库）。
- 侧边栏顶部入口待 DSH 开放 section 槽位（v0.1 用脚部）。
