const THEME_COLORS = {
    'galaxy-blue': { primary: '#4f7cff', accent: '#7aa0ff' },
    'dawn-gold': { primary: '#e0a43b', accent: '#f2c56b' },
    'aurora-purple': { primary: '#9a6bff', accent: '#c39bff' },
};
/** 将设置投影到 CSS 变量（浏览器环境调用）。 */
export function applyVisual(settings) {
    if (typeof document === 'undefined')
        return;
    const root = document.documentElement;
    const color = THEME_COLORS[settings?.visual.themeColor ?? 'galaxy-blue'];
    root.style.setProperty('--shining-primary', color.primary);
    root.style.setProperty('--shining-accent', color.accent);
    root.style.setProperty('--shining-blur', `${settings?.visual.glassBlur ?? 12}px`);
}
