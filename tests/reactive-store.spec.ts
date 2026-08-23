import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { setWorkspaceRoot, useWorkspaceRoot, getWorkspaceRoot } from '../src/client/workspace.ts'
import { setShiningRemote, useShiningRemote } from '../src/client/remote-types.ts'

describe('workspace root reactive store (git-refresh regression)', () => {
  beforeEach(() => setWorkspaceRoot(''))

  it('reactively updates components when the root path changes', () => {
    const { result } = renderHook(() => useWorkspaceRoot())
    expect(result.current).toBe('')
    act(() => setWorkspaceRoot('/repo/a'))
    expect(getWorkspaceRoot()).toBe('/repo/a')
    expect(result.current).toBe('/repo/a')
  })

  it('keeps a stable value when set to the same root', () => {
    setWorkspaceRoot('/repo/a')
    const { result } = renderHook(() => useWorkspaceRoot())
    expect(result.current).toBe('/repo/a')
    act(() => setWorkspaceRoot('/repo/a')) // 相同值：不抛错、结果不变
    expect(result.current).toBe('/repo/a')
  })
})

describe('shining remote reactive store', () => {
  beforeEach(() => setShiningRemote(undefined))

  it('reactively updates when the remote is mounted', () => {
    const { result } = renderHook(() => useShiningRemote())
    expect(result.current).toBeUndefined()
    act(() => setShiningRemote({ fsList: vi.fn() } as never))
    expect(result.current).toBeDefined()
  })
})
