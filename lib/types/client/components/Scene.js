import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 场景层：参考「星辰跃动」官网的星空/白昼设计语言。
 * - 星星：JS 随机生成（位置/大小/闪烁时长），CSS twinkle 动画；
 * - 流星：尊重 prefers-reduced-motion（动画关闭时不渲染）；
 * - 烈阳：仅浅色模式的晨曦金场景显示（多层光晕呼吸）；
 * - 星云：模糊光斑，screen 混合 + 形态流动（reduced-motion 下静止）。
 * 主题场景由 data-shining-scene 驱动：galaxy-blue / dawn-gold / aurora-purple；follow 不渲染。
 */
import { useMemo } from 'react';
import styles from './Scene.module.css';
const METEORS = [
    { top: 16, dur: 8, delay: 1.5 },
    { top: 32, dur: 11, delay: 6.5 },
    { top: 50, dur: 9.5, delay: 11 },
];
/** 浏览器是否偏好减少动效（组件挂载时读取一次；jsdom 等无 matchMedia 环境按 false 处理）。 */
function usePrefersReducedMotion() {
    return useMemo(() => {
        if (typeof window === 'undefined')
            return true;
        if (typeof window.matchMedia !== 'function')
            return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);
}
function makeStars(count) {
    return Array.from({ length: count }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: (Math.random() * 1.8 + 0.6).toFixed(1),
        delay: (Math.random() * 6).toFixed(1),
        dur: (Math.random() * 4 + 3).toFixed(1),
    }));
}
/** 场景层：按主题渲染星星/流星/烈阳/星云；follow 或无效主题返回 null。 */
export function Scene({ themeColor }) {
    const reduced = usePrefersReducedMotion();
    const stars = useMemo(() => makeStars(70), [themeColor]);
    if (themeColor === 'follow')
        return null;
    return (_jsxs("div", { className: styles.scene, "data-shining-scene": themeColor, "aria-hidden": "true", children: [stars.map((s, i) => (_jsx("span", { "data-star": true, className: styles.star, style: {
                    top: `${s.top}%`,
                    left: `${s.left}%`,
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                    '--delay': `${s.delay}s`,
                    '--dur': `${s.dur}s`,
                } }, i))), reduced ? null : METEORS.map((m, i) => (_jsx("span", { "data-meteor": true, className: styles.meteor, style: { '--my': `${m.top}%`, '--mdur': `${m.dur}s`, '--mdelay': `${m.delay}s` } }, `m${i}`))), _jsx("span", { className: styles.nebula1 }), _jsx("span", { className: styles.nebula2 }), _jsx("span", { className: styles.aurora }), _jsx("span", { className: styles.sun })] }));
}
