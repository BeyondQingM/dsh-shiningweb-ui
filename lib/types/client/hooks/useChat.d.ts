import type { ShiningSettings } from '../../settings.ts';
import type { ChatRequest, ChatValue } from '../../types.ts';
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol';
import { type ChatRecord } from '../storage.ts';
/** ctx.remote.shining 的最小面。 */
export interface ChatRemote {
    chat: (request: ChatRequest) => Promise<RemoteResult<ChatValue>>;
}
export declare function useChat(personaId: string, remote: ChatRemote | undefined, settings: ShiningSettings): {
    rec: ChatRecord | null;
    busy: boolean;
    send: (text: string, contextText?: string) => Promise<void>;
};
