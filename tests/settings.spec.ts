import { describe, it, expect } from 'vitest'
import { ShiningSettingsSchema } from '../src/settings-schema.ts'
import { DEFAULT_SHINING_SETTINGS } from '../src/settings.ts'
import { bindSettingsScope, getSettingsDebugSnapshot, mergeSettings } from '../src/client/settings.ts'

describe('follow-dsh theme option', () => {
  it('host schema accepts visual.themeColor = follow', () => {
    const parsed = ShiningSettingsSchema({ visual: { themeColor: 'follow' } })
    expect(parsed.visual.themeColor).toBe('follow')
  })

  it('mergeSettings passes follow through and keeps galaxy-blue default', () => {
    expect(mergeSettings({ visual: { themeColor: 'follow' } }).visual.themeColor).toBe('follow')
    expect(mergeSettings(undefined).visual.themeColor).toBe('galaxy-blue')
    expect(DEFAULT_SHINING_SETTINGS.visual.themeColor).toBe('galaxy-blue')
  })
})

describe('settings diagnostics', () => {
  it('reports the live scope transport state without exposing values', () => {
    bindSettingsScope({
      getSnapshot: () => ({
        status: 'ready', value: { apiKey: 'secret' }, base: {}, user: {}, revision: 7, writable: true, mode: 'host',
      }),
      subscribe: () => () => {}, set: async () => {}, unset: async () => {},
    } as never)

    expect(getSettingsDebugSnapshot()).toEqual({
      bound: true, status: 'ready', writable: true, mode: 'host', revision: 7, hasValue: true,
    })
  })
})

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
