export interface ChatMessageRecord {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface ChatRecord {
    id: string;
    personaId: string;
    messages: ChatMessageRecord[];
    updatedAt: number;
}
/** 保存一次会话历史（按 id 覆盖）。 */
export declare function saveChat(rec: ChatRecord): Promise<void>;
/** 读取指定角色最近一次会话。 */
export declare function loadChat(personaId: string): Promise<ChatRecord | undefined>;
export declare function setImage(dataUrl: string): void;
export declare function getImage(): string | null;
export declare function clearImage(): void;
/** 压缩图片到最大 1024px，JPEG 0.8，仍超 2MB 则拒绝。 */
export declare function compressImage(file: File): Promise<string>;
export interface MemoryNote {
    id: string;
    content: string;
    createdAt: number;
}
/** 记录一条天圆地方记忆（自持 IndexedDB 写）。 */
export declare function saveMemoryNote(content: string): Promise<void>;
/** 读取天圆地方自持记忆（倒序，最多 limit 条）。 */
export declare function listMemoryNotes(limit?: number): Promise<MemoryNote[]>;
