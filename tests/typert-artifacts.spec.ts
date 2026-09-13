import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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

  // 回归守卫：package.json 的 exports["./remote"] 曾经指向从未生成的文件，
  // 任何 `import 'dsh-shiningweb-ui/remote'` 都会在解析期失败。
  it('every declared export target exists on disk after a build', () => {
    const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
      exports: Record<string, { types?: string; default?: string } | string>
    }
    const missing: string[] = []
    for (const [key, value] of Object.entries(pkg.exports)) {
      if (typeof value === 'string') {
        if (!existsSync(resolve(process.cwd(), value))) missing.push(`${key} -> ${value}`)
        continue
      }
      for (const field of ['types', 'default'] as const) {
        const target = value[field]
        if (target !== undefined && !existsSync(resolve(process.cwd(), target))) missing.push(`${key}.${field} -> ${target}`)
      }
    }
    expect(missing).toEqual([])
  })
})
