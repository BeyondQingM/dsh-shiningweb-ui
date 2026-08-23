/** 天圆地方 QQ 会话视图（从 host 会话层读取 + 回复）。 */
import { useEffect, useState } from 'react'
import { getShiningRemote } from '../remote-types.ts'
import type { QqSessionView } from '../../types.ts'
import styles from './QqSessions.module.css'

export function QqSessions(): React.ReactNode {
  const [sessions, setSessions] = useState<QqSessionView[]>([])
  const [open, setOpen] = useState<QqSessionView | null>(null)
  const [draft, setDraft] = useState('')
  const remote = getShiningRemote()

  const refresh = () => { void remote?.qqList({}).then((r) => { if (r.ok) setSessions(r.value.sessions) }) }
  useEffect(() => { refresh() }, [])

  const openSession = (s: QqSessionView) => {
    if (remote) void remote.qqRead({ key: s.key }).then((r) => { if (r.ok && r.value.session) setOpen(r.value.session) })
  }
  const reply = async () => {
    if (!open || !draft.trim() || !remote) return
    await remote.qqSend({ key: open.key, content: draft.trim() })
    setDraft('')
    refresh()
    void remote.qqRead({ key: open.key }).then((r) => { if (r.ok && r.value.session) setOpen(r.value.session) })
  }

  return (
    <div className={styles.wrap}>
      <button className={styles.refresh} onClick={() => { refresh() }}>刷新</button>
      <ul className={styles.list}>
        {sessions.map((s) => (
          <li key={s.key}>
            <button className={styles.session} onClick={() => openSession(s)}>
              <span className={styles.peer}>{s.kind === 'group' ? `群 ${s.peerId}` : `私聊 ${s.peerId}`}</span>
              <span className={styles.preview}>{s.messages[s.messages.length - 1]?.content?.slice(0, 30) ?? ''}</span>
            </button>
          </li>
        ))}
        {sessions.length === 0 ? <li className={styles.empty}>暂无 QQ 会话（需配置 QQ 并接收消息）</li> : null}
      </ul>
      {open ? (
        <div className={styles.detail}>
          <ul className={styles.messages}>
            {open.messages.map((m, i) => <li key={i} className={m.role === 'user' ? styles.user : styles.assistant}>{m.content}</li>)}
          </ul>
          <div className={styles.composer}>
            <input className={styles.input} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="回复…" onKeyDown={(e) => { if (e.key === 'Enter') void reply() }} />
            <button className={styles.send} onClick={() => void reply()} disabled={!draft.trim()}>发送</button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
