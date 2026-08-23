import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { PLATFORM_MODULES, PRELOADED_CLIENT_EXTERNALS } from '../scripts/platform-modules.ts'

// 注意：不要用 import.meta.url + ../lib 定位（vitest 在含非 ASCII 路径下会把 import.meta.url 解析成
// 项目根 URL，导致 ../lib 落到 F:\lib）。vitest 运行时 cwd 恒为项目根，用 process.cwd() 最稳。
const readLib = (p: string) => readFileSync(resolve(process.cwd(), 'lib', p), 'utf8')

const CLIENT_JS = readLib('client.js')
const TYPERT_HOST_JS = readLib('typert.host.js')

/** 允许出现在 client bundle 里的 external require specifier。 */
const PLATFORM = new Set([...PLATFORM_MODULES, ...PRELOADED_CLIENT_EXTERNALS])

describe('shipped client bundle is module-table-safe', () => {
  // 历史崩溃 #1：client.js 出现 require("zod")/require("@deepseek-ai/schemastery")
  // → "client-modules: require(...) missed the module table"。
  // 修复：tsdown 的 external + noExternal（替代被忽略的 deps.alwaysBundle），并把 schemastery 从 client 解耦。
  it('requires only platform modules (no vendored/schemastery/zod externals)', () => {
    const requires = [...CLIENT_JS.matchAll(/require\("([^"]+)"\)/g)].map((m) => m[1])
    const nonPlatform = requires.filter((r) => !PLATFORM.has(r))
    expect(nonPlatform).toEqual([])
  })

  it('does not contain a zod or schemastery require', () => {
    expect(CLIENT_JS).not.toMatch(/require\("zod"\)/)
    expect(CLIENT_JS).not.toMatch(/require\("@deepseek-ai\/schemastery"\)/)
  })
})

describe('shipped client bundle mounts the remote without inject', () => {
  // 历史崩溃 #2：apply 用 ctx.remote.shining（属性访问强制 inject）
  // → "cannot get property 'remote.shining' without inject"。
  // 修复：改用 ctx.get('remote.shining')（cordis 可选服务读取，不走 inject 检查）。
  it('resolves remote.shining via ctx.get, not inject-requiring property access', () => {
    expect(CLIENT_JS).toContain('get("remote.shining")')
    expect(CLIENT_JS).not.toContain('.remote.shining')
  })
})

describe('shipped typert.host.js is valid ESM JS', () => {
  // 历史崩溃 #0：gen-typert 给 host .js 输出 TS 的 as const
  // → "SyntaxError: Unexpected identifier 'as'"。
  it('has no TS "as const"', () => {
    expect(TYPERT_HOST_JS.includes('as const')).toBe(false)
  })

  it('declares the TYPERT export', () => {
    expect(TYPERT_HOST_JS).toContain('export const TYPERT =')
  })
})
