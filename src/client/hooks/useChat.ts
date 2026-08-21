/** useChat：独立模型聊天（IndexedDB 历史 + remote.chat 调用）。 */
import { useCallback, useEffect, useState } from 'react'
import type { ShiningSettings } from '../../settings.ts'
import type { ChatRequest, ChatValue } from '../../types.ts'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import { loadChat, saveChat, type ChatRecord } from '../storage.ts'

/** ctx.remote.shining 的最小面。 */
export interface ChatRemote {
  chat: (request: ChatRequest) => Promise<RemoteResult<ChatValue>>
}

export function useChat(personaId: string, remote: ChatRemote | undefined, settings: ShiningSettings) {
  const [rec, setRec] = useState<ChatRecord | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    void loadChat(personaId).then((r) => { if (alive) setRec(r ?? null) })
    return () => { alive = false }
  }, [personaId])

  const send = useCallback(async (text: string): Promise<void> => {
    if (busy || !text.trim() || !remote) return
    setBusy(true)
    try {
      const base = rec?.messages ?? []
      const userMsg = { role: 'user' as const, content: text.trim() }
      const withUser = [...base, userMsg]
      const nextRec: ChatRecord = { id: rec?.id ?? `${personaId}-${Date.now()}`, personaId, messages: withUser, updatedAt: Date.now() }
      await saveChat(nextRec)
      setRec(nextRec)
      const res = await remote.chat({ messages: withUser, model: settings.chat.model, apiBase: settings.chat.apiBase, apiKey: settings.chat.apiKey })
      const content = res.ok ? res.value.content : (res.error?.message ?? '请求失败')
      const finalRec: ChatRecord = { ...nextRec, messages: [...withUser, { role: 'assistant', content }], updatedAt: Date.now() }
      await saveChat(finalRec)
      setRec(finalRec)
    } finally {
      setBusy(false)
    }
  }, [busy, rec, remote, settings.chat, personaId])

  return { rec, busy, send }
}
