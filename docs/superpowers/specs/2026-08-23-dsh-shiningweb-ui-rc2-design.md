# dsh-shiningweb-ui（璀璨星河）rc2 设计文档

日期：2026-08-23
版本：v0.1.0-rc2（在 v0.1/rc1 的 4 模块基础上扩展）
证据基线：官方 deepseek-harness `@ b150a551`；已装 `@deepseek-ai/*` rc.6；`@tencent-connect/dsh-qqbot` v0.4.0 源码（`F:\余程安学习资料\_ref\dsh-qqbot`）；`@modusensus/dsh-mneme` v0.4.0。

## 1. 目标与范围

在 rc1（天圆地方基础聊天、文件栏、Git 工具栏、视觉增强）之上，rc2 新增 5 个能力模块：

1. **天圆地方 DSH 上下文感知**：天圆地方（独立模型）能了解 DSH 主窗口的项目/会话，并能代发任务给 DSH 会话（ASSISTANT/SUPER 基石）。
2. **分级能力模式**：`pet`（默认）→ `assistant` → `super`，渐进式权限门控。
3. **QQ 群接入**：用官方 `@tencent-connect/qqbot-nodejs` 传输，天圆地方**自持** QQ 会话（独立模型回复），内置「QQ 会话」标签，**零污染侧边栏**（不建 DSH 会话）。
4. **天圆地方记忆**：发起前读 dsh-mneme 注入上下文；写侧存天圆地方自己的 IndexedDB。
5. **朋友圈**：天圆地方人格的动态/点赞/评论，存 IndexedDB。

## 2. 核心架构决策（已与用户确认）

- **天圆地方=QQ bot 人格，DSH 会话=独立"员工"**：QQ bot 用天圆地方人格 + 独立模型；DSH 主会话不受影响（天然隔离，因为 QQ 会话不是 DSH 会话）。
- **超级助理="代发消息到当前会话"**：用 `session.prompt(content,'queue')` 把任务交给 DSH agent。
- **记忆**：读 dsh-mneme（HTTP `list`/`search`）+ 天圆地方自持 IndexedDB 写。
- **QQ 会话层**：官方 connector 传输 + 天圆地方自持会话（非 DSH 会话），零侧边栏污染；人格最纯粹（独立模型）。
- **上下文感知**：客户端读 `ctx.workspaces`/`ctx.sessions`/`session.prompt`，注入独立模型上下文。

## 3. 技术验证结论（取证）

### 3.1 DSH 会话可见性（为何零污染可行）
- `SessionHeader` 无 `workspaceId`/`hidden`；workspace 归属 = `WorkspaceView.sessionIds` 注册表。
- 侧边栏 `deriveGroups` 按 workspace 分组；未归属会话→"Ungrouped"；**archived 会话全被排除**。
- 结论：不建 DSH 会话（自持天圆地方 QQ 会话）→ 结构上零污染。

### 3.2 上下文与代发 API（客户端）
- `ctx.workspaces.list`（项目/工作区）+ `ctx.sessions.list`（会话清单）+ `ctx.sessions.binding(id).session`（`SessionFace`）。
- `SessionFace = ISession & ObservableSnapshot<ConversationSnapshot>`：读会话快照 + `prompt(content,'queue')` 代发。

### 3.3 记忆 API（dsh-mneme HTTP）
- 读：`GET /api/dsh-mneme/list`、`/search?q=...`；`/profile`、`/rules`、`/commands`。
- **无 save 路由**（`memory_save` 是 agent 工具）；→ 天圆地方写侧自持 IndexedDB。

### 3.4 QQ 传输（@tencent-connect/qqbot-nodejs）
- `new QQBot({ appId, appSecret, transport:'websocket', ... })`；`bot.on('message', cb)`；`bot.sendMarkdown(target, content)`；`bot.start()/stop()`。
- rc2 先做 text 消息；media/vision 标注后续。

## 4. 数据流与存储分工

| 数据 | 侧 | 存储 |
|---|---|---|
| 天圆地方 GUI 对话历史 | client | IndexedDB（沿用 rc1 storage.ts）|
| 天圆地方 QQ 会话（每 peer） | host | `~/.dsh/shiningweb/qq-store/`（JSON，host Node store；不可用 IndexedDB）|
| 朋友圈 | client | IndexedDB |
| 天圆地方记忆写侧 | client | IndexedDB |
| 天圆地方记忆读侧 | client（GUI）/ host（QQ） | dsh-mneme HTTP `list`/`search` |
| DSH 上下文注入 | client | 实时读 `ctx.workspaces`/`ctx.sessions` + 当前会话快照 |
| 设置（含 capabilityMode/QQ 配置） | host | settings 命名空间 `shining`（沿用 rc1）|

> host 侧 QQ 会话/记忆用 JSON 文件（`node:fs`），不走 DSH session 持久化，规避侧边栏污染；GUI 侧用 IndexedDB。

## 5. 各模块设计

### 5.1 设置扩展（settings schema）
新增字段到 `ShiningSettings`：
```
capabilityMode: 'pet'|'assistant'|'super' (默认 pet)
qq: { enabled: boolean; appId: string; appSecret: string; groupAllow: string[]; personaPrompt: string }
visual / chat / fileExplorer / git 沿用 rc1
```
设置面板显示：模式切换（3 选项）+ 「QQ 群接入」节（仅 `super` 模式可见：enable / appId / appSecret / 群号列表 / QQ 人格提示词）。

### 5.2 天圆地方 DSH 上下文感知（client `useDshContext`）
聚合函数 `gatherDshContext(ctx)` → 返回 { workspaces, sessions, currentSession }：
- `ctx.workspaces.list.getSnapshot()` → 项目路径/标题。
- `ctx.sessions.list.getSnapshot()` → 会话清单（id/title/cwd/current）。
- `ctx.sessions.binding(currentId)?.session.getSnapshot()` → 当前会话内容（用作 assistant 上下文）。
ChatWindow 发送前把它拼成 context 注入独立模型 system prompt。
动作 helper：`sendToSession(ctx, sessionId, text)` = `binding(id).session.prompt([{type:'text',text}],'queue')`（代发，无 confirm 由 UI 层控制）。

### 5.3 分级能力模式
- 设置字段 `capabilityMode`。
- 门控：QQ 配置节仅 `super` 可见；`assistant/super` 时天圆地方可读当前会话内容；`assistant` 代发需用户确认（对话框 + "本次不再提示"复选，记 localStorage）；`super` 代发默认放行（仍可切回确认）。
- 模式指示：天圆地方 overlay 顶部显示当前模式标签。

### 5.4 天圆地方记忆
- 读：ChatWindow 发起前 `fetch('/api/dsh-mneme/search?q=<相关词>')` 拉相关记忆 → 注入上下文。
- 写：聊完后把本轮高价值内容 `saveChat` 到天圆地方自己的 IndexedDB（记忆桶）。
- 后续增强：把写侧改接 dsh-mneme（需其开放 save 路由，暂不侵入）。

### 5.5 朋友圈（client，IndexedDB）
`friend-circle.ts` 数据模型：`post { id, personaId, content, createdAt, likes: string[], comments: [{id,author,content,createdAt}] }`。
`shining-web` IndexedDB store `friendCircle`。天圆地方 overlay 新增「朋友圈」tab：发动态（含立绘不参与）、点赞、评论。

### 5.6 QQ 群接入（host 会话层 + GUI 视图）
**host `ShiningQQService`**（Node）：
- 注入 `@tencent-connect/qqbot-nodejs` 的 `QQBot`；读天圆地方 settings（appId/appSecret/groupAllow/personaPrompt/apiBase/apiKey/model）。
- `bot.on('message')` → 按 `group/c2c`+peer 维护会话缓冲（`~/.dsh/shiningweb/qq-store/<key>.json`）→ 拼 persona + history + DSH 概况 → 调天圆地方独立模型 → `bot.sendMarkdown()` 回复。
- 生命周期：`bot.start()` 随 effect，dispose 时 `bot.stop()`。
- 暴露为 `ctx.shiningQq`（可选）+ 注册 Typert Remote（`shining` 命名空间）`qqList`/`qqRead`/`qqSend` 供 GUI 读。
**client `useQqSessions`**：读 `ctx.remote.shining.qqList`/`qqRead`；天圆地方 overlay「QQ 会话」tab（每 peer 对话 + 可回复）。
- rc2 先 text；media/vision 标注后续。

## 6. v0.1-rc2 边界（不做，标注后续）
- QQ 富媒体/语音/图片理解。
- QQ bot 主动发朋友圈、跨 GUI/QQ 统一会话。
- 记忆写侧接 dsh-mneme（需其开放 save）。
- 更多能力模式的细粒度工具白名单。

## 7. 验证
- host/OOq QQ 会话层单测（mock QQBot + 独立模型 mock；临时目录会话往返）。
- client 单测：useDshContext 聚合、模式门控、朋友圈 crud、useChat 记忆注入。
- `npm run verify`（typecheck/build/test）。
- 真实组合：scratch profile `dsh plugin add`（pnpm 网络已修）；QQ 接入需真 QQ 凭据（环境不可测，标注需用户侧验证）。
