/**
 * dsh-shiningweb-ui 设置类型与默认值（host/client 共享，不含 schemastery）。
 * 此模块**不** import schemastery（那是宿主侧 schema 的事，见 settings-schema.ts）：
 * client bundle 会打包它，而 client 只需类型+默认值，不需要 schema。
 */
export declare const SETTINGS_NAMESPACE = "shining";
export type ThemeColor = 'galaxy-blue' | 'dawn-gold' | 'aurora-purple';
export type GitAutoRefresh = 'off' | '10s' | '30s' | '1m';
/** 分级能力模式：pet（默认）/ assistant / super。 */
export type CapabilityMode = 'pet' | 'assistant' | 'super';
/** 设置文档的可持久化形态。 */
export interface ShiningSettings {
    enabled: boolean;
    capabilityMode: CapabilityMode;
    chat: {
        enabled: boolean;
        personaId: string;
        model: string;
        apiBase: string;
        apiKey: string;
    };
    fileExplorer: {
        enabled: boolean;
        showHidden: boolean;
    };
    git: {
        enabled: boolean;
        autoRefresh: GitAutoRefresh;
    };
    visual: {
        themeColor: ThemeColor;
        glassBlur: number;
    };
    qq: {
        enabled: boolean;
        appId: string;
        appSecret: string;
        groupAllow: string[];
        personaPrompt: string;
    };
}
/** schema 校验通过的默认值。 */
export declare const DEFAULT_SHINING_SETTINGS: ShiningSettings;
