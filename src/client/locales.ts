/** dsh-shiningweb-ui client 字典。 */
export const NS = 'shining'

export const dict = {
  zh: {
    entryChat: '天圆地方',
    entryFiles: '文件',
    settingsTitle: '璀璨星河',
    chatTitle: '天圆地方',
    send: '发送',
    sendPlaceholder: '输入消息…',
    close: '关闭',
    fileFilter: '过滤文件…',
    newFile: '新建文件',
    newDir: '新建文件夹',
    rename: '重命名',
    remove: '删除',
    copyPath: '复制路径',
    dirtyCount: '未提交',
    refresh: '刷新',
  },
  en: {
    entryChat: 'Tianyuan Difang',
    entryFiles: 'Files',
    settingsTitle: 'Shining Web',
    chatTitle: 'Tianyuan Difang',
    send: 'Send',
    sendPlaceholder: 'Type a message…',
    close: 'Close',
    fileFilter: 'Filter files…',
    newFile: 'New File',
    newDir: 'New Folder',
    rename: 'Rename',
    remove: 'Delete',
    copyPath: 'Copy Path',
    dirtyCount: 'Dirty',
    refresh: 'Refresh',
  },
}

export type ShiningKey = keyof typeof dict.zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** 璀璨星河设置/文案的字典命名空间。 */
    'shining': ShiningKey
  }
}
