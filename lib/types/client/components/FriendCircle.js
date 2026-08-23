import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** 天圆地方朋友圈：动态列表 + 发布 + 点赞 + 评论。 */
import { useEffect, useState } from 'react';
import { addPost, listPosts, toggleLike, addComment } from "../friend-circle.js";
import styles from './FriendCircle.module.css';
export function FriendCircle(props) {
    const [posts, setPosts] = useState([]);
    const [draft, setDraft] = useState('');
    const refresh = () => { void listPosts(props.personaId).then(setPosts); };
    useEffect(() => { refresh(); }, [props.personaId]);
    const publish = async () => {
        if (!draft.trim())
            return;
        await addPost(props.personaId, draft.trim());
        setDraft('');
        refresh();
    };
    return (_jsxs("div", { className: styles.wrap, children: [_jsxs("div", { className: styles.composer, children: [_jsx("textarea", { className: styles.textarea, value: draft, onChange: (e) => setDraft(e.target.value), placeholder: "\u8FD9\u4E00\u523B\u7684\u60F3\u6CD5\u2026" }), _jsx("button", { className: styles.publish, onClick: () => void publish(), disabled: !draft.trim(), children: "\u53D1\u8868" })] }), _jsxs("ul", { className: styles.list, children: [posts.map((p) => (_jsxs("li", { className: styles.post, children: [_jsx("p", { className: styles.content, children: p.content }), _jsxs("div", { className: styles.meta, children: [_jsx("span", { className: styles.time, children: new Date(p.createdAt).toLocaleString() }), _jsxs("button", { className: styles.action, onClick: () => void toggleLike(p.id, 'me').then(refresh), children: ["\u8D5E ", p.likes.length] })] }), _jsx("ul", { className: styles.comments, children: p.comments.map((c) => _jsxs("li", { className: styles.comment, children: [_jsxs("b", { children: [c.author, "\uFF1A"] }), c.content] }, c.id)) })] }, p.id))), posts.length === 0 ? _jsx("li", { className: styles.empty, children: "\u8FD8\u6CA1\u6709\u52A8\u6001" }) : null] })] }));
}
