import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ShiningService } from '../src/gateway.ts'

/** 构造一个不带真实 ctx 的网关实例用于单测（fs 方法不触碰 ctx）。 */
function makeService(): ShiningService {
  return new ShiningService({ inject: () => {}, reflect: { provide: () => {} } } as never, {})
}

// 契约：host 方法返回“裸业务值”（无 { ok, value } 包裹），失败时抛错。
describe('ShiningService.fs', () => {
  let root: string
  beforeAll(async () => { root = await mkdtemp(join(tmpdir(), 'shining-')) })
  afterAll(async () => { await rm(root, { recursive: true, force: true }) })

  it('lists, reads, writes, creates, renames, deletes', async () => {
    const svc = makeService()
    await writeFile(join(root, 'a.txt'), 'hello', 'utf8')
    const list = await svc.fsList({ root, path: '.' })
    expect(list.entries.some((e) => e.name === 'a.txt')).toBe(true)

    const read = await svc.fsRead({ root, path: 'a.txt' })
    expect(read).toEqual({ content: 'hello' })

    const write = await svc.fsWrite({ root, path: 'b.txt', content: 'world' })
    expect(write.path.endsWith('b.txt')).toBe(true)

    const mk = await svc.fsCreateDir({ root, path: 'sub' })
    expect(mk.path.endsWith('sub')).toBe(true)

    const ren = await svc.fsRename({ root, path: 'a.txt', newName: 'c.txt' })
    expect(ren.path.endsWith('c.txt')).toBe(true)

    const del = await svc.fsDelete({ root, path: 'b.txt' })
    expect(del.path.endsWith('b.txt')).toBe(true)
  })

  it('throws on a path escaping the root', async () => {
    const svc = makeService()
    await expect(svc.fsRead({ root, path: '../secret.txt' })).rejects.toThrow()
  })

  it('honors showHidden for dotfiles', async () => {
    const svc = makeService()
    await writeFile(join(root, '.hidden'), 'x', 'utf8')
    const shown = await svc.fsList({ root, path: '.', showHidden: true })
    expect(shown.entries.some((e) => e.name === '.hidden')).toBe(true)
    const hidden = await svc.fsList({ root, path: '.' })
    expect(hidden.entries.some((e) => e.name === '.hidden')).toBe(false)
  })
})
