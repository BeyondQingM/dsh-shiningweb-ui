/**
 * 幂等安装到 dsh profile（默认 web）。
 * 用法：node scripts/install.mjs [profile]
 * 说明：`dsh plugin --profile <p> add <dir>` 为 profile 目录的 pnpm 转发层，
 * 自动对账 dsh.profile.bundles。安装后需重启 dsh web 生效（会中断当前会话）。
 *
 * 注意：这里传**目录绝对路径**而不是 `file:<dir>`。
 * `file:` specifier 无法对含空格的路径转义（引号会被当成路径的一部分），
 * pnpm 会把它截断成 "F:/Coding" 并报 ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND；
 * 直接给绝对路径时由 pnpm 自己生成合法的 file: 依赖。
 */
import { execFileSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const profile = process.argv[2] ?? process.env.DSH_PROFILE ?? 'web'
const pluginDir = resolve(join(dirname(fileURLToPath(import.meta.url)), '..'))

console.log(`> dsh plugin --profile ${profile} add ${pluginDir}`)
execFileSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['-p', '@deepseek-ai/dsh', 'dsh', 'plugin', '--profile', profile, 'add', pluginDir],
  { stdio: 'inherit' },
)
console.log('安装完成。请重启 dsh web 以生效（会中断当前会话）。')
