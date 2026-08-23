/** 面板开关共享状态（模块级 store，useSyncExternalStore 订阅）。 */
import { useSyncExternalStore } from 'react';
let state = { chatOpen: false, filesOpen: false };
const listeners = new Set();
function emit() {
    for (const l of listeners)
        l();
}
function set(next) {
    state = { ...state, ...next };
    emit();
}
export function useShiningStore() {
    return useSyncExternalStore((l) => { listeners.add(l); return () => { listeners.delete(l); }; }, () => state);
}
export function openChat() { set({ chatOpen: true }); }
export function closeChat() { set({ chatOpen: false }); }
export function toggleChat() { set({ chatOpen: !state.chatOpen }); }
export function openFiles() { set({ filesOpen: true }); }
export function closeFiles() { set({ filesOpen: false }); }
export function toggleFiles() { set({ filesOpen: !state.filesOpen }); }
