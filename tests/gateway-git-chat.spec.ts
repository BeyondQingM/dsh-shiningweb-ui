import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { ShiningService } from '../src/gateway.ts'

function makeService(): ShiningService {
  return new ShiningService({ inject: () => {}, reflect: { provide: () => {} } } as never, {})
}

describe('ShiningService.settings', () => {
  it('registers settings from the service entrypoint', () => {
    const inject = vi.fn()
    new ShiningService({ inject, reflect: { provide: () => {} } } as never, {})
    expect(inject).toHaveBeenCalledWith(['settings'], expect.any(Function))
  })
})

// 契约：host 方法返回“裸业务值”（无 { ok, value } 包裹），失败时抛错。
// 网关（Typert gateway）负责统一包装成 { ok, value } / { ok: false, error }。
describe('ShiningService.git', () => {
  let root: string
  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), 'shining-git-'))
    execFileSync('git', ['init', '-b', 'main', root], { stdio: 'ignore' })
    execFileSync('git', ['-C', root, 'config', 'user.email', 't@t'], { stdio: 'ignore' })
    execFileSync('git', ['-C', root, 'config', 'user.name', 't'], { stdio: 'ignore' })
    await writeFile(join(root, 'x.txt'), 'x')
    execFileSync('git', ['-C', root, 'add', '.'], { stdio: 'ignore' })
    execFileSync('git', ['-C', root, 'commit', '-m', 'init'], { stdio: 'ignore' })
  })
  afterAll(async () => { await rm(root, { recursive: true, force: true }) })

  it('returns the raw branch + dirtyCount value (no result wrapper)', async () => {
    const svc = makeService()
    const res = await svc.gitStatus({ root, repoPath: '.' })
    expect(res).toEqual({ branch: 'main', dirtyCount: 0, changes: [] })
  })

  it('creates and checks out a branch', async () => {
    const svc = makeService()
    await expect(svc.gitCreateBranch({ root, repoPath: '.', name: 'feat' })).resolves.toEqual({ output: expect.any(String) })
    const st = await svc.gitStatus({ root, repoPath: '.' })
    expect(st.branch).toBe('feat')
  })

  it('reports a dirty working tree count', async () => {
    const svc = makeService()
    await writeFile(join(root, 'dirty.txt'), 'd')
    const st = await svc.gitStatus({ root, repoPath: '.' })
    expect(st.dirtyCount).toBe(1)
  })

  it('normalizes worktree-only porcelain changes to M', async () => {
    const svc = makeService()
    await writeFile(join(root, 'x.txt'), 'changed')
    const st = await svc.gitStatus({ root, repoPath: '.' })
    expect(st.changes).toEqual(expect.arrayContaining([{ path: 'x.txt', status: 'M' }]))
  })

  it('throws on a repo path escaping the root', async () => {
    const svc = makeService()
    await expect(svc.gitStatus({ root, repoPath: '../other' })).rejects.toThrow()
  })
})

describe('ShiningService.chat', () => {
  it('POSTs to the configured apiBase and returns the content', async () => {
    const svc = makeService()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true, status: 200,
      json: async () => ({ choices: [{ message: { content: 'hi' } }] }),
    } as never)
    const res = await svc.chat({
      messages: [{ role: 'user', content: 'ping' }], model: 'deepseek-chat', apiBase: 'https://api.deepseek.com', apiKey: 'k',
    })
    expect(res).toEqual({ content: 'hi' })
    const url = String(fetchSpy.mock.calls[0]?.[0])
    expect(url).toBe('https://api.deepseek.com/chat/completions')
    fetchSpy.mockRestore()
  })

  it('throws the business failure (code + message preserved) on upstream error', async () => {
    const svc = makeService()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 401 } as never)
    const err = await svc.chat({
      messages: [{ role: 'user', content: 'ping' }], model: 'm', apiBase: 'https://x', apiKey: 'k',
    }).catch((e) => e as { failure?: { code: string; message: string } })
    expect(err.failure).toMatchObject({ code: 'chat-error', message: 'upstream 401' })
    fetchSpy.mockRestore()
  })
})
