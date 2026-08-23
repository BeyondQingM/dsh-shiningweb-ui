import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol';
import type { ChatRequest, ChatValue, FsListRequest, FsListValue, FsPathRequest, FsOpValue, FsReadRequest, FsReadValue, FsRenameRequest, FsWriteRequest, GitBranchRequest, GitCreateBranchRequest, GitOpValue, GitPathRequest, GitStatusRequest, GitStatusValue, QqListRequest, QqListValue, QqReadRequest, QqReadValue, QqSendRequest, QqSendValue } from '../types.ts';
/** ctx.remote.shining 命名空间方法面。 */
export interface ShiningRemote {
    fsList: (request: FsListRequest) => Promise<RemoteResult<FsListValue>>;
    fsRead: (request: FsReadRequest) => Promise<RemoteResult<FsReadValue>>;
    fsWrite: (request: FsWriteRequest) => Promise<RemoteResult<FsOpValue>>;
    fsCreateFile: (request: FsPathRequest) => Promise<RemoteResult<FsOpValue>>;
    fsCreateDir: (request: FsPathRequest) => Promise<RemoteResult<FsOpValue>>;
    fsRename: (request: FsRenameRequest) => Promise<RemoteResult<FsOpValue>>;
    fsDelete: (request: FsPathRequest) => Promise<RemoteResult<FsOpValue>>;
    gitStatus: (request: GitStatusRequest) => Promise<RemoteResult<GitStatusValue>>;
    gitCheckout: (request: GitBranchRequest) => Promise<RemoteResult<GitOpValue>>;
    gitCreateBranch: (request: GitCreateBranchRequest) => Promise<RemoteResult<GitOpValue>>;
    gitPull: (request: GitPathRequest) => Promise<RemoteResult<GitOpValue>>;
    chat: (request: ChatRequest) => Promise<RemoteResult<ChatValue>>;
    qqList: (request: QqListRequest) => Promise<RemoteResult<QqListValue>>;
    qqRead: (request: QqReadRequest) => Promise<RemoteResult<QqReadValue>>;
    qqSend: (request: QqSendRequest) => Promise<RemoteResult<QqSendValue>>;
}
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface TypertRemoteNamespaceMap {
        /** 本插件 Remote 命名空间。 */
        shining: ShiningRemote;
    }
}
/** apply 挂载 remote 后绑定实例（mount 失败时 undefined，组件优雅降级）。 */
export declare function setShiningRemote(r: ShiningRemote | undefined): void;
/** 组件读取当前 remote 实例（apply 后即稳定）。 */
export declare function getShiningRemote(): ShiningRemote | undefined;
/** 响应式读 remote 实例（apply 挂载后变化一次，供组件订阅避免初渲染读到 undefined）。 */
export declare function useShiningRemote(): ShiningRemote | undefined;
