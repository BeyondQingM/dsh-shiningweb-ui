/**
 * 璀璨星河全套 GUI 换肤：基于 DSH 官方主题 token 覆盖层（ctx.theme.overrideTokens）。
 * 每个 token 同时提供 light/dark 两套值，DSH 明暗切换时自动适配；
 * 'follow' = 跟随 DSH：移除覆盖层，还原原生观感。
 * token 名与取值语义来自官方 ui-theme（--dsw-alias-* / --dsw-specific-*）。
 */
import type { ThemeColor } from '../settings.ts'

/** 官方 token 覆盖值：light/dark 双档必填（保证另一模式下依旧可读）。 */
export interface TokenModes {
  light: string
  dark: string
}

/** token 全名 → light/dark 值对。 */
export type ThemeTokenMap = Record<string, TokenModes>

/** 覆盖层身份（同 source 重复调用 = 替换该层）。 */
export const THEME_SOURCE = 'dsh-shiningweb-ui'

/** 官方 theme 服务最小结构面（避免引入包级类型依赖）。 */
export interface ShiningThemeService {
  overrideTokens(source: string, tokens: ThemeTokenMap): () => void
}

/** 单主题语义色板：短字段 → light/dark 值对。 */
interface ThemePalette {
  bgBase: TokenModes
  bgLayer1: TokenModes
  bgLayer2: TokenModes
  bgOverlay: TokenModes
  bgModule: TokenModes
  labelPrimary: TokenModes
  labelSecondary: TokenModes
  labelTertiary: TokenModes
  labelCaption: TokenModes
  labelDimmed: TokenModes
  borderL1: TokenModes
  borderL2: TokenModes
  borderL3: TokenModes
  borderL4: TokenModes
  brandPrimary: TokenModes
  brandText: TokenModes
  brandInvert: TokenModes
  buttonFill: TokenModes
  buttonHover: TokenModes
  buttonDimmed: TokenModes
  buttonContrast: TokenModes
  ghostActiveBorder: TokenModes
  ghostActiveFill: TokenModes
  ghostActiveHover: TokenModes
  interactiveHover: TokenModes
  interactiveActive: TokenModes
  interactiveAccent: TokenModes
  sidebarFill: TokenModes
  navActive: TokenModes
  navActiveAccent: TokenModes
  navHover: TokenModes
  inputMajor: TokenModes
  menu: TokenModes
  selector: TokenModes
  bubble: TokenModes
  bubbleHighlight: TokenModes
  scrollbarBg: TokenModes
  scrollbarHover: TokenModes
  tip: TokenModes
}

/** 短字段 → 官方 token 全名。 */
const TOKEN_FIELDS: Record<keyof ThemePalette, string> = {
  bgBase: '--dsw-alias-bg-base',
  bgLayer1: '--dsw-alias-bg-layer-1',
  bgLayer2: '--dsw-alias-bg-layer-2',
  bgOverlay: '--dsw-alias-bg-overlay',
  bgModule: '--dsw-alias-bg-module-platform',
  labelPrimary: '--dsw-alias-label-primary',
  labelSecondary: '--dsw-alias-label-secondary',
  labelTertiary: '--dsw-alias-label-tertiary',
  labelCaption: '--dsw-alias-label-caption',
  labelDimmed: '--dsw-alias-label-dimmed',
  borderL1: '--dsw-alias-border-l1',
  borderL2: '--dsw-alias-border-l2',
  borderL3: '--dsw-alias-border-l3',
  borderL4: '--dsw-alias-border-l4',
  brandPrimary: '--dsw-alias-brand-primary',
  brandText: '--dsw-alias-brand-text',
  brandInvert: '--dsw-alias-brand-primary-invert',
  buttonFill: '--dsw-alias-button-primary-fill',
  buttonHover: '--dsw-alias-button-primary-hover',
  buttonDimmed: '--dsw-alias-button-primary-dimmed',
  buttonContrast: '--dsw-alias-button-contrast-fill',
  ghostActiveBorder: '--dsw-alias-button-ghost-active-border',
  ghostActiveFill: '--dsw-alias-button-ghost-active-fill',
  ghostActiveHover: '--dsw-alias-button-ghost-active-hover',
  interactiveHover: '--dsw-alias-interactive-bg-hover',
  interactiveActive: '--dsw-alias-interactive-bg-active',
  interactiveAccent: '--dsw-alias-interactive-bg-hover-accent',
  sidebarFill: '--dsw-specific-sidebar-fill',
  navActive: '--dsw-specific-sidebar-nav-item-active',
  navActiveAccent: '--dsw-specific-sidebar-nav-item-active-accent',
  navHover: '--dsw-specific-sidebar-nav-item-hover',
  inputMajor: '--dsw-specific-input-major',
  menu: '--dsw-specific-menu',
  selector: '--dsw-specific-selector',
  bubble: '--dsw-specific-bubble',
  bubbleHighlight: '--dsw-specific-bubble-highlight',
  scrollbarBg: '--dsw-alias-scrollbar-bg-l1',
  scrollbarHover: '--dsw-alias-scrollbar-hover-l1',
  tip: '--dsw-specific-tip',
}

/** 星河蓝：深空蓝黑 + 蓝白星光。 */
const GALAXY_BLUE: ThemePalette = {
  bgBase: { light: '#f3f6ff', dark: '#0b1020' },
  bgLayer1: { light: '#ffffff', dark: '#101830' },
  bgLayer2: { light: '#eef3ff', dark: '#141d3a' },
  bgOverlay: { light: '#ffffff', dark: '#182246' },
  bgModule: { light: '#f6f8ff', dark: '#1a2444' },
  labelPrimary: { light: '#17203a', dark: '#e8eeff' },
  labelSecondary: { light: '#4a5674', dark: '#aab6d8' },
  labelTertiary: { light: '#8a94ad', dark: '#7c89ad' },
  labelCaption: { light: '#9aa3ba', dark: '#6b7899' },
  labelDimmed: { light: 'rgba(23,32,58,0.4)', dark: 'rgba(232,238,255,0.4)' },
  borderL1: { light: 'rgba(63,102,230,0.14)', dark: 'rgba(122,160,255,0.14)' },
  borderL2: { light: 'rgba(63,102,230,0.22)', dark: 'rgba(122,160,255,0.24)' },
  borderL3: { light: 'rgba(63,102,230,0.32)', dark: 'rgba(122,160,255,0.36)' },
  borderL4: { light: 'rgba(63,102,230,0.45)', dark: 'rgba(122,160,255,0.5)' },
  brandPrimary: { light: '#3f66e6', dark: '#4f7cff' },
  brandText: { light: '#ffffff', dark: '#ffffff' },
  brandInvert: { light: '#f3f6ff', dark: '#0b1020' },
  buttonFill: { light: '#3f66e6', dark: '#4f7cff' },
  buttonHover: { light: '#557aef', dark: '#6b90ff' },
  buttonDimmed: { light: 'rgba(63,102,230,0.5)', dark: 'rgba(79,124,255,0.5)' },
  buttonContrast: { light: '#ffffff', dark: '#1a2444' },
  ghostActiveBorder: { light: 'rgba(63,102,230,0.5)', dark: 'rgba(122,160,255,0.6)' },
  ghostActiveFill: { light: 'rgba(63,102,230,0.16)', dark: 'rgba(79,124,255,0.26)' },
  ghostActiveHover: { light: 'rgba(63,102,230,0.10)', dark: 'rgba(79,124,255,0.14)' },
  interactiveHover: { light: 'rgba(63,102,230,0.10)', dark: 'rgba(79,124,255,0.14)' },
  interactiveActive: { light: 'rgba(63,102,230,0.18)', dark: 'rgba(79,124,255,0.26)' },
  interactiveAccent: { light: 'rgba(63,102,230,0.14)', dark: 'rgba(122,160,255,0.18)' },
  sidebarFill: { light: '#e9eeff', dark: '#0d1326' },
  navActive: { light: 'rgba(63,102,230,0.14)', dark: 'rgba(79,124,255,0.24)' },
  navActiveAccent: { light: '#3f66e6', dark: '#7aa0ff' },
  navHover: { light: 'rgba(63,102,230,0.08)', dark: 'rgba(79,124,255,0.12)' },
  inputMajor: { light: '#ffffff', dark: '#131c38' },
  menu: { light: '#ffffff', dark: '#1a2444' },
  selector: { light: '#ffffff', dark: '#1a2444' },
  bubble: { light: '#eef3ff', dark: '#1c2750' },
  bubbleHighlight: { light: 'rgba(63,102,230,0.12)', dark: 'rgba(122,160,255,0.18)' },
  scrollbarBg: { light: 'rgba(63,102,230,0.25)', dark: 'rgba(122,160,255,0.22)' },
  scrollbarHover: { light: 'rgba(63,102,230,0.45)', dark: 'rgba(122,160,255,0.45)' },
  tip: { light: 'rgba(63,102,230,0.08)', dark: 'rgba(79,124,255,0.12)' },
}

/** 晨曦金：暖夜金棕 + 晨光。 */
const DAWN_GOLD: ThemePalette = {
  bgBase: { light: '#fbf6ea', dark: '#171106' },
  bgLayer1: { light: '#fffdf6', dark: '#1e1709' },
  bgLayer2: { light: '#faf3e0', dark: '#261d0c' },
  bgOverlay: { light: '#fffdf6', dark: '#2b210e' },
  bgModule: { light: '#faf4e4', dark: '#2b210e' },
  labelPrimary: { light: '#2a2010', dark: '#f7edd8' },
  labelSecondary: { light: '#6b5c3e', dark: '#d8c8a4' },
  labelTertiary: { light: '#9c8c6a', dark: '#a89877' },
  labelCaption: { light: '#b3a583', dark: '#8d7f60' },
  labelDimmed: { light: 'rgba(42,32,16,0.4)', dark: 'rgba(247,237,216,0.4)' },
  borderL1: { light: 'rgba(185,127,30,0.16)', dark: 'rgba(242,197,107,0.14)' },
  borderL2: { light: 'rgba(185,127,30,0.26)', dark: 'rgba(242,197,107,0.24)' },
  borderL3: { light: 'rgba(185,127,30,0.36)', dark: 'rgba(242,197,107,0.36)' },
  borderL4: { light: 'rgba(185,127,30,0.5)', dark: 'rgba(242,197,107,0.5)' },
  brandPrimary: { light: '#b97f1e', dark: '#e0a43b' },
  brandText: { light: '#ffffff', dark: '#1c1506' },
  brandInvert: { light: '#fbf6ea', dark: '#171106' },
  buttonFill: { light: '#d29526', dark: '#e0a43b' },
  buttonHover: { light: '#e0a43b', dark: '#f2c56b' },
  buttonDimmed: { light: 'rgba(185,127,30,0.5)', dark: 'rgba(224,164,59,0.5)' },
  buttonContrast: { light: '#ffffff', dark: '#2b210e' },
  ghostActiveBorder: { light: 'rgba(185,127,30,0.5)', dark: 'rgba(242,197,107,0.6)' },
  ghostActiveFill: { light: 'rgba(185,127,30,0.16)', dark: 'rgba(224,164,59,0.26)' },
  ghostActiveHover: { light: 'rgba(185,127,30,0.10)', dark: 'rgba(224,164,59,0.14)' },
  interactiveHover: { light: 'rgba(185,127,30,0.10)', dark: 'rgba(224,164,59,0.14)' },
  interactiveActive: { light: 'rgba(185,127,30,0.18)', dark: 'rgba(224,164,59,0.26)' },
  interactiveAccent: { light: 'rgba(185,127,30,0.14)', dark: 'rgba(242,197,107,0.18)' },
  sidebarFill: { light: '#f5ecd4', dark: '#12100a' },
  navActive: { light: 'rgba(185,127,30,0.14)', dark: 'rgba(224,164,59,0.24)' },
  navActiveAccent: { light: '#b97f1e', dark: '#f2c56b' },
  navHover: { light: 'rgba(185,127,30,0.08)', dark: 'rgba(224,164,59,0.12)' },
  inputMajor: { light: '#ffffff', dark: '#201910' },
  menu: { light: '#fffdf6', dark: '#241c0c' },
  selector: { light: '#fffdf6', dark: '#241c0c' },
  bubble: { light: '#faf3df', dark: '#2a2110' },
  bubbleHighlight: { light: 'rgba(185,127,30,0.12)', dark: 'rgba(242,197,107,0.16)' },
  scrollbarBg: { light: 'rgba(185,127,30,0.25)', dark: 'rgba(242,197,107,0.22)' },
  scrollbarHover: { light: 'rgba(185,127,30,0.45)', dark: 'rgba(242,197,107,0.45)' },
  tip: { light: 'rgba(185,127,30,0.08)', dark: 'rgba(224,164,59,0.12)' },
}

/** 极光紫：紫夜 + 极光粉紫。 */
const AURORA_PURPLE: ThemePalette = {
  bgBase: { light: '#f6f2ff', dark: '#120b20' },
  bgLayer1: { light: '#fdfbff', dark: '#181028' },
  bgLayer2: { light: '#f1eafe', dark: '#1e1533' },
  bgOverlay: { light: '#fdfbff', dark: '#241a3d' },
  bgModule: { light: '#f2ecfe', dark: '#241a3d' },
  labelPrimary: { light: '#201536', dark: '#efe8ff' },
  labelSecondary: { light: '#574878', dark: '#c0b2e0' },
  labelTertiary: { light: '#8d7fae', dark: '#8d7fae' },
  labelCaption: { light: '#a79ac4', dark: '#776a96' },
  labelDimmed: { light: 'rgba(32,21,54,0.4)', dark: 'rgba(239,232,255,0.4)' },
  borderL1: { light: 'rgba(124,77,255,0.14)', dark: 'rgba(195,155,255,0.14)' },
  borderL2: { light: 'rgba(124,77,255,0.22)', dark: 'rgba(195,155,255,0.24)' },
  borderL3: { light: 'rgba(124,77,255,0.32)', dark: 'rgba(195,155,255,0.36)' },
  borderL4: { light: 'rgba(124,77,255,0.45)', dark: 'rgba(195,155,255,0.5)' },
  brandPrimary: { light: '#7c4dff', dark: '#9a6bff' },
  brandText: { light: '#ffffff', dark: '#ffffff' },
  brandInvert: { light: '#f6f2ff', dark: '#120b20' },
  buttonFill: { light: '#8a5cff', dark: '#9a6bff' },
  buttonHover: { light: '#9a6bff', dark: '#b288ff' },
  buttonDimmed: { light: 'rgba(124,77,255,0.5)', dark: 'rgba(154,107,255,0.5)' },
  buttonContrast: { light: '#ffffff', dark: '#241a3d' },
  ghostActiveBorder: { light: 'rgba(124,77,255,0.5)', dark: 'rgba(195,155,255,0.6)' },
  ghostActiveFill: { light: 'rgba(124,77,255,0.16)', dark: 'rgba(154,107,255,0.26)' },
  ghostActiveHover: { light: 'rgba(124,77,255,0.10)', dark: 'rgba(154,107,255,0.14)' },
  interactiveHover: { light: 'rgba(124,77,255,0.10)', dark: 'rgba(154,107,255,0.14)' },
  interactiveActive: { light: 'rgba(124,77,255,0.18)', dark: 'rgba(154,107,255,0.26)' },
  interactiveAccent: { light: 'rgba(124,77,255,0.14)', dark: 'rgba(195,155,255,0.18)' },
  sidebarFill: { light: '#ede6ff', dark: '#150e26' },
  navActive: { light: 'rgba(124,77,255,0.14)', dark: 'rgba(154,107,255,0.24)' },
  navActiveAccent: { light: '#7c4dff', dark: '#c39bff' },
  navHover: { light: 'rgba(124,77,255,0.08)', dark: 'rgba(154,107,255,0.12)' },
  inputMajor: { light: '#ffffff', dark: '#1c1330' },
  menu: { light: '#fdfbff', dark: '#221936' },
  selector: { light: '#fdfbff', dark: '#221936' },
  bubble: { light: '#f1eafe', dark: '#291e44' },
  bubbleHighlight: { light: 'rgba(124,77,255,0.12)', dark: 'rgba(195,155,255,0.16)' },
  scrollbarBg: { light: 'rgba(124,77,255,0.25)', dark: 'rgba(195,155,255,0.22)' },
  scrollbarHover: { light: 'rgba(124,77,255,0.45)', dark: 'rgba(195,155,255,0.45)' },
  tip: { light: 'rgba(124,77,255,0.08)', dark: 'rgba(154,107,255,0.12)' },
}

const PALETTES: Record<Exclude<ThemeColor, 'follow'>, ThemePalette> = {
  'galaxy-blue': GALAXY_BLUE,
  'dawn-gold': DAWN_GOLD,
  'aurora-purple': AURORA_PURPLE,
}

/** 把语义色板展开成官方 token 全名映射。 */
function toTokenMap(palette: ThemePalette): ThemeTokenMap {
  const map: ThemeTokenMap = {}
  for (const [field, token] of Object.entries(TOKEN_FIELDS)) {
    map[token] = palette[field as keyof ThemePalette]
  }
  return map
}

/**
 * 生成某主题的官方 token 覆盖映射；
 * 'follow' 返回空映射（表示移除覆盖层、还原 DSH 原生外观）。
 */
export function buildTokenOverrides(themeColor: ThemeColor): ThemeTokenMap {
  if (themeColor === 'follow') return {}
  return toTokenMap(PALETTES[themeColor])
}

export interface ThemeOverrideController {
  /** 应用/切换主题；'follow' 移除覆盖层。同一主题重复调用为幂等。 */
  apply(themeColor: ThemeColor): void
  /** 移除覆盖层（插件卸载时调用）。 */
  dispose(): void
}

/**
 * 创建覆盖层控制器：内部持有一个覆盖层，
 * 切换主题 = 释放旧层 + 以同一 source 注册新层；
 * 'follow' = 仅释放；服务缺失时所有操作安全跳过。
 */
export function createThemeOverrideController(theme: ShiningThemeService | undefined): ThemeOverrideController {
  let activeDisposer: (() => void) | null = null
  let activeColor: ThemeColor | null = null
  return {
    apply(themeColor) {
      if (activeColor === themeColor) return
      activeDisposer?.()
      activeDisposer = null
      activeColor = null
      if (!theme?.overrideTokens) return
      if (themeColor === 'follow') return
      activeDisposer = theme.overrideTokens(THEME_SOURCE, buildTokenOverrides(themeColor))
      activeColor = themeColor
    },
    dispose() {
      activeDisposer?.()
      activeDisposer = null
      activeColor = null
    },
  }
}

/** 从 client ctx 读取官方 theme 服务（缺失返回 undefined，调用方优雅降级）。 */
export function getThemeService(ctx: unknown): ShiningThemeService | undefined {
  const theme = (ctx as { theme?: unknown }).theme
  if (
    theme !== null && typeof theme === 'object' &&
    typeof (theme as ShiningThemeService).overrideTokens === 'function'
  ) {
    return theme as ShiningThemeService
  }
  return undefined
}
