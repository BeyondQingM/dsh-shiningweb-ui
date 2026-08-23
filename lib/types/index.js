import { settingsNamespace } from '@deepseek-ai/dsh-settings';
import { ShiningService } from "./gateway.js";
import { createQqAdapter, createQqModelCall, ShiningQqService } from "./qq.js";
import { SETTINGS_NAMESPACE, ShiningSettingsSchema } from "./settings.js";
export { ShiningService } from "./gateway.js";
export default ShiningService;
/** Host plugin body：提供网关 + 注册 settings 命名空间 + 可选 QQ 会话层。 */
export function apply(ctx) {
    new ShiningService(ctx, {});
    ctx.inject(['settings'], (settingsCtx) => {
        settingsCtx.settings.register(settingsNamespace(SETTINGS_NAMESPACE), ShiningSettingsSchema);
        // 读天圆地方 settings（含 qq/chat/独立模型配置）。
        const readSettings = () => settingsCtx.settings.get(settingsNamespace(SETTINGS_NAMESPACE)) ?? {
            enabled: true, capabilityMode: 'pet',
            chat: { enabled: true, personaId: '', model: 'deepseek-chat', apiBase: 'https://api.deepseek.com', apiKey: '' },
            fileExplorer: { enabled: true, showHidden: false },
            git: { enabled: true, autoRefresh: 'off' },
            visual: { themeColor: 'galaxy-blue', glassBlur: 12 },
            qq: { enabled: false, appId: '', appSecret: '', groupAllow: [], personaPrompt: '' },
        };
        // qq 启用且已配置凭据时启动 QQ 会话层（connector 缺失则优雅跳过）。
        void (async () => {
            const s = readSettings();
            if (!s.qq?.enabled || !s.qq.appId || !s.qq.appSecret)
                return;
            try {
                const adapter = await createQqAdapter(s.qq.appId, s.qq.appSecret);
                const svc = new ShiningQqService(adapter, createQqModelCall(), readSettings);
                ctx.provide('shiningQq', svc);
                ctx.effect(() => () => svc.dispose(), 'shining: qq lifecycle');
            }
            catch { /* 连接器不可用则跳过 QQ */ }
        })();
    });
}
