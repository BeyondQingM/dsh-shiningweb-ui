/**
 * DSH 上下文感知：天圆地方了解 DSH 主窗口的项目/会话，并能代发任务给 DSH 会话。
 * 纯客户端能力（读 ctx.workspaces/ctx.sessions + session.prompt 代发）。
 */
import { useSyncExternalStore } from 'react';
let ctx;
const listeners = new Set();
let cached = { workspaces: [], sessions: [], currentSessionId: undefined };
let version = 0;
/** apply 时绑定 DSH 客户端上下文。 */
export function bindDshCtx(c) {
    ctx = c;
}
function emit() {
    version += 1;
    cached = gatherDshContext();
    for (const l of listeners)
        l();
}
/** 订阅 workspaces + sessions 列表变化（供 useDshContext 响应式）。 */
function subscribe(l) {
    listeners.add(l);
    ctx?.workspaces.list.subscribe(emit);
    ctx?.sessions.list.subscribe(emit);
    return () => { listeners.delete(l); };
}
/** 同步聚合 DSH 概况（工作区/会话/当前会话）。 */
export function gatherDshContext() {
    if (!ctx)
        return { workspaces: [], sessions: [], currentSessionId: undefined };
    const workspaces = ctx.workspaces.list.getSnapshot().items.map((w) => ({ id: w.workspaceId, title: w.title, path: w.path }));
    const list = ctx.sessions.list.getSnapshot();
    const currentSessionId = list.current;
    const sessions = list.ids.map((id) => {
        const s = list.byId[id];
        return { id, title: s?.displayTitle ?? String(id), cwd: s?.cwd };
    });
    return { workspaces, sessions, currentSessionId };
}
/** 响应式读 DSH 概况（快照缓存，仅在列表变化时重算）。 */
export function useDshContext() {
    return useSyncExternalStore(subscribe, () => cached);
}
/** 把 DSH 概况格式化为 model 上下文块（注入独立模型 system prompt）。 */
export function dshContextToText(c) {
    const lines = ['【DSH 主窗口概况】'];
    if (c.workspaces.length)
        lines.push(`项目：${c.workspaces.map((w) => w.title).join('、')}`);
    if (c.sessions.length)
        lines.push(`会话：${c.sessions.map((s) => s.title).join('、')}`);
    if (c.currentSessionId) {
        const cur = c.sessions.find((s) => s.id === c.currentSessionId);
        lines.push(`当前会话：${cur?.title ?? '（无标题）'}`);
    }
    if (c.workspaces.length || c.sessions.length)
        return lines.join('\n');
    return '';
}
/**
 * 代发：把一段内容作为"一轮"送进指定 DSH 会话（主 agent 处理）。
 * @param sessionId - 目标会话。
 * @param text - 任务内容。
 */
export async function sendToSession(sessionId, text) {
    const binding = ctx?.sessions.binding(sessionId);
    if (!binding)
        return false;
    const res = await binding.session.prompt([{ type: 'text', text }], 'queue');
    return res.ok === true;
}
/** 当前会话 id（异步绑定场景兜底）。 */
export function getCurrentSessionId() {
    return ctx?.sessions.list.getSnapshot().current;
}
