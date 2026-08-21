/** 文件栏抽屉（shell.overlay）：文件树 + 右键菜单 + 搜索过滤。 */
import { useState } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { useSettings } from '../settings.ts'
import { useShiningStore, closeFiles } from '../store.ts'
import { useFileTree } from '../hooks/useFileTree.ts'
import { getShiningRemote, type ShiningRemote } from '../remote-types.ts'
import { getWorkspaceRoot, getOpenPath } from '../workspace.ts'
import { dict } from '../locales.ts'
import styles from './FileExplorer.module.css'

type Props = PropsRuntime<'shell.overlay'>

function extIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = { js: 'JS', ts: 'TS', py: 'PY', json: '{}', md: 'M', txt: 'T', html: '<>' }
  return map[ext] ?? '•'
}

export function FileExplorer(_props: Props): React.ReactNode {
  const { filesOpen } = useShiningStore()
  const settings = useSettings()
  const [query, setQuery] = useState('')
  const [menu, setMenu] = useState<{ x: number; y: number; path: string } | null>(null)
  const remote = getShiningRemote()
  const root = getWorkspaceRoot()
  const openPath = getOpenPath()
  const tree = useFileTree(root, settings.fileExplorer.showHidden, remote)

  if (!filesOpen || !settings.enabled || !settings.fileExplorer.enabled) return null

  const filtered = (entries: typeof tree.children[string] | undefined) =>
    (entries ?? []).filter((e) => !query || e.name.toLowerCase().includes(query.toLowerCase()))

  const renderDir = (rel: string): React.ReactNode => {
    const children = filtered(tree.children[rel])
    return children.map((e) => {
      const childRel = rel ? `${rel}/${e.name}` : e.name
      return (
        <li key={childRel}>
          <button
            type="button"
            className={styles.row}
            onContextMenu={(ev) => { ev.preventDefault(); setMenu({ x: ev.clientX, y: ev.clientY, path: childRel }) }}
            onClick={() => { if (e.isDirectory) void tree.toggle(childRel); else openPath?.(childRel) }}
          >
            <span className={styles.icon}>{e.isDirectory ? '▸' : extIcon(e.name)}</span>
            <span className={styles.name}>{e.name}</span>
          </button>
          {e.isDirectory && tree.expanded[childRel] ? <ul className={styles.children}>{renderDir(childRel)}</ul> : null}
        </li>
      )
    })
  }

  return (
    <div className={styles.drawer}>
      <header className={styles.header}>
        <span className={styles.title}>{dict.zh.entryFiles}</span>
        <button className={styles.close} onClick={closeFiles} aria-label={dict.zh.close}>×</button>
      </header>
      <input className={styles.search} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={dict.zh.fileFilter} />
      <ul className={styles.tree}>{renderDir('')}</ul>
      {menu ? <CtxMenu menu={menu} onClose={() => setMenu(null)} remote={remote} root={root} onDone={() => void tree.refresh()} /> : null}
    </div>
  )
}

function CtxMenu(props: { menu: { x: number; y: number; path: string }; onClose: () => void; remote: ShiningRemote | undefined; root: string; onDone: () => void }): React.ReactNode {
  const run = async (op: () => Promise<unknown>) => { await op(); props.onClose(); props.onDone() }
  const copy = () => { void navigator.clipboard.writeText(props.menu.path); props.onClose() }
  return (
    <div className={styles.menu} style={{ left: props.menu.x, top: props.menu.y }}>
      <button onClick={() => void run(() => props.remote!.fsCreateFile({ root: props.root, path: props.menu.path }))}>{dict.zh.newFile}</button>
      <button onClick={() => void run(() => props.remote!.fsCreateDir({ root: props.root, path: props.menu.path }))}>{dict.zh.newDir}</button>
      <button onClick={() => void run(() => props.remote!.fsRename({ root: props.root, path: props.menu.path, newName: 'renamed' }))}>{dict.zh.rename}</button>
      <button onClick={() => void run(() => props.remote!.fsDelete({ root: props.root, path: props.menu.path }))}>{dict.zh.remove}</button>
      <button onClick={copy}>{dict.zh.copyPath}</button>
    </div>
  )
}
