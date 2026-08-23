import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const GIT_CSS = readFileSync(resolve(process.cwd(), 'src/client/components/GitManager.module.css'), 'utf8')

describe('git bar sits in the composer dock like DSH built-ins (layout regression)', () => {
  // 回归守卫：DSH 内置 input.dock 条目通过各自 .dock 包裹居中（margin: 0 auto）
  // 并把宽度对齐 composer 卡片。git 条必须复用这套，否则会贴到容器边缘。
  it('self-centers with a composer-aligned width', () => {
    expect(GIT_CSS).toMatch(/margin:\s*0\s+auto/)
    expect(GIT_CSS).toContain('--dsh-composer-side-clearance')
    expect(GIT_CSS).toContain('--dsh-composer-card-max-width')
  })
})
