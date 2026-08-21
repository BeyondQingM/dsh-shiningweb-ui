/** 璀璨星河设置页（settings.section）。 */
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { useSettings, writeSetting, type ShiningSettings } from '../settings.ts'
import { setImage, clearImage, getImage, compressImage } from '../storage.ts'
import { dict } from '../locales.ts'
import styles from './SettingsPanel.module.css'

type Props = PropsRuntime<'settings.section'> & PropsLocale<'shining'>

export function SettingsPanel(_props: Props): React.ReactNode {
  const settings = useSettings()
  const patch = async <K extends keyof ShiningSettings>(key: K, value: ShiningSettings[K]) => {
    await writeSetting(String(key), value)
  }
  const onImage = async (file?: File) => {
    if (!file) return
    try { setImage(await compressImage(file)) } catch { /* 忽略超大图 */ }
  }

  return (
    <div className={styles.group}>
      <h3 className={styles.title}>{dict.zh.settingsTitle}</h3>
      <Toggle label="启用璀璨星河" checked={settings.enabled} onChange={(v) => void patch('enabled', v)} />

      <section className={styles.section}>
        <Toggle label="天圆地方" checked={settings.chat.enabled} onChange={(v) => void patch('chat', { ...settings.chat, enabled: v })} />
        <Row label="模型" value={settings.chat.model} onChange={(v) => void patch('chat', { ...settings.chat, model: v })} />
        <Row label="API Base" value={settings.chat.apiBase} onChange={(v) => void patch('chat', { ...settings.chat, apiBase: v })} />
        <Row label="API Key" value={settings.chat.apiKey} type="password" onChange={(v) => void patch('chat', { ...settings.chat, apiKey: v })} />
        <label className={styles.row}>
          <input type="file" accept="image/*" onChange={(e) => void onImage(e.target.files?.[0])} />
          <span>更换立绘</span>
        </label>
        {getImage() ? <button className={styles.link} onClick={clearImage}>清除立绘</button> : null}
      </section>

      <section className={styles.section}>
        <Toggle label="文件栏" checked={settings.fileExplorer.enabled} onChange={(v) => void patch('fileExplorer', { ...settings.fileExplorer, enabled: v })} />
        <Toggle label="显示隐藏文件" checked={settings.fileExplorer.showHidden} onChange={(v) => void patch('fileExplorer', { ...settings.fileExplorer, showHidden: v })} />
      </section>

      <section className={styles.section}>
        <Toggle label="Git 分支管理" checked={settings.git.enabled} onChange={(v) => void patch('git', { ...settings.git, enabled: v })} />
        <label className={styles.row}>
          <span>自动刷新</span>
          <select value={settings.git.autoRefresh} onChange={(e) => void patch('git', { ...settings.git, autoRefresh: e.target.value as ShiningSettings['git']['autoRefresh'] })}>
            <option value="off">关闭</option><option value="10s">10s</option><option value="30s">30s</option><option value="1m">1m</option>
          </select>
        </label>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sub}>视觉主题</h4>
        <label className={styles.row}>
          <span>主色调</span>
          <select value={settings.visual.themeColor} onChange={(e) => void patch('visual', { ...settings.visual, themeColor: e.target.value as ShiningSettings['visual']['themeColor'] })}>
            <option value="galaxy-blue">星河蓝</option><option value="dawn-gold">晨曦金</option><option value="aurora-purple">极光紫</option>
          </select>
        </label>
        <label className={styles.row}>
          <span>毛玻璃强度</span>
          <input type="range" min={0} max={24} value={settings.visual.glassBlur} onChange={(e) => void patch('visual', { ...settings.visual, glassBlur: Number(e.target.value) })} />
        </label>
      </section>
    </div>
  )
}

function Toggle(props: { label: string; checked: boolean; onChange: (v: boolean) => void }): React.ReactNode {
  return (
    <label className={styles.row}>
      <input type="checkbox" checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
      <span>{props.label}</span>
    </label>
  )
}

function Row(props: { label: string; value: string; type?: string; onChange: (v: string) => void }): React.ReactNode {
  return (
    <label className={styles.row}>
      <span className={styles.label}>{props.label}</span>
      <input type={props.type ?? 'text'} value={props.value} onChange={(e) => props.onChange(e.target.value)} />
    </label>
  )
}
