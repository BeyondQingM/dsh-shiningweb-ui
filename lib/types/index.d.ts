/**
 * dsh-shiningweb-ui 插件 host 半入口。
 * 提供 ShiningService 网关（命名空间 `shining`），注册 `shining` settings 命名空间，
 * 并在 qq 启用时启动天圆地方 QQ 会话层（ShiningQqService）。
 */
import type { Context } from '@deepseek-ai/cordis';
import { ShiningService } from './gateway.ts';
export { ShiningService } from './gateway.ts';
export default ShiningService;
/** Compatibility entry for hosts that load the module as a Cordis plugin. */
export declare function apply(ctx: Context): void;
