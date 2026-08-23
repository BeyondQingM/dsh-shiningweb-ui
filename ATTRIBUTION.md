# 开源声明

本项目 `dsh-shiningweb-ui`（璀璨星河）使用了以下开源项目的代码或源码级设计，特此感谢并遵守其许可证要求。

> 说明：仅列出**实际引用其源码或源码级设计**的项目；纯设计灵感/产品功能启发（如界面参考）不在此列。许可证以各项目 NPM 发布元数据为准。

## 直接依赖（实际 `import` 的包）

| 项目名称 | 仓库地址 | 许可证 | 使用说明 |
|----------|----------|--------|----------|
| `@deepseek-ai/schemastery` | https://github.com/deepseek-ai/deepseek-harness | MIT | 设置命名空间 schema（host/client 共享设置定义） |
| `zod` | https://github.com/colinhacks/zod | MIT | Typert 制品 strict codec（`src/client/remote.ts` 生成的客户端贡献） |
| `@deepseek-ai/cordis` | https://github.com/deepseek-ai/deepseek-harness | MIT | 插件微内核：Context / Service 基类 |
| `@deepseek-ai/dsh-typert-protocol` | https://github.com/deepseek-ai/deepseek-harness | MIT | Remote 装饰器 / `TypertRemoteService` / `RemoteResult` |
| `@deepseek-ai/dsh-settings` | https://github.com/deepseek-ai/deepseek-harness | BSD-3-Clause | `settingsNamespace` 注册 / 读取设置命名空间 |
| `@deepseek-ai/dsh-client-runtime` | https://github.com/deepseek-ai/deepseek-harness | BSD-3-Clause | 客户端运行时：`ClientContext`、会话/工作区服务 |
| `@deepseek-ai/dsh-client-ui-slots` | https://github.com/deepseek-ai/deepseek-harness | BSD-3-Clause | 槽位系统：`register` / `PropsRuntime` / 定位器（5 处槽位注册） |
| `@deepseek-ai/dsh-api-remotes` | https://github.com/deepseek-ai/deepseek-harness | BSD-3-Clause | `ctx.remote`（Typert Remote 客户端命名空间挂载） |
| `@deepseek-ai/dsh-client-locale` | https://github.com/deepseek-ai/deepseek-harness | BSD-3-Clause | `ctx.locale`（字典注册；type-only） |
| `@deepseek-ai/dsh-client-ui-settings` | https://github.com/deepseek-ai/deepseek-harness | BSD-3-Clause | `ctx.settingsScope`（设置绑定；type-only） |
| `@deepseek-ai/dsh-client-ui-conversation` | https://github.com/deepseek-ai/deepseek-harness | BSD-3-Clause | 会话槽位契约（`conversation.input.dock` 等；type-only） |
| `@deepseek-ai/dsh-client-ui-layout` | https://github.com/deepseek-ai/deepseek-harness | BSD-3-Clause | `shell.overlay`/布局槽位（type-only） |
| `@deepseek-ai/dsh-client-ui-sidebar` | https://github.com/deepseek-ai/deepseek-harness | BSD-3-Clause | `sidebar.footer.action` 槽位（type-only） |
| `@tencent-connect/qqbot-nodejs` | https://github.com/tencent-connect/qqbot-nodejs | MIT | QQ 连接器（可选依赖）：`QQBot` 收发消息 |

> 上表中 `dsh-client-*` 系列为 DSH 框架的 peer 依赖，是插件运行的框架契约；其中多个为 type-only import（仅拉入类型、不产生运行字节）。

## 参考源码设计 / 直接复制的源码

| 项目名称 | 仓库地址 | 许可证 | 参考说明 |
|----------|----------|--------|----------|
| `deepseek-ai/deepseek-harness` | https://github.com/deepseek-ai/deepseek-harness | MIT | **直接复制**：`scripts/tsdown.client.ts`（client bundle 构建预设，原 `packages/client/tsdown.client.ts` @ `141eb6fe`）与 `scripts/platform-modules.ts`（平台模块表，原 `packages/client/web/src/platform.ts`） |
| `@tencent-connect/dsh-qqbot` | https://github.com/tencent-connect/dsh-qqbot | MIT | 参考其 `src/gateway/bootstrap.ts`、`src/config.ts`、`src/session/session-manager.ts` 的 **QQBot 连接器接线**（`on('message')` / `sendMarkdown` / `start` / `stop`），据此实现本项目的 `createQqAdapter` |

## 运行时集成的外部插件（非本仓库依赖，未复制其源码）

| 项目名称 | 仓库地址 | 许可证 | 说明 |
|----------|----------|--------|------|
| `@modusensus/dsh-mneme` | https://github.com/modusensus/dsh-mneme | MIT | 天圆地方记忆的读侧：运行时调用其 HTTP API `GET /api/dsh-mneme/search` 检索记忆（`src/client/memory.ts`）。作为 DSH 插件由用户另装，**未**作为本仓库依赖、**未**复制其源码。 |

## 未引用（仅作为线索检索，未读取/复制其源码，故不列入声明）

- `dsh-web-ui`（zhu1090093659/dsh-web-ui）
- `dsh-channels`（wsz987/dsh-channels）

> 以上两个项目仅用于初步了解生态（如 UI 参考），未实际采用其任何源码或源码级设计，因此按"纯灵感参考"处理，不产生许可证声明义务。

---

*本声明由开发者依据实际 `import` 引用与源码取证生成，确保准确、可追溯。*
