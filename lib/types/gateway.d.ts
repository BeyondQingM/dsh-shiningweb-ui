import { Context } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { ChatRequest, ChatValue, FsListRequest, FsListValue, FsOpValue, FsPathRequest, FsReadRequest, FsReadValue, FsRenameRequest, FsWriteRequest, GitBranchRequest, GitCreateBranchRequest, GitOpValue, GitPathRequest, GitStatusRequest, GitStatusValue, QqListRequest, QqListValue, QqReadRequest, QqReadValue, QqSendRequest, QqSendValue, ShiningResult } from './types.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** QQ 会话层服务（qq 未启用时 optional）。 */
        shiningQq?: import('./qq.ts').ShiningQqService | undefined;
    }
}
export interface Config {
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** 网关服务：命名空间 `shining` 的 Remote 方法。 */
        shining: ShiningService;
    }
}
/** ShiningService：host 侧 Remote 网关。 */
export declare class ShiningService extends TypertRemoteService {
    static inject: string[];
    static Config: s<Config>;
    constructor(ctx: Context, _config: Config);
    fsList(request: FsListRequest): Promise<ShiningResult<FsListValue>>;
    fsRead(request: FsReadRequest): Promise<ShiningResult<FsReadValue>>;
    fsWrite(request: FsWriteRequest): Promise<ShiningResult<FsOpValue>>;
    fsCreateFile(request: FsPathRequest): Promise<ShiningResult<FsOpValue>>;
    fsCreateDir(request: FsPathRequest): Promise<ShiningResult<FsOpValue>>;
    fsRename(request: FsRenameRequest): Promise<ShiningResult<FsOpValue>>;
    fsDelete(request: FsPathRequest): Promise<ShiningResult<FsOpValue>>;
    gitStatus(request: GitStatusRequest): Promise<ShiningResult<GitStatusValue>>;
    gitCheckout(request: GitBranchRequest): Promise<ShiningResult<GitOpValue>>;
    gitCreateBranch(request: GitCreateBranchRequest): Promise<ShiningResult<GitOpValue>>;
    gitPull(request: GitPathRequest): Promise<ShiningResult<GitOpValue>>;
    chat(request: ChatRequest): Promise<ShiningResult<ChatValue>>;
    qqList(_request: QqListRequest): Promise<ShiningResult<QqListValue>>;
    qqRead(request: QqReadRequest): Promise<ShiningResult<QqReadValue>>;
    qqSend(request: QqSendRequest): Promise<ShiningResult<QqSendValue>>;
}
export default ShiningService;
