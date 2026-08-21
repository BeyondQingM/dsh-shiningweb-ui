import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFileTree } from '../src/client/hooks/useFileTree.ts'
import { useGitBranch } from '../src/client/hooks/useGitBranch.ts'
import { useChat } from '../src/client/hooks/useChat.ts'

// jsdom 无 IndexedDB，mock 掉 storage 模块。
vi.mock('../src/client/storage.ts', () => ({
  loadChat: vi.fn().mockResolvedValue(undefined),
  saveChat: vi.fn().mockResolvedValue(undefined),
}))

describe('useFileTree', () => {
  it('lazily loads a directory on expand', async () => {
    const fsList = vi.fn().mockResolvedValue({ ok: true, value: { entries: [{ name: 'a.txt', isDirectory: false, size: 1 }] } })
    const { result } = renderHook(() => useFileTree('/root', false, { fsList } as never))
    await act(async () => { await result.current.toggle('') })
    expect(fsList).toHaveBeenCalledWith({ root: '/root', path: '.', showHidden: false })
    expect(result.current.children['']).toEqual([{ name: 'a.txt', isDirectory: false, size: 1 }])
    expect(result.current.expanded['']).toBe(true)
  })
})

describe('useGitBranch', () => {
  it('refreshes branch status', async () => {
    const gitStatus = vi.fn().mockResolvedValue({ ok: true, value: { branch: 'main', dirtyCount: 2, changes: [] } })
    const { result } = renderHook(() => useGitBranch('/root', { gitStatus } as never))
    await act(async () => { await result.current.refresh() })
    expect(result.current.state.branch).toBe('main')
    expect(result.current.state.dirtyCount).toBe(2)
  })
})

describe('useChat', () => {
  it('appends user + assistant messages via remote.chat', async () => {
    const chat = vi.fn().mockResolvedValue({ ok: true, value: { content: 'hi' } })
    const settings = { chat: { model: 'm', apiBase: 'https://x', apiKey: 'k' } } as never
    const { result } = renderHook(() => useChat('p', { chat } as never, settings))
    await act(async () => { await result.current.send('hello') })
    expect(chat).toHaveBeenCalled()
    const messages = (result.current.rec?.messages ?? []).map((m) => m.role)
    expect(messages).toEqual(['user', 'assistant'])
  })
})
