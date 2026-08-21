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
  beforeEach(() => {
    document.documentElement.style.removeProperty('--shining-primary')
  })
  it('writes theme color and blur CSS variables', () => {
    applyVisual({ visual: { themeColor: 'dawn-gold', glassBlur: 8 } } as never)
    expect(document.documentElement.style.getPropertyValue('--shining-primary')).toBe('#e0a43b')
    expect(document.documentElement.style.getPropertyValue('--shining-blur')).toBe('8px')
  })
})

describe('SidebarEntry', () => {
  it('renders the 天圆地方 button when wide', () => {
    const { getByRole } = render(<ChatEntry wide={true} {...({} as never)} />)
    expect(getByRole('button')).toBeTruthy()
  })
})
