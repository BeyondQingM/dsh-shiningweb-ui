/**
 * dsh-shiningweb-ui 网关业务类型与成功/失败辅助。
 * 单个 request 对象参数；host 方法返回“裸业务值”，失败时抛出携带业务码的错误。
 * 成功/失败的 { ok, value } / { ok: false, error } 包装由 Typert 网关统一完成，
 * 这里不再自行包裹，避免与网关形成双重包裹（导致客户端拿到 { ok, value: { ok, value } }）。
 */
import { resolve, sep } from 'node:path'
import { RemoteError, type RemoteErrorDetailsMap } from '@deepseek-ai/dsh-typert-protocol'

/**
 * 本命名空间的 Remote 失败码词表。
 *
 * 0.1.5 起 Host 方法不再抛 `TypertLookupFailure`（已移除）：业务失败必须抛
 * `RemoteError`，并把码声明进共享的 `RemoteErrorDetailsMap`。未声明的码会被网关
 * 归并成 `gateway/internal`（客户端只能看到 "internal"，丢失业务码与文案）。
 * 码统一用 `<namespace>/<slug>` 形态，与官方 domain 包（如 `session/not-found`）一致。
 */
declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    /** fs 操作失败（路径越界、IO 错误等）。 */
    'shining/fs-error': {}
    /** git 命令失败。 */
    'shining/git-error': {}
    /** 上游 LLM 调用失败。 */
    'shining/chat-error': {}
    /** QQ 会话层不可用或操作失败。 */
    'shining/qq-error': {}
  }
}

/** 成功：直接返回裸业务值（网关统一包成 { ok: true, value }）。 */
export function success<T>(value: T): T {
  return value
}

/** 失败：抛出携带业务错误码的失败（网关统一包成 { ok: false, error }）。 */
export function failure(code: keyof RemoteErrorDetailsMap, message: string): never {
  throw new RemoteError(code, message, {})
}

/** 将客户端路径解析为绝对路径，并强制位于 root 之内（防目录穿越）。 */
export function resolveWithinRoot(root: string, path: string): string {
  const rootAbs = resolve(root)
  const target = resolve(rootAbs, path)
  if (target !== rootAbs && !target.startsWith(rootAbs + sep)) {
    throw new Error(`path-root-escape: ${target} is outside ${rootAbs}`)
  }
  return target
}

export interface FsListRequest { root: string; path: string; showHidden?: boolean }
export interface FsEntry { name: string; isDirectory: boolean; size: number }
export interface FsListValue { entries: FsEntry[] }
export interface FsReadRequest { root: string; path: string }
export interface FsReadValue { content: string }
export interface FsWriteRequest { root: string; path: string; content: string }
export interface FsPathRequest { root: string; path: string }
export interface FsRenameRequest { root: string; path: string; newName: string }
export interface FsOpValue { path: string }

export interface GitStatusRequest { root: string; repoPath: string }
export interface GitChange { path: string; status: 'M' | 'A' | 'D' | 'U' }
export interface GitStatusValue { branch: string; dirtyCount: number; changes: GitChange[] }
export interface GitBranchRequest { root: string; repoPath: string; branch: string }
export interface GitCreateBranchRequest { root: string; repoPath: string; name: string }
export interface GitPathRequest { root: string; repoPath: string }
export interface GitOpValue { output: string }

export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string }
export interface ChatRequest { messages: ChatMessage[]; model: string; apiBase: string; apiKey: string }
export interface ChatValue { content: string }

// ── QQ 会话视图（host 会话层 → GUI） ──
export interface QqMessageView { role: 'user' | 'assistant'; content: string }
export interface QqSessionView {
  key: string
  peerId: string
  kind: 'group' | 'c2c'
  messages: QqMessageView[]
  updatedAt: number
}
export interface QqListRequest {}
export interface QqListValue { sessions: QqSessionView[] }
export interface QqReadRequest { key: string }
export interface QqReadValue { session?: QqSessionView }
export interface QqSendRequest { key: string; content: string }
export interface QqSendValue { ok: boolean }
