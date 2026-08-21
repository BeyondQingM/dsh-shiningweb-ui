/** useGitBranch：Git 分支状态与操作。 */
import { useCallback, useState } from 'react'
import type { GitChange } from '../../types.ts'
import type { ShiningRemote } from '../remote-types.ts'

export interface GitState {
  branch: string
  dirtyCount: number
  changes: GitChange[]
}

export function useGitBranch(root: string, remote: ShiningRemote | undefined) {
  const [state, setState] = useState<GitState>({ branch: '', dirtyCount: 0, changes: [] })

  const refresh = useCallback(async () => {
    if (!remote) return
    const res = await remote.gitStatus({ root, repoPath: '.' })
    if (res.ok) setState(res.value)
  }, [root, remote])

  return { state, refresh }
}
