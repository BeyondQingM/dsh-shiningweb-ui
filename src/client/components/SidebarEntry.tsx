/** 侧边栏脚部入口：天圆地方 / 文件 按钮（sidebar.footer.action）。 */
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '../slots.ts'
import { useSettings } from '../settings.ts'
import { openChat, openFiles } from '../store.ts'
import { dict } from '../locales.ts'
import styles from './SidebarEntry.module.css'

type Props = PropsRuntime<'sidebar.footer.action'> & PropsLocale<'shining'>

/** 天圆地方入口按钮（拱门图标）。 */
export function ChatEntry(props: Props): React.ReactNode {
  const settings = useSettings()
  if (!settings.enabled || !settings.chat.enabled) return null
  return (
    <button type="button" className={styles.entry} onClick={openChat} aria-label={dict.zh.entryChat}>
      <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20h16M6 20V9a6 6 0 0 1 12 0v11" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6 14h12" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      {props.wide ? <span className={styles.label}>{dict.zh.entryChat}</span> : null}
    </button>
  )
}

/** 文件栏入口按钮。 */
export function FilesEntry(props: Props): React.ReactNode {
  const settings = useSettings()
  if (!settings.enabled || !settings.fileExplorer.enabled) return null
  return (
    <button type="button" className={styles.entry} onClick={openFiles} aria-label={dict.zh.entryFiles}>
      <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 6h7l2 2h9v11H3z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      {props.wide ? <span className={styles.label}>{dict.zh.entryFiles}</span> : null}
    </button>
  )
}
