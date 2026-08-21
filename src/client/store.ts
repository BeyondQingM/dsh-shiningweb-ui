/** 面板开关共享状态（模块级 store，useSyncExternalStore 订阅）。 */
import { useSyncExternalStore } from 'react'

export interface ShiningPanels {
  chatOpen: boolean
  filesOpen: boolean
}

let state: ShiningPanels = { chatOpen: false, filesOpen: false }
const listeners = new Set<() => void>()

function emit(): void {
  for (const l of listeners) l()
}

function set(next: Partial<ShiningPanels>): void {
  state = { ...state, ...next }
  emit()
}

export function useShiningStore(): ShiningPanels {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => { listeners.delete(l) } },
    () => state,
  )
}

export function openChat(): void { set({ chatOpen: true }) }
export function closeChat(): void { set({ chatOpen: false }) }
export function toggleChat(): void { set({ chatOpen: !state.chatOpen }) }
export function openFiles(): void { set({ filesOpen: true }) }
export function closeFiles(): void { set({ filesOpen: false }) }
export function toggleFiles(): void { set({ filesOpen: !state.filesOpen }) }
