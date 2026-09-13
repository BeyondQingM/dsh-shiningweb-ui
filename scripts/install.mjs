/**
 * 幂等安装到 dsh profile（默认 web）。
 * 用法：node scripts/install.mjs [profile]
 *
 * `dsh plugin --profile <p> add <dir>` 是 profile 目录的 pnpm 转发层，会自动对账
 * dsh.profile.bundles。安装后需重启 dsh web 生效（会中断当前会话）。
 *
 * 两处必须绕开的 pnpm/CLI 限制：
 *  1. `file:<dir>` specifier 无法转义含空格的路径（引号会被当成路径的一部分），
 *     pnpm 会截断成 "F:/Coding" 并报 ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND。
 *  2. 即便直接传绝对路径，`dsh plugin add` 仍会**按空格拆参数**：形如
 *     `F:\Coding Projects\Other Projects\dsh-shiningweb-ui` 会被拆成
 *     `Coding` / `Other` / `dsh-shiningweb-ui` 三个依赖写进 profile 的 package.json，
 *     其中前两个是指向不存在目录的死链接。
 * 因此路径含空格时，先在一个**本身无空格**的目录下建一个指向本包的目录链接再安装。
 * 链接保留复用：目标一致就不重建，避免留下 -2、-3 之类的一串残留。
 */
import { execFileSync } from 'node:child_process'
import { existsSync, lstatSync, mkdirSync, readlinkSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir } from 'node:os'

const profile = process.argv[2] ?? process.env.DSH_PROFILE ?? 'web'
const pluginDir = resolve(join(dirname(fileURLToPath(import.meta.url)), '..'))
const isWindows = process.platform === 'win32'

/**
 * 无空格链接的落点。必须选一个**自身不含空格**的目录 ——
 * 曾经把它放在 `dirname(pluginDir)` 下，而那里恰恰含空格，等于没绕开。
 */
function linkRoot() {
  const base = process.env.LOCALAPPDATA ?? process.env.XDG_DATA_HOME ?? join(homedir(), '.local', 'share')
  return join(base, 'dsh-plugin-install-links')
}

/**
 * 定位 dsh CLI，返回 [command, args]。
 *
 * Windows 上 `dsh` 是 npm 生成的 `.ps1`/`.cmd` 包装脚本，`execFileSync('dsh', …)`
 * 既不认 `.ps1`，加 `shell: true` 又会触发 Node 的 DEP0190 弃用告警并把参数拼接进
 * 命令行（含空格路径会再次被拆开）。改为直接解析到包内的 `lib/bin.js` 用 node 执行，
 * 既能传数组参数、又保留 `#!` 之外的跨平台一致性。
 */
/**
 * 定位 dsh CLI，返回 [command, args]。
 *
 * 三个 Windows/Node 组合坑，逐个绕开：
 *  - `dsh` 是 npm 生成的 `.ps1`（另有 `.cmd`），`execFileSync('dsh', …)` 不认 `.ps1`；
 *  - 加 `shell: true` 会触发 DEP0190 并把参数拼接进命令行（含空格路径会再次被拆开）；
 *  - Node ≥ 18.20/20.12（安全修复后）**拒绝** `execFileSync` 直接执行 `.cmd`/`.bat`
 *    （抛 EINVAL），所以也不能直接 spawn `dsh.cmd`。
 * 结论：先找出真正的 `.cmd`，再用 `cmd /c <cmd> <args…>` 执行 —— 参数以数组传入，
 * 由 cmd 自身按引号规则解析，不做字符串拼接。
 */
function dshCommand(args) {
  const names = isWindows ? ['dsh.cmd', 'dsh.exe', 'dsh'] : ['dsh']
  let found
  for (const name of names) {
    if (found !== undefined) break
    try {
      // 逐个查询：一次传多个候选名时，where 会把未命中的名字写到 stderr，污染输出。
      const listing = execFileSync(isWindows ? 'where' : 'which', [name], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      found = listing.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)[0]
    } catch {
      // 该候选名不在 PATH 上，继续
    }
  }
  if (found === undefined) {
    throw new Error('找不到 dsh CLI。请先安装：npm i -g @deepseek-ai/dsh')
  }
  return isWindows ? ['cmd', ['/c', found, ...args]] : [found, args]
}

/** 读取目录链接当前指向；不是链接（或不存在）时返回 undefined。 */
function linkTarget(path) {
  try {
    if (!lstatSync(path).isSymbolicLink()) return undefined
    return resolve(dirname(path), readlinkSync(path))
  } catch {
    return undefined
  }
}

/** 路径含空格时，返回一个可安全传给 dsh CLI 的无空格等价路径。 */
function installPathFor(dir) {
  if (!/\s/.test(dir)) return dir
  const linkPath = join(linkRoot(), basename(dir))
  const current = linkTarget(linkPath)
  if (current === dir) {
    console.log(`路径含空格，复用无空格链接：${linkPath}`)
    return linkPath
  }
  if (current !== undefined) {
    execFileSync(isWindows ? 'cmd' : 'rm', isWindows ? ['/c', 'rmdir', linkPath] : ['-f', linkPath])
  } else if (existsSync(linkPath)) {
    throw new Error(`${linkPath} 已存在且不是目录链接；请手动删除后重试`)
  }
  mkdirSync(dirname(linkPath), { recursive: true })
  console.log(`路径含空格，建立无空格链接：${linkPath} -> ${dir}`)
  execFileSync(
    isWindows ? 'cmd' : 'ln',
    isWindows ? ['/c', 'mklink', '/J', linkPath, dir] : ['-s', dir, linkPath],
    { stdio: 'inherit' },
  )
  return linkPath
}

const installPath = installPathFor(pluginDir)
console.log(`> dsh plugin --profile ${profile} add ${installPath}`)
execFileSync(...dshCommand(['plugin', '--profile', profile, 'add', installPath]), { stdio: 'inherit' })
console.log('安装完成。请重启 dsh web 以生效（会中断当前会话）。')
