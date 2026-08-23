/** 天圆地方聊天窗（shell.overlay 全屏浮层）。分级能力模式 + DSH 上下文感知 + 委派。 */
import { useState } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { useSettings } from '../settings.ts'
import { useShiningStore, closeChat } from '../store.ts'
import { useChat } from '../hooks/useChat.ts'
import { useDshContext, dshContextToText, sendToSession, getCurrentSessionId } from '../dsh-context.ts'
import { getShiningRemote } from '../remote-types.ts'
import { getImage, setImage, clearImage, compressImage } from '../storage.ts'
import { dict } from '../locales.ts'
import styles from './ChatWindow.module.css'

type Props = PropsRuntime<'shell.overlay'>

const MODE_LABEL: Record<string, string> = { pet: '萌宠', assistant: '助理', super: '超级助理' }

export function ChatWindow(_props: Props): React.ReactNode {
  const { chatOpen } = useShiningStore()
  const settings = useSettings()
  const [input, setInput] = useState('')
  const [confirmSend, setConfirmSend] = useState(false)
  const dshContext = useDshContext()
  const { rec, busy, send } = useChat(settings.chat.personaId || 'default', getShiningRemote(), settings)

  if (!chatOpen || !settings.enabled || !settings.chat.enabled) return null

  const mode = settings.capabilityMode
  const canDelegate = mode !== 'pet' && getCurrentSessionId() !== undefined
  const contextText = mode === 'pet' ? undefined : dshContextToText(dshContext)

  const onImage = async (file?: File) => {
    if (!file) return
    try { setImage(await compressImage(file)) } catch { /* 忽略超大图 */ }
  }
  const backgroundImage = getImage()

  const doSend = () => void send(input, contextText)
  const doDelegate = () => {
    const cur = getCurrentSessionId()
    if (!cur || !input.trim()) return
    // assistant 需确认；super 直接放行（仍可确认）。
    if (mode === 'assistant') { setConfirmSend(true); return }
    void sendToSession(cur, input.trim())
    setInput('')
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={dict.zh.chatTitle}>
      <div className={styles.backdrop} onClick={closeChat} />
      <section className={styles.panel} style={{ backdropFilter: `blur(var(--shining-blur))`, backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>{dict.zh.chatTitle}</h2>
            <span className={styles.tag}>人格：{settings.chat.personaId || '默认'} · {MODE_LABEL[mode] ?? mode}</span>
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
            onKeyDown={(e) => { if (e.key === 'Enter') doSend() }}
          />
          <button className={styles.send} onClick={doSend} disabled={busy}>{dict.zh.send}</button>
          {canDelegate ? <button className={styles.delegate} onClick={doDelegate} disabled={busy}>委派到 DSH</button> : null}
        </footer>
      </section>
      {confirmSend ? (
        <div className={styles.confirm}>
          <div className={styles.confirmBox}>
            <p>将这条任务发送给当前 DSH 会话？</p>
            <label><input type="checkbox" checked={false} readOnly /> 本次会话不再提示</label>
            <div className={styles.confirmActions}>
              <button onClick={() => { setConfirmSend(false); void sendToSession(getCurrentSessionId()!, input.trim()); setInput('') }}>确认</button>
              <button onClick={() => setConfirmSend(false)}>取消</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
