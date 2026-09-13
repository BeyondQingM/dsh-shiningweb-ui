import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { globSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { PLATFORM_MODULES } from '../scripts/platform-modules.ts'

/** 读取源码并剥离注释（避免注释里的说明文字误报）。 */
const codeOf = (p: string) => {
  const raw = readFileSync(resolve(process.cwd(), 'src', p), 'utf8')
  return raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

/**
 * DSH 0.1.5-rc 契约回归守卫。
 *
 * 背景：本插件的 devDependencies 曾长期停在 0.1.0-rc.8，而真实运行面是 0.1.5-rc，
 * 于是 `tsc`/`vitest` 对旧契约全程假绿，破坏点只在运行时才炸。现在依赖已对齐
 * 0.1.5-rc.2（`tsc -p tsconfig.host.json` / `tsconfig.client.json` 直接校验真实契约），
 * 这里再把"与 0.1.5 契约绑定的硬事实"固化成静态断言，任何一条被改回去都会立即可见。
 */
describe('DSH 0.1.5-rc contract: module augmentation must target a real module', () => {
  // 症状：`import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'`
  // 报 TS2305 "has no exported member"，且增强文件自身报 TS2306 "is not a module"。
  // 根因：只含 `declare module 'X' {...}` 的文件若无顶层 import/export，就是**脚本**，
  // 其 `declare module` 被解释为"环境模块声明"而非"模块增强"，会把真实包整个遮蔽。
  //
  // 0.1.5 下 `sidebar.footer.action` / `settings.section` 的 merge 由上游包自带
  // （ui-sidebar / ui-settings 的 client 入口），因此原先的本地补丁文件 src/client/slots.ts
  // 已经删除。这条守卫改成对**整个 src 树**生效，防止同类文件再次出现。
  const sources = globSync('src/**/*.{ts,tsx}', { cwd: process.cwd() })

  it('finds the source tree', () => {
    expect(sources.length).toBeGreaterThan(20)
  })

  it('no source is a script that declares a module (ambient-declaration shadowing)', () => {
    const offenders: string[] = []
    for (const file of sources) {
      const raw = readFileSync(resolve(process.cwd(), file), 'utf8')
      if (!/^\s*declare module\s+['"]/m.test(raw)) continue
      // 有顶层 import/export 才是模块，`declare module` 才是增强。
      const isModule = /^\s*(import|export)\b/m.test(raw)
      if (!isModule) offenders.push(file)
    }
    expect(offenders).toEqual([])
  })

  it('does not re-declare a platform package that already owns its SlotMap entries', () => {
    // 上游已经声明过的槽位若在本地重复声明，owner 形状会随时间漂移而无人发现。
    const redeclared: string[] = []
    for (const file of sources) {
      const raw = readFileSync(resolve(process.cwd(), file), 'utf8')
      for (const key of ['sidebar.footer.action', 'settings.section']) {
        if (new RegExp(`['"]${key.replace('.', '\\.')}['"]\\s*:`).test(raw)) redeclared.push(`${file}: ${key}`)
      }
    }
    expect(redeclared).toEqual([])
  })
})

describe('DSH 0.1.5-rc contract: settings namespace registration', () => {
  // 0.1.5 移除 `settingsNamespace()` 工厂：`settings.register` 直接收裸字符串，
  // 命名空间类型变为 brand 后的 `SettingsNamespace`（dsh-settings/types）。
  it('gateway does not call the removed settingsNamespace() factory', () => {
    expect(codeOf('gateway.ts')).not.toMatch(/\bsettingsNamespace\s*\(/)
  })

  it('gateway passes the bare namespace string to settings.register', () => {
    const code = codeOf('gateway.ts')
    expect(code).toMatch(/settings\.register\(/)
    expect(code).toMatch(/as SettingsNamespace/)
  })
})

describe('DSH 0.1.5-rc contract: Remote failure vocabulary', () => {
  // 0.1.5 移除 `TypertLookupFailure`：改为抛 `RemoteError`，并把自己的业务码
  // 通过模块增强合并进 `RemoteErrorDetailsMap`（否则报错会退化成 gateway/internal）。
  it('no source still imports the removed TypertLookupFailure', () => {
    for (const f of ['types.ts', 'gateway.ts']) {
      expect(codeOf(f)).not.toMatch(/TypertLookupFailure/)
    }
  })

  it('types.ts throws RemoteError and declares its own code vocabulary', () => {
    const code = codeOf('types.ts')
    expect(code).toMatch(/import\s*\{[^}]*\bRemoteError\b[^}]*\}\s*from\s*'@deepseek-ai\/dsh-typert-protocol'/)
    expect(code).toMatch(/declare module '@deepseek-ai\/dsh-typert-protocol'/)
    expect(code).toMatch(/interface RemoteErrorDetailsMap/)
    expect(code).toMatch(/'shining\/[a-z-]+':/)
  })

  it('every failure() call site uses a declared shining/* code', () => {
    const declared = new Set(
      [...codeOf('types.ts').matchAll(/'(shining\/[a-z-]+)':/g)].map((m) => m[1]),
    )
    expect(declared.size).toBeGreaterThan(0)
    const used = new Set(
      [...codeOf('gateway.ts').matchAll(/failure\(\s*'(shining\/[a-z-]+)'/g)].map((m) => m[1]),
    )
    expect(used.size).toBeGreaterThan(0)
    expect([...used].filter((c) => !declared.has(c))).toEqual([])
  })
})

describe('DSH 0.1.5-rc contract: browser platform module table', () => {
  // 真源：dsh-web-frontend 的 boot staticModules 表。旧表里的
  // `dsh-client-ui-primitives` 仍在，但 `dsh-client-ui-slots` 必须保留
  // （SlotMap 增强目标）；同时 0.1.5 新增 dsh-client-store / ui-dockkit。
  it('matches the 0.1.5 shell table', () => {
    expect([...PLATFORM_MODULES].sort()).toEqual([
      '@deepseek-ai/cordis',
      '@deepseek-ai/dsh-client-store',
      '@deepseek-ai/dsh-client-ui-dockkit',
      '@deepseek-ai/dsh-client-ui-primitives',
      '@deepseek-ai/dsh-client-ui-slots',
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
    ])
  })
})
