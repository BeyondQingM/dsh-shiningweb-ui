import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

/** 读取源码并剥离注释，得到可对"代码"做权威断言的文本（避免注释里的说明文字误报）。 */
const codeOf = (p: string) => {
  // 同 build-hygiene：不要用 import.meta.url（非 ASCII 路径下解析异常）；用 process.cwd()。
  const src = readFileSync(resolve(process.cwd(), 'src', p), 'utf8')
  // 只剥注释：块注释 /* */ 与行注释 //。两个都在注释里，不影响真正的代码。
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').trim()
}

describe('client apply mounts remote without inject (source)', () => {
  // 回归守卫（崩溃 #2）：apply 必须用 ctx.get('remote.shining')，不能退化成属性访问。
  it('uses ctx.get("remote.shining") and not property access', () => {
    const code = codeOf('client/index.ts')
    expect(code).toContain("ctx.get('remote.shining')")
    expect(code).not.toContain('ctx.remote.shining')
  })
})

describe('client stays decoupled from schemastery (source)', () => {
  // 回归守卫（崩溃 #1 的根因之一）：client 共享的 settings.ts 若引入 schemastery，
  // 会被 client bundle 打包触发 "missed the module table"。
  it('shared settings.ts does not import @deepseek-ai/schemastery', () => {
    const code = codeOf('settings.ts')
    expect(code).not.toContain('@deepseek-ai/schemastery')
  })

  it('host-only settings-schema.ts is the schemastery importer', () => {
    const code = codeOf('settings-schema.ts')
    expect(code).toContain('@deepseek-ai/schemastery')
  })
})
