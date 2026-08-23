/** useGitBranch：Git 分支状态与操作。 */
import { useCallback, useState } from 'react';
export function useGitBranch(root, remote) {
    const [state, setState] = useState({ branch: '', dirtyCount: 0, changes: [] });
    const refresh = useCallback(async () => {
        if (!remote)
            return;
        const res = await remote.gitStatus({ root, repoPath: '.' });
        if (res.ok)
            setState(res.value);
    }, [root, remote]);
    return { state, refresh };
}
