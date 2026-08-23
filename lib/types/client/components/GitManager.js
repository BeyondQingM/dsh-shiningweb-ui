import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Git 分支工具栏（conversation.input.dock）。 */
import { useEffect, useState } from 'react';
import { useSettings } from "../settings.js";
import { useGitBranch } from "../hooks/useGitBranch.js";
import { getShiningRemote } from "../remote-types.js";
import { getWorkspaceRoot } from "../workspace.js";
import { dict } from "../locales.js";
import styles from './GitManager.module.css';
const REFRESH_MS = { '10s': 10000, '30s': 30000, '1m': 60000 };
export function GitManager(_props) {
    const settings = useSettings();
    const remote = getShiningRemote();
    const root = getWorkspaceRoot();
    const git = useGitBranch(root, remote);
    const [branches, setBranches] = useState([]);
    const [newBranch, setNewBranch] = useState('');
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        if (!settings.enabled || !settings.git.enabled || !root || !remote)
            return;
        let alive = true;
        const refresh = async () => {
            const res = await remote.gitStatus({ root, repoPath: '.' });
            if (alive && res.ok) {
                git.refresh();
                setBranches([res.value.branch]);
            }
        };
        void refresh();
        const interval = REFRESH_MS[settings.git.autoRefresh];
        if (interval) {
            const t = setInterval(() => void refresh(), interval);
            return () => { alive = false; clearInterval(t); };
        }
        return () => { alive = false; };
    }, [settings.enabled, settings.git.enabled, settings.git.autoRefresh, root, remote]);
    if (!settings.enabled || !settings.git.enabled)
        return null;
    const doCheckout = async (branch) => {
        if (!remote || branch === git.state.branch)
            return;
        setBusy(true);
        await remote.gitCheckout({ root, repoPath: '.', branch });
        setBusy(false);
        await git.refresh();
    };
    const doCreate = async () => {
        if (!remote || !newBranch.trim())
            return;
        setBusy(true);
        await remote.gitCreateBranch({ root, repoPath: '.', name: newBranch.trim() });
        setNewBranch('');
        setBusy(false);
        await git.refresh();
    };
    const doPull = async () => {
        if (!remote)
            return;
        setBusy(true);
        await remote.gitPull({ root, repoPath: '.' });
        setBusy(false);
        await git.refresh();
    };
    return (_jsxs("div", { className: styles.bar, children: [_jsxs("select", { className: styles.select, value: git.state.branch, onChange: (e) => void doCheckout(e.target.value), disabled: busy, children: [_jsx("option", { value: git.state.branch, children: git.state.branch || '无分支' }), branches.map((b) => _jsx("option", { value: b, children: b }, b))] }), _jsx("input", { className: styles.new, value: newBranch, onChange: (e) => setNewBranch(e.target.value), placeholder: "\u65B0\u5206\u652F\u540D" }), _jsx("button", { className: styles.btn, onClick: () => void doCreate(), disabled: busy, children: "+" }), _jsx("button", { className: styles.btn, onClick: () => void doPull(), disabled: busy, children: "pull" }), _jsxs("span", { className: styles.dirty, children: [dict.zh.dirtyCount, " ", git.state.dirtyCount] })] }));
}
