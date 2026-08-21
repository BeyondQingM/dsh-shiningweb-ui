/**
 * dsh-shiningweb-ui 插件 invariant 伴生（官方包惯例）。
 * v0.1 为占位；正式 invariant 声明在后续任务补齐。
 */
import type { Context } from '@deepseek-ai/cordis'

export const name = 'shiningweb-ui-invariant'
export const inject = ['invariants']
export const PACKAGE_NAME = 'dsh-shiningweb-ui'

/** 注册一个空 invariant（占位）。 */
export function apply(ctx: Context): void {
  // 占位：正式 invariant 断言在后续任务补齐。
  void ctx
}
