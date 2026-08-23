/** useChat：独立模型聊天（IndexedDB 历史 + remote.chat 调用）。 */
import { useCallback, useEffect, useState } from 'react';
import { loadChat, saveChat } from "../storage.js";
export function useChat(personaId, remote, settings) {
    const [rec, setRec] = useState(null);
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        let alive = true;
        void loadChat(personaId).then((r) => { if (alive)
            setRec(r ?? null); });
        return () => { alive = false; };
    }, [personaId]);
    const send = useCallback(async (text, contextText) => {
        if (busy || !text.trim() || !remote)
            return;
        setBusy(true);
        try {
            const base = rec?.messages ?? [];
            const userMsg = { role: 'user', content: text.trim() };
            const withUser = [...base, userMsg];
            const nextRec = { id: rec?.id ?? `${personaId}-${Date.now()}`, personaId, messages: withUser, updatedAt: Date.now() };
            await saveChat(nextRec);
            setRec(nextRec);
            const modelMessages = contextText ? [{ role: 'system', content: contextText }, ...withUser] : withUser;
            const res = await remote.chat({ messages: modelMessages, model: settings.chat.model, apiBase: settings.chat.apiBase, apiKey: settings.chat.apiKey });
            const content = res.ok ? res.value.content : (res.error?.message ?? '请求失败');
            const finalRec = { ...nextRec, messages: [...withUser, { role: 'assistant', content }], updatedAt: Date.now() };
            await saveChat(finalRec);
            setRec(finalRec);
        }
        finally {
            setBusy(false);
        }
    }, [busy, rec, remote, settings.chat, personaId]);
    return { rec, busy, send };
}
