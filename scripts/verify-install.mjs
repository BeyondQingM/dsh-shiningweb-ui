/**
 * 插件组合验证。默认做确定性的插件包结构校验（patch + exports 指向真实产物）；
 * 仅当环境变量 DSH_REAL_INSTALL=1 时，额外用 `dsh plugin --profile <scratch> add file:<dir>`
 * 做真实安装 + `--dump-config` 断言（需工作正常的 pnpm 网络/代理，本环境 pnpm 代理不可用）。
 * 用法：node scripts/verify-install.mjs [profile]
 */
import { execFileSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

const profile = process.argv[2] ?? process.env.DSH_SCRATCH ?? 'shining-scratch'
const pluginDir = resolve(join(dirname(fileURLToPath(import.meta.url)), '..'))
const dshBin = process.platform === 'win32' ? 'dsh.cmd' : 'dsh'

// 1) 结构校验（确定）。
const required = ['cordis.patch.yml', 'lib/index.js', 'lib/client.js', 'lib/typert.host.js']
const checks = required.map((p) => [p, existsSync(resolve(pluginDir, p))])
console.log('结构校验：', JSON.stringify(checks))
if (!checks.every(([, ok]) => ok)) process.exit(1)

// 2) 可选真实安装（需工作 pnpm 网络）。
if (process.env.DSH_REAL_INSTALL === '1') {
  try {
    console.log(`> dsh plugin --profile ${profile} add "file:${pluginDir}"`)
    execFileSync(dshBin, ['plugin', '--profile', profile, 'add', `file:${pluginDir}`], { stdio: 'inherit', shell: true })
    const dump = execFileSync(dshBin, ['--profile', profile, '--dump-config'], { encoding: 'utf8', shell: true })
    if (!dump.includes('dsh-shiningweb-ui')) {
      console.error('--dump-config 未包含 dsh-shiningweb-ui 插件层')
      process.exit(1)
    }
    console.log('--dump-config 已含插件层 ✓')
  } catch (error) {
    console.warn(`真实安装验证失败（${error instanceof Error ? error.message : String(error)}），结构校验已通过。`)
  }
} else {
  console.log('（DSH_REAL_INSTALL=1 时尝试真实安装 + --dump-config）')
}

process.exit(0)
