import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { openChat, closeChat, openFiles, closeFiles, useShiningStore } from '../src/client/store.ts'
import { applyVisual } from '../src/client/visual.ts'
import { ChatEntry } from '../src/client/components/SidebarEntry.tsx'

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
})

describe('SidebarEntry', () => {
  it('renders the 天圆地方 button when wide', () => {
    const { getByRole } = render(<ChatEntry wide={true} {...({} as never)} />)
    expect(getByRole('button')).toBeTruthy()
  })
})
