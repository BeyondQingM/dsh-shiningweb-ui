/**
 * dsh-shiningweb-ui 网关业务类型与成功/失败辅助。
 * 单个 request 对象参数；host 方法返回“裸业务值”，失败时抛出携带业务码的错误。
 * 成功/失败的 { ok, value } / { ok: false, error } 包装由 Typert 网关统一完成，
 * 这里不再自行包裹，避免与网关形成双重包裹（导致客户端拿到 { ok, value: { ok, value } }）。
 */
import { resolve, sep } from 'node:path';
import { RemoteError } from '@deepseek-ai/dsh-typert-protocol';
/** 成功：直接返回裸业务值（网关统一包成 { ok: true, value }）。 */
export function success(value) {
    return value;
}
/** 失败：抛出携带业务错误码的失败（网关统一包成 { ok: false, error }）。 */
export function failure(code, message) {
    throw new RemoteError(code, message, {});
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
