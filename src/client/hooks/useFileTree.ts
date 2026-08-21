/** useFileTree：懒加载文件树（展开时读取子目录）。 */
import { useCallback, useState } from 'react'
import type { FsEntry } from '../../types.ts'
import type { ShiningRemote } from '../remote-types.ts'

export function useFileTree(root: string, showHidden: boolean, remote: ShiningRemote | undefined) {
  const [children, setChildren] = useState<Record<string, FsEntry[]>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = useCallback(async (relPath: string) => {
    const next = !expanded[relPath]
    setExpanded((e) => ({ ...e, [relPath]: next }))
    if (next && !children[relPath] && remote) {
      const res = await remote.fsList({ root, path: relPath || '.', showHidden })
      if (res.ok) setChildren((c) => ({ ...c, [relPath]: res.value.entries }))
    }
  }, [root, showHidden, expanded, children, remote])

  const refresh = useCallback(async () => {
    setChildren({})
    setExpanded({})
  }, [])

  return { children, expanded, toggle, refresh }
}
