/** 最小结构面：与 `ctx.workspaces.list.getSnapshot()` 的 WorkspaceListState 兼容。 */
export interface WorkspacePathEntry {
    workspaceId?: string;
    path: string;
}
export interface WorkspaceListShape {
    items?: readonly WorkspacePathEntry[];
    recentWorkspaceId?: string | undefined;
}
/**
 * 解析“当前”工作区根路径：优先 most-recently-active 工作区（recentWorkspaceId），
 * 缺失或未命中时回退到列表首项。避免多工作区时把 items[0]（显示顺序首项）
 * 当成当前仓库，导致 Git 分支读到错误仓库。
 */
export declare function resolveCurrentWorkspaceRoot(state: WorkspaceListShape | undefined): string;
export declare function setWorkspaceRoot(r: string): void;
export declare function getWorkspaceRoot(): string;
/** 响应式读工作区根路径（变化时触发组件重渲染，供 GitManager 等订阅）。 */
export declare function useWorkspaceRoot(): string;
export declare function setOpenPath(fn: (path: string) => void): void;
export declare function getOpenPath(): ((path: string) => void) | undefined;
