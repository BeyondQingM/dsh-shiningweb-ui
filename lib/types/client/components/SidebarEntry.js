import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSettings } from "../settings.js";
import { openChat, openFiles } from "../store.js";
import { dict } from "../locales.js";
import styles from './SidebarEntry.module.css';
/** 天圆地方入口按钮（拱门图标）。 */
export function ChatEntry(props) {
    const settings = useSettings();
    if (!settings.enabled || !settings.chat.enabled)
        return null;
    return (_jsxs("button", { type: "button", className: styles.entry, onClick: openChat, "aria-label": dict.zh.entryChat, children: [_jsxs("svg", { className: styles.icon, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [_jsx("path", { d: "M4 20h16M6 20V9a6 6 0 0 1 12 0v11", stroke: "currentColor", strokeWidth: "1.6" }), _jsx("path", { d: "M6 14h12", stroke: "currentColor", strokeWidth: "1.6" })] }), props.wide ? _jsx("span", { className: styles.label, children: dict.zh.entryChat }) : null] }));
}
/** 文件栏入口按钮。 */
export function FilesEntry(props) {
    const settings = useSettings();
    if (!settings.enabled || !settings.fileExplorer.enabled)
        return null;
    return (_jsxs("button", { type: "button", className: styles.entry, onClick: openFiles, "aria-label": dict.zh.entryFiles, children: [_jsx("svg", { className: styles.icon, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: _jsx("path", { d: "M3 6h7l2 2h9v11H3z", stroke: "currentColor", strokeWidth: "1.6" }) }), props.wide ? _jsx("span", { className: styles.label, children: dict.zh.entryFiles }) : null] }));
}
