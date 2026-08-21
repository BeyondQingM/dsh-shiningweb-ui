/**
 * 幂等安装到 dsh profile（默认 web）。
 * 用法：node scripts/install.mjs [profile]
 * 说明：`dsh plugin --profile <p> add file:<dir>` 为 profile 目录的 pnpm 转发层，
 * 自动对账 dsh.profile.bundles。安装后需重启 dsh web 生效（会中断当前会话）。
 */
import { execFileSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const profile = process.argv[2] ?? process.env.DSH_PROFILE ?? 'web'
const pluginDir = resolve(join(dirname(fileURLToPath(import.meta.url)), '..'))

console.log(`> dsh plugin --profile ${profile} add "file:${pluginDir}"`)
execFileSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['-p', '@deepseek-ai/dsh', 'dsh', 'plugin', '--profile', profile, 'add', `file:${pluginDir}`],
  { stdio: 'inherit' },
)
console.log('安装完成。请重启 dsh web 以生效（会中断当前会话）。')
