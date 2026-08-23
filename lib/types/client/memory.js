/** 天圆地方记忆：读 dsh-mneme（HTTP）+ 自持 IndexedDB，拼成注入上下文的文本。 */
import { listMemoryNotes, saveMemoryNote } from "./storage.js";
/**
 * 聚合记忆上下文（发起前调用）：读 dsh-mneme 相关记忆 + 天圆地方自持记忆。
 * dsh-mneme 不可用时优雅降级为自持记忆。
 * @param query - 用于 dsh-mneme 检索的关键词（通常为当前用户输入）。
 */
export async function readMemoryContext(query) {
    const chunks = [];
    try {
        const res = await fetch(`/api/dsh-mneme/search?q=${encodeURIComponent(query)}&limit=5`);
        if (res.ok) {
            const data = (await res.json());
            for (const it of data.items ?? []) {
                const content = it.content ?? '';
                if (content)
                    chunks.push(`【记忆】${it.title ? `${it.title}：` : ''}${content}`);
            }
        }
    }
    catch { /* dsh-mneme 不可用则忽略 */ }
    for (const n of await listMemoryNotes(3))
        chunks.push(`【天圆地方记忆】${n.content}`);
    return chunks.slice(0, 6).join('\n');
}
/** 记录一条天圆地方记忆（自持 IndexedDB 写）。 */
export function saveMemory(content) {
    return saveMemoryNote(content);
}
