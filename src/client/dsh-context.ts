/**
 * DSH 上下文感知：天圆地方了解 DSH 主窗口的项目/会话，并能代发任务给 DSH 会话。
 * 纯客户端能力（读 ctx.workspaces/ctx.sessions + session.prompt 代发）。
 */
import { useSyncExternalStore } from 'react'
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// 0.1.5：`@deepseek-ai/dsh-client-runtime` 已停止发布。各 ctx 服务的类型由
//「声明它们的包」通过 declare module '@deepseek-ai/cordis' 合并，因此这些
// type-only 导入既是类型来源，也是把合并拉进当前程序的手段（运行时被擦除）。
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
import type {} from '@deepseek-ai/dsh-api-workspace-controller/client'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { WorkspaceId } from '@deepseek-ai/dsh-workspace/types'

let ctx: ClientContext | undefined
const listeners = new Set<() => void>()
let cached: DshContext = { workspaces: [], sessions: [], currentSessionId: undefined }
let version = 0

/** apply 时绑定 DSH 客户端上下文。 */
export function bindDshCtx(c: ClientContext): void {
  ctx = c
}

function emit(): void {
  version += 1
  cached = gatherDshContext()
  for (const l of listeners) l()
}

/** 订阅 workspaces + sessions 列表变化（供 useDshContext 响应式）。 */
function subscribe(l: () => void): () => void {
  listeners.add(l)
  ctx?.workspaces.list.subscribe(emit)
  ctx?.sessions.list.subscribe(emit)
  return () => { listeners.delete(l) }
}

export interface DshWorkspace { id: WorkspaceId; title: string; path: string }
export interface DshSession { id: SessionId; title: string; cwd: string | undefined }

export interface DshContext {
  workspaces: DshWorkspace[]
  sessions: DshSession[]
  currentSessionId: SessionId | undefined
}

/** 同步聚合 DSH 概况（工作区/会话/当前会话）。 */
export function gatherDshContext(): DshContext {
  if (!ctx) return { workspaces: [], sessions: [], currentSessionId: undefined }
  const workspaces = ctx.workspaces.list.getSnapshot().items.map((w) => ({ id: w.workspaceId, title: w.title, path: w.path }))
  const list = ctx.sessions.list.getSnapshot()
  const currentSessionId = list.current
  const sessions = list.ids.map((id) => {
    const s = list.byId[id]
    return { id, title: s?.displayTitle ?? String(id), cwd: s?.cwd }
  })
  return { workspaces, sessions, currentSessionId }
}

/** 响应式读 DSH 概况（快照缓存，仅在列表变化时重算）。 */
export function useDshContext(): DshContext {
  return useSyncExternalStore(subscribe, () => cached)
}

/** 把 DSH 概况格式化为 model 上下文块（注入独立模型 system prompt）。 */
export function dshContextToText(c: DshContext): string {
  const lines: string[] = ['【DSH 主窗口概况】']
  if (c.workspaces.length) lines.push(`项目：${c.workspaces.map((w) => w.title).join('、')}`)
  if (c.sessions.length) lines.push(`会话：${c.sessions.map((s) => s.title).join('、')}`)
  if (c.currentSessionId) {
    const cur = c.sessions.find((s) => s.id === c.currentSessionId)
    lines.push(`当前会话：${cur?.title ?? '（无标题）'}`)
  }
  if (c.workspaces.length || c.sessions.length) return lines.join('\n')
  return ''
}

/**
 * 代发：把一段内容作为"一轮"送进指定 DSH 会话（主 agent 处理）。
 * @param sessionId - 目标会话。
 * @param text - 任务内容。
 */
export async function sendToSession(sessionId: SessionId, text: string): Promise<boolean> {
  const binding = ctx?.sessions.binding(sessionId)
  if (!binding) return false
  const res = await binding.session.prompt([{ type: 'text', text }], 'queue')
  return res.ok === true
}

/** 当前会话 id（异步绑定场景兜底）。 */
export function getCurrentSessionId(): SessionId | undefined {
  return ctx?.sessions.list.getSnapshot().current
}
