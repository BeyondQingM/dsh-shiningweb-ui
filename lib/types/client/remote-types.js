let shiningRemote;
/** apply 挂载 remote 后绑定实例。 */
export function setShiningRemote(r) { shiningRemote = r; }
/** 组件读取当前 remote 实例（apply 后即稳定）。 */
export function getShiningRemote() { return shiningRemote; }
