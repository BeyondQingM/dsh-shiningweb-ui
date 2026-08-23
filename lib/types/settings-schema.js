/**
 * dsh-shiningweb-ui 宿主侧设置 schema（schemastery）。
 * 与 client 共享的类型/默认值在 settings.ts；此处仅宿主端注册 schema 时引入 schemastery，
 * 避免 client bundle 打包 schemastery。
 */
import s from '@deepseek-ai/schemastery';
/** 设置 schema：wire 校验与默认值。 */
export const ShiningSettingsSchema = s.object({
    enabled: s.boolean().default(true),
    capabilityMode: s.union([s.const('pet'), s.const('assistant'), s.const('super')]).default('pet'),
    chat: s.object({
        enabled: s.boolean().default(true),
        personaId: s.string().default(''),
        model: s.string().default('deepseek-chat'),
        apiBase: s.string().default('https://api.deepseek.com'),
        apiKey: s.string().default(''),
    }).default({ enabled: true, personaId: '', model: 'deepseek-chat', apiBase: 'https://api.deepseek.com', apiKey: '' }),
    fileExplorer: s.object({
        enabled: s.boolean().default(true),
        showHidden: s.boolean().default(false),
    }).default({ enabled: true, showHidden: false }),
    git: s.object({
        enabled: s.boolean().default(true),
        autoRefresh: s.union([s.const('off'), s.const('10s'), s.const('30s'), s.const('1m')]).default('off'),
    }).default({ enabled: true, autoRefresh: 'off' }),
    visual: s.object({
        themeColor: s.union([s.const('galaxy-blue'), s.const('dawn-gold'), s.const('aurora-purple')]).default('galaxy-blue'),
        glassBlur: s.number().min(0).max(24).default(12),
    }).default({ themeColor: 'galaxy-blue', glassBlur: 12 }),
    qq: s.object({
        enabled: s.boolean().default(false),
        appId: s.string().default(''),
        appSecret: s.string().default(''),
        groupAllow: s.array(s.string()).default([]),
        personaPrompt: s.string().default('你是天圆地方，一位温柔而能干的助理。请用简洁、亲切的中文回答。'),
    }).default({
        enabled: false, appId: '', appSecret: '', groupAllow: [],
        personaPrompt: '你是天圆地方，一位温柔而能干的助理。请用简洁、亲切的中文回答。',
    }),
});
