/**
 * ctx.remote.shining 的客户端类型面 + 实例绑定。
 * 网关 $mount 后 ctx.remote.shining 即存在；此处声明其命名空间形状与访问器。
 */
import { useSyncExternalStore } from 'react';
let shiningRemote;
const remoteListeners = new Set();
/** apply 挂载 remote 后绑定实例（mount 失败时 undefined，组件优雅降级）。 */
export function setShiningRemote(r) {
    shiningRemote = r;
    for (const l of remoteListeners)
        l();
}
/** 组件读取当前 remote 实例（apply 后即稳定）。 */
export function getShiningRemote() { return shiningRemote; }
/** 响应式读 remote 实例（apply 挂载后变化一次，供组件订阅避免初渲染读到 undefined）。 */
export function useShiningRemote() {
    return useSyncExternalStore((l) => { remoteListeners.add(l); return () => { remoteListeners.delete(l); }; }, () => shiningRemote);
}
