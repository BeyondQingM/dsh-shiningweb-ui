/** useFileTree：懒加载文件树（展开时读取子目录）。 */
import { useCallback, useState } from 'react';
export function useFileTree(root, showHidden, remote) {
    const [children, setChildren] = useState({});
    const [expanded, setExpanded] = useState({});
    const toggle = useCallback(async (relPath) => {
        const next = !expanded[relPath];
        setExpanded((e) => ({ ...e, [relPath]: next }));
        if (next && !children[relPath] && remote) {
            const res = await remote.fsList({ root, path: relPath || '.', showHidden });
            if (res.ok)
                setChildren((c) => ({ ...c, [relPath]: res.value.entries }));
        }
    }, [root, showHidden, expanded, children, remote]);
    const refresh = useCallback(async () => {
        setChildren({});
        setExpanded({});
    }, []);
    return { children, expanded, toggle, refresh };
}
