export const name = 'shiningweb-ui-invariant';
export const inject = ['invariants'];
export const PACKAGE_NAME = 'dsh-shiningweb-ui';
/** 注册一个空 invariant（占位）。 */
export function apply(ctx) {
    // 占位：正式 invariant 断言在后续任务补齐。
    void ctx;
}
