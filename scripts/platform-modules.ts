/**
 * 浏览器共享平台模块表。真源是 shell 启动时注入的 staticModules 表
 * （`dsh-web-frontend` 的 boot 代码：`{react, react/jsx-runtime, react-dom,
 * react-dom/client, @deepseek-ai/cordis, @deepseek-ai/dsh-client-store,
 * @deepseek-ai/dsh-client-ui-slots, @deepseek-ai/dsh-client-ui-primitives,
 * @deepseek-ai/dsh-client-ui-dockkit}`）。
 *
 * shell 将这些 specifier 冻结进模块表，client bundle 将其作为 external；
 * 表外的 `require(...)` 会在运行时以 "client-modules: require(...) missed the
 * module table" 失败，因此本表必须与目标 DSH 版本的 shell 一致，多一项少一项都是 bug。
 *
 * 注意：`dsh-client-ui-slots` / `dsh-client-ui-primitives` / `dsh-client-store` /
 * `dsh-client-ui-dockkit` 在运行面上**不作为独立包存在**，它们是 shell 提供的模块表项；
 * 本地 types 仅用于编译期（见 tsconfig.runtime*.json）。
 */
export const PLATFORM_MODULES = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-store',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-dockkit',
] as const

/** client bundle 预加载的外部 specifier。 */
export const PRELOADED_CLIENT_EXTERNALS = [
  '@deepseek-ai/dsh-client-runtime/client',
] as const

export type PlatformModule = (typeof PLATFORM_MODULES)[number]
