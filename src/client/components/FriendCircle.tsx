/** 天圆地方朋友圈：动态列表 + 发布 + 点赞 + 评论。 */
import { useEffect, useState } from 'react'
import { addPost, listPosts, toggleLike, addComment, type FriendPost } from '../friend-circle.ts'
import styles from './FriendCircle.module.css'

export function FriendCircle(props: { personaId: string }): React.ReactNode {
  const [posts, setPosts] = useState<FriendPost[]>([])
  const [draft, setDraft] = useState('')

  const refresh = () => { void listPosts(props.personaId).then(setPosts) }
  useEffect(() => { refresh() }, [props.personaId])

  const publish = async () => {
    if (!draft.trim()) return
    await addPost(props.personaId, draft.trim())
    setDraft('')
    refresh()
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.composer}>
        <textarea className={styles.textarea} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="这一刻的想法…" />
        <button className={styles.publish} onClick={() => void publish()} disabled={!draft.trim()}>发表</button>
      </div>
      <ul className={styles.list}>
        {posts.map((p) => (
          <li key={p.id} className={styles.post}>
            <p className={styles.content}>{p.content}</p>
            <div className={styles.meta}>
              <span className={styles.time}>{new Date(p.createdAt).toLocaleString()}</span>
              <button className={styles.action} onClick={() => void toggleLike(p.id, 'me').then(refresh)}>赞 {p.likes.length}</button>
            </div>
            <ul className={styles.comments}>
              {p.comments.map((c) => <li key={c.id} className={styles.comment}><b>{c.author}：</b>{c.content}</li>)}
            </ul>
          </li>
        ))}
        {posts.length === 0 ? <li className={styles.empty}>还没有动态</li> : null}
      </ul>
    </div>
  )
}
