/**
 * dsh-shiningweb-ui 网关：ShiningService（Typert Remote 命名空间 `shining`）。
 * fs 方法（node:fs/promises）；git/chat 方法见 Task 4。
 */
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { Context, Service } from '@deepseek-ai/cordis'
import s from '@deepseek-ai/schemastery'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type {
  ChatRequest, ChatValue, FsEntry, FsListRequest, FsListValue, FsOpValue, FsPathRequest,
  FsReadRequest, FsReadValue, FsRenameRequest, FsWriteRequest, GitBranchRequest,
  GitChange, GitCreateBranchRequest, GitOpValue, GitPathRequest, GitStatusRequest,
  GitStatusValue, QqListRequest, QqListValue, QqReadRequest, QqReadValue, QqSendRequest,
  QqSendValue, QqSessionView, ShiningResult,
} from './types.ts'
import { failure, resolveWithinRoot, success } from './types.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** QQ 会话层服务（qq 未启用时 optional）。 */
    shiningQq?: import('./qq.ts').ShiningQqService | undefined
  }
}

const execFileAsync = promisify(execFile)

/** 在 repo 目录执行 git 命令。 */
async function gitResult(repo: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync('git', ['-C', repo, ...args], { timeout: 30000 })
  return stdout.trim()
}

export interface Config {}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** 网关服务：命名空间 `shining` 的 Remote 方法。 */
    shining: ShiningService
  }
}

/** ShiningService：host 侧 Remote 网关。 */
export class ShiningService extends TypertRemoteService {
  static inject: string[] = []
  static Config: s<Config> = s.object({})

  constructor(ctx: Context, _config: Config) {
    super(ctx, 'shining')
  }

  @Remote('fsList')
  async fsList(request: FsListRequest): Promise<ShiningResult<FsListValue>> {
    try {
      const dir = resolveWithinRoot(request.root, request.path)
      const entries = await fs.readdir(dir, { withFileTypes: true })
      const shown: FsEntry[] = entries
        .filter((e) => request.showHidden === true || !e.name.startsWith('.'))
        .map((e) => ({ name: e.name, isDirectory: e.isDirectory(), size: 0 }))
      for (const entry of shown) {
        if (!entry.isDirectory) {
          try { entry.size = (await fs.stat(join(dir, entry.name))).size } catch { /* size optional */ }
        }
      }
      return success({ entries: shown.sort((a, b) => Number(b.isDirectory) - Number(a.isDirectory) || a.name.localeCompare(b.name)) })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsRead')
  async fsRead(request: FsReadRequest): Promise<ShiningResult<FsReadValue>> {
    try {
      const file = resolveWithinRoot(request.root, request.path)
      return success({ content: await fs.readFile(file, 'utf8') })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsWrite')
  async fsWrite(request: FsWriteRequest): Promise<ShiningResult<FsOpValue>> {
    try {
      const file = resolveWithinRoot(request.root, request.path)
      await fs.writeFile(file, request.content, 'utf8')
      return success({ path: file })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsCreateFile')
  async fsCreateFile(request: FsPathRequest): Promise<ShiningResult<FsOpValue>> {
    try {
      const file = resolveWithinRoot(request.root, request.path)
      await fs.writeFile(file, '', { flag: 'wx' })
      return success({ path: file })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsCreateDir')
  async fsCreateDir(request: FsPathRequest): Promise<ShiningResult<FsOpValue>> {
    try {
      const dir = resolveWithinRoot(request.root, request.path)
      await fs.mkdir(dir, { recursive: false })
      return success({ path: dir })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsRename')
  async fsRename(request: FsRenameRequest): Promise<ShiningResult<FsOpValue>> {
    try {
      const target = resolveWithinRoot(request.root, request.path)
      const next = resolveWithinRoot(request.root, join(dirname(target), request.newName))
      await fs.rename(target, next)
      return success({ path: next })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsDelete')
  async fsDelete(request: FsPathRequest): Promise<ShiningResult<FsOpValue>> {
    try {
      const target = resolveWithinRoot(request.root, request.path)
      await fs.rm(target, { recursive: true, force: false })
      return success({ path: target })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('gitStatus')
  async gitStatus(request: GitStatusRequest): Promise<ShiningResult<GitStatusValue>> {
    try {
      const repo = resolveWithinRoot(request.root, request.repoPath)
      const branch = await gitResult(repo, ['branch', '--show-current'])
      const porcelain = await gitResult(repo, ['status', '--porcelain'])
      const lines = porcelain === '' ? [] : porcelain.split('\n')
      const changes: GitChange[] = lines.map((line) => ({
        path: line.slice(3),
        status: (line[0] === '?' ? 'U' : line[0]) as GitChange['status'],
      }))
      return success({ branch, dirtyCount: lines.length, changes })
    } catch (error) {
      return failure('git-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('gitCheckout')
  async gitCheckout(request: GitBranchRequest): Promise<ShiningResult<GitOpValue>> {
    try {
      const repo = resolveWithinRoot(request.root, request.repoPath)
      return success({ output: await gitResult(repo, ['checkout', request.branch]) })
    } catch (error) {
      return failure('git-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('gitCreateBranch')
  async gitCreateBranch(request: GitCreateBranchRequest): Promise<ShiningResult<GitOpValue>> {
    try {
      const repo = resolveWithinRoot(request.root, request.repoPath)
      return success({ output: await gitResult(repo, ['checkout', '-b', request.name]) })
    } catch (error) {
      return failure('git-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('gitPull')
  async gitPull(request: GitPathRequest): Promise<ShiningResult<GitOpValue>> {
    try {
      const repo = resolveWithinRoot(request.root, request.repoPath)
      return success({ output: await gitResult(repo, ['pull']) })
    } catch (error) {
      return failure('git-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('chat')
  async chat(request: ChatRequest): Promise<ShiningResult<ChatValue>> {
    try {
      const response = await fetch(`${request.apiBase.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${request.apiKey}` },
        body: JSON.stringify({ model: request.model, messages: request.messages, stream: false }),
        signal: AbortSignal.timeout(120000),
      })
      if (!response.ok) return failure('chat-error', `upstream ${response.status}`)
      const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
      return success({ content: data.choices?.[0]?.message?.content ?? '' })
    } catch (error) {
      return failure('chat-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('qqList')
  async qqList(_request: QqListRequest): Promise<ShiningResult<QqListValue>> {
    try {
      const svc = this.ctx.shiningQq
      const sessions: QqSessionView[] = (svc?.list() ?? []).map((s) => ({ key: s.key, peerId: s.peerId, kind: s.kind, messages: s.messages, updatedAt: s.updatedAt }))
      return success({ sessions })
    } catch (error) {
      return failure('qq-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('qqRead')
  async qqRead(request: QqReadRequest): Promise<ShiningResult<QqReadValue>> {
    try {
      const svc = this.ctx.shiningQq
      const s = svc?.read(request.key)
      return success({ session: s ? { key: s.key, peerId: s.peerId, kind: s.kind, messages: s.messages, updatedAt: s.updatedAt } : undefined })
    } catch (error) {
      return failure('qq-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('qqSend')
  async qqSend(request: QqSendRequest): Promise<ShiningResult<QqSendValue>> {
    try {
      const svc = this.ctx.shiningQq
      if (!svc) return failure('qq-error', 'qq service not enabled')
      await svc.sendTo(request.key, request.content)
      return success({ ok: true })
    } catch (error) {
      return failure('qq-error', error instanceof Error ? error.message : String(error))
    }
  }
}

export default ShiningService
