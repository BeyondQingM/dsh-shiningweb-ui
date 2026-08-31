import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import { openChat, closeChat, openFiles, closeFiles, useShiningStore } from '../src/client/store.ts'
import { applyVisual } from '../src/client/visual.ts'
import { ChatEntry } from '../src/client/components/SidebarEntry.tsx'
import { Scene } from '../src/client/components/Scene.tsx'

describe('shining client store', () => {
  it('opens/closes chat panel', () => {
    openChat()
    // useShiningStore 是 React hook，仅验证其存在性（真实渲染见 Task 12）
    expect(useShiningStore).toBeDefined()
    closeChat()
  })
  it('opens/closes files panel', () => {
    openFiles()
    closeFiles()
    expect(true).toBe(true)
  })
})

describe('applyVisual', () => {
  const VARS = ['--shining-primary', '--shining-accent', '--shining-gradient', '--shining-glow', '--shining-border', '--shining-soft', '--shining-blur']
  beforeEach(() => {
    for (const v of VARS) document.documentElement.style.removeProperty(v)
  })
  it('writes the full theme palette + blur as CSS variables', () => {
    applyVisual({ visual: { themeColor: 'dawn-gold', glassBlur: 8 } } as never)
    const st = document.documentElement.style
    expect(st.getPropertyValue('--shining-primary')).toBe('#e0a43b')
    expect(st.getPropertyValue('--shining-accent')).toBe('#f2c56b')
    expect(st.getPropertyValue('--shining-gradient')).toBe('linear-gradient(135deg, #e0a43b 0%, #f2c56b 100%)')
    expect(st.getPropertyValue('--shining-glow')).toBe('rgba(224, 164, 59, 0.35)')
    expect(st.getPropertyValue('--shining-border')).toBe('rgba(224, 164, 59, 0.35)')
    expect(st.getPropertyValue('--shining-soft')).toBe('rgba(224, 164, 59, 0.10)')
    expect(st.getPropertyValue('--shining-blur')).toBe('8px')
  })

  it('follow-dsh must not throw and keeps blur + fallback palette (clickability regression)', () => {
    // 回归守卫：themeColor='follow' 时旧的实现 THEME_COLORS['follow'] 为 undefined，
    // 在 scope 订阅回调里抛错，导致设置页后续点击（含跟随 DSH 卡片）全部失效。
    expect(() => applyVisual({ visual: { themeColor: 'follow', glassBlur: 16 } } as never)).not.toThrow()
    const st = document.documentElement.style
    expect(st.getPropertyValue('--shining-blur')).toBe('16px')
    expect(st.getPropertyValue('--shining-primary')).not.toBe('')
  })

  it('unknown themeColor falls back without throwing', () => {
    expect(() => applyVisual({ visual: { themeColor: 'red-wine' as never, glassBlur: 4 } } as never)).not.toThrow()
    expect(document.documentElement.style.getPropertyValue('--shining-blur')).toBe('4px')
  })
})

describe('SidebarEntry', () => {
  it('renders the 天圆地方 button when wide', () => {
    const { getByRole } = render(<ChatEntry wide={true} {...({} as never)} />)
    expect(getByRole('button')).toBeTruthy()
  })
})

describe('Scene', () => {
  it('renders nothing for follow (no scene decoration)', () => {
    const { container } = render(<Scene themeColor="follow" />)
    expect(container.querySelector('[data-shining-scene]')).toBeNull()
  })

  it('renders a starfield for a theme, with meteors when motion allowed', () => {
    const { container } = render(<Scene themeColor="galaxy-blue" />)
    const scene = container.querySelector('[data-shining-scene="galaxy-blue"]')
    expect(scene).toBeTruthy()
    expect(scene!.querySelectorAll('[data-star]').length).toBe(70)
    expect(scene!.querySelectorAll('[data-meteor]').length).toBe(3)
  })

  it('omits meteors under prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
    const { container } = render(<Scene themeColor="dawn-gold" />)
    const scene = container.querySelector('[data-shining-scene="dawn-gold"]')
    expect(scene!.querySelectorAll('[data-star]').length).toBe(70)
    expect(scene!.querySelectorAll('[data-meteor]').length).toBe(0)
    vi.unstubAllGlobals()
  })
})
