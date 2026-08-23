import type { ShiningSettings } from './settings.ts';
/** QQ 入站消息最小形态。 */
export interface QqMessage {
    kind: 'group' | 'c2c';
    peerId: string;
    senderId: string;
    senderName?: string;
    content: string;
    messageId?: string;
}
/** 一个 QQ 会话（per peer）。 */
export interface QqSession {
    key: string;
    peerId: string;
    kind: 'group' | 'c2c';
    messages: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
    updatedAt: number;
}
/** 传输适配器（可注入 mock；真实实现 lazy-import @tencent-connect/qqbot-nodejs）。 */
export interface QqAdapter {
    onMessage(cb: (msg: QqMessage) => Promise<void>): () => void;
    sendMarkdown(target: {
        scope: string;
        targetId: string;
        msgId?: string;
    }, content: string): Promise<void>;
    start(): void;
    stop(): void;
}
/** 独立模型调用最小面（host fetch，复用天圆地方独立模型配置）。 */
export type QqModelCall = (messages: Array<{
    role: string;
    content: string;
}>, settings: ShiningSettings) => Promise<{
    content: string;
}>;
/** 覆盖会话存储根目录（测试用；默认 ~/.dsh/shiningweb/qq-store）。 */
export declare function setQqStoreRoot(dir: string): void;
/** 读取一组会话（GUI 用）。 */
export declare function listQqSessions(): QqSession[];
/** 读取一个会话。 */
export declare function readQqSession(key: string): QqSession | undefined;
/**
 * ShiningQqService：bot.on('message') → 会话缓冲 → 独立模型 → bot.sendMarkdown 回复。
 * @param adapter - 传输适配器。
 * @param callModel - 独立模型调用。
 * @param readSettings - 读天圆地方 settings（含 qq/chat/独立模型配置）。
 * @param getGroupAllow - 群号白名单（空=允许所有）。
 */
export declare class ShiningQqService {
    private readonly adapter;
    private readonly callModel;
    private readonly readSettings;
    private readonly sessions;
    private disposed;
    private readonly disposeMessage;
    constructor(adapter: QqAdapter, callModel: QqModelCall, readSettings: () => ShiningSettings);
    /** 处理一条 QQ 消息。 */
    handleMessage(msg: QqMessage): Promise<void>;
    /** 列出会话（GUI）。 */
    list(): QqSession[];
    /** 读取某会话（GUI）。 */
    read(key: string): QqSession | undefined;
    /** GUI 主动发一条消息到某 QQ 会话（追加 assistant 消息 + sendMarkdown）。 */
    sendTo(key: string, content: string): Promise<void>;
    /** 停止。 */
    dispose(): void;
}
/**
 * 真实 QQ connector 适配器：lazy-import @tencent-connect/qqbot-nodejs。
 * rc2 仅做 text 消息；media/vision 后续。
 */
export declare function createQqAdapter(appId: string, appSecret: string): Promise<QqAdapter>;
/** 真实独立模型调用（host fetch，用天圆地方独立模型配置）。 */
export declare function createQqModelCall(): QqModelCall;
