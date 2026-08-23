/** 天圆地方朋友圈：动态/点赞/评论（IndexedDB）。 */
const FC_DB = 'shining-friend-circle'
const FC_STORE = 'posts'

export interface FriendComment { id: string; author: string; content: string; createdAt: number }
export interface FriendPost {
  id: string
  personaId: string
  content: string
  createdAt: number
  likes: string[]
  comments: FriendComment[]
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(FC_DB, 1)
    req.onupgradeneeded = () => { req.result.createObjectStore(FC_STORE, { keyPath: 'id' }) }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

/** 发布一条动态。 */
export async function addPost(personaId: string, content: string): Promise<void> {
  const db = await openDb()
  const post: FriendPost = { id: `post-${Date.now()}`, personaId, content, createdAt: Date.now(), likes: [], comments: [] }
  const tx = db.transaction(FC_STORE, 'readwrite')
  tx.objectStore(FC_STORE).put(post)
  await new Promise<void>((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error) })
}

/** 列出某角色的全部动态（倒序）。 */
export async function listPosts(personaId: string): Promise<FriendPost[]> {
  const db = await openDb()
  return new Promise((res, rej) => {
    const rq = db.transaction(FC_STORE).objectStore(FC_STORE).getAll()
    rq.onsuccess = () => res((rq.result as FriendPost[]).filter((p) => p.personaId === personaId).sort((a, b) => b.createdAt - a.createdAt))
    rq.onerror = () => rej(rq.error)
  })
}

/** 点赞/取消点赞（toggle）。 */
export async function toggleLike(postId: string, liker: string): Promise<void> {
  const db = await openDb()
  const rq = db.transaction(FC_STORE).objectStore(FC_STORE).get(postId)
  const post = await new Promise<FriendPost | undefined>((res, rej) => { rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error) })
  if (!post) return
  const likes = post.likes.includes(liker) ? post.likes.filter((l) => l !== liker) : [...post.likes, liker]
  await putPost(db, { ...post, likes })
}

/** 添加评论。 */
export async function addComment(postId: string, author: string, content: string): Promise<void> {
  const db = await openDb()
  const rq = db.transaction(FC_STORE).objectStore(FC_STORE).get(postId)
  const post = await new Promise<FriendPost | undefined>((res, rej) => { rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error) })
  if (!post) return
  await putPost(db, { ...post, comments: [...post.comments, { id: `c-${Date.now()}`, author, content, createdAt: Date.now() }] })
}

async function putPost(db: IDBDatabase, post: FriendPost): Promise<void> {
  const tx = db.transaction(FC_STORE, 'readwrite')
  tx.objectStore(FC_STORE).put(post)
  await new Promise<void>((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error) })
}
