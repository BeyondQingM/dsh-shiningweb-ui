/** Git 分支工具栏（conversation.input.dock）。 */
import { useEffect, useState } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { useSettings } from '../settings.ts'
import { useGitBranch } from '../hooks/useGitBranch.ts'
import { useShiningRemote } from '../remote-types.ts'
import { useWorkspaceRoot } from '../workspace.ts'
import { dict } from '../locales.ts'
import styles from './GitManager.module.css'

type Props = PropsRuntime<'conversation.input.dock'>

const REFRESH_MS: Record<string, number> = { '10s': 10000, '30s': 30000, '1m': 60000 }

export function GitManager(_props: Props): React.ReactNode {
  const settings = useSettings()
  // 响应式读 remote/root：apply 之后才异步挂载/设置，若初渲染读到 undefined/空，
  // 这里会在就绪时重渲染并使 effect 重跑，从而真正刷新（而不是永远无分支）。
  const remote = useShiningRemote()
  const root = useWorkspaceRoot()
  const git = useGitBranch(root, remote)
  const [branches, setBranches] = useState<string[]>([])
  const [newBranch, setNewBranch] = useState('')
  const [busy, setBusy] = useState(false)
  const [gitErr, setGitErr] = useState('')

  useEffect(() => {
    if (!settings.enabled || !settings.git.enabled) return
    if (!root || !remote) { setGitErr(remote ? '未获取到工作区' : '远程服务未就绪'); return }
    let alive = true
    const refresh = async () => {
      try {
        const res = await remote.gitStatus({ root: root || '/', repoPath: '.' })
        if (!alive) return
        if (res.ok) {
          git.refresh()
          setBranches([res.value.branch])
          setGitErr('')
        } else {
          setGitErr(res.error.message)
        }
      } catch (e) {
        if (alive) setGitErr(e instanceof Error ? `remote调用失败: ${e.message}` : String(e))
      }
    }
    void refresh()
    const interval = REFRESH_MS[settings.git.autoRefresh]
    if (interval) { const t = setInterval(() => void refresh(), interval); return () => { alive = false; clearInterval(t) } }
    return () => { alive = false }
  }, [settings.enabled, settings.git.enabled, settings.git.autoRefresh, root, remote])

  if (!settings.enabled || !settings.git.enabled) return null

  const doCheckout = async (branch: string) => {
    if (!remote || branch === git.state.branch) return
    setBusy(true)
    await remote.gitCheckout({ root, repoPath: '.', branch })
    setBusy(false)
    await git.refresh()
  }
  const doCreate = async () => {
    if (!remote || !newBranch.trim()) return
    setBusy(true)
    await remote.gitCreateBranch({ root, repoPath: '.', name: newBranch.trim() })
    setNewBranch('')
    setBusy(false)
    await git.refresh()
  }
  const doPull = async () => {
    if (!remote) return
    setBusy(true)
    await remote.gitPull({ root, repoPath: '.' })
    setBusy(false)
    await git.refresh()
  }

  return (
    <div className={styles.bar}>
      <select className={styles.select} value={git.state.branch} onChange={(e) => void doCheckout(e.target.value)} disabled={busy}>
        <option value={git.state.branch}>{git.state.branch || '无分支'}</option>
        {branches.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
      <input className={styles.new} value={newBranch} onChange={(e) => setNewBranch(e.target.value)} placeholder="新分支名" />
      <button className={styles.btn} onClick={() => void doCreate()} disabled={busy}>+</button>
      <button className={styles.btn} onClick={() => void doPull()} disabled={busy}>pull</button>
      <span className={styles.dirty}>{dict.zh.dirtyCount} {git.state.dirtyCount}</span>
      {gitErr ? <span className={styles.err} title={gitErr}>{gitErr}</span> : null}
    </div>
  )
}
