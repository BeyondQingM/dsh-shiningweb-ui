const THEME_COLORS = {
    'galaxy-blue': {
        primary: '#4f7cff',
        accent: '#7aa0ff',
        gradient: 'linear-gradient(135deg, #4f7cff 0%, #7aa0ff 100%)',
        glow: 'rgba(79, 124, 255, 0.35)',
        border: 'rgba(79, 124, 255, 0.35)',
        soft: 'rgba(79, 124, 255, 0.10)',
    },
    'dawn-gold': {
        primary: '#e0a43b',
        accent: '#f2c56b',
        gradient: 'linear-gradient(135deg, #e0a43b 0%, #f2c56b 100%)',
        glow: 'rgba(224, 164, 59, 0.35)',
        border: 'rgba(224, 164, 59, 0.35)',
        soft: 'rgba(224, 164, 59, 0.10)',
    },
    'aurora-purple': {
        primary: '#9a6bff',
        accent: '#c39bff',
        gradient: 'linear-gradient(135deg, #9a6bff 0%, #c39bff 100%)',
        glow: 'rgba(154, 107, 255, 0.35)',
        border: 'rgba(154, 107, 255, 0.35)',
        soft: 'rgba(154, 107, 255, 0.10)',
    },
};
/** 将设置投影到 CSS 变量（浏览器环境调用）。 */
export function applyVisual(settings) {
    if (typeof document === 'undefined')
        return;
    const root = document.documentElement;
    const color = THEME_COLORS[settings?.visual.themeColor ?? 'galaxy-blue'];
    root.style.setProperty('--shining-primary', color.primary);
    root.style.setProperty('--shining-accent', color.accent);
    root.style.setProperty('--shining-gradient', color.gradient);
    root.style.setProperty('--shining-glow', color.glow);
    root.style.setProperty('--shining-border', color.border);
    root.style.setProperty('--shining-soft', color.soft);
    root.style.setProperty('--shining-blur', `${settings?.visual.glassBlur ?? 12}px`);
}
