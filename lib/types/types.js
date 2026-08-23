/**
 * dsh-shiningweb-ui 网关业务类型与成功/失败辅助。
 * 单个 request 对象参数，返回 ShiningResult 业务联合。
 */
import { resolve, sep } from 'node:path';
/** 成功分支。 */
export function success(value) {
    return Object.freeze({ ok: true, value });
}
/** 失败分支。 */
export function failure(code, message, extra = {}) {
    return Object.freeze({ ok: false, error: Object.freeze({ code, message, ...extra }) });
}
/** 将客户端路径解析为绝对路径，并强制位于 root 之内（防目录穿越）。 */
export function resolveWithinRoot(root, path) {
    const rootAbs = resolve(root);
    const target = resolve(rootAbs, path);
    if (target !== rootAbs && !target.startsWith(rootAbs + sep)) {
        throw new Error(`path-root-escape: ${target} is outside ${rootAbs}`);
    }
    return target;
}
