import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ShiningQqService, setQqStoreRoot, listQqSessions, type QqAdapter } from '../src/qq.ts'
import type { ShiningSettings } from '../src/settings.ts'

function makeAdapter(): QqAdapter & { sent: unknown[] } {
  const sent: unknown[] = []
  return {
    sent,
    onMessage: () => () => {},
    sendMarkdown: async (target, content) => { sent.push({ target, content }) },
    start: () => {},
    stop: () => {},
  }
}

const settings = (over: Partial<ShiningSettings> = {}): ShiningSettings => ({
  enabled: true,
  capabilityMode: 'super',
  chat: { enabled: true, personaId: '', model: 'm', apiBase: 'https://x', apiKey: 'k' },
  fileExplorer: { enabled: true, showHidden: false },
  git: { enabled: true, autoRefresh: 'off' },
  visual: { themeColor: 'galaxy-blue', glassBlur: 12 },
  qq: { enabled: true, appId: 'a', appSecret: 's', groupAllow: [], personaPrompt: '你是天圆地方' },
  ...over,
})

describe('ShiningQqService', () => {
  let dir: string
  beforeEach(async () => { dir = await mkdtemp(join(tmpdir(), 'shining-qq-')) ; setQqStoreRoot(dir) })
  afterEach(async () => { await rm(dir, { recursive: true, force: true }) })

  it('routes a group message to the model and sends a reply', async () => {
    const adapter = makeAdapter()
    const callModel = vi.fn().mockResolvedValue({ content: '你好呀' })
    const svc = new ShiningQqService(adapter, callModel, () => settings())
    await svc.handleMessage({ kind: 'group', peerId: 'G1', senderId: 'u', content: '在吗' })
    expect(callModel).toHaveBeenCalled()
    expect(adapter.sent).toHaveLength(1)
    expect(adapter.sent[0]).toMatchObject({ content: '你好呀' })
    svc.dispose()
  })

  it('enforces the group allowlist', async () => {
    const adapter = makeAdapter()
    const callModel = vi.fn().mockResolvedValue({ content: 'x' })
    const svc = new ShiningQqService(adapter, callModel, () => settings({ qq: { enabled: true, appId: 'a', appSecret: 's', groupAllow: ['G-ALLOWED'], personaPrompt: 'p' } }))
    await svc.handleMessage({ kind: 'group', peerId: 'G-OTHER', senderId: 'u', content: 'hi' })
    expect(callModel).not.toHaveBeenCalled()
    expect(adapter.sent).toHaveLength(0)
    svc.dispose()
  })

  it('persists a session and lists it', async () => {
    const adapter = makeAdapter()
    const svc = new ShiningQqService(adapter, vi.fn().mockResolvedValue({ content: 'ok' }), () => settings())
    await svc.handleMessage({ kind: 'c2c', peerId: 'U1', senderId: 'u', content: 'hello' })
    expect(svc.list().some((s) => s.peerId === 'U1')).toBe(true)
    expect(listQqSessions().some((s) => s.peerId === 'U1')).toBe(true)
    svc.dispose()
  })

  it('does not respond when qq disabled', async () => {
    const adapter = makeAdapter()
    const callModel = vi.fn()
    const svc = new ShiningQqService(adapter, callModel, () => settings({ qq: { enabled: false, appId: 'a', appSecret: 's', groupAllow: [], personaPrompt: 'p' } }))
    await svc.handleMessage({ kind: 'c2c', peerId: 'U', senderId: 'u', content: 'hi' })
    expect(callModel).not.toHaveBeenCalled()
    svc.dispose()
  })
})
