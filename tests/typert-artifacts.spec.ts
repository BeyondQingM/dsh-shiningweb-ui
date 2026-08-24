import { describe, it, expect } from 'vitest'
import { TYPERT_REMOTE } from '../src/client/remote.ts'

describe('typert artifacts', () => {
  it('client contribution has strict codecs and expected endpoints', () => {
    expect(TYPERT_REMOTE.package).toBe('dsh-shiningweb-ui')
    const methods = TYPERT_REMOTE.descriptors.map((d) => d.method)
    expect(methods).toContain('fsList')
    expect(methods).toContain('gitStatus')
    expect(methods).toContain('chat')
    for (const d of TYPERT_REMOTE.descriptors) {
      expect(d.service).toBe('shining')
      expect(d.invocation.kind).toBe('direct')
      expect(d.result.mode).toBe('strict')
      expect(typeof d.result.schema.parse).toBe('function')
      expect(d.parameters.length).toBe(1)
      expect(d.parameters[0].name).toBe('request')
      expect(typeof d.parameters[0].codec.schema.parse).toBe('function')
    }
  })

  it('fsList result schema validates the raw business value (no wrapper)', () => {
    const d = TYPERT_REMOTE.descriptors.find((x) => x.method === 'fsList')
    expect(d).toBeDefined()
    const parsed = d!.result.schema.parse({ entries: [{ name: 'a', isDirectory: false, size: 1 }] })
    expect(parsed).toMatchObject({ entries: [{ name: 'a', isDirectory: false, size: 1 }] })
  })
})
