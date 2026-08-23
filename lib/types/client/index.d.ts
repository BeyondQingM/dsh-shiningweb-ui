/**
 * dsh-shiningweb-ui 插件 client 半入口。
 * apply：注册字典、挂载 shinining Remote、绑定 settingsScope、应用视觉。
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required services。不注入 'remote.shining'（我们自己在 apply 里挂载，声明为依赖会死锁）。 */
export declare const inject: string[];
/** Client plugin body。 */
export declare function apply(ctx: ClientContext): Promise<void>;
