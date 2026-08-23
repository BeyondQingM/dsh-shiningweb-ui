/** 当前工作区根路径 + 打开文件回调（apply 订阅 workspaces 列表设置）。 */
let root = '';
let openPathFn;
export function setWorkspaceRoot(r) { root = r; }
export function getWorkspaceRoot() { return root; }
export function setOpenPath(fn) { openPathFn = fn; }
export function getOpenPath() { return openPathFn; }
