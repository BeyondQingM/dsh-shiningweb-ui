/**
 * 浏览器共享平台模块表（vendored from deepseek-ai/deepseek-harness
 * packages/client/web/src/platform.ts @ 141eb6fe）。shell 将这些 specifier
 * 冻结进模块表，client bundle 将其作为 external。
 */
export const PLATFORM_MODULES = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
] as const

/** client bundle 预加载的外部 specifier。 */
export const PRELOADED_CLIENT_EXTERNALS = [
  '@deepseek-ai/dsh-client-runtime/client',
] as const

export type PlatformModule = (typeof PLATFORM_MODULES)[number]
