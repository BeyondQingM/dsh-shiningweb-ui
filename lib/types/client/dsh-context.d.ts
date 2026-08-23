import type { ClientContext, SessionId, WorkspaceId } from '@deepseek-ai/dsh-client-runtime/client';
/** apply 时绑定 DSH 客户端上下文。 */
export declare function bindDshCtx(c: ClientContext): void;
export interface DshWorkspace {
    id: WorkspaceId;
    title: string;
    path: string;
}
export interface DshSession {
    id: SessionId;
    title: string;
    cwd: string | undefined;
}
export interface DshContext {
    workspaces: DshWorkspace[];
    sessions: DshSession[];
    currentSessionId: SessionId | undefined;
}
/** 同步聚合 DSH 概况（工作区/会话/当前会话）。 */
export declare function gatherDshContext(): DshContext;
/** 响应式读 DSH 概况（快照缓存，仅在列表变化时重算）。 */
export declare function useDshContext(): DshContext;
/** 把 DSH 概况格式化为 model 上下文块（注入独立模型 system prompt）。 */
export declare function dshContextToText(c: DshContext): string;
/**
 * 代发：把一段内容作为"一轮"送进指定 DSH 会话（主 agent 处理）。
 * @param sessionId - 目标会话。
 * @param text - 任务内容。
 */
export declare function sendToSession(sessionId: SessionId, text: string): Promise<boolean>;
/** 当前会话 id（异步绑定场景兜底）。 */
export declare function getCurrentSessionId(): SessionId | undefined;
