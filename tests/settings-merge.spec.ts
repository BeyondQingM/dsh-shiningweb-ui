import { describe, it, expect } from 'vitest'
import { mergeSettings } from '../src/client/settings.ts'

describe('client settings deep-merge defaults (empty-field regression)', () => {
  // 回归守卫：scope 快照 value 若是部分对象（如 `{}` 或 `{ chat: { enabled: true } }`），
  // 组件读 settings.chat.model 会 undefined/崩溃，表现为设置空字段 + 点不动。
  it('returns full defaults when the section value is undefined', () => {
    const s = mergeSettings(undefined)
    expect(s.chat.model).toBe('deepseek-chat')
    expect(s.chat.apiBase).toBe('https://api.deepseek.com')
    expect(s.git.autoRefresh).toBe('off')
    expect(s.visual.themeColor).toBe('galaxy-blue')
  })

  it('fills missing nested fields when the section is a partial object', () => {
    const s = mergeSettings({ chat: { enabled: true } } as never)
    expect(s.chat.enabled).toBe(true)
    expect(s.chat.model).toBe('deepseek-chat')
    expect(s.chat.apiBase).toBe('https://api.deepseek.com')
    expect(s.visual.themeColor).toBe('galaxy-blue')
  })

  it('returns full defaults for an empty object section', () => {
    const s = mergeSettings({} as never)
    expect(s.chat.model).toBe('deepseek-chat')
    expect(s.visual.themeColor).toBe('galaxy-blue')
    expect(s.qq.personaPrompt).toContain('天圆地方')
  })

  it('keeps an explicit scalar override on top of the default', () => {
    const s = mergeSettings({ capabilityMode: 'super' })
    expect(s.capabilityMode).toBe('super')
    expect(s.chat.model).toBe('deepseek-chat')
  })
})
