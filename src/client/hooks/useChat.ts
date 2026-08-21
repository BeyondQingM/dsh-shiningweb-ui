/** useChat：独立模型聊天（IndexedDB 历史 + remote.chat 调用）。 */
import { useCallback, useEffect, useState } from 'react'
import type { ShiningSettings } from '../../settings.ts'
import type { ChatMessage, ChatRequest, ChatValue } from '../../types.ts'
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

  const append = useCallback(async (role: 'user' | 'assistant', content: string) => {
    const next: ChatRecord = {
      id: rec?.id ?? `${personaId}-${Date.now()}`,
      personaId,
      messages: [...(rec?.messages ?? []), { role, content }],
      updatedAt: Date.now(),
    }
    await saveChat(next)
    setRec(next)
  }, [rec, personaId])

  const send = useCallback(async (text: string): Promise<void> => {
    if (busy || !text.trim() || !remote) return
    setBusy(true)
    try {
      await append('user', text.trim())
      const history = [...(rec?.messages ?? []), { role: 'user' as const, content: text.trim() }]
      const res = await remote.chat({
        messages: history,
        model: settings.chat.model,
        apiBase: settings.chat.apiBase,
        apiKey: settings.chat.apiKey,
      })
      const content = res.ok ? res.value.content : (res.error?.message ?? '请求失败')
      await append('assistant', content)
    } finally {
      setBusy(false)
    }
  }, [append, busy, rec, remote, settings.chat])

  return { rec, busy, send }
}
