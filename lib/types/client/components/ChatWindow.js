import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/** 天圆地方聊天窗（shell.overlay 全屏浮层）。分级能力模式 + DSH 上下文感知 + 委派。 */
import { useState } from 'react';
import { useSettings } from "../settings.js";
import { useShiningStore, closeChat } from "../store.js";
import { useChat } from "../hooks/useChat.js";
import { FriendCircle } from "./FriendCircle.js";
import { QqSessions } from "./QqSessions.js";
import { useDshContext, dshContextToText, sendToSession, getCurrentSessionId } from "../dsh-context.js";
import { readMemoryContext } from "../memory.js";
import { useShiningRemote } from "../remote-types.js";
import { getImage, setImage, clearImage, compressImage } from "../storage.js";
import { dict } from "../locales.js";
import styles from './ChatWindow.module.css';
const MODE_LABEL = { pet: '萌宠', assistant: '助理', super: '超级助理' };
export function ChatWindow(_props) {
    const { chatOpen } = useShiningStore();
    const settings = useSettings();
    const [tab, setTab] = useState('chat');
    const [input, setInput] = useState('');
    const [confirmSend, setConfirmSend] = useState(false);
    const dshContext = useDshContext();
    const { rec, busy, send } = useChat(settings.chat.personaId || 'default', useShiningRemote(), settings);
    if (!chatOpen || !settings.enabled || !settings.chat.enabled)
        return null;
    const mode = settings.capabilityMode;
    const canDelegate = mode !== 'pet' && getCurrentSessionId() !== undefined;
    const contextText = mode === 'pet' ? undefined : dshContextToText(dshContext);
    const onImage = async (file) => {
        if (!file)
            return;
        try {
            setImage(await compressImage(file));
        }
        catch { /* 忽略超大图 */ }
    };
    const backgroundImage = getImage();
    const doSend = async () => {
        const mem = await readMemoryContext(input);
        const combined = [contextText, mem].filter(Boolean).join('\n');
        await send(input, combined);
    };
    const doDelegate = () => {
        const cur = getCurrentSessionId();
        if (!cur || !input.trim())
            return;
        // assistant 需确认；super 直接放行（仍可确认）。
        if (mode === 'assistant') {
            setConfirmSend(true);
            return;
        }
        void sendToSession(cur, input.trim());
        setInput('');
    };
    return (_jsxs("div", { className: styles.overlay, role: "dialog", "aria-modal": "true", "aria-label": dict.zh.chatTitle, children: [_jsx("div", { className: styles.backdrop, onClick: closeChat }), _jsxs("section", { className: styles.panel, style: { backdropFilter: `blur(var(--shining-blur))`, backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }, children: [_jsxs("header", { className: styles.header, children: [_jsxs("div", { children: [_jsx("h2", { className: styles.title, children: dict.zh.chatTitle }), _jsxs("span", { className: styles.tag, children: ["\u4EBA\u683C\uFF1A", settings.chat.personaId || '默认', " \u00B7 ", MODE_LABEL[mode] ?? mode] })] }), _jsxs("label", { className: styles.upload, children: [_jsx("input", { type: "file", accept: "image/*", hidden: true, onChange: (e) => void onImage(e.target.files?.[0]) }), "\u66F4\u6362\u7ACB\u7ED8"] }), backgroundImage ? _jsx("button", { className: styles.close, onClick: clearImage, "aria-label": "clear image", children: "\u6E05\u9664\u7ACB\u7ED8" }) : null, _jsx("button", { className: styles.close, onClick: closeChat, "aria-label": dict.zh.close, children: "\u00D7" })] }), _jsxs("nav", { className: styles.tabs, children: [_jsx("button", { className: tab === 'chat' ? styles.tabActive : styles.tab, onClick: () => setTab('chat'), children: "\u804A\u5929" }), _jsx("button", { className: tab === 'circle' ? styles.tabActive : styles.tab, onClick: () => setTab('circle'), children: "\u670B\u53CB\u5708" }), mode === 'super' ? _jsx("button", { className: tab === 'qq' ? styles.tabActive : styles.tab, onClick: () => setTab('qq'), children: "QQ \u4F1A\u8BDD" }) : null] }), tab === 'chat' ? (_jsxs(_Fragment, { children: [_jsx("ul", { className: styles.messages, children: (rec?.messages ?? []).map((m, i) => (_jsx("li", { className: m.role === 'user' ? styles.user : styles.assistant, children: m.content }, i))) }), _jsxs("footer", { className: styles.footer, children: [_jsx("input", { className: styles.input, value: input, onChange: (e) => setInput(e.target.value), placeholder: dict.zh.sendPlaceholder, onKeyDown: (e) => { if (e.key === 'Enter')
                                            doSend(); } }), _jsx("button", { className: styles.send, onClick: doSend, disabled: busy, children: dict.zh.send }), canDelegate ? _jsx("button", { className: styles.delegate, onClick: doDelegate, disabled: busy, children: "\u59D4\u6D3E\u5230 DSH" }) : null] })] })) : tab === 'circle' ? (_jsx(FriendCircle, { personaId: settings.chat.personaId || 'default' })) : (_jsx(QqSessions, {}))] }), confirmSend ? (_jsx("div", { className: styles.confirm, children: _jsxs("div", { className: styles.confirmBox, children: [_jsx("p", { children: "\u5C06\u8FD9\u6761\u4EFB\u52A1\u53D1\u9001\u7ED9\u5F53\u524D DSH \u4F1A\u8BDD\uFF1F" }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: false, readOnly: true }), " \u672C\u6B21\u4F1A\u8BDD\u4E0D\u518D\u63D0\u793A"] }), _jsxs("div", { className: styles.confirmActions, children: [_jsx("button", { onClick: () => { setConfirmSend(false); void sendToSession(getCurrentSessionId(), input.trim()); setInput(''); }, children: "\u786E\u8BA4" }), _jsx("button", { onClick: () => setConfirmSend(false), children: "\u53D6\u6D88" })] })] }) })) : null] }));
}
