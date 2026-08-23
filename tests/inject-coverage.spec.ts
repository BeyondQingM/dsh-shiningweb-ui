import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

/** 读取源码并剥离注释（避免注释里的说明文字误报）。 */
const codeOf = (p: string) =>
  readFileSync(resolve(process.cwd(), 'src', p), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .trim()

/**
 * cordis Context 自身成员（方法/属性），访问它们不需要 inject。
 * 凡是 `ctx.<ident>` 而 ident 不在这个集合里，就是一个"服务属性访问"，
 * 必须声明在插件的 `inject` 数组里，否则 cordis 在 runtime 下会抛
 * "cannot get property '<ident>' without inject"。
 */
const CTX_MEMBERS = new Set([
  'get', 'effect', 'plugin', 'provide', 'reflect', 'events', 'scope',
  'set', 'isolate', 'fiber', 'parent', 'defer', 'lifecycle', 'logger',
  'on', 'off', 'emit', 'current', 'slice', 'wait',
])

/** 从 src/client/index.ts 解析插件的 inject 数组（服务名集合）。 */
function parseInject(): Set<string> {
  const code = codeOf('client/index.ts')
  const m = code.match(/export const inject = \[([^\]]*)\]/)
  const raw = m?.[1] ?? ''
  return new Set(raw.split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean))
}

/** 扫描某文件的全部 `ctx.<ident>` 服务属性访问（剔除 ctx 自身成员）。 */
function serviceAccessesOf(p: string): Set<string> {
  const code = codeOf(p)
  const found = new Set<string>()
  for (const m of code.matchAll(/ctx(?:\.|\?\.)([a-zA-Z_][a-zA-Z0-9_]*)/g)) {
    const ident = m[1]
    if (!CTX_MEMBERS.has(ident)) found.add(ident)
  }
  return found
}

describe('client plugin declares every ctx service it accesses (without-inject guard)', () => {
  // 回归守卫：本次 "cannot get property 'workspaces' without inject" 报错，
  // 以及历史上 "remote.shining without inject" 的同类根因——
  // cordis 属性访问要求服务在 inject 里声明，否则 runtime 直接抛错。
  it('inject covers every service accessed via ctx.<service>', () => {
    const injected = parseInject()
    // 收集所有使用 plugin ctx (cordis) 的加载期源码文件。
    const files = ['client/index.ts', 'client/dsh-context.ts']
    const missing = new Set<string>()
    for (const f of files) {
      for (const svc of serviceAccessesOf(f)) if (!injected.has(svc)) missing.add(svc)
    }
    expect([...missing].sort()).toEqual([])
  })

  it('inject explicitly registers sessions + workspaces (the historical offenders)', () => {
    const injected = parseInject()
    expect(injected.has('workspaces')).toBe(true)
    expect(injected.has('sessions')).toBe(true)
    // 与 apply 里用到的其它服务保持一致。
    for (const svc of ['slots', 'remote', 'locale', 'settingsScope']) expect(injected.has(svc)).toBe(true)
  })
})
