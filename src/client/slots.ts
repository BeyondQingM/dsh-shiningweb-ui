/**
 * 本地 SlotMap 合并：ui-sidebar / ui-settings 的 client 类型入口仅具名 re-export 了 owner 类型，
 * 没有把 `declare module` 的 SlotMap merge 拉进程序。此处按当前正式版契约补上我们消费的槽位。
 * 若上游在更新版本中改为 `export type {} from './contract/slots.ts'`，本合并与其一致，可安全并存。
 */
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    /** 侧边栏脚部 action（与设置并列），owner 为列状态。 */
    'sidebar.footer.action': { kind: 'list'; scope: 'root'; owner: { wide: boolean } }
    /** 设置页一节，owner 为面板关闭回调。 */
    'settings.section': { kind: 'list'; scope: 'root'; owner: { close: () => void } }
  }
}
