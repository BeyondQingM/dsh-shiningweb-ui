import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** 文件栏抽屉（shell.overlay）：文件树 + 右键菜单 + 搜索过滤。 */
import { useState } from 'react';
import { useSettings } from "../settings.js";
import { useShiningStore, closeFiles } from "../store.js";
import { useFileTree } from "../hooks/useFileTree.js";
import { getShiningRemote } from "../remote-types.js";
import { getWorkspaceRoot, getOpenPath } from "../workspace.js";
import { dict } from "../locales.js";
import styles from './FileExplorer.module.css';
function extIcon(name) {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    const map = { js: 'JS', ts: 'TS', py: 'PY', json: '{}', md: 'M', txt: 'T', html: '<>' };
    return map[ext] ?? '•';
}
export function FileExplorer(_props) {
    const { filesOpen } = useShiningStore();
    const settings = useSettings();
    const [query, setQuery] = useState('');
    const [menu, setMenu] = useState(null);
    const remote = getShiningRemote();
    const root = getWorkspaceRoot();
    const openPath = getOpenPath();
    const tree = useFileTree(root, settings.fileExplorer.showHidden, remote);
    if (!filesOpen || !settings.enabled || !settings.fileExplorer.enabled)
        return null;
    const filtered = (entries) => (entries ?? []).filter((e) => !query || e.name.toLowerCase().includes(query.toLowerCase()));
    const renderDir = (rel) => {
        const children = filtered(tree.children[rel]);
        return children.map((e) => {
            const childRel = rel ? `${rel}/${e.name}` : e.name;
            return (_jsxs("li", { children: [_jsxs("button", { type: "button", className: styles.row, onContextMenu: (ev) => { ev.preventDefault(); setMenu({ x: ev.clientX, y: ev.clientY, path: childRel }); }, onClick: () => { if (e.isDirectory)
                            void tree.toggle(childRel);
                        else
                            openPath?.(childRel); }, children: [_jsx("span", { className: styles.icon, children: e.isDirectory ? '▸' : extIcon(e.name) }), _jsx("span", { className: styles.name, children: e.name })] }), e.isDirectory && tree.expanded[childRel] ? _jsx("ul", { className: styles.children, children: renderDir(childRel) }) : null] }, childRel));
        });
    };
    return (_jsxs("div", { className: styles.drawer, children: [_jsxs("header", { className: styles.header, children: [_jsx("span", { className: styles.title, children: dict.zh.entryFiles }), _jsx("button", { className: styles.close, onClick: closeFiles, "aria-label": dict.zh.close, children: "\u00D7" })] }), _jsx("input", { className: styles.search, value: query, onChange: (e) => setQuery(e.target.value), placeholder: dict.zh.fileFilter }), _jsx("ul", { className: styles.tree, children: renderDir('') }), menu ? _jsx(CtxMenu, { menu: menu, onClose: () => setMenu(null), remote: remote, root: root, onDone: () => void tree.refresh() }) : null] }));
}
function CtxMenu(props) {
    const run = async (op) => { await op(); props.onClose(); props.onDone(); };
    const copy = () => { void navigator.clipboard.writeText(props.menu.path); props.onClose(); };
    return (_jsxs("div", { className: styles.menu, style: { left: props.menu.x, top: props.menu.y }, children: [_jsx("button", { onClick: () => void run(() => props.remote.fsCreateFile({ root: props.root, path: props.menu.path })), children: dict.zh.newFile }), _jsx("button", { onClick: () => void run(() => props.remote.fsCreateDir({ root: props.root, path: props.menu.path })), children: dict.zh.newDir }), _jsx("button", { onClick: () => void run(() => props.remote.fsRename({ root: props.root, path: props.menu.path, newName: 'renamed' })), children: dict.zh.rename }), _jsx("button", { onClick: () => void run(() => props.remote.fsDelete({ root: props.root, path: props.menu.path })), children: dict.zh.remove }), _jsx("button", { onClick: copy, children: dict.zh.copyPath })] }));
}
