/** 天圆地方聊天窗（shell.overlay 全屏浮层）。 */
import { useState } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { useSettings } from '../settings.ts'
import { useShiningStore, closeChat } from '../store.ts'
import { useChat } from '../hooks/useChat.ts'
import { getShiningRemote } from '../remote-types.ts'
import { getImage, setImage, clearImage, compressImage } from '../storage.ts'
import { dict } from '../locales.ts'
import styles from './ChatWindow.module.css'

type Props = PropsRuntime<'shell.overlay'>

export function ChatWindow(_props: Props): React.ReactNode {
  const { chatOpen } = useShiningStore()
  const settings = useSettings()
  const [input, setInput] = useState('')
  const { rec, busy, send } = useChat(settings.chat.personaId || 'default', getShiningRemote(), settings)

  if (!chatOpen || !settings.enabled || !settings.chat.enabled) return null

  const onImage = async (file?: File) => {
    if (!file) return
    try { setImage(await compressImage(file)) } catch { /* 忽略超大图 */ }
  }
  const backgroundImage = getImage()

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={dict.zh.chatTitle}>
      <div className={styles.backdrop} onClick={closeChat} />
      <section className={styles.panel} style={{ backdropFilter: `blur(var(--shining-blur))`, backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>{dict.zh.chatTitle}</h2>
            <span className={styles.tag}>人格：{settings.chat.personaId || '默认'}</span>
          </div>
          <label className={styles.upload}>
            <input type="file" accept="image/*" hidden onChange={(e) => void onImage(e.target.files?.[0])} />
            更换立绘
          </label>
          {backgroundImage ? <button className={styles.close} onClick={clearImage} aria-label="clear image">清除立绘</button> : null}
          <button className={styles.close} onClick={closeChat} aria-label={dict.zh.close}>×</button>
        </header>
        <ul className={styles.messages}>
          {(rec?.messages ?? []).map((m, i) => (
            <li key={i} className={m.role === 'user' ? styles.user : styles.assistant}>{m.content}</li>
          ))}
        </ul>
        <footer className={styles.footer}>
          <input
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={dict.zh.sendPlaceholder}
            onKeyDown={(e) => { if (e.key === 'Enter') void send(input) }}
          />
          <button className={styles.send} onClick={() => void send(input)} disabled={busy}>{dict.zh.send}</button>
        </footer>
      </section>
    </div>
  )
}
