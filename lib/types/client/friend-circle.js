/** 天圆地方朋友圈：动态/点赞/评论（IndexedDB）。 */
const FC_DB = 'shining-friend-circle';
const FC_STORE = 'posts';
function openDb() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(FC_DB, 1);
        req.onupgradeneeded = () => { req.result.createObjectStore(FC_STORE, { keyPath: 'id' }); };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
/** 发布一条动态。 */
export async function addPost(personaId, content) {
    const db = await openDb();
    const post = { id: `post-${Date.now()}`, personaId, content, createdAt: Date.now(), likes: [], comments: [] };
    const tx = db.transaction(FC_STORE, 'readwrite');
    tx.objectStore(FC_STORE).put(post);
    await new Promise((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); });
}
/** 列出某角色的全部动态（倒序）。 */
export async function listPosts(personaId) {
    const db = await openDb();
    return new Promise((res, rej) => {
        const rq = db.transaction(FC_STORE).objectStore(FC_STORE).getAll();
        rq.onsuccess = () => res(rq.result.filter((p) => p.personaId === personaId).sort((a, b) => b.createdAt - a.createdAt));
        rq.onerror = () => rej(rq.error);
    });
}
/** 点赞/取消点赞（toggle）。 */
export async function toggleLike(postId, liker) {
    const db = await openDb();
    const rq = db.transaction(FC_STORE).objectStore(FC_STORE).get(postId);
    const post = await new Promise((res, rej) => { rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error); });
    if (!post)
        return;
    const likes = post.likes.includes(liker) ? post.likes.filter((l) => l !== liker) : [...post.likes, liker];
    await putPost(db, { ...post, likes });
}
/** 添加评论。 */
export async function addComment(postId, author, content) {
    const db = await openDb();
    const rq = db.transaction(FC_STORE).objectStore(FC_STORE).get(postId);
    const post = await new Promise((res, rej) => { rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error); });
    if (!post)
        return;
    await putPost(db, { ...post, comments: [...post.comments, { id: `c-${Date.now()}`, author, content, createdAt: Date.now() }] });
}
async function putPost(db, post) {
    const tx = db.transaction(FC_STORE, 'readwrite');
    tx.objectStore(FC_STORE).put(post);
    await new Promise((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); });
}
