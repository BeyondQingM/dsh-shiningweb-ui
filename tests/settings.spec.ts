import { describe, it, expect } from 'vitest'
import { ShiningSettingsSchema } from '../src/settings-schema.ts'
import { DEFAULT_SHINING_SETTINGS } from '../src/settings.ts'

describe('ShiningSettingsSchema', () => {
  it('applies defaults when no section is supplied', () => {
    const parsed = ShiningSettingsSchema({})
    expect(parsed.enabled).toBe(true)
    expect(parsed.chat.model).toBe('deepseek-chat')
    expect(parsed.visual.themeColor).toBe('galaxy-blue')
  })

  it('rejects an invalid themeColor', () => {
    expect(() => ShiningSettingsSchema({ visual: { themeColor: 'red' } })).toThrow()
  })

  it('rejects an invalid git.autoRefresh', () => {
    expect(() => ShiningSettingsSchema({ git: { autoRefresh: '5s' } })).toThrow()
  })

  it('keeps DEFAULT_SHINING_SETTINGS schema-valid', () => {
    const parsed = ShiningSettingsSchema(DEFAULT_SHINING_SETTINGS)
    expect(parsed).toMatchObject(DEFAULT_SHINING_SETTINGS)
  })

  it('defaults capabilityMode to pet and qq disabled', () => {
    const parsed = ShiningSettingsSchema({})
    expect(parsed.capabilityMode).toBe('pet')
    expect(parsed.qq.enabled).toBe(false)
    expect(parsed.qq.groupAllow).toEqual([])
  })

  it('rejects an invalid capabilityMode', () => {
    expect(() => ShiningSettingsSchema({ capabilityMode: 'god' })).toThrow()
  })
})
