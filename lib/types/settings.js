/**
 * dsh-shiningweb-ui 设置类型与默认值（host/client 共享，不含 schemastery）。
 * 此模块**不** import schemastery（那是宿主侧 schema 的事，见 settings-schema.ts）：
 * client bundle 会打包它，而 client 只需类型+默认值，不需要 schema。
 */
export const SETTINGS_NAMESPACE = 'shining';
/** schema 校验通过的默认值。 */
export const DEFAULT_SHINING_SETTINGS = {
    enabled: true,
    capabilityMode: 'pet',
    chat: { enabled: true, personaId: '', model: 'deepseek-chat', apiBase: 'https://api.deepseek.com', apiKey: '' },
    fileExplorer: { enabled: true, showHidden: false },
    git: { enabled: true, autoRefresh: 'off' },
    visual: { themeColor: 'galaxy-blue', glassBlur: 12 },
    qq: {
        enabled: false, appId: '', appSecret: '', groupAllow: [],
        personaPrompt: '你是天圆地方，一位温柔而能干的助理。请用简洁、亲切的中文回答。',
    },
};
