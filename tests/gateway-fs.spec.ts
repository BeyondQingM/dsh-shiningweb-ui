import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ShiningService } from '../src/gateway.ts'

/** 构造一个不带真实 ctx 的网关实例用于单测（fs 方法不触碰 ctx）。 */
function makeService(): ShiningService {
  return new ShiningService({ reflect: { provide: () => {} } } as never, {})
}

describe('ShiningService.fs', () => {
  let root: string
  beforeAll(async () => { root = await mkdtemp(join(tmpdir(), 'shining-')) })
  afterAll(async () => { await rm(root, { recursive: true, force: true }) })

  it('lists, reads, writes, creates, renames, deletes', async () => {
    const svc = makeService()
    await writeFile(join(root, 'a.txt'), 'hello', 'utf8')
    const list = await svc.fsList({ root, path: '.' })
    expect(list.ok).toBe(true)
    if (list.ok) expect(list.value.entries.some((e) => e.name === 'a.txt')).toBe(true)

    const read = await svc.fsRead({ root, path: 'a.txt' })
    expect(read).toEqual({ ok: true, value: { content: 'hello' } })

    const write = await svc.fsWrite({ root, path: 'b.txt', content: 'world' })
    expect(write.ok).toBe(true)

    const mk = await svc.fsCreateDir({ root, path: 'sub' })
    expect(mk.ok).toBe(true)

    const ren = await svc.fsRename({ root, path: 'a.txt', newName: 'c.txt' })
    expect(ren.ok).toBe(true)
    if (ren.ok) expect(ren.value.path.endsWith('c.txt')).toBe(true)

    const del = await svc.fsDelete({ root, path: 'b.txt' })
    expect(del.ok).toBe(true)
  })

  it('rejects a path escaping the root', async () => {
    const svc = makeService()
    const res = await svc.fsRead({ root, path: '../secret.txt' })
    expect(res).toMatchObject({ ok: false, error: { code: 'fs-error' } })
  })

  it('honors showHidden for dotfiles', async () => {
    const svc = makeService()
    await writeFile(join(root, '.hidden'), 'x', 'utf8')
    const shown = await svc.fsList({ root, path: '.', showHidden: true })
    expect(shown).toMatchObject({ ok: true })
    if (shown.ok) expect(shown.value.entries.some((e) => e.name === '.hidden')).toBe(true)
    const hidden = await svc.fsList({ root, path: '.' })
    if (hidden.ok) expect(hidden.value.entries.some((e) => e.name === '.hidden')).toBe(false)
  })
})
