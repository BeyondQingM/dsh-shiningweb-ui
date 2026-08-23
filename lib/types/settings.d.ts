/**
 * dsh-shiningweb-ui 设置命名空间与 schema（host/client 共享单一事实源）。
 * settings schema 用 @deepseek-ai/schemastery 的 `z`（不是 zod）。
 */
import s from '@deepseek-ai/schemastery';
/** Host settings 命名空间。 */
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
/** 设置 schema：wire 校验与默认值。 */
export declare const ShiningSettingsSchema: s<Schemastery.ObjectS<{
    enabled: s<boolean, boolean>;
    capabilityMode: s<"pet" | "assistant" | "super", "pet" | "assistant" | "super">;
    chat: s<Schemastery.ObjectS<{
        enabled: s<boolean, boolean>;
        personaId: s<string, string>;
        model: s<string, string>;
        apiBase: s<string, string>;
        apiKey: s<string, string>;
    }>, Schemastery.ObjectT<{
        enabled: s<boolean, boolean>;
        personaId: s<string, string>;
        model: s<string, string>;
        apiBase: s<string, string>;
        apiKey: s<string, string>;
    }>>;
    fileExplorer: s<Schemastery.ObjectS<{
        enabled: s<boolean, boolean>;
        showHidden: s<boolean, boolean>;
    }>, Schemastery.ObjectT<{
        enabled: s<boolean, boolean>;
        showHidden: s<boolean, boolean>;
    }>>;
    git: s<Schemastery.ObjectS<{
        enabled: s<boolean, boolean>;
        autoRefresh: s<"off" | "10s" | "30s" | "1m", "off" | "10s" | "30s" | "1m">;
    }>, Schemastery.ObjectT<{
        enabled: s<boolean, boolean>;
        autoRefresh: s<"off" | "10s" | "30s" | "1m", "off" | "10s" | "30s" | "1m">;
    }>>;
    visual: s<Schemastery.ObjectS<{
        themeColor: s<"galaxy-blue" | "dawn-gold" | "aurora-purple", "galaxy-blue" | "dawn-gold" | "aurora-purple">;
        glassBlur: s<number, number>;
    }>, Schemastery.ObjectT<{
        themeColor: s<"galaxy-blue" | "dawn-gold" | "aurora-purple", "galaxy-blue" | "dawn-gold" | "aurora-purple">;
        glassBlur: s<number, number>;
    }>>;
    qq: s<Schemastery.ObjectS<{
        enabled: s<boolean, boolean>;
        appId: s<string, string>;
        appSecret: s<string, string>;
        groupAllow: s<string[], string[]>;
        personaPrompt: s<string, string>;
    }>, Schemastery.ObjectT<{
        enabled: s<boolean, boolean>;
        appId: s<string, string>;
        appSecret: s<string, string>;
        groupAllow: s<string[], string[]>;
        personaPrompt: s<string, string>;
    }>>;
}>, Schemastery.ObjectT<{
    enabled: s<boolean, boolean>;
    capabilityMode: s<"pet" | "assistant" | "super", "pet" | "assistant" | "super">;
    chat: s<Schemastery.ObjectS<{
        enabled: s<boolean, boolean>;
        personaId: s<string, string>;
        model: s<string, string>;
        apiBase: s<string, string>;
        apiKey: s<string, string>;
    }>, Schemastery.ObjectT<{
        enabled: s<boolean, boolean>;
        personaId: s<string, string>;
        model: s<string, string>;
        apiBase: s<string, string>;
        apiKey: s<string, string>;
    }>>;
    fileExplorer: s<Schemastery.ObjectS<{
        enabled: s<boolean, boolean>;
        showHidden: s<boolean, boolean>;
    }>, Schemastery.ObjectT<{
        enabled: s<boolean, boolean>;
        showHidden: s<boolean, boolean>;
    }>>;
    git: s<Schemastery.ObjectS<{
        enabled: s<boolean, boolean>;
        autoRefresh: s<"off" | "10s" | "30s" | "1m", "off" | "10s" | "30s" | "1m">;
    }>, Schemastery.ObjectT<{
        enabled: s<boolean, boolean>;
        autoRefresh: s<"off" | "10s" | "30s" | "1m", "off" | "10s" | "30s" | "1m">;
    }>>;
    visual: s<Schemastery.ObjectS<{
        themeColor: s<"galaxy-blue" | "dawn-gold" | "aurora-purple", "galaxy-blue" | "dawn-gold" | "aurora-purple">;
        glassBlur: s<number, number>;
    }>, Schemastery.ObjectT<{
        themeColor: s<"galaxy-blue" | "dawn-gold" | "aurora-purple", "galaxy-blue" | "dawn-gold" | "aurora-purple">;
        glassBlur: s<number, number>;
    }>>;
    qq: s<Schemastery.ObjectS<{
        enabled: s<boolean, boolean>;
        appId: s<string, string>;
        appSecret: s<string, string>;
        groupAllow: s<string[], string[]>;
        personaPrompt: s<string, string>;
    }>, Schemastery.ObjectT<{
        enabled: s<boolean, boolean>;
        appId: s<string, string>;
        appSecret: s<string, string>;
        groupAllow: s<string[], string[]>;
        personaPrompt: s<string, string>;
    }>>;
}>>;
/** schema 校验通过的默认值。 */
export declare const DEFAULT_SHINING_SETTINGS: ShiningSettings;
