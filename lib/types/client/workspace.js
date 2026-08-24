/** 当前工作区根路径 + 打开文件回调（apply 订阅 workspaces 列表设置）。 */
import { useSyncExternalStore } from 'react';
/**
 * 解析“当前”工作区根路径：优先 most-recently-active 工作区（recentWorkspaceId），
 * 缺失或未命中时回退到列表首项。避免多工作区时把 items[0]（显示顺序首项）
 * 当成当前仓库，导致 Git 分支读到错误仓库。
 */
export function resolveCurrentWorkspaceRoot(state) {
    const items = state?.items ?? [];
    const recent = state?.recentWorkspaceId;
    if (recent) {
        const found = items.find((w) => w.workspaceId === recent);
        if (found)
            return found.path;
    }
    return items[0]?.path ?? '';
}
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
