/**
 * dsh-shiningweb-ui 宿主侧设置 schema（schemastery）。
 * 与 client 共享的类型/默认值在 settings.ts；此处仅宿主端注册 schema 时引入 schemastery，
 * 避免 client bundle 打包 schemastery。
 */
import s from '@deepseek-ai/schemastery';
import type { ShiningSettings } from './settings.ts';
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
export type { ShiningSettings };
