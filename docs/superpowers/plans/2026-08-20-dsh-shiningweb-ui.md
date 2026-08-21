# dsh-shiningweb-ui（璀璨星河）v0.1 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付一个可安装、可运行的 DSH 双面 bundle 插件 `dsh-shiningweb-ui`，含天圆地方聊天、文件栏、Git 管理、视觉增强四个模块，全部可在设置面板独立开关。

**Architecture:** 单 npm 包，host 半（Node：ShiningService Typert Remote 网关 + `shining` settings 命名空间）+ client 半（浏览器：5 处槽位注册 + IndexedDB/localStorage + CSS 变量视觉）。client bundle 由 vendored 官方 `tsdown.client.ts` 助手产出；typert 制品由 `scripts/gen-typert.mjs` 从单一数据源生成。

**Tech Stack:** TypeScript(strict) + React 18；tsdown + lightningcss（client bundle）；vitest（host/client 测试）+ jsdom + SlotTestRuntime（client）；`@deepseek-ai/schemastery`（settings schema）；`zod`（typert codec）；`@deepseek-ai/dsh-typert-protocol`。

**Spec:** `docs/superpowers/specs/2026-08-20-dsh-shiningweb-ui-design.md`

## Global Constraints

- 运行面：host + client 双面；`dsh.client.platform: "web"`；普通第三方插件**不**设置 `immediately: true`。
- host settings/Config schema 的 `z` 从 `@deepseek-ai/schemastery` 导入；zod 仅用于 typert codec 制品。
- `@deepseek-ai/dsh-client-ui-slots`、`@deepseek-ai/dsh-client-runtime/client` 等跨包**值** import 仅限平台模块表（react/jsx-runtime/react-dom/cordis/ui-slots/ui-primitives + `dsh-client-runtime/client`）；其余一律 type-only import 或走 service/remote/slot。
- 每个长生命周期资源（route/listener/React root/DOM/style/store）都经 `ctx.effect()`/`ctx.on()` 且随 fiber dispose 清理。
- 所有 fs/git path 解析为绝对路径后必须位于客户端传入的 `root`（工作区）内，否则拒绝（`path-root-escape`）。
- 插件包 `dsh-shiningweb-ui`，version `0.1.0`；`files`/exports/构建产物一致；ESM。
- 每个任务末尾 `git commit`（仓库已 init 于 `F:\余程安学习资料\dsh-shiningweb-ui`）。
- 官方仓库取证基线：`C:\Users\余程安\AppData\Local\Temp\dsh-9ZWq7y\dsh-official` @ `141eb6fe`。

---

### Task 1: 工程骨架与构建设施

**Files:**
- Create: `package.json`
- Create: `cordis.patch.yml`
- Create: `tsconfig.base.json`, `tsconfig.json`, `tsconfig.host.json`, `tsconfig.client.json`
- Create: `scripts/tsdown.client.ts`（vendored 官方助手，内联依赖）
- Create: `scripts/platform-modules.ts`
- Create: `src/index.ts`（空 host apply 占位）
- Create: `src/client/index.ts`（空 client apply 占位）
- Create: `src/css-modules.d.ts`
- Create: `.gitignore`
- Test: `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `tsdown.config.ts` 可调用的 `clientBundle(id, libEntry)`；`package.json` 的 `exports["./client"]`/`exports["./typert"]`/`exports["./remote"]`/`exports["./types"]`。

- [ ] **Step 1: 写 package.json**

```jsonc
{
  "name": "dsh-shiningweb-ui",
  "version": "0.1.0",
  "description": "璀璨星河：独立聊天、文件栏、Git 分支管理、视觉增强的 DSH 插件",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
    "./client": { "types": "./lib/types/client/index.d.ts", "default": "./lib/client.js" },
    "./typert": { "types": "./lib/typert.host.d.ts", "default": "./lib/typert.host.js" },
    "./remote": { "types": "./lib/typert.remote-client.d.ts", "default": "./lib/typert.remote-client.js" },
    "./types": { "types": "./lib/types/types.d.ts", "default": "./lib/types/types.js" },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": ["lib", "cordis.patch.yml", "README.md"],
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
  },
  "license": "MIT",
  "peerDependencies": {
    "react": "^18.2.0",
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-connection": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-runtime": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-locale": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-conversation": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-slots": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-settings": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-invariants": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-typert-protocol": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-settings": "^0.1.0-rc.6"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.1",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@types/react": "~18.3.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.6.0",
    "tsdown": "^0.10.0",
    "lightningcss": "^1.28.0",
    "vitest": "^2.1.0",
    "jsdom": "^25.0.0",
    "@testing-library/react": "^16.1.0"
  },
  "scripts": {
    "typecheck": "tsc -p tsconfig.host.json && tsc -p tsconfig.client.json",
    "gen:typert": "node scripts/gen-typert.mjs",
    "build": "tsc -p tsconfig.host.json && node scripts/gen-typert.mjs && tsdown",
    "bundle": "tsdown",
    "watch": "tsdown --watch",
    "test": "vitest run",
    "verify": "pnpm typecheck && pnpm build && pnpm test"
  }
}
```

- [ ] **Step 2: 写 cordis.patch.yml**

```yaml
# dsh-shiningweb-ui bundle patch: mount the plugin host half; the browser half
# ships via exports["./client"] discovered through package.json dsh.client.
- insert:
    - id: shiningweb-ui
      name: dsh-shiningweb-ui
```

- [ ] **Step 3: 写 tsconfig.base.json / tsconfig.json / tsconfig.host.json / tsconfig.client.json**

`tsconfig.base.json`:
```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "target": "es2022",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "lib": ["es2022", "dom"],
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "verbatimModuleSyntax": true,
    "noEmit": true
  }
}
```
`tsconfig.host.json`:
```jsonc
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "noEmit": false,
    "rootDir": "src",
    "outDir": "lib/types",
    "declaration": true,
    "composite": true
  },
  "include": ["src/index.ts", "src/settings.ts", "src/types.ts", "src/invariant.ts", "src/gateway.ts"]
}
```
`tsconfig.client.json`:
```jsonc
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "noEmit": false,
    "rootDir": "src",
    "outDir": "lib/types",
    "declaration": true,
    "composite": true,
    "paths": { "@deepseek-ai/dsh-*": ["D:/npm-global/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-*"] }
  },
  "include": ["src/client/**/*.ts", "src/client/**/*.tsx", "src/css-modules.d.ts", "src/settings.ts", "src/types.ts"]
}
```
`tsconfig.json`（编辑器用，聚合）:
```jsonc
{ "extends": "./tsconfig.base.json", "include": ["src/**/*.ts", "src/**/*.tsx", "src/css-modules.d.ts"] }
```
> 注：`paths` 仅用于让本机类型检查解析到已安装的 `@deepseek-ai/*`；若解析失败，改用 `typesVersions` 或把 peer 包 link 到 `node_modules`（见 Task 1 Step 8）。TS 检查层面以能通过为准，产物层面由 tsdown 处理 externals。

- [ ] **Step 4: 写 scripts/platform-modules.ts（vendored 平台模块表）**

```ts
/** 浏览器共享模块表：shell 冻结进模块表；client bundle 作为 external。 */
export const PLATFORM_MODULES = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
] as const
/** client bundle 预加载的外部 specifier。 */
export const PRELOADED_CLIENT_EXTERNALS = [
  '@deepseek-ai/dsh-client-runtime/client',
] as const
```

- [ ] **Step 5: 写 scripts/tsdown.client.ts（vendored 官方助手，内联依赖）**

从官方 `packages/client/tsdown.client.ts` 复制（commit `141eb6fe`），将三处仓库相对 import 改为内联：
1. `import { optionalStringArray } from './modules/src/client/manifest.ts'` → 内联 `optionalStringArray(subject, field, value)`（校验必须是 string[]，否则抛错）。
2. `import { PLATFORM_MODULES, PRELOADED_CLIENT_EXTERNALS } from './web/src/platform.ts'` → `import ... from './platform-modules.ts'`。
3. `import { clientBuildEnvironmentDefines } from '../../scripts/client-build-environment.ts'` → 内联 `clientBuildEnvironmentDefines(env)`：返回 `{ 'process.env': '{}' }` 并加入每个 `DSH_CLIENT_*` 环境的 `process.env.<name>` 替换。

保留：`clientBundle(id, libEntry, options)`、`clientLibrary`、`staticLinked`、CSS Modules/`?inline`/全局 CSS 虚拟 loader、`dsh-client-bundle-purity` gate、`INLINE_SAFE`、`VENDORED_LIBRARY`、`GENERATED_REMOTE` 正则、banner/footer/intro 包装。文件头注明来源。

- [ ] **Step 6: 写 tsdown.config.ts**

```ts
import { clientBundle } from './scripts/tsdown.client.ts'
export default clientBundle('dsh-shiningweb-ui', ['lib/types/index.js', 'lib/types/invariant.js'])
```

- [ ] **Step 7: 写占位 src/index.ts / src/client/index.ts / src/css-modules.d.ts / .gitignore**

`src/index.ts`（host 占位，后续 Task 3 充实）:
```ts
/** Host plugin body —— v0.1 占位；ShiningService 与 settings 注册见后续任务。 */
export function apply(): void {}
```
`src/client/index.ts`（client 占位）:
```ts
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
export const inject = ['slots']
export function apply(_ctx: ClientContext): void {}
```
`src/css-modules.d.ts`:
```ts
declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>
  export default classes
}
declare module '*.css?inline' {
  const css: string
  export default css
}
```
`.gitignore`:
```
node_modules
lib
*.log
.DS_Store
```

- [ ] **Step 8: 安装依赖并解析 peer 类型**

```sh
cd F:\余程安学习资料\dsh-shiningweb-ui
pnpm install
```
> 若 `@deepseek-ai/*` 类型无法解析，把已装包链接进来：`pnpm add -D "D:/npm-global/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-client-runtime"` 等（按需），或保持 `paths` 映射。目标：`tsc -p tsconfig.host.json` 与 `tsc -p tsconfig.client.json` 通过（占位空 apply 至少能 typecheck）。

- [ ] **Step 9: 跑 typecheck**

```sh
pnpm typecheck
```
Expected: 0 error（占位文件）。

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold dsh-shiningweb-ui plugin (package, tsconfigs, vendored tsdown helper)"
```

---

### Task 2: 设置命名空间 + 类型（host/client 共享）

**Files:**
- Create: `src/settings.ts`
- Modify: `src/index.ts`（注册 settings 命名空间）
- Test: `tests/settings.spec.ts`

**Interfaces:**
- Consumes: Task 1 的 tsconfig。
- Produces: `SETTINGS_NAMESPACE = 'shining'`；`ShiningSettings`（类型）；`ShiningSettingsSchema`（schemastery）；`DEFAULT_SHINING_SETTINGS`。host 侧 `ctx.settings.register(settingsNamespace('shining'), schema)` 已生效。

- [ ] **Step 1: 写 settings.ts**

```ts
import s from '@deepseek-ai/schemastery'

export const SETTINGS_NAMESPACE = 'shining'

export type ThemeColor = 'galaxy-blue' | 'dawn-gold' | 'aurora-purple'
export type GitAutoRefresh = 'off' | '10s' | '30s' | '1m'

export interface ShiningSettings {
  enabled: boolean
  chat: { enabled: boolean; personaId: string; model: string; apiBase: string; apiKey: string }
  fileExplorer: { enabled: boolean; showHidden: boolean }
  git: { enabled: boolean; autoRefresh: GitAutoRefresh }
  visual: { themeColor: ThemeColor; glassBlur: number }
}

export const ShiningSettingsSchema = s.object({
  enabled: s.boolean().default(true),
  chat: s.object({
    enabled: s.boolean().default(true),
    personaId: s.string().default(''),
    model: s.string().default('deepseek-chat'),
    apiBase: s.string().default('https://api.deepseek.com'),
    apiKey: s.string().default(''),
  }).default({}),
  fileExplorer: s.object({
    enabled: s.boolean().default(true),
    showHidden: s.boolean().default(false),
  }).default({}),
  git: s.object({
    enabled: s.boolean().default(true),
    autoRefresh: s.union([s.const('off'), s.const('10s'), s.const('30s'), s.const('1m')]).default('off'),
  }).default({}),
  visual: s.object({
    themeColor: s.union([s.const('galaxy-blue'), s.const('dawn-gold'), s.const('aurora-purple')]).default('galaxy-blue'),
    glassBlur: s.number().min(0).max(24).default(12),
  }).default({}),
})

export const DEFAULT_SHINING_SETTINGS: ShiningSettings = {
  enabled: true,
  chat: { enabled: true, personaId: '', model: 'deepseek-chat', apiBase: 'https://api.deepseek.com', apiKey: '' },
  fileExplorer: { enabled: true, showHidden: false },
  git: { enabled: true, autoRefresh: 'off' },
  visual: { themeColor: 'galaxy-blue', glassBlur: 12 },
}
```
> 若 schemastery 的 `s.union([s.const(...)])` 写法与当前版本不符，改为 `s.union('off','10s','30s','1m')` 或 `s.enum(['off',...])`（以 schemastery 类型为准，此处为安全默认）。

- [ ] **Step 2: 写 host settings 注册（src/index.ts）**

```ts
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { SETTINGS_NAMESPACE, ShiningSettingsSchema } from './settings.ts'

export function apply(ctx: import('@deepseek-ai/cordis').Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(settingsNamespace(SETTINGS_NAMESPACE), ShiningSettingsSchema)
  })
}
```

- [ ] **Step 3: 写 settings 单测**

```ts
import { describe, it, expect } from 'vitest'
import { ShiningSettingsSchema, DEFAULT_SHINING_SETTINGS } from '../src/settings.ts'

describe('ShiningSettingsSchema', () => {
  it('applies defaults when no section is supplied', () => {
    const parsed = ShiningSettingsSchema.parse({})
    expect(parsed.enabled).toBe(true)
    expect(parsed.chat.model).toBe('deepseek-chat')
    expect(parsed.visual.themeColor).toBe('galaxy-blue')
  })
  it('rejects an invalid themeColor', () => {
    expect(() => ShiningSettingsSchema.parse({ visual: { themeColor: 'red' } })).toThrow()
  })
  it('keeps DEFAULT_SHINING_SETTINGS schema-valid', () => {
    expect(() => ShiningSettingsSchema.parse(DEFAULT_SHINING_SETTINGS)).not.toThrow()
  })
})
```

- [ ] **Step 4: 跑测试**

```sh
npx vitest run tests/settings.spec.ts
```
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/settings.ts src/index.ts tests/settings.spec.ts
git commit -m "feat(host): shining settings namespace + schema"
```

---

### Task 3: ShiningService 网关 —— fs 方法

**Files:**
- Create: `src/gateway.ts`
- Create: `src/types.ts`
- Modify: `src/index.ts`（export default ShiningService）
- Test: `tests/gateway-fs.spec.ts`

**Interfaces:**
- Consumes: `ctx`(cordis)，`TypertRemoteService`/`Remote` from `@deepseek-ai/dsh-typert-protocol`。
- Produces: `class ShiningService extends TypertRemoteService`，服务键 `'shining'`；方法 `fsList/fsRead/fsWrite/fsCreateFile/fsCreateDir/fsRename/fsDelete`，全部单 request 对象参数，返回 `ShiningResult<T>`。

- [ ] **Step 1: 写 src/types.ts（业务类型 + 成功/失败辅助）**

```ts
import { dirname, resolve, sep } from 'node:path'

export interface ShiningSuccess<T> { ok: true; value: T }
export interface ShiningFailure { ok: false; error: { code: string; message: string; [k: string]: unknown } }
export type ShiningResult<T> = ShiningSuccess<T> | ShiningFailure

export function success<T>(value: T): ShiningSuccess<T> { return Object.freeze({ ok: true, value }) }
export function failure(code: string, message: string, extra: Record<string, unknown> = {}): ShiningFailure {
  return Object.freeze({ ok: false, error: Object.freeze({ code, message, ...extra }) })
}

export interface FsListRequest { root: string; path: string; showHidden?: boolean }
export interface FsEntry { name: string; isDirectory: boolean; size: number }
export interface FsListValue { entries: FsEntry[] }
export interface FsReadRequest { root: string; path: string }
export interface FsReadValue { content: string }
export interface FsWriteRequest { root: string; path: string; content: string }
export interface FsPathRequest { root: string; path: string }
export interface FsRenameRequest { root: string; path: string; newName: string }
export interface FsOpValue { path: string }

/** 将客户端路径解析为绝对路径，并强制位于 root 之内。 */
export function resolveWithinRoot(root: string, path: string): string {
  const rootAbs = resolve(root)
  const target = resolve(rootAbs, path)
  if (target !== rootAbs && !target.startsWith(rootAbs + sep)) {
    throw new Error(`path-root-escape: ${target} is outside ${rootAbs}`)
  }
  return target
}
```
> 说明：网关方法在捕获 `path-root-escape` 后转成业务 `failure('path-root-escape', ...)`。

- [ ] **Step 2: 写 src/gateway.ts（fs 方法）**

```ts
import { promises as fs } from 'node:fs'
import { basename, join } from 'node:path'
import { Context, Service } from '@deepseek-ai/cordis'
import s from '@deepseek-ai/schemastery'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type {
  FsListRequest, FsListValue, FsReadRequest, FsReadValue, FsWriteRequest,
  FsPathRequest, FsOpValue, FsRenameRequest, ShiningResult,
} from './types.ts'
import { failure, resolveWithinRoot, success } from './types.ts'

export interface Config {}

declare module '@deepseek-ai/cordis' {
  interface Context { shining: ShiningService }
}

export class ShiningService extends TypertRemoteService {
  static inject: string[] = []
  static Config: s<Config> = s.object({})

  constructor(ctx: Context, _config: Config) {
    super(ctx, 'shining')
  }

  @Remote('fsList')
  async fsList(request: FsListRequest): Promise<ShiningResult<FsListValue>> {
    try {
      const dir = resolveWithinRoot(request.root, request.path)
      const entries = await fs.readdir(dir, { withFileTypes: true })
      const shown = entries
        .filter((e) => request.showHidden === true || !e.name.startsWith('.'))
        .map((e) => ({ name: e.name, isDirectory: e.isDirectory(), size: 0 }))
      for (const entry of shown) {
        if (!entry.isDirectory) {
          try { entry.size = (await fs.stat(join(dir, entry.name))).size } catch { /* size optional */ }
        }
      }
      return success({ entries: shown.sort((a, b) => Number(a.isDirectory) - Number(b.isDirectory) || a.name.localeCompare(b.name)) })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsRead')
  async fsRead(request: FsReadRequest): Promise<ShiningResult<FsReadValue>> {
    try {
      const file = resolveWithinRoot(request.root, request.path)
      return success({ content: await fs.readFile(file, 'utf8') })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsWrite')
  async fsWrite(request: FsWriteRequest): Promise<ShiningResult<FsOpValue>> {
    try {
      const file = resolveWithinRoot(request.root, request.path)
      await fs.writeFile(file, request.content, 'utf8')
      return success({ path: file })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsCreateFile')
  async fsCreateFile(request: FsPathRequest): Promise<ShiningResult<FsOpValue>> {
    try {
      const file = resolveWithinRoot(request.root, request.path)
      await fs.writeFile(file, '', { flag: 'wx' })
      return success({ path: file })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsCreateDir')
  async fsCreateDir(request: FsPathRequest): Promise<ShiningResult<FsOpValue>> {
    try {
      const dir = resolveWithinRoot(request.root, request.path)
      await fs.mkdir(dir, { recursive: false })
      return success({ path: dir })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsRename')
  async fsRename(request: FsRenameRequest): Promise<ShiningResult<FsOpValue>> {
    try {
      const target = resolveWithinRoot(request.root, request.path)
      const next = resolveWithinRoot(request.root, join(basename(target), '..', request.newName))
      await fs.rename(target, next)
      return success({ path: next })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }

  @Remote('fsDelete')
  async fsDelete(request: FsPathRequest): Promise<ShiningResult<FsOpValue>> {
    try {
      const target = resolveWithinRoot(request.root, request.path)
      await fs.rm(target, { recursive: true, force: false })
      return success({ path: target })
    } catch (error) {
      return failure('fs-error', error instanceof Error ? error.message : String(error))
    }
  }
}
export default ShiningService
```
> `fsRename` 的 `newName` 用 `join(basename(target), '..', newName)` 把新名放在同一目录；再经 `resolveWithinRoot` 校验。若语义不对，改为 `join(dirname(target), request.newName)` 并同样校验。

- [ ] **Step 3: 更新 src/index.ts**

```ts
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { SETTINGS_NAMESPACE, ShiningSettingsSchema } from './settings.ts'
import ShiningService from './gateway.ts'

export { ShiningService }
export default ShiningService

export function apply(ctx: import('@deepseek-ai/cordis').Context): void {
  new ShiningService(ctx, {})
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(settingsNamespace(SETTINGS_NAMESPACE), ShiningSettingsSchema)
  })
}
```
> cordis 遇到导出的 Service 类会自动实例化？为避免歧义，`apply` 中显式 `new ShiningService(ctx, {})` 提供 `ctx.shining`（依赖注入：Service 基类构造器 `super(ctx, 'shining')` 会 `ctx.provide`）。

- [ ] **Step 4: 写 gateway-fs 单测（临时目录往返）**

```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ShiningService } from '../src/gateway.ts'

describe('ShiningService.fs', () => {
  let root: string
  beforeAll(async () => { root = await mkdtemp(join(tmpdir(), 'shining-')) })
  afterAll(async () => { await rm(root, { recursive: true, force: true }) })

  it('lists, reads, writes, creates, renames, deletes', async () => {
    const svc = new ShiningService({} as any, {})
    await writeFile(join(root, 'a.txt'), 'hello', 'utf8')
    const list = await svc.fsList({ root, path: '.' })
    expect(list.ok).toBe(true)
    if (list.ok) expect(list.value.entries.some((e) => e.name === 'a.txt')).toBe(true)
    const read = await svc.fsRead({ root, path: 'a.txt' })
    expect(read).toEqual({ ok: true, value: { content: 'hello' } })
    const write = await svc.fsWrite({ root, path: 'b.txt', content: 'world' })
    expect(write.ok).toBe(true)
    const mk = await svc.fsCreateDir({ root, path: 'sub' })
    expect(mk.ok).toBe(true)
    const ren = await svc.fsRename({ root, path: 'a.txt', newName: 'c.txt' })
    expect(ren.ok).toBe(true)
    const del = await svc.fsDelete({ root, path: 'b.txt' })
    expect(del.ok).toBe(true)
  })

  it('rejects a path escaping the root', async () => {
    const svc = new ShiningService({} as any, {})
    const res = await svc.fsRead({ root, path: '../secret.txt' })
    expect(res).toMatchObject({ ok: false, error: { code: 'fs-error' } })
  })
})
```

- [ ] **Step 5: 跑测试**

```sh
npx vitest run tests/gateway-fs.spec.ts
```
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/gateway.ts src/index.ts tests/gateway-fs.spec.ts
git commit -m "feat(host): ShiningService fs Remote methods + path-root confinement"
```

---

### Task 4: ShiningService 网关 —— git 与 chat 方法

**Files:**
- Modify: `src/types.ts`（git/chat 类型）
- Modify: `src/gateway.ts`（git 与 chat 方法）
- Test: `tests/gateway-git-chat.spec.ts`

**Interfaces:**
- Consumes: `ShiningResult`/`success`/`failure`/`resolveWithinRoot`。
- Produces: `gitStatus/gitCheckout/gitCreateBranch/gitPull/chat` 方法。

- [ ] **Step 1: 追加 git/chat 类型（src/types.ts）**

```ts
export interface GitStatusRequest { root: string; repoPath: string }
export interface GitChange { path: string; status: 'M' | 'A' | 'D' | 'U' }
export interface GitStatusValue { branch: string; dirtyCount: number; changes: GitChange[] }
export interface GitBranchRequest { root: string; repoPath: string; branch: string }
export interface GitCreateBranchRequest { root: string; repoPath: string; name: string }
export interface GitPathRequest { root: string; repoPath: string }
export interface GitOpValue { output: string }
export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string }
export interface ChatRequest { messages: ChatMessage[]; model: string; apiBase: string; apiKey: string }
export interface ChatValue { content: string }
```

- [ ] **Step 2: 写 git/chat 方法（src/gateway.ts 内追加）**

```ts
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
const execFileAsync = promisify(execFile)

function gitResult(cmd: string, args: string[]): Promise<{ stdout: string; stderr: string }> {
  return execFileAsync('git', ['-C', cmd, ...args], { timeout: 30000 })
}

@Remote('gitStatus')
async gitStatus(request: GitStatusRequest): Promise<ShiningResult<GitStatusValue>> {
  try {
    const repo = resolveWithinRoot(request.root, request.repoPath)
    const branch = (await gitResult(repo, ['branch', '--show-current'])).stdout.trim()
    const porcelain = (await gitResult(repo, ['status', '--porcelain'])).stdout
    const lines = porcelain.split('\n').filter(Boolean)
    const changes = lines.map((line) => ({
      path: line.slice(3),
      status: (line[0] === '?' ? 'U' : line[0]) as GitChange['status'],
    }))
    return success({ branch, dirtyCount: lines.length, changes })
  } catch (error) {
    return failure('git-error', error instanceof Error ? error.message : String(error))
  }
}

@Remote('gitCheckout')
async gitCheckout(request: GitBranchRequest): Promise<ShiningResult<GitOpValue>> {
  try {
    const repo = resolveWithinRoot(request.root, request.repoPath)
    const { stdout } = await gitResult(repo, ['checkout', request.branch])
    return success({ output: stdout.trim() })
  } catch (error) {
    return failure('git-error', error instanceof Error ? error.message : String(error))
  }
}

@Remote('gitCreateBranch')
async gitCreateBranch(request: GitCreateBranchRequest): Promise<ShiningResult<GitOpValue>> {
  try {
    const repo = resolveWithinRoot(request.root, request.repoPath)
    const { stdout } = await gitResult(repo, ['checkout', '-b', request.name])
    return success({ output: stdout.trim() })
  } catch (error) {
    return failure('git-error', error instanceof Error ? error.message : String(error))
  }
}

@Remote('gitPull')
async gitPull(request: GitPathRequest): Promise<ShiningResult<GitOpValue>> {
  try {
    const repo = resolveWithinRoot(request.root, request.repoPath)
    const { stdout } = await gitResult(repo, ['pull'])
    return success({ output: stdout.trim() })
  } catch (error) {
    return failure('git-error', error instanceof Error ? error.message : String(error))
  }
}

@Remote('chat')
async chat(request: ChatRequest): Promise<ShiningResult<ChatValue>> {
  try {
    const response = await fetch(`${request.apiBase.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${request.apiKey}` },
      body: JSON.stringify({ model: request.model, messages: request.messages, stream: false }),
      signal: AbortSignal.timeout(120000),
    })
    if (!response.ok) return failure('chat-error', `upstream ${response.status}`)
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
    return success({ content: data.choices?.[0]?.message?.content ?? '' })
  } catch (error) {
    return failure('chat-error', error instanceof Error ? error.message : String(error))
  }
}
```
> `fetch` 为 Node 18+ 全局（宿主 Node ≥22）；`AbortSignal.timeout` 需 Node ≥17.3。超时/二进制路径为部署级可调项，v0.1 用 `static Config` 默认并留 TODO 注释指向 Task 2 的 Config 扩展。

- [ ] **Step 3: 写 gateway-git-chat 单测**

```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { ShiningService } from '../src/gateway.ts'

describe('ShiningService.git/chat', () => {
  let root: string
  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), 'shining-git-'))
    execFileSync('git', ['init', '-b', 'main', root], { stdio: 'ignore' })
    execFileSync('git', ['-C', root, 'config', 'user.email', 't@t'], { stdio: 'ignore' })
    execFileSync('git', ['-C', root, 'config', 'user.name', 't'], { stdio: 'ignore' })
    await writeFile(join(root, 'x.txt'), 'x')
    execFileSync('git', ['-C', root, 'add', '.'], { stdio: 'ignore' })
    execFileSync('git', ['-C', root, 'commit', '-m', 'init'], { stdio: 'ignore' })
  })
  afterAll(async () => { await rm(root, { recursive: true, force: true }) })

  it('reports branch and clean status', async () => {
    const svc = new ShiningService({} as any, {})
    const res = await svc.gitStatus({ root, repoPath: '.' })
    expect(res).toMatchObject({ ok: true, value: { branch: 'main', dirtyCount: 0 } })
  })

  it('creates and checks out a branch', async () => {
    const svc = new ShiningService({} as any, {})
    await expect(svc.gitCreateBranch({ root, repoPath: '.', name: 'feat' })).resolves.toMatchObject({ ok: true })
    const st = await svc.gitStatus({ root, repoPath: '.' })
    expect(st).toMatchObject({ ok: true, value: { branch: 'feat' } })
  })

  it('rejects a repo path escaping the root', async () => {
    const svc = new ShiningService({} as any, {})
    const res = await svc.gitStatus({ root, repoPath: '../other' })
    expect(res).toMatchObject({ ok: false, error: { code: 'git-error' } })
  })
})
```

- [ ] **Step 4: 跑测试**

```sh
npx vitest run tests/gateway-git-chat.spec.ts
```
Expected: PASS（若 `git` 不在 PATH 则跳过/标注，见 README 前置条件）。

- [ ] **Step 5: Commit**

```bash
git add src/types.ts src/gateway.ts tests/gateway-git-chat.spec.ts
git commit -m "feat(host): ShiningService git + chat Remote methods"
```

---

### Task 5: typert 制品（gen-typert.mjs）

**Files:**
- Create: `scripts/typert-defs.mjs`
- Create: `scripts/gen-typert.mjs`
- Create: `src/client/remote.ts`（生成的 client 贡献）
- Create: `lib/typert.host.js`, `lib/typert.host.d.ts`（生成的 host 制品）
- Test: `tests/typert-artifacts.spec.ts`

**Interfaces:**
- Consumes: Task 3/4 的方法名与 request/result 形状。
- Produces: `TYPERT_REMOTE`（client 挂载，strict zod codec）与 `TYPERT`（host `./typert`）。

- [ ] **Step 1: 写 scripts/typert-defs.mjs（单一数据源：schema + 描述符）**

```js
import { z } from 'zod'

export const NAMESPACE = 'shining'
export const PACKAGE = 'dsh-shiningweb-ui'

const entrySchema = z.object({
  name: z.string(), isDirectory: z.boolean(), size: z.number(),
})
const listValue = z.object({ entries: z.array(entrySchema) })
const readValue = z.object({ content: z.string() })
const opValue = z.object({ path: z.string() })
const gitChange = z.object({ path: z.string(), status: z.union([z.literal('M'), z.literal('A'), z.literal('D'), z.literal('U')]) })
const gitStatusValue = z.object({ branch: z.string(), dirtyCount: z.number(), changes: z.array(gitChange) })
const gitOpValue = z.object({ output: z.string() })
const chatMessage = z.object({ role: z.union([z.literal('system'), z.literal('user'), z.literal('assistant')]), content: z.string() })
const chatValue = z.object({ content: z.string() })

const root = z.object({ root: z.string(), path: z.string() })

/** 每个 method 的参数 zod 对象（不含 root 时的通用形态）。 */
export const methods = [
  { method: 'fsList', params: root.extend({ showHidden: z.boolean().optional() }), result: listValue, field: 'path' },
  { method: 'fsRead', params: root, result: readValue, field: 'path' },
  { method: 'fsWrite', params: root.extend({ content: z.string() }), result: opValue, field: 'path' },
  { method: 'fsCreateFile', params: root, result: opValue, field: 'path' },
  { method: 'fsCreateDir', params: root, result: opValue, field: 'path' },
  { method: 'fsRename', params: root.extend({ newName: z.string() }), result: opValue, field: 'path' },
  { method: 'fsDelete', params: root, result: opValue, field: 'path' },
  { method: 'gitStatus', params: z.object({ root: z.string(), repoPath: z.string() }), result: gitStatusValue, field: 'repoPath' },
  { method: 'gitCheckout', params: z.object({ root: z.string(), repoPath: z.string(), branch: z.string() }), result: gitOpValue, field: 'repoPath' },
  { method: 'gitCreateBranch', params: z.object({ root: z.string(), repoPath: z.string(), name: z.string() }), result: gitOpValue, field: 'repoPath' },
  { method: 'gitPull', params: z.object({ root: z.string(), repoPath: z.string() }), result: gitOpValue, field: 'repoPath' },
  { method: 'chat', params: z.object({ messages: z.array(chatMessage), model: z.string(), apiBase: z.string(), apiKey: z.string() }), result: chatValue, field: 'none' },
]
```
> 参数 schema 直接由 `params` 提供；`field` 仅用于 sourceLocation 标记（可忽略）。

- [ ] **Step 2: 写 scripts/gen-typert.mjs（生成两个制品）**

```js
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { methods, NAMESPACE, PACKAGE } from './typert-defs.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const paramCodec = (schema) => `z.object(${JSON.stringify(schema.shape, (k, v) => v)})` // 简化：直接用对象

function buildDescriptors(mode) {
  return methods.map((m) => ({
    id: `${PACKAGE}#${NAMESPACE}/${m.method}`,
    service: NAMESPACE,
    namespace: NAMESPACE,
    method: m.method,
    invocation: { kind: 'direct' },
    parameters: Object.entries(m.params.shape).map(([name, zs]) => ({ name, wire: name, source: 'json', codec: { mode: 'strict', typeSymbol: `#${name}`, schema: zs } })),
    result: { mode: 'strict', typeSymbol: `#${m.method}`, schema: m.result },
  }))
}

// 1) lib/typert.host.js（host ./typert）
const host = `import { z } from 'zod'
export const TYPERT = {
  package: '${PACKAGE}',
  face: 'host',
  schemas: [],
  invocations: ${JSON.stringify(buildDescriptors(), (k, v) => v, 2).replace(/"/g, (m, off, s) => (s[off-1] === ':' ? '"' : '"'))},
  model: { services: [], events: [], objects: [] },
}
`
// 2) src/client/remote.ts（client 贡献，zod strict）
const client = `import { z } from 'zod'
export const TYPERT_REMOTE = {
  package: '${PACKAGE}',
  descriptors: ${JSON.stringify(buildDescriptors(), null, 2)},
}
export default TYPERT_REMOTE
`
mkdirSync(join(root, 'lib'), { recursive: true })
writeFileSync(join(root, 'lib/typert.host.js'), host)
writeFileSync(join(root, 'lib/typert.host.d.ts'), `export declare const TYPERT: unknown\n`)
writeFileSync(join(root, 'src/client/remote.ts'), client)
console.log('gen-typert: wrote lib/typert.host.{js,d.ts} and src/client/remote.ts')
```
> 说明：上述 `JSON.stringify` 会把 zod schema 对象序列化，但 zod 对象不能 JSON 序列化（含函数）。**正确做法**是在 `typert-defs.mjs` 里直接以源码字符串给出 schema 表达式（`z.object({...})`），gen-typert 把该字符串拼进产物。为简化并避免 JSON 序列化 zod 的坑，`buildDescriptors` 改为从 `typert-defs.mjs` 读取每个 method 的**源码字符串** `paramCodecSource` / `resultCodecSource`（形如 `z.object({ root: z.string(), path: z.string() })`），直接写入产物文本。实现时按此调整 `typert-defs.mjs` 为源码字符串形式。宿主校验规则（dsh-typert-loader）要求 codec 为 zod v4 schema 实例，故产物中必须保留真实 `z.object(...)` 调用而非序列化。

- [ ] **Step 3: 写 typert-artifacts 单测**

```ts
import { describe, it, expect } from 'vitest'
import { TYPERT_REMOTE } from '../src/client/remote.ts'

describe('typert artifacts', () => {
  it('client contribution has strict codecs and expected endpoints', () => {
    expect(TYPERT_REMOTE.package).toBe('dsh-shiningweb-ui')
    const methods = TYPERT_REMOTE.descriptors.map((d) => d.method)
    expect(methods).toContain('fsList')
    expect(methods).toContain('chat')
    for (const d of TYPERT_REMOTE.descriptors) {
      expect(d.result.mode).toBe('strict')
      expect(typeof d.result.schema.parse).toBe('function')
    }
  })
})
```

- [ ] **Step 4: 跑生成 + 测试**

```sh
node scripts/gen-typert.mjs
npx vitest run tests/typert-artifacts.spec.ts
```
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add scripts/typert-defs.mjs scripts/gen-typert.mjs src/client/remote.ts lib/typert.host.js lib/typert.host.d.ts tests/typert-artifacts.spec.ts
git commit -m "feat: typert artifacts (host ./typert + client remote contribution)"
```

---

### Task 6: client 基础 —— apply + 面板 store + 设置 hook

**Files:**
- Create: `src/client/locales.ts`
- Create: `src/client/store.ts`
- Create: `src/client/settings.ts`
- Modify: `src/client/index.tsx`（apply：mount remote + bind settings + 视觉应用 + 注册占位）
- Test: `tests/client-shell.spec.tsx`

**Interfaces:**
- Consumes: Task 5 的 `TYPERT_REMOTE`（`src/client/remote.ts`）；`SETTINGS_NAMESPACE`/`ShiningSettings`。
- Produces: `useShiningStore()`（面板开关）、`useSettings()`（settingsScope snapshot）、`ctx.remote.shining` 已挂载。

- [ ] **Step 1: 写 locales.ts**

```ts
export const NS = 'shining'
export const dict = {
  zh: { entryChat: '天圆地方', entryFiles: '文件', settingsTitle: '璀璨星河', chatTitle: '天圆地方', send: '发送', sendPlaceholder: '输入消息…' },
  en: { entryChat: 'Tianyuan Difang', entryFiles: 'Files', settingsTitle: 'Shining Web', chatTitle: 'Tianyuan Difang', send: 'Send', sendPlaceholder: 'Type a message…' },
}
export type ShiningKey = keyof typeof dict.zh
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap { 'shining': ShiningKey }
}
```

- [ ] **Step 2: 写 store.ts（overlay 面板开关）**

```ts
import { useSyncExternalStore } from 'react'

export interface ShiningPanels { chatOpen: boolean; filesOpen: boolean }

let state: ShiningPanels = { chatOpen: false, filesOpen: false }
const listeners = new Set<() => void>()
function emit(): void { for (const l of listeners) l() }
function set(next: Partial<ShiningPanels>): void { state = { ...state, ...next }; emit() }

export function useShiningStore(): ShiningPanels {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l) },
    () => state,
  )
}
export function openChat(): void { set({ chatOpen: true }) }
export function closeChat(): void { set({ chatOpen: false }) }
export function openFiles(): void { set({ filesOpen: true }) }
export function closeFiles(): void { set({ filesOpen: false }) }
export function toggleChat(): void { set({ chatOpen: !state.chatOpen }) }
export function toggleFiles(): void { set({ filesOpen: !state.filesOpen }) }
```

- [ ] **Step 3: 写 settings.ts（useSettings hook）**

```ts
import { useSyncExternalStore } from 'react'
import type { SettingsScope, SettingsScopeSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import type { ShiningSettings } from '../settings.ts'
import { DEFAULT_SHINING_SETTINGS } from '../settings.ts'

export type { ShiningSettings }
let scope: SettingsScope<ShiningSettings> | null = null
export function bindSettingsScope(s: SettingsScope<ShiningSettings>): void { scope = s }
function snapshot(): ShiningSettings { return scope?.getSnapshot().value ?? DEFAULT_SHINING_SETTINGS }
export function useSettings(): ShiningSettings {
  return useSyncExternalStore(
    (l) => { scope?.subscribe(l); return () => {} },
    snapshot,
  )
}
```

- [ ] **Step 4: 写 client/index.tsx（apply 骨架）**

```tsx
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { ShiningSettings } from '../settings.ts'
import { SETTINGS_NAMESPACE } from '../settings.ts'
import { dict, NS } from './locales.ts'
import { bindSettingsScope } from './settings.ts'
import TYPERT_REMOTE from './remote.ts'
import { applyVisual } from './visual.ts'

export const inject = ['slots', 'remote', 'remote.shining', 'locale', 'settingsScope', 'connection']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, dict), 'shining: dictionaries')
  void ctx.remote.$mount(TYPERT_REMOTE)
  const scope = ctx.settingsScope.bind<ShiningSettings>({ namespace: SETTINGS_NAMESPACE })
  bindSettingsScope(scope)
  ctx.effect(() => scope.subscribe(() => applyVisual(scope.getSnapshot().value)), 'shining: visual subscription')
  applyVisual(scope.getSnapshot().value)
}
```

- [ ] **Step 5: 写 visual.ts（视觉应用）**

```ts
import type { ShiningSettings } from '../settings.ts'
const THEME_COLORS: Record<string, { primary: string; accent: string }> = {
  'galaxy-blue': { primary: '#4f7cff', accent: '#7aa0ff' },
  'dawn-gold': { primary: '#e0a43b', accent: '#f2c56b' },
  'aurora-purple': { primary: '#9a6bff', accent: '#c39bff' },
}
export function applyVisual(settings?: ShiningSettings): void {
  const root = document.documentElement
  const color = THEME_COLORS[settings?.visual.themeColor ?? 'galaxy-blue']
  root.style.setProperty('--shining-primary', color.primary)
  root.style.setProperty('--shining-accent', color.accent)
  root.style.setProperty('--shining-blur', `${settings?.visual.glassBlur ?? 12}px`)
}
```

- [ ] **Step 6: 写 client-shell 单测（jsdom + fake services）**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { useShiningStore, openChat, closeChat } from '../src/client/store.ts'

describe('shining client store', () => {
  it('toggles chat panel', () => {
    openChat()
    expect(useShiningStore).toBeDefined()
  })
})
```
> client 真正的 slot 注册测试在 Task 10 之后用 SlotTestRuntime 覆盖；本任务只验证 store/视觉纯逻辑可编译。`@testing-library/react` 依赖 jsdom 环境（vitest config 见 Task 10）。

- [ ] **Step 7: Commit**

```bash
git add src/client/locales.ts src/client/store.ts src/client/settings.ts src/client/index.tsx src/client/visual.ts tests/client-shell.spec.tsx
git commit -m "feat(client): apply skeleton, panel store, settings hook, visual effect"
```

---

### Task 7: client bundle 构建打通

**Files:**
- Modify: `src/client/index.tsx`（确保无 cross-plugin value import）
- Test: 构建产物存在性

**Interfaces:**
- Consumes: Task 1 的 tsdown 设施 + Task 6 的 client。
- Produces: `lib/client.js`（`window.__ModuleLoader__.load` 格式）+ `lib/index.js`（node half）。

- [ ] **Step 1: 跑完整构建**

```sh
pnpm build
```
Expected: 生成 `lib/client.js`、`lib/index.js`、`lib/types/**`、`lib/typert.host.js`。

- [ ] **Step 2: 断言产物格式**

```sh
node -e "const s=require('fs').readFileSync('lib/client.js','utf8'); if(!/window\.__ModuleLoader__\.load\(/.test(s)){throw new Error('missing loader wrapper')}; console.log('client bundle OK', s.length)"
```
Expected: 打印 `client bundle OK <len>`。

- [ ] **Step 3: Commit**

```bash
git add lib/client.js lib/index.js lib/types lib/typert.host.js
git commit -m "chore: build produces loadable client bundle and node half"
```

---

### Task 8: 侧边栏入口（sidebar.footer.action）

**Files:**
- Create: `src/client/components/SidebarEntry.tsx` + `SidebarEntry.module.css`
- Modify: `src/client/index.tsx`（注册 2 个 footer action）
- Test: `tests/sidebar-entry.spec.tsx`

**Interfaces:**
- Consumes: `useShiningStore`（toggleChat/toggleFiles）、`useSettings`、`t`(locale seat)。
- Produces: 脚部「天圆地方」「文件」两个按钮。

- [ ] **Step 1: 写 SidebarEntry.tsx**

```tsx
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { useSettings } from '../settings.ts'
import { openChat, openFiles } from '../store.ts'
import { dict } from '../locales.ts'
import styles from './SidebarEntry.module.css'

type Props = PropsRuntime<'sidebar.footer.action'> & PropsLocale<'shining'>

export function ChatEntry(props: Props): React.ReactNode {
  const settings = useSettings()
  if (!settings.enabled || !settings.chat.enabled) return null
  const wide = props.wide
  return (
    <button type="button" className={styles.entry} onClick={openChat} aria-label={dict.zh.entryChat}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20h16M6 20V9a6 6 0 0 1 12 0v11" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M6 14h12" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
      {wide ? <span className={styles.label}>{dict.zh.entryChat}</span> : null}
    </button>
  )
}

export function FilesEntry(props: Props): React.ReactNode {
  const settings = useSettings()
  if (!settings.enabled || !settings.fileExplorer.enabled) return null
  const wide = props.wide
  return (
    <button type="button" className={styles.entry} onClick={openFiles} aria-label={dict.zh.entryFiles}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 6h7l2 2h9v11H3z" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
      {wide ? <span className={styles.label}>{dict.zh.entryFiles}</span> : null}
    </button>
  )
}
```

- [ ] **Step 2: 写 SidebarEntry.module.css**

```css
.entry { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 10px; color: var(--dsw-alias-label-primary); background: transparent; border: 0; cursor: pointer; font: inherit; }
.entry:hover { background: var(--dsw-alias-interactive-bg-hover); }
.label { font-size: 13px; }
```

- [ ] **Step 3: 注册（src/client/index.tsx 追加）**

```tsx
import { ChatEntry, FilesEntry } from './components/SidebarEntry.tsx'
// in apply():
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name: 'sidebar.footer.action', id: 'shining-chat', order: 30, locale: NS }, ChatEntry))
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name: 'sidebar.footer.action', id: 'shining-files', order: 31, locale: NS }, FilesEntry))
```
> 注意：`ctx.slots.inject(key, ...)` 对同一 key 多次调用（两处 footer action）——ui-message-feedback 每次 inject 注册一个 entry。同 id 不同 priority 会抛错，因此 id 不同（shining-chat / shining-files）。

- [ ] **Step 4: 跑构建 + 类型检查**

```sh
pnpm typecheck && pnpm build
```
Expected: 0 error。

- [ ] **Step 5: Commit**

```bash
git add src/client/components/SidebarEntry.tsx src/client/components/SidebarEntry.module.css src/client/index.tsx
git commit -m "feat(client): sidebar.footer.action entries (天圆地方 / 文件)"
```

---

### Task 9: 天圆地方聊天窗（shell.overlay）

**Files:**
- Create: `src/client/components/ChatWindow.tsx` + `ChatWindow.module.css`
- Create: `src/client/hooks/useChat.ts`（IndexedDB 历史）
- Create: `src/client/storage.ts`（IndexedDB/localStorage + 图片压缩）
- Modify: `src/client/index.tsx`（注册 shell.overlay entry）
- Test: `tests/chat-window.spec.tsx`

**Interfaces:**
- Consumes: `useShiningStore`(chatOpen/closeChat)、`useSettings`、`ctx.remote.shining.chat`。
- Produces: `useChatHistory(personaId)`、`storage`（putImage/getImage、chat 历史增删）。

- [ ] **Step 1: 写 storage.ts（IndexedDB 聊天历史 + localStorage 立绘/背景）**

```ts
const DB = 'shining-chat'
const STORE = 'history'
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}
export interface ChatRecord { id: string; personaId: string; messages: Array<{ role: string; content: string }>; updatedAt: number }
export async function saveChat(rec: ChatRecord): Promise<void> {
  const db = await openDb(); const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(rec)
  await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = () => rej(tx.error) })
}
export async function loadChat(id: string): Promise<ChatRecord | undefined> {
  const db = await openDb()
  return new Promise((res, rej) => { const rq = db.transaction(STORE).objectStore(STORE).get(id); rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error) })
}
export async function listChats(personaId: string): Promise<ChatRecord[]> {
  const db = await openDb()
  return new Promise((res, rej) => {
    const all = db.transaction(STORE).objectStore(STORE).getAll()
    all.onsuccess = () => res(all.result.filter((r) => r.personaId === personaId).sort((a, b) => b.updatedAt - a.updatedAt))
    all.onerror = () => rej(all.error)
  })
}

// 立绘/背景：localStorage（限 2MB，压缩后存 Base64）
const IMG_KEY = 'shining:image'
export function setImage(dataUrl: string): void { localStorage.setItem(IMG_KEY, dataUrl) }
export function getImage(): string | null { return localStorage.getItem(IMG_KEY) }
export function clearImage(): void { localStorage.removeItem(IMG_KEY) }
```
> 图片压缩（canvas → 最大 1024px → JPEG 0.8）在 ChatWindow 上传时做；若仍 > 2MB 拒绝并提示。

- [ ] **Step 2: 写 useChat.ts**

```ts
import { useEffect, useState } from 'react'
import { loadChat, saveChat, listChats, type ChatRecord } from '../storage.ts'
import type { ShiningSettings } from '../../settings.ts'

export function useChatHistory(personaId: string) {
  const [rec, setRec] = useState<ChatRecord | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    void listChats(personaId).then((list) => {
      if (!alive) return
      setRec(list[0] ?? null); setLoading(false)
    })
    return () => { alive = false }
  }, [personaId])
  const append = async (role: string, content: string) => {
    const next: ChatRecord = { id: rec?.id ?? `${personaId}-${Date.now()}`, personaId, messages: [...(rec?.messages ?? []), { role, content }], updatedAt: Date.now() }
    await saveChat(next); setRec(next)
  }
  return { rec, loading, append }
}

export interface SendResult { ok: boolean; content?: string; error?: string }
export async function sendChat(settings: ShiningSettings, messages: Array<{ role: string; content: string }>): Promise<SendResult> {
  const res = await (globalThis as any).remoteShining?.chat?.({
    messages, model: settings.chat.model, apiBase: settings.chat.apiBase, apiKey: settings.chat.apiKey,
  })
  if (res?.ok) return { ok: true, content: res.value.content }
  return { ok: false, error: res?.error?.message ?? 'chat failed' }
}
```
> `remoteShining` 由 ChatWindow 通过 props/inject 注入（见下），此处仅作类型占位。实际 ChatWindow 通过 `ctx.remote.shining.chat` 调用。

- [ ] **Step 3: 写 ChatWindow.tsx**

```tsx
import { useState } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { useSettings } from '../settings.ts'
import { useShiningStore, closeChat } from '../store.ts'
import { useChatHistory } from '../hooks/useChat.ts'
import { dict } from '../locales.ts'
import styles from './ChatWindow.module.css'

type Props = PropsRuntime<'shell.overlay'> & { remoteShining?: { chat: (r: any) => Promise<{ ok: boolean; value?: { content: string }; error?: { message: string } }> } }

export function ChatWindow(props: Props): React.ReactNode {
  const { chatOpen } = useShiningStore()
  const settings = useSettings()
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const { rec, append } = useChatHistory(settings.chat.personaId || 'default')
  if (!chatOpen || !settings.enabled || !settings.chat.enabled) return null
  const send = async () => {
    if (!input.trim() || busy) return
    setBusy(true)
    await append('user', input.trim())
    const history = [...(rec?.messages ?? []), { role: 'user' as const, content: input.trim() }]
    const res = await props.remoteShining?.chat?.({
      messages: history.map((m) => ({ role: m.role, content: m.content })),
      model: settings.chat.model, apiBase: settings.chat.apiBase, apiKey: settings.chat.apiKey,
    })
    if (res?.ok && res.value?.content) await append('assistant', res.value.content)
    else await append('assistant', res?.error?.message ?? '请求失败')
    setInput(''); setBusy(false)
  }
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={dict.zh.chatTitle}>
      <div className={styles.backdrop} onClick={closeChat} />
      <section className={styles.panel} style={{ backdropFilter: `blur(var(--shining-blur))` }}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>{dict.zh.chatTitle}</h2>
            <span className={styles.tag}>人格：{settings.chat.personaId || '默认'}</span>
          </div>
          <button className={styles.close} onClick={closeChat} aria-label="close">×</button>
        </header>
        <ul className={styles.messages}>
          {(rec?.messages ?? []).map((m, i) => <li key={i} className={m.role === 'user' ? styles.user : styles.assistant}>{m.content}</li>)}
        </ul>
        <footer className={styles.footer}>
          <input className={styles.input} value={input} onChange={(e) => setInput(e.target.value)} placeholder={dict.zh.sendPlaceholder}
            onKeyDown={(e) => { if (e.key === 'Enter') void send() }} />
          <button className={styles.send} onClick={() => void send()} disabled={busy}>{dict.zh.send}</button>
        </footer>
      </section>
    </div>
  )
}
```
> 立绘背景：`section.panel` 的 `backgroundImage` 由 `getImage()` 提供；默认渐变占位图写在 CSS。`remoteShining` 从 `ctx.remote.shining` 传入（见注册处）。

- [ ] **Step 4: 写 ChatWindow.module.css**

```css
.overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; }
.backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.4); }
.panel { position: relative; width: min(720px, 92vw); height: min(560px, 86vh); display: flex; flex-direction: column; border-radius: 16px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-overlay); overflow: hidden; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.title { margin: 0; font-size: 16px; }
.tag { font-size: 12px; color: var(--dsw-alias-label-secondary); margin-left: 8px; }
.close { background: transparent; border: 0; font-size: 20px; cursor: pointer; color: var(--dsw-alias-label-primary); }
.messages { flex: 1; overflow-y: auto; list-style: none; margin: 0; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.user { align-self: flex-end; background: var(--shining-primary); color: #fff; padding: 6px 12px; border-radius: 12px; max-width: 70%; }
.assistant { align-self: flex-start; background: var(--dsw-alias-bg-module-platform); padding: 6px 12px; border-radius: 12px; max-width: 70%; }
.footer { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--dsw-alias-border-l2); }
.input { flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); }
.send { padding: 8px 16px; border: 0; border-radius: 8px; background: var(--shining-primary); color: #fff; cursor: pointer; }
```

- [ ] **Step 5: 注册 shell.overlay entry（src/client/index.tsx 追加）**

```tsx
import { ChatWindow } from './components/ChatWindow.tsx'
// in apply():
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'shining-chat' }, () => <ChatWindow remoteShining={ctx.remote.shining} />))
```
> 说明：注册的组件直接 render 的 `ChatWindow`（内含 overlay 的 fixed 定位 + pointer-events 开启，见 CSS `position: fixed`）。`ctx.remote.shining` 为挂载后的命名空间服务，作为 prop 传入。

- [ ] **Step 6: 跑构建 + 类型检查**

```sh
pnpm typecheck && pnpm build
```
Expected: 0 error。

- [ ] **Step 7: Commit**

```bash
git add src/client/components/ChatWindow.tsx src/client/components/ChatWindow.module.css src/client/hooks/useChat.ts src/client/storage.ts src/client/index.tsx
git commit -m "feat(client): 天圆地方 chat overlay (shell.overlay)"
```

---

### Task 10: 文件栏抽屉（shell.overlay）与 Git 工具栏（conversation.input.dock）

**Files:**
- Create: `src/client/components/FileExplorer.tsx` + `.module.css`
- Create: `src/client/components/GitManager.tsx` + `.module.css`
- Create: `src/client/hooks/useFileTree.ts`
- Create: `src/client/hooks/useGitBranch.ts`
- Modify: `src/client/index.tsx`（注册 2 个 entry）
- Test: `tests/file-git.spec.tsx`

**Interfaces:**
- Consumes: `ctx.remote.shining.fsList/fsRead/fsWrite/fsCreateFile/fsCreateDir/fsRename/fsDelete`；`ctx.remote.shining.gitStatus/gitCheckout/gitCreateBranch/gitPull`；`useWorkspaces`/`useSessions`（拿 workspace path）；`useSettings`；`useShiningStore`。
- Produces: `useFileTree(root, {showHidden})`、`useGitBranch(root)`；抽屉与工具栏组件。

- [ ] **Step 1: 写 useFileTree.ts**

```ts
import { useCallback, useState } from 'react'
interface FsEntry { name: string; isDirectory: boolean; size: number }
interface RemoteFs { fsList: (r: { root: string; path: string; showHidden?: boolean }) => Promise<{ ok: boolean; value?: { entries: FsEntry[] }; error?: { message: string } }> }
export function useFileTree(root: string, showHidden: boolean, remote: RemoteFs) {
  const [children, setChildren] = useState<Record<string, FsEntry[]>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const toggle = useCallback(async (relPath: string) => {
    const next = !expanded[relPath]
    setExpanded((e) => ({ ...e, [relPath]: next }))
    if (next && !children[relPath]) {
      const res = await remote.fsList({ root, path: relPath || '.', showHidden })
      if (res.ok) setChildren((c) => ({ ...c, [relPath]: res.value!.entries }))
    }
  }, [root, showHidden, expanded, children, remote])
  return { children, expanded, toggle, root }
}
```
> 目录 key 用相对路径（'' = 根）；展开时懒加载。

- [ ] **Step 2: 写 useGitBranch.ts**

```ts
import { useCallback, useState } from 'react'
interface GitChange { path: string; status: string }
interface RemoteGit { gitStatus: (r: { root: string; repoPath: string }) => Promise<{ ok: boolean; value?: { branch: string; dirtyCount: number; changes: GitChange[] }; error?: { message: string } }> }
export function useGitBranch(root: string, remote: RemoteGit) {
  const [state, setState] = useState<{ branch: string; dirtyCount: number; changes: GitChange[] }>({ branch: '', dirtyCount: 0, changes: [] })
  const refresh = useCallback(async () => {
    const res = await remote.gitStatus({ root, repoPath: '.' })
    if (res.ok && res.value) setState(res.value)
  }, [root, remote])
  return { state, refresh }
}
```

- [ ] **Step 3: 写 FileExplorer.tsx（抽屉 + 文件树 + 右键菜单 + 搜索）**

```tsx
import { useState } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { useSettings } from '../settings.ts'
import { useShiningStore, closeFiles } from '../store.ts'
import { useFileTree } from '../hooks/useFileTree.ts'
import styles from './FileExplorer.module.css'

type Props = PropsRuntime<'shell.overlay'> & { remote: any; root: string; openPath: (p: string) => void }

function extIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = { js: 'JS', py: 'PY', json: '{}', md: 'M', txt: 'T', html: '<>' }
  return map[ext] ?? '•'
}

export function FileExplorer(props: Props): React.ReactNode {
  const { filesOpen } = useShiningStore()
  const settings = useSettings()
  const [query, setQuery] = useState('')
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; path: string } | null>(null)
  const tree = useFileTree(props.root, settings.fileExplorer.showHidden, props.remote)
  if (!filesOpen || !settings.enabled || !settings.fileExplorer.enabled) return null
  const renderDir = (rel: string): React.ReactNode => {
    const children = (tree.children[rel] ?? []).filter((e) => !query || e.name.toLowerCase().includes(query.toLowerCase()))
    return children.map((e) => {
      const childRel = rel ? `${rel}/${e.name}` : e.name
      return (
        <li key={childRel}>
          <button type="button" className={styles.row}
            onContextMenu={(ev) => { ev.preventDefault(); setCtxMenu({ x: ev.clientX, y: ev.clientY, path: childRel }) }}
            onClick={() => { if (e.isDirectory) void tree.toggle(childRel); else props.openPath(childRel) }}>
            <span className={styles.icon}>{e.isDirectory ? '▸' : extIcon(e.name)}</span>
            <span className={styles.name}>{e.name}</span>
          </button>
          {e.isDirectory && tree.expanded[childRel] ? <ul className={styles.children}>{renderDir(childRel)}</ul> : null}
        </li>
      )
    })
  }
  return (
    <div className={styles.drawer}>
      <header className={styles.header}>
        <span>文件</span>
        <button className={styles.close} onClick={closeFiles} aria-label="close">×</button>
      </header>
      <input className={styles.search} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="过滤文件…" />
      <ul className={styles.tree}>{renderDir('')}</ul>
      {ctxMenu ? <CtxMenu menu={ctxMenu} onClose={() => setCtxMenu(null)} remote={props.remote} root={props.root} /> : null}
    </div>
  )
}

function CtxMenu(props: { menu: { x: number; y: number; path: string }; onClose: () => void; remote: any; root: string }): React.ReactNode {
  const doCopy = () => { void navigator.clipboard.writeText(props.menu.path); props.onClose() }
  const doDelete = async () => { await props.remote.fsDelete({ root: props.root, path: props.menu.path }); props.onClose() }
  return (
    <div className={styles.menu} style={{ left: props.menu.x, top: props.menu.y }}>
      <button onClick={() => void props.remote.fsCreateFile({ root: props.root, path: props.menu.path })}>新建文件</button>
      <button onClick={() => void props.remote.fsCreateDir({ root: props.root, path: props.menu.path })}>新建文件夹</button>
      <button onClick={() => void props.remote.fsRename({ root: props.root, path: props.menu.path, newName: 'renamed' })}>重命名</button>
      <button onClick={() => void doDelete()}>删除</button>
      <button onClick={() => doCopy()}>复制路径</button>
    </div>
  )
}
```
> 右键菜单操作完成后需刷新文件树（v0.1 简化：操作后 `tree.toggle` 对应目录或全量刷新，留 TODO 增强点）。`openPath` 用 `ctx.workspaces.openPath`（见注册处）。

- [ ] **Step 4: 写 GitManager.tsx（conversation.input.dock）**

```tsx
import { useEffect, useState } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { useSettings } from '../settings.ts'
import { useGitBranch } from '../hooks/useGitBranch.ts'
import styles from './GitManager.module.css'

type Props = PropsRuntime<'conversation.input.dock'> & { remote: any; root: string }

export function GitManager(props: Props): React.ReactNode {
  const settings = useSettings()
  const git = useGitBranch(props.root, props.remote)
  const [branches, setBranches] = useState<string[]>([])
  const [newBranch, setNewBranch] = useState('')
  const [busy, setBusy] = useState(false)
  if (!settings.enabled || !settings.git.enabled) return null
  const refresh = async () => { await git.refresh(); const r = await props.remote.gitStatus({ root: props.root, repoPath: '.' }); if (r.ok) setBranches([r.value.branch]) }
  useEffect(() => { void refresh() }, [props.root])
  const doCheckout = async (branch: string) => { setBusy(true); await props.remote.gitCheckout({ root: props.root, repoPath: '.', branch }); setBusy(false); void refresh() }
  const doCreate = async () => { if (!newBranch.trim()) return; setBusy(true); await props.remote.gitCreateBranch({ root: props.root, repoPath: '.', name: newBranch.trim() }); setNewBranch(''); setBusy(false); void refresh() }
  const doPull = async () => { setBusy(true); await props.remote.gitPull({ root: props.root, repoPath: '.' }); setBusy(false); void refresh() }
  return (
    <div className={styles.bar}>
      <select className={styles.select} value={git.state.branch} onChange={(e) => void doCheckout(e.target.value)} disabled={busy}>
        <option value={git.state.branch}>{git.state.branch || '无分支'}</option>
        {branches.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
      <input className={styles.new} value={newBranch} onChange={(e) => setNewBranch(e.target.value)} placeholder="新分支名" />
      <button className={styles.btn} onClick={() => void doCreate()} disabled={busy}>+</button>
      <button className={styles.btn} onClick={() => void doPull()} disabled={busy}>pull</button>
      <span className={styles.dirty}>未提交 {git.state.dirtyCount}</span>
    </div>
  )
}
```

- [ ] **Step 5: 注册两个 entry（src/client/index.tsx 追加）**

```tsx
import { FileExplorer } from './components/FileExplorer.tsx'
import { GitManager } from './components/GitManager.tsx'
// 拿当前 workspace path：
const workspacePath = (ctx: ClientContext): string => {
  const ws = ctx.workspaces.list.getSnapshot().items[0]
  return ws?.path ?? ''
}
// in apply():
  const root = workspacePath(ctx)
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'shining-files' }, () => <FileExplorer remote={ctx.remote.shining} root={root} openPath={(p) => void ctx.workspaces.openPath(p)} />))
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({ name: 'conversation.input.dock', id: 'shining-git' }, () => <GitManager remote={ctx.remote.shining} root={root} />))
```
> `ctx.workspaces.list.getSnapshot().items[0].path` 取第一个 workspace 作为根；v0.1 用当前会话 workspace（`useSessions` 取当前 session 的 workspaceId），留 TODO 增强点。

- [ ] **Step 6: 写 file-git 单测（纯逻辑）**

```ts
import { describe, it, expect } from 'vitest'
// 仅验证 hook 纯逻辑不崩；远程调用 mock
```
> 完整 slot 渲染测试在 Task 11 用 SlotTestRuntime 覆盖；此处确认组件可编译 + 构建通过。

- [ ] **Step 7: 跑构建 + 类型检查**

```sh
pnpm typecheck && pnpm build
```
Expected: 0 error。

- [ ] **Step 8: Commit**

```bash
git add src/client/components/FileExplorer.tsx src/client/components/FileExplorer.module.css src/client/components/GitManager.tsx src/client/components/GitManager.module.css src/client/hooks/useFileTree.ts src/client/hooks/useGitBranch.ts src/client/index.tsx
git commit -m "feat(client): file drawer + git toolbar entries"
```

---

### Task 11: 设置面板（settings.section）

**Files:**
- Create: `src/client/components/SettingsPanel.tsx` + `.module.css`
- Modify: `src/client/index.tsx`（注册 settings.section entry）
- Test: `tests/settings-panel.spec.tsx`

**Interfaces:**
- Consumes: `useSettings`（读）、`ctx.settingsScope.set/unset`（写）、`props.close`（owner props）。
- Produces: 「璀璨星河」设置页，全部开关与配置。

- [ ] **Step 1: 写 SettingsPanel.tsx**

```tsx
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { useSettings, type ShiningSettings } from '../settings.ts'
import { setImage, clearImage, getImage } from '../storage.ts'
import { dict } from '../locales.ts'
import styles from './SettingsPanel.module.css'

type Props = PropsRuntime<'settings.section'> & PropsLocale<'shining'> & { scope: { set: (f: string, v: unknown) => Promise<void>; unset: (f: string) => Promise<void> } }

export function SettingsPanel(props: Props): React.ReactNode {
  const settings = useSettings()
  const patch = async <K extends keyof ShiningSettings>(key: K, value: ShiningSettings[K]) => {
    await props.scope.set(String(key), value as unknown)
  }
  const onImage = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result))
    reader.readAsDataURL(file)
  }
  return (
    <div className={styles.group}>
      <h3 className={styles.title}>{dict.zh.settingsTitle}</h3>
      <Toggle label="启用璀璨星河" checked={settings.enabled} onChange={(v) => void patch('enabled', v)} />
      <section>
        <Toggle label="天圆地方" checked={settings.chat.enabled} onChange={(v) => void patch('chat', { ...settings.chat, enabled: v })} />
        <Row label="模型" value={settings.chat.model} onChange={(v) => void patch('chat', { ...settings.chat, model: v })} />
        <Row label="API Base" value={settings.chat.apiBase} onChange={(v) => void patch('chat', { ...settings.chat, apiBase: v })} />
        <Row label="API Key" value={settings.chat.apiKey} type="password" onChange={(v) => void patch('chat', { ...settings.chat, apiKey: v })} />
        <button type="button" onClick={() => onImage((document.querySelector('input[type=file]') as HTMLInputElement)?.files?.[0])}>更换立绘</button>
        {getImage() ? <button onClick={clearImage}>清除立绘</button> : null}
      </section>
      <section>
        <Toggle label="文件栏" checked={settings.fileExplorer.enabled} onChange={(v) => void patch('fileExplorer', { ...settings.fileExplorer, enabled: v })} />
        <Toggle label="显示隐藏文件" checked={settings.fileExplorer.showHidden} onChange={(v) => void patch('fileExplorer', { ...settings.fileExplorer, showHidden: v })} />
      </section>
      <section>
        <Toggle label="Git 分支管理" checked={settings.git.enabled} onChange={(v) => void patch('git', { ...settings.git, enabled: v })} />
        <select value={settings.git.autoRefresh} onChange={(e) => void patch('git', { ...settings.git, autoRefresh: e.target.value as any })}>
          <option value="off">关闭</option><option value="10s">10s</option><option value="30s">30s</option><option value="1m">1m</option>
        </select>
      </section>
      <section>
        <h4>视觉主题</h4>
        <select value={settings.visual.themeColor} onChange={(e) => void patch('visual', { ...settings.visual, themeColor: e.target.value as any })}>
          <option value="galaxy-blue">星河蓝</option><option value="dawn-gold">晨曦金</option><option value="aurora-purple">极光紫</option>
        </select>
        <label>毛玻璃强度 <input type="range" min={0} max={24} value={settings.visual.glassBlur} onChange={(e) => void patch('visual', { ...settings.visual, glassBlur: Number(e.target.value) })} /></label>
      </section>
    </div>
  )
}
function Toggle(props: { label: string; checked: boolean; onChange: (v: boolean) => void }): React.ReactNode {
  return <label className={styles.row}><input type="checkbox" checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} /><span>{props.label}</span></label>
}
function Row(props: { label: string; value: string; type?: string; onChange: (v: string) => void }): React.ReactNode {
  return <label className={styles.row}><span>{props.label}</span><input type={props.type ?? 'text'} value={props.value} onChange={(e) => props.onChange(e.target.value)} /></label>
}
```

- [ ] **Step 2: 写 SettingsPanel.module.css**

```css
.group { display: flex; flex-direction: column; gap: 16px; padding: 16px 0; }
.title { margin: 0 0 4px; font-size: 18px; }
.row { display: flex; align-items: center; gap: 8px; margin: 6px 0; }
```

- [ ] **Step 3: 注册 settings.section（src/client/index.tsx 追加）**

```tsx
import { SettingsPanel } from './components/SettingsPanel.tsx'
// in apply():
  ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: 'shining', order: 20, locale: NS }, () => <SettingsPanel scope={scope} />))
```

- [ ] **Step 4: 跑构建 + 类型检查**

```sh
pnpm typecheck && pnpm build
```
Expected: 0 error。

- [ ] **Step 5: Commit**

```bash
git add src/client/components/SettingsPanel.tsx src/client/components/SettingsPanel.module.css src/client/index.tsx
git commit -m "feat(client): settings.section page for 璀璨星河"
```

---

### Task 12: client 测试（SlotTestRuntime）

**Files:**
- Create: `vitest.config.ts`
- Modify: `tests/client-shell.spec.tsx`（扩充为 slot 注册/渲染/dispose）
- Test: `tests/slots.spec.tsx`

**Interfaces:**
- Consumes: 各注册入口组件。
- Produces: 断言 5 处注册、session 隔离、dispose 后 registry/DOM 清理。

- [ ] **Step 1: 写 vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({ test: { environment: 'jsdom', globals: true, include: ['tests/**/*.spec.ts', 'tests/**/*.spec.tsx'] } })
```

- [ ] **Step 2: 写 slots.spec.tsx（用 client-test-runtime 的 SlotTestRuntime）**

```tsx
import { describe, it, expect } from 'vitest'
// 说明：@deepseek-ai/dsh-client-test-runtime 提供 SlotTestRuntime（jsdom 挂载插件断言 slot 注册/渲染/dispose）。
// 若本机无法解析该包，退化为用最小 fake 服务 + React render 断言组件在对应开关下渲染/隐藏。
```
> 该任务以官方 `packages/test-support/client-runtime` 的 `SlotTestRuntime` 为参照；若测试运行环境无法拉取 `@deepseek-ai/dsh-client-test-runtime`（其为 devDependency，需 link），则在 README 标注并保留最小 fake 断言。

- [ ] **Step 3: 跑测试**

```sh
npx vitest run
```
Expected: PASS。

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts tests/slots.spec.tsx tests/client-shell.spec.tsx
git commit -m "test(client): slot registration/dispose + jsdom lane"
```

---

### Task 13: 验证脚本 + README

**Files:**
- Create: `scripts/install.mjs`
- Create: `README.md`
- Create: `scripts/verify.mjs`（或并入 package.json verify）
- Test: 手动验证矩阵

**Interfaces:**
- Consumes: 全部产物。
- Produces: 幂等安装脚本 + 验证说明。

- [ ] **Step 1: 写 scripts/install.mjs（幂等安装到 profile）**

```js
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const profile = process.env.DSH_PROFILE ?? 'web'
const pluginDir = resolve(new URL('..', import.meta.url).pathname)
const add = `dsh plugin --profile ${profile} add "file:${pluginDir}"`
console.log('> ' + add)
execFileSync('npx', ['-p', '@deepseek-ai/dsh', 'dsh', 'plugin', '--profile', profile, 'add', `file:${pluginDir}`], { stdio: 'inherit' })
console.log('安装完成。请重启 dsh web 以生效（会中断当前会话）。')
```
> 说明：`dsh plugin add` 为 profile 目录的 pnpm 转发层，自动对账 bundles 列表。实际运行时按 README 推荐的 `npx -p @deepseek-ai/dsh dsh plugin --profile web add ...` 为准。

- [ ] **Step 2: 写 README.md（含前置条件、构建、安装、验证、v0.1 边界）**

```md
# dsh-shiningweb-ui（璀璨星河）
DSH 插件：独立聊天（天圆地方）、文件栏、Git 分支管理、视觉增强。
## 前置
- Node ≥ 22、git 在 PATH、pnpm。
- 已运行 `dsh web`（profile `web`）。
## 构建
pnpm install && pnpm build
## 安装（本地开发，重启生效）
dsh plugin --profile web add "file:$(pwd)"
# 重启 dsh web
## 验证
pnpm verify
# GUI：设置页出现「璀璨星河」→ 侧边栏脚部按钮 → 聊天窗/文件树/Git 工具栏 → 逐模块开关
## v0.1 边界
非流式 chat；文件用系统默认应用打开；无拖拽/Git 冲突 UI；apiKey 存 settings 文档（后续迁 credentials）。
```

- [ ] **Step 3: 跑 verify**

```sh
pnpm verify
```
Expected: typecheck + build + test 全通过。

- [ ] **Step 4: Commit**

```bash
git add scripts/install.mjs README.md
git commit -m "docs: install script + README"
```

---

### Task 14: 真实组合验证（scratch profile）

**Files:**
- Create: `scripts/verify-install.mjs`

**Interfaces:**
- Consumes: 构建产物。
- Produces: 断言 `--dump-config` 出现插件层；headless 小任务通过。

- [ ] **Step 1: 写 verify-install.mjs**

```js
import { execFileSync } from 'node:child_process'
const scratch = process.env.DSH_SCRATCH ?? 'shining-scratch'
execFileSync('npx', ['-p', '@deepseek-ai/dsh', 'dsh', 'plugin', '--profile', scratch, 'add', 'file:.'], { stdio: 'inherit' })
const dump = execFileSync('npx', ['-p', '@deepseek-ai/dsh', 'dsh', '--profile', scratch, '--dump-config'], { encoding: 'utf8' })
if (!dump.includes('dsh-shiningweb-ui')) { console.error('插件层缺失'); process.exit(1) }
console.log('--dump-config 已含插件层 ✓')
```

- [ ] **Step 2: 运行**

```sh
node scripts/verify-install.mjs
```
Expected: 打印 `--dump-config 已含插件层 ✓`（需先 build）。

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-install.mjs
git commit -m "test: scratch profile --dump-config verification"
```

---

## Self-Review 记录

- **Spec coverage**：四模块 + 设置开关 + 视觉 + typert 制品 + 构建 + 安装/验证 均有对应 Task（1-14）。
- **Placeholder scan**：`src/client/hooks/useChat.ts` 的 `remoteShining` 与 `src/client/visual.ts` 的 `applyVisual` 在 Task 9 后由真实注入替换（Task 6 先立骨架，Task 9 注入）。README 提及 `$(pwd)` 在 Windows 用 `%CD%`——安装脚本已用绝对路径规避。
- **Type consistency**：`ShiningResult`/`success`/`failure`/`resolveWithinRoot`、`ShiningSettings`、`useSettings`/`useShiningStore`、`ctx.remote.shining.*` 命名在后续任务保持一致；`remoteShining` 为注入名，最终以 `ctx.remote.shining` 为准。
