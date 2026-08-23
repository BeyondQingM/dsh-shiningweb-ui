/**
 * 聚合记忆上下文（发起前调用）：读 dsh-mneme 相关记忆 + 天圆地方自持记忆。
 * dsh-mneme 不可用时优雅降级为自持记忆。
 * @param query - 用于 dsh-mneme 检索的关键词（通常为当前用户输入）。
 */
export declare function readMemoryContext(query: string): Promise<string>;
/** 记录一条天圆地方记忆（自持 IndexedDB 写）。 */
export declare function saveMemory(content: string): Promise<void>;
