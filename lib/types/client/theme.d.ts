/**
 * 璀璨星河全套 GUI 换肤：基于 DSH 官方主题 token 覆盖层（ctx.theme.overrideTokens）。
 * 每个 token 同时提供 light/dark 两套值，DSH 明暗切换时自动适配；
 * 'follow' = 跟随 DSH：移除覆盖层，还原原生观感。
 * token 名与取值语义来自官方 ui-theme（--dsw-alias-* / --dsw-specific-*）。
 */
import type { ThemeColor } from '../settings.ts';
/** 官方 token 覆盖值：light/dark 双档必填（保证另一模式下依旧可读）。 */
export interface TokenModes {
    light: string;
    dark: string;
}
/** token 全名 → light/dark 值对。 */
export type ThemeTokenMap = Record<string, TokenModes>;
/** 覆盖层身份（同 source 重复调用 = 替换该层）。 */
export declare const THEME_SOURCE = "dsh-shiningweb-ui";
/** 官方 theme 服务最小结构面（避免引入包级类型依赖）。 */
export interface ShiningThemeService {
    overrideTokens(source: string, tokens: ThemeTokenMap): () => void;
}
/**
 * 生成某主题的官方 token 覆盖映射；
 * 'follow' 返回空映射（表示移除覆盖层、还原 DSH 原生外观）。
 */
export declare function buildTokenOverrides(themeColor: ThemeColor): ThemeTokenMap;
export interface ThemeOverrideController {
    /** 应用/切换主题；'follow' 移除覆盖层。同一主题重复调用为幂等。 */
    apply(themeColor: ThemeColor): void;
    /** 移除覆盖层（插件卸载时调用）。 */
    dispose(): void;
}
/**
 * 创建覆盖层控制器：内部持有一个覆盖层，
 * 切换主题 = 释放旧层 + 以同一 source 注册新层；
 * 'follow' = 仅释放；服务缺失时所有操作安全跳过。
 */
export declare function createThemeOverrideController(theme: ShiningThemeService | undefined): ThemeOverrideController;
/** 从 client ctx 读取官方 theme 服务（缺失返回 undefined，调用方优雅降级）。 */
export declare function getThemeService(ctx: unknown): ShiningThemeService | undefined;
