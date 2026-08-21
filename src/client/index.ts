/**
 * dsh-shiningweb-ui 插件 client 半入口。
 * 槽位注册、remote 挂载、settingsScope 绑定、视觉应用由后续任务充实。
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'

/** Required services: the slot registry. */
export const inject = ['slots']

/** Client plugin body —— v0.1 占位。 */
export function apply(_ctx: ClientContext): void {}
