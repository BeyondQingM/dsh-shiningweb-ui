export declare function setWorkspaceRoot(r: string): void;
export declare function getWorkspaceRoot(): string;
/** 响应式读工作区根路径（变化时触发组件重渲染，供 GitManager 等订阅）。 */
export declare function useWorkspaceRoot(): string;
export declare function setOpenPath(fn: (path: string) => void): void;
export declare function getOpenPath(): ((path: string) => void) | undefined;
