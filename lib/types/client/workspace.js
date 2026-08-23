/** 当前工作区根路径 + 打开文件回调（apply 订阅 workspaces 列表设置）。 */
import { useSyncExternalStore } from 'react';
let root = '';
const rootListeners = new Set();
let openPathFn;
function notifyRoot() {
    for (const l of rootListeners)
        l();
}
export function setWorkspaceRoot(r) {
    if (r === root)
        return;
    root = r;
    notifyRoot();
}
export function getWorkspaceRoot() { return root; }
/** 响应式读工作区根路径（变化时触发组件重渲染，供 GitManager 等订阅）。 */
export function useWorkspaceRoot() {
    return useSyncExternalStore((l) => { rootListeners.add(l); return () => { rootListeners.delete(l); }; }, () => root);
}
export function setOpenPath(fn) { openPathFn = fn; }
export function getOpenPath() { return openPathFn; }
