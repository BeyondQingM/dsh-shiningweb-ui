/**
 * ctx.remote.shining 的客户端类型面 + 实例绑定。
 * 网关 $mount 后 ctx.remote.shining 即存在；此处声明其命名空间形状与访问器。
 */
import { useSyncExternalStore } from 'react'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import type {
  ChatRequest, ChatValue, FsListRequest, FsListValue, FsPathRequest, FsOpValue,
  FsReadRequest, FsReadValue, FsRenameRequest, FsWriteRequest, GitBranchRequest,
  GitCreateBranchRequest, GitOpValue, GitPathRequest, GitStatusRequest, GitStatusValue,
  QqListRequest, QqListValue, QqReadRequest, QqReadValue, QqSendRequest, QqSendValue,
} from '../types.ts'

/** ctx.remote.shining 命名空间方法面。 */
export interface ShiningRemote {
  fsList: (request: FsListRequest) => Promise<RemoteResult<FsListValue>>
  fsRead: (request: FsReadRequest) => Promise<RemoteResult<FsReadValue>>
  fsWrite: (request: FsWriteRequest) => Promise<RemoteResult<FsOpValue>>
  fsCreateFile: (request: FsPathRequest) => Promise<RemoteResult<FsOpValue>>
  fsCreateDir: (request: FsPathRequest) => Promise<RemoteResult<FsOpValue>>
  fsRename: (request: FsRenameRequest) => Promise<RemoteResult<FsOpValue>>
  fsDelete: (request: FsPathRequest) => Promise<RemoteResult<FsOpValue>>
  gitStatus: (request: GitStatusRequest) => Promise<RemoteResult<GitStatusValue>>
  gitCheckout: (request: GitBranchRequest) => Promise<RemoteResult<GitOpValue>>
  gitCreateBranch: (request: GitCreateBranchRequest) => Promise<RemoteResult<GitOpValue>>
  gitPull: (request: GitPathRequest) => Promise<RemoteResult<GitOpValue>>
  chat: (request: ChatRequest) => Promise<RemoteResult<ChatValue>>
  qqList: (request: QqListRequest) => Promise<RemoteResult<QqListValue>>
  qqRead: (request: QqReadRequest) => Promise<RemoteResult<QqReadValue>>
  qqSend: (request: QqSendRequest) => Promise<RemoteResult<QqSendValue>>
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespaceMap {
    /** 本插件 Remote 命名空间。 */
    shining: ShiningRemote
  }
}

let shiningRemote: ShiningRemote | undefined
const remoteListeners = new Set<() => void>()

/** apply 挂载 remote 后绑定实例（mount 失败时 undefined，组件优雅降级）。 */
export function setShiningRemote(r: ShiningRemote | undefined): void {
  shiningRemote = r
  for (const l of remoteListeners) l()
}

/** 组件读取当前 remote 实例（apply 后即稳定）。 */
export function getShiningRemote(): ShiningRemote | undefined { return shiningRemote }

/** 响应式读 remote 实例（apply 挂载后变化一次，供组件订阅避免初渲染读到 undefined）。 */
export function useShiningRemote(): ShiningRemote | undefined {
  return useSyncExternalStore(
    (l) => { remoteListeners.add(l); return () => { remoteListeners.delete(l) } },
    () => shiningRemote,
  )
}
