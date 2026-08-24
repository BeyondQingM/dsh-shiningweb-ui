/** 成功：直接返回裸业务值（网关统一包成 { ok: true, value }）。 */
export declare function success<T>(value: T): T;
/** 失败：抛出携带业务错误码的失败（网关统一包成 { ok: false, error }）。 */
export declare function failure(code: string, message: string): never;
/** 将客户端路径解析为绝对路径，并强制位于 root 之内（防目录穿越）。 */
export declare function resolveWithinRoot(root: string, path: string): string;
export interface FsListRequest {
    root: string;
    path: string;
    showHidden?: boolean;
}
export interface FsEntry {
    name: string;
    isDirectory: boolean;
    size: number;
}
export interface FsListValue {
    entries: FsEntry[];
}
export interface FsReadRequest {
    root: string;
    path: string;
}
export interface FsReadValue {
    content: string;
}
export interface FsWriteRequest {
    root: string;
    path: string;
    content: string;
}
export interface FsPathRequest {
    root: string;
    path: string;
}
export interface FsRenameRequest {
    root: string;
    path: string;
    newName: string;
}
export interface FsOpValue {
    path: string;
}
export interface GitStatusRequest {
    root: string;
    repoPath: string;
}
export interface GitChange {
    path: string;
    status: 'M' | 'A' | 'D' | 'U';
}
export interface GitStatusValue {
    branch: string;
    dirtyCount: number;
    changes: GitChange[];
}
export interface GitBranchRequest {
    root: string;
    repoPath: string;
    branch: string;
}
export interface GitCreateBranchRequest {
    root: string;
    repoPath: string;
    name: string;
}
export interface GitPathRequest {
    root: string;
    repoPath: string;
}
export interface GitOpValue {
    output: string;
}
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface ChatRequest {
    messages: ChatMessage[];
    model: string;
    apiBase: string;
    apiKey: string;
}
export interface ChatValue {
    content: string;
}
export interface QqMessageView {
    role: 'user' | 'assistant';
    content: string;
}
export interface QqSessionView {
    key: string;
    peerId: string;
    kind: 'group' | 'c2c';
    messages: QqMessageView[];
    updatedAt: number;
}
export interface QqListRequest {
}
export interface QqListValue {
    sessions: QqSessionView[];
}
export interface QqReadRequest {
    key: string;
}
export interface QqReadValue {
    session?: QqSessionView;
}
export interface QqSendRequest {
    key: string;
    content: string;
}
export interface QqSendValue {
    ok: boolean;
}
