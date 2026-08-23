/**
 * 本地存储：IndexedDB（聊天历史）+ localStorage（立绘/背景，限尺寸）。
 */
const DB = 'shining-chat'
const STORE = 'history'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => { req.result.createObjectStore(STORE, { keyPath: 'id' }) }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export interface ChatMessageRecord { role: 'system' | 'user' | 'assistant'; content: string }
export interface ChatRecord {
  id: string
  personaId: string
  messages: ChatMessageRecord[]
  updatedAt: number
}

/** 保存一次会话历史（按 id 覆盖）。 */
export async function saveChat(rec: ChatRecord): Promise<void> {
  const db = await openDb()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).put(rec)
  await new Promise<void>((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error) })
}

/** 读取指定角色最近一次会话。 */
export async function loadChat(personaId: string): Promise<ChatRecord | undefined> {
  const db = await openDb()
  return new Promise((res, rej) => {
    const all = db.transaction(STORE).objectStore(STORE).getAll()
    all.onsuccess = () => {
      const list = (all.result as ChatRecord[])
        .filter((r) => r.personaId === personaId)
        .sort((a, b) => b.updatedAt - a.updatedAt)
      res(list[0])
    }
    all.onerror = () => rej(all.error)
  })
}

/** 立绘图片（Base64 DataURL）存取，限 2MB。 */
const IMG_KEY = 'shining:image'
export function setImage(dataUrl: string): void { localStorage.setItem(IMG_KEY, dataUrl) }
export function getImage(): string | null { return localStorage.getItem(IMG_KEY) }
export function clearImage(): void { localStorage.removeItem(IMG_KEY) }

/** 压缩图片到最大 1024px，JPEG 0.8，仍超 2MB 则拒绝。 */
export async function compressImage(file: File): Promise<string> {
  const dataUrl = await readDataUrl(file)
  const img = await loadImage(dataUrl)
  const max = 1024
  const scale = Math.min(1, max / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(img.width * scale))
  canvas.height = Math.max(1, Math.round(img.height * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas unavailable')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const out = canvas.toDataURL('image/jpeg', 0.8)
  if (out.length > 2 * 1024 * 1024) throw new Error('image too large (>2MB)')
  return out
}

function readDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(file) })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = () => rej(new Error('image load failed')); img.src = src })
}

// ── 天圆地方自持记忆（IndexedDB） ──
const MEM_DB = 'shining-memory'
const MEM_STORE = 'memory'

function openMemDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(MEM_DB, 1)
    req.onupgradeneeded = () => { req.result.createObjectStore(MEM_STORE, { keyPath: 'id' }) }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export interface MemoryNote { id: string; content: string; createdAt: number }

/** 记录一条天圆地方记忆（自持 IndexedDB 写）。 */
export async function saveMemoryNote(content: string): Promise<void> {
  const db = await openMemDb()
  const rec: MemoryNote = { id: `mem-${Date.now()}`, content, createdAt: Date.now() }
  const tx = db.transaction(MEM_STORE, 'readwrite')
  tx.objectStore(MEM_STORE).put(rec)
  await new Promise<void>((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error) })
}

/** 读取天圆地方自持记忆（倒序，最多 limit 条）。 */
export async function listMemoryNotes(limit = 10): Promise<MemoryNote[]> {
  const db = await openMemDb()
  return new Promise((res, rej) => {
    const rq = db.transaction(MEM_STORE).objectStore(MEM_STORE).getAll()
    rq.onsuccess = () => res((rq.result as MemoryNote[]).sort((a, b) => b.createdAt - a.createdAt).slice(0, limit))
    rq.onerror = () => rej(rq.error)
  })
}
