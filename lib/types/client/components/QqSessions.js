import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** 天圆地方 QQ 会话视图（从 host 会话层读取 + 回复）。 */
import { useEffect, useState } from 'react';
import { useShiningRemote } from "../remote-types.js";
import styles from './QqSessions.module.css';
export function QqSessions() {
    const [sessions, setSessions] = useState([]);
    const [open, setOpen] = useState(null);
    const [draft, setDraft] = useState('');
    const remote = useShiningRemote();
    const refresh = () => { void remote?.qqList({}).then((r) => { if (r.ok)
        setSessions(r.value.sessions); }); };
    useEffect(() => { refresh(); }, [remote]);
    const openSession = (s) => {
        if (remote)
            void remote.qqRead({ key: s.key }).then((r) => { if (r.ok && r.value.session)
                setOpen(r.value.session); });
    };
    const reply = async () => {
        if (!open || !draft.trim() || !remote)
            return;
        await remote.qqSend({ key: open.key, content: draft.trim() });
        setDraft('');
        refresh();
        void remote.qqRead({ key: open.key }).then((r) => { if (r.ok && r.value.session)
            setOpen(r.value.session); });
    };
    return (_jsxs("div", { className: styles.wrap, children: [_jsx("button", { className: styles.refresh, onClick: () => { refresh(); }, children: "\u5237\u65B0" }), _jsxs("ul", { className: styles.list, children: [sessions.map((s) => (_jsx("li", { children: _jsxs("button", { className: styles.session, onClick: () => openSession(s), children: [_jsx("span", { className: styles.peer, children: s.kind === 'group' ? `群 ${s.peerId}` : `私聊 ${s.peerId}` }), _jsx("span", { className: styles.preview, children: s.messages[s.messages.length - 1]?.content?.slice(0, 30) ?? '' })] }) }, s.key))), sessions.length === 0 ? _jsx("li", { className: styles.empty, children: "\u6682\u65E0 QQ \u4F1A\u8BDD\uFF08\u9700\u914D\u7F6E QQ \u5E76\u63A5\u6536\u6D88\u606F\uFF09" }) : null] }), open ? (_jsxs("div", { className: styles.detail, children: [_jsx("ul", { className: styles.messages, children: open.messages.map((m, i) => _jsx("li", { className: m.role === 'user' ? styles.user : styles.assistant, children: m.content }, i)) }), _jsxs("div", { className: styles.composer, children: [_jsx("input", { className: styles.input, value: draft, onChange: (e) => setDraft(e.target.value), placeholder: "\u56DE\u590D\u2026", onKeyDown: (e) => { if (e.key === 'Enter')
                                    void reply(); } }), _jsx("button", { className: styles.send, onClick: () => void reply(), disabled: !draft.trim(), children: "\u53D1\u9001" })] })] })) : null] }));
}
