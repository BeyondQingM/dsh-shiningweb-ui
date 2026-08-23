import { describe, it, expect, vi, beforeEach } from 'vitest'
import { bindDshCtx, gatherDshContext, dshContextToText, sendToSession } from '../src/client/dsh-context.ts'

function fakeCtx() {
  return {
    workspaces: {
      list: {
        getSnapshot: () => ({ items: [{ workspaceId: 'w1', title: 'projA', path: 'C:/projA' }] }),
        subscribe: () => () => {},
      },
    },
    sessions: {
      list: {
        getSnapshot: () => ({ ids: ['s1'], byId: { s1: { displayTitle: '会话1', cwd: 'C:/projA' } }, current: 's1' }),
        subscribe: () => () => {},
      },
      binding: (id: string) => ({ session: { prompt: vi.fn().mockResolvedValue({ ok: true }) } }),
    },
  } as never
}

describe('dsh-context', () => {
  beforeEach(() => { bindDshCtx(fakeCtx()) })

  it('gathers workspaces and sessions', () => {
    const c = gatherDshContext()
    expect(c.workspaces[0].title).toBe('projA')
    expect(c.sessions[0].title).toBe('会话1')
    expect(c.currentSessionId).toBe('s1')
  })

  it('formats context text', () => {
    const c = gatherDshContext()
    const text = dshContextToText(c)
    expect(text).toContain('projA')
    expect(text).toContain('会话1')
  })

  it('sends a prompt to a session', async () => {
    const ok = await sendToSession('s1', '帮我整理')
    expect(ok).toBe(true)
  })
})
