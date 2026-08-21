/**
 * dsh-shiningweb-ui 网关：ShiningService（Typert Remote 命名空间 `shining`）。
 * fs 方法（node:fs/promises）；git/chat 方法见 Task 4。
 */
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { Context, Service } from '@deepseek-ai/cordis'
import s from '@deepseek-ai/schemastery'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type {
  FsEntry, FsListRequest, FsListValue, FsOpValue, FsPathRequest, FsReadRequest,
  FsReadValue, FsRenameRequest, FsWriteRequest, ShiningResult,
} from './types.ts'
import { failure, resolveWithinRoot, success } from './types.ts'

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
}

export default ShiningService
