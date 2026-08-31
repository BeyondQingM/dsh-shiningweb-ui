import { describe, it, expect, vi } from 'vitest'
import { buildTokenOverrides, createThemeOverrideController, THEME_SOURCE } from '../src/client/theme.ts'

/** 全套换肤必须覆盖的核心官方 token（背景/文字/描边/品牌/按钮/交互/侧边栏/输入/气泡/滚动条）。 */
const CORE_TOKENS = [
  '--dsw-alias-bg-base',
  '--dsw-alias-bg-layer-1',
  '--dsw-alias-bg-layer-2',
  '--dsw-alias-bg-overlay',
  '--dsw-alias-bg-module-platform',
  '--dsw-alias-label-primary',
  '--dsw-alias-label-secondary',
  '--dsw-alias-label-tertiary',
  '--dsw-alias-border-l1',
  '--dsw-alias-border-l2',
  '--dsw-alias-border-l3',
  '--dsw-alias-brand-primary',
  '--dsw-alias-brand-text',
  '--dsw-alias-button-primary-fill',
  '--dsw-alias-button-primary-hover',
  '--dsw-alias-interactive-bg-hover',
  '--dsw-alias-interactive-bg-active',
  '--dsw-specific-sidebar-fill',
  '--dsw-specific-sidebar-nav-item-active',
  '--dsw-specific-sidebar-nav-item-active-accent',
  '--dsw-specific-sidebar-nav-item-hover',
  '--dsw-specific-input-major',
  '--dsw-specific-menu',
  '--dsw-specific-selector',
  '--dsw-specific-bubble',
  '--dsw-alias-scrollbar-bg-l1',
  '--dsw-alias-scrollbar-hover-l1',
] as const

const THEME_KEYS = ['galaxy-blue', 'dawn-gold', 'aurora-purple'] as const

describe('shining full-GUI token overrides', () => {
  it.each(THEME_KEYS)('maps every core official token with light+dark values (%s)', (theme) => {
    const map = buildTokenOverrides(theme)
    for (const key of CORE_TOKENS) {
      const v = map[key]
      expect(v, `${theme} missing ${key}`).toBeTruthy()
      expect(v!.light.trim(), `${theme} ${key}.light empty`).not.toBe('')
      expect(v!.dark.trim(), `${theme} ${key}.dark empty`).not.toBe('')
    }
  })

  it.each(THEME_KEYS)('only touches official --dsw token names (%s)', (theme) => {
    const map = buildTokenOverrides(theme)
    for (const key of Object.keys(map)) {
      expect(key).toMatch(/^--dsw-(alias|specific)-[a-z0-9-]+$/)
    }
  })

  it('follow-dsh yields an empty map (restore native look)', () => {
    expect(buildTokenOverrides('follow')).toEqual({})
  })
})

/** 最小 theme 服务 mock：记录调用与释放。 */
function makeThemeSvc() {
  const calls: Array<{ source: string; tokens: Record<string, unknown> }> = []
  let disposed = 0
  return {
    calls,
    get disposed() { return disposed },
    overrideTokens(source: string, tokens: Record<string, unknown>) {
      calls.push({ source, tokens })
      return () => { disposed += 1 }
    },
  }
}

describe('createThemeOverrideController lifecycle', () => {
  it('applies one layer for the selected theme', () => {
    const svc = makeThemeSvc()
    const ctl = createThemeOverrideController(svc as never)
    ctl.apply('galaxy-blue')
    expect(svc.calls).toHaveLength(1)
    expect(svc.calls[0]!.source).toBe(THEME_SOURCE)
    expect(Object.keys(svc.calls[0]!.tokens).length).toBeGreaterThan(0)
  })

  it('switching themes replaces the layer under the same source', () => {
    const svc = makeThemeSvc()
    const ctl = createThemeOverrideController(svc as never)
    ctl.apply('galaxy-blue')
    ctl.apply('aurora-purple')
    expect(svc.calls).toHaveLength(2)
    expect(svc.calls[1]!.source).toBe(THEME_SOURCE)
    expect(svc.calls[1]!.tokens).toEqual(buildTokenOverrides('aurora-purple'))
    expect(svc.disposed).toBe(1)
  })

  it('follow-dsh removes the override layer and applies nothing', () => {
    const svc = makeThemeSvc()
    const ctl = createThemeOverrideController(svc as never)
    ctl.apply('galaxy-blue')
    ctl.apply('follow')
    expect(svc.disposed).toBe(1)
    expect(svc.calls).toHaveLength(1)
    // follow 之后再次 follow：仍无新层。
    ctl.apply('follow')
    expect(svc.calls).toHaveLength(1)
  })

  it('is idempotent for the same theme (no duplicate layers)', () => {
    const svc = makeThemeSvc()
    const ctl = createThemeOverrideController(svc as never)
    ctl.apply('galaxy-blue')
    ctl.apply('galaxy-blue')
    expect(svc.calls).toHaveLength(1)
  })

  it('dispose() removes the layer; apply after dispose works again', () => {
    const svc = makeThemeSvc()
    const ctl = createThemeOverrideController(svc as never)
    ctl.apply('dawn-gold')
    ctl.dispose()
    expect(svc.disposed).toBe(1)
    ctl.apply('dawn-gold')
    expect(svc.calls).toHaveLength(2)
  })

  it('skips gracefully when the theme service is unavailable', () => {
    expect(() => createThemeOverrideController(undefined).apply('galaxy-blue')).not.toThrow()
    expect(() => createThemeOverrideController(undefined).apply('follow')).not.toThrow()
  })
})
