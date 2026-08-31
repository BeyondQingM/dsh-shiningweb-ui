/** 视觉主题应用：主题色/毛玻璃写入 document.documentElement CSS 变量。 */
import type { ShiningSettings, ThemeColor } from '../settings.ts'

/** 一个主题的完整色板：主色、强调色、渐变、辉光、描边、柔和底。 */
interface ThemeColors {
  primary: string
  accent: string
  gradient: string
  glow: string
  border: string
  soft: string
}

const THEME_COLORS: Record<string, ThemeColors> = {
  'galaxy-blue': {
    primary: '#4f7cff',
    accent: '#7aa0ff',
    gradient: 'linear-gradient(135deg, #4f7cff 0%, #7aa0ff 100%)',
    glow: 'rgba(79, 124, 255, 0.35)',
    border: 'rgba(79, 124, 255, 0.35)',
    soft: 'rgba(79, 124, 255, 0.10)',
  },
  'dawn-gold': {
    primary: '#e0a43b',
    accent: '#f2c56b',
    gradient: 'linear-gradient(135deg, #e0a43b 0%, #f2c56b 100%)',
    glow: 'rgba(224, 164, 59, 0.35)',
    border: 'rgba(224, 164, 59, 0.35)',
    soft: 'rgba(224, 164, 59, 0.10)',
  },
  'aurora-purple': {
    primary: '#9a6bff',
    accent: '#c39bff',
    gradient: 'linear-gradient(135deg, #9a6bff 0%, #c39bff 100%)',
    glow: 'rgba(154, 107, 255, 0.35)',
    border: 'rgba(154, 107, 255, 0.35)',
    soft: 'rgba(154, 107, 255, 0.10)',
  },
}

/** follow 的兜底色板（DSH token 不可读时使用）。 */
const FALLBACK: ThemeColors = THEME_COLORS['galaxy-blue']!

/** 解析 #rgb/#rrggbb/rgb()/rgba() 为 [r,g,b]；失败返回 null。 */
function parseRgb(input: string): [number, number, number] | null {
  const s = input.trim()
  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    const h = hex[1]!.length === 3 ? hex[1]!.split('').map((c) => c + c).join('') : hex[1]!
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const rgb = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
  return null
}

/** follow 语义：把 DSH 当前品牌色推导为 shining 组件变量，读不到则回退星河蓝。 */
function followPalette(root: HTMLElement): ThemeColors {
  const computed = getComputedStyle(root)
  const brand = computed.getPropertyValue('--dsw-alias-brand-primary').trim()
  const rgb = parseRgb(brand)
  if (!rgb) return FALLBACK
  const [r, g, b] = rgb
  return {
    primary: `rgb(${r}, ${g}, ${b})`,
    accent: `rgb(${Math.min(255, r + 42)}, ${Math.min(255, g + 42)}, ${Math.min(255, b + 42)})`,
    gradient: `linear-gradient(135deg, rgb(${r}, ${g}, ${b}) 0%, rgb(${Math.min(255, r + 42)}, ${Math.min(255, g + 42)}, ${Math.min(255, b + 42)}) 100%)`,
    glow: `rgba(${r}, ${g}, ${b}, 0.35)`,
    border: `rgba(${r}, ${g}, ${b}, 0.35)`,
    soft: `rgba(${r}, ${g}, ${b}, 0.10)`,
  }
}

/** 主题色 → 色板：'follow'/未知值回退（旧实现会因 THEME_COLORS[undefined] 抛错，破坏订阅与点击）。 */
function paletteFor(themeColor: ThemeColor | undefined, root: HTMLElement): ThemeColors {
  if (themeColor === 'follow') return followPalette(root)
  return THEME_COLORS[themeColor ?? 'galaxy-blue'] ?? FALLBACK
}

/** 将设置投影到 CSS 变量（浏览器环境调用）。 */
export function applyVisual(settings?: ShiningSettings): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const color = paletteFor(settings?.visual.themeColor, root)
  root.style.setProperty('--shining-primary', color.primary)
  root.style.setProperty('--shining-accent', color.accent)
  root.style.setProperty('--shining-gradient', color.gradient)
  root.style.setProperty('--shining-glow', color.glow)
  root.style.setProperty('--shining-border', color.border)
  root.style.setProperty('--shining-soft', color.soft)
  root.style.setProperty('--shining-blur', `${settings?.visual.glassBlur ?? 12}px`)
}
