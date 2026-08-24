import { Context } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { ChatRequest, ChatValue, FsListRequest, FsListValue, FsOpValue, FsPathRequest, FsReadRequest, FsReadValue, FsRenameRequest, FsWriteRequest, GitBranchRequest, GitCreateBranchRequest, GitOpValue, GitPathRequest, GitStatusRequest, GitStatusValue, QqListRequest, QqListValue, QqReadRequest, QqReadValue, QqSendRequest, QqSendValue } from './types.ts';
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
    fsList(request: FsListRequest): Promise<FsListValue>;
    fsRead(request: FsReadRequest): Promise<FsReadValue>;
    fsWrite(request: FsWriteRequest): Promise<FsOpValue>;
    fsCreateFile(request: FsPathRequest): Promise<FsOpValue>;
    fsCreateDir(request: FsPathRequest): Promise<FsOpValue>;
    fsRename(request: FsRenameRequest): Promise<FsOpValue>;
    fsDelete(request: FsPathRequest): Promise<FsOpValue>;
    gitStatus(request: GitStatusRequest): Promise<GitStatusValue>;
    gitCheckout(request: GitBranchRequest): Promise<GitOpValue>;
    gitCreateBranch(request: GitCreateBranchRequest): Promise<GitOpValue>;
    gitPull(request: GitPathRequest): Promise<GitOpValue>;
    chat(request: ChatRequest): Promise<ChatValue>;
    qqList(_request: QqListRequest): Promise<QqListValue>;
    qqRead(request: QqReadRequest): Promise<QqReadValue>;
    qqSend(request: QqSendRequest): Promise<QqSendValue>;
}
export default ShiningService;
