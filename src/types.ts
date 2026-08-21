/**
 * dsh-shiningweb-ui 网关业务类型与成功/失败辅助。
 * 单个 request 对象参数，返回 ShiningResult 业务联合。
 */
import { resolve, sep } from 'node:path'

export interface ShiningSuccess<T> { ok: true; value: T }
export interface ShiningFailure { ok: false; error: { code: string; message: string; [k: string]: unknown } }
export type ShiningResult<T> = ShiningSuccess<T> | ShiningFailure

/** 成功分支。 */
export function success<T>(value: T): ShiningSuccess<T> {
  return Object.freeze({ ok: true, value })
}

/** 失败分支。 */
export function failure(code: string, message: string, extra: Record<string, unknown> = {}): ShiningFailure {
  return Object.freeze({ ok: false, error: Object.freeze({ code, message, ...extra }) })
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
