/**
 * 天圆地方 QQ 会话层（host）。
 * 自持 per-peer 会话（JSON 存储），路由到天圆地方独立模型回复，不建 DSH 会话（零侧边栏污染）。
 * connector 可注入（QqAdapter），逻辑层可单测；真实 QQ 凭据由用户在真实环境验证。
 */
import { readdirSync, chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { ShiningSettings } from './settings.ts'

/** QQ 入站消息最小形态。 */
export interface QqMessage {
  kind: 'group' | 'c2c'
  peerId: string
  senderId: string
  senderName?: string
  content: string
  messageId?: string
}

/** 一个 QQ 会话（per peer）。 */
export interface QqSession {
  key: string
  peerId: string
  kind: 'group' | 'c2c'
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  updatedAt: number
}

/** 传输适配器（可注入 mock；真实实现 lazy-import @tencent-connect/qqbot-nodejs）。 */
export interface QqAdapter {
  onMessage(cb: (msg: QqMessage) => Promise<void>): () => void
  sendMarkdown(target: { scope: string; targetId: string; msgId?: string }, content: string): Promise<void>
  start(): void
  stop(): void
}

/** 独立模型调用最小面（host fetch，复用天圆地方独立模型配置）。 */
export type QqModelCall = (messages: Array<{ role: string; content: string }>, settings: ShiningSettings) => Promise<{ content: string }>

let storeRoot = join(homedir(), '.dsh', 'shiningweb', 'qq-store')

/** 覆盖会话存储根目录（测试用；默认 ~/.dsh/shiningweb/qq-store）。 */
export function setQqStoreRoot(dir: string): void { storeRoot = dir }

const STORE_ROOT = () => storeRoot

function storeFile(key: string): string {
  const safe = key.replace(/[\\/:]/g, '_')
  return join(STORE_ROOT(), `${safe}.json`)
}

function ensureDir(): void {
  mkdirSync(STORE_ROOT(), { recursive: true })
}

/** 读取一组会话（GUI 用）。 */
export function listQqSessions(): QqSession[] {
  if (!existsSync(STORE_ROOT())) return []
  const files = readdirSafe(STORE_ROOT())
  const sessions: QqSession[] = []
  for (const f of files) {
    try {
      const raw = readFileSync(join(STORE_ROOT(), f), 'utf8')
      const rec = JSON.parse(raw) as QqSession
      if (rec && rec.key) sessions.push(rec)
    } catch { /* 跳过损坏会话 */ }
  }
  return sessions.sort((a, b) => b.updatedAt - a.updatedAt)
}

/** 读取一个会话。 */
export function readQqSession(key: string): QqSession | undefined {
  const file = storeFile(key)
  if (!existsSync(file)) return undefined
  try { return JSON.parse(readFileSync(file, 'utf8')) as QqSession } catch { return undefined }
}

function writeSession(session: QqSession): void {
  ensureDir()
  writeFileSync(storeFile(session.key), JSON.stringify(session, null, 2), 'utf8')
  try { chmodSync(storeFile(session.key), 0o600) } catch { /* chmod 可选 */ }
}

function readdirSafe(dir: string): string[] {
  try { return readdirSync(dir) } catch { return [] }
}

/**
 * ShiningQqService：bot.on('message') → 会话缓冲 → 独立模型 → bot.sendMarkdown 回复。
 * @param adapter - 传输适配器。
 * @param callModel - 独立模型调用。
 * @param readSettings - 读天圆地方 settings（含 qq/chat/独立模型配置）。
 * @param getGroupAllow - 群号白名单（空=允许所有）。
 */
export class ShiningQqService {
  private readonly sessions = new Map<string, QqSession>()
  private disposed = false
  private readonly disposeMessage: () => void

  constructor(
    private readonly adapter: QqAdapter,
    private readonly callModel: QqModelCall,
    private readonly readSettings: () => ShiningSettings,
  ) {
    this.disposeMessage = adapter.onMessage((msg) => this.handleMessage(msg))
  }

  /** 处理一条 QQ 消息。 */
  async handleMessage(msg: QqMessage): Promise<void> {
    if (this.disposed) return
    const settings = this.readSettings()
    if (!settings?.qq?.enabled) return
    // 群白名单
    const isGroup = msg.kind === 'group'
    if (isGroup && settings.qq.groupAllow.length > 0 && !settings.qq.groupAllow.includes(msg.peerId)) return

    const key = `${msg.kind}:${msg.peerId}`
    let session = this.sessions.get(key) ?? readQqSession(key)
    if (!session) {
      session = { key, peerId: msg.peerId, kind: msg.kind, messages: [], updatedAt: Date.now() }
    }

    const persona = settings.qq.personaPrompt
    const hist = session.messages.slice(-10).map((m) => ({ role: m.role, content: m.content }))
    const modelMessages = [
      { role: 'system' as const, content: persona },
      ...hist,
      { role: 'user' as const, content: msg.content },
    ]
    let reply = '（回复失败）'
    try {
      const res = await this.callModel(modelMessages as Array<{ role: string; content: string }>, settings)
      reply = res.content || '（空回复）'
    } catch { /* 保留默认失败文案 */ }

    session.messages.push({ role: 'user', content: msg.content }, { role: 'assistant', content: reply })
    session.updatedAt = Date.now()
    this.sessions.set(key, session)
    writeSession(session)

    await this.adapter.sendMarkdown({ scope: msg.kind, targetId: msg.peerId, msgId: msg.messageId }, reply)
  }

  /** 列出会话（GUI）。 */
  list(): QqSession[] { return [...this.sessions.values()].sort((a, b) => b.updatedAt - a.updatedAt) }

  /** 读取某会话（GUI）。 */
  read(key: string): QqSession | undefined { return this.sessions.get(key) ?? readQqSession(key) }

  /** GUI 主动发一条消息到某 QQ 会话（追加 assistant 消息 + sendMarkdown）。 */
  async sendTo(key: string, content: string): Promise<void> {
    const session = this.sessions.get(key) ?? readQqSession(key)
    if (!session) return
    session.messages.push({ role: 'assistant', content })
    session.updatedAt = Date.now()
    this.sessions.set(key, session)
    writeSession(session)
    await this.adapter.sendMarkdown({ scope: session.kind, targetId: session.peerId }, content)
  }

  /** 停止。 */
  dispose(): void {
    this.disposed = true
    this.disposeMessage()
    this.adapter.stop()
  }
}

/**
 * 真实 QQ connector 适配器：lazy-import @tencent-connect/qqbot-nodejs。
 * rc2 仅做 text 消息；media/vision 后续。
 */
export async function createQqAdapter(appId: string, appSecret: string): Promise<QqAdapter> {
  const { QQBot } = await import('@tencent-connect/qqbot-nodejs')
  const bot = new QQBot({ appId, appSecret, transport: 'websocket' } as ConstructorParameters<typeof QQBot>[0])
  return {
    onMessage: (cb) => {
      // rc2 仅处理 text；SDK 消息形态复杂，此处宽松提取。
      bot.on('message', (mCtx: unknown) => {
        const ctx = mCtx as { message?: Record<string, unknown> }
        const m = (ctx?.message ?? mCtx) as Record<string, unknown>
        const kind = m.kind === 'group' ? 'group' as const : 'c2c' as const
        const peerId = kind === 'group' ? String(m.groupOpenid ?? m.senderId ?? '') : String(m.senderId ?? '')
        void cb({
          kind,
          peerId,
          senderId: String(m.senderId ?? peerId),
          senderName: typeof m.senderName === 'string' ? m.senderName : undefined,
          content: typeof m.content === 'string' ? m.content : '',
        })
      })
      return () => {}
    },
    sendMarkdown: async (target, content) => {
      await bot.sendMarkdown({ scope: target.scope as 'group' | 'c2c', targetId: target.targetId, msgId: target.msgId }, content)
    },
    start: () => { void bot.start().catch(() => {}) },
    stop: () => { bot.stop() },
  }
}

/** 真实独立模型调用（host fetch，用天圆地方独立模型配置）。 */
export function createQqModelCall(): QqModelCall {
  return async (messages, settings) => {
    const res = await fetch(`${settings.chat.apiBase.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${settings.chat.apiKey}` },
      body: JSON.stringify({ model: settings.chat.model, messages, stream: false }),
      signal: AbortSignal.timeout(120000),
    })
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> }
    return { content: data.choices?.[0]?.message?.content ?? '' }
  }
}
