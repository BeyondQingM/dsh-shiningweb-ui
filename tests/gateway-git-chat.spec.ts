import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { ShiningService } from '../src/gateway.ts'

function makeService(): ShiningService {
  return new ShiningService({ reflect: { provide: () => {} } } as never, {})
}

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

  it('reports branch and clean status', async () => {
    const svc = makeService()
    const res = await svc.gitStatus({ root, repoPath: '.' })
    expect(res).toMatchObject({ ok: true, value: { branch: 'main', dirtyCount: 0 } })
  })

  it('creates and checks out a branch', async () => {
    const svc = makeService()
    await expect(svc.gitCreateBranch({ root, repoPath: '.', name: 'feat' })).resolves.toMatchObject({ ok: true })
    const st = await svc.gitStatus({ root, repoPath: '.' })
    expect(st).toMatchObject({ ok: true, value: { branch: 'feat' } })
  })

  it('reports a dirty working tree count', async () => {
    const svc = makeService()
    await writeFile(join(root, 'dirty.txt'), 'd')
    const st = await svc.gitStatus({ root, repoPath: '.' })
    expect(st).toMatchObject({ ok: true, value: { dirtyCount: 1 } })
  })

  it('rejects a repo path escaping the root', async () => {
    const svc = makeService()
    const res = await svc.gitStatus({ root, repoPath: '../other' })
    expect(res).toMatchObject({ ok: false, error: { code: 'git-error' } })
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
    expect(res).toMatchObject({ ok: true, value: { content: 'hi' } })
    const url = String(fetchSpy.mock.calls[0]?.[0])
    expect(url).toBe('https://api.deepseek.com/chat/completions')
    fetchSpy.mockRestore()
  })

  it('returns a failure on upstream error', async () => {
    const svc = makeService()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 401 } as never)
    const res = await svc.chat({
      messages: [{ role: 'user', content: 'ping' }], model: 'm', apiBase: 'https://x', apiKey: 'k',
    })
    expect(res).toMatchObject({ ok: false, error: { code: 'chat-error' } })
    fetchSpy.mockRestore()
  })
})
