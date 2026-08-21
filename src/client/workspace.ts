/** 当前工作区根路径 + 打开文件回调（apply 订阅 workspaces 列表设置）。 */
let root = ''
let openPathFn: ((path: string) => void) | undefined

export function setWorkspaceRoot(r: string): void { root = r }
export function getWorkspaceRoot(): string { return root }

export function setOpenPath(fn: (path: string) => void): void { openPathFn = fn }
export function getOpenPath(): ((path: string) => void) | undefined { return openPathFn }
