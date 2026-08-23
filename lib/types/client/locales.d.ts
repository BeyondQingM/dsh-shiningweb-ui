/** dsh-shiningweb-ui client 字典。 */
export declare const NS = "shining";
export declare const dict: {
    zh: {
        entryChat: string;
        entryFiles: string;
        settingsTitle: string;
        chatTitle: string;
        send: string;
        sendPlaceholder: string;
        close: string;
        fileFilter: string;
        newFile: string;
        newDir: string;
        rename: string;
        remove: string;
        copyPath: string;
        dirtyCount: string;
        refresh: string;
    };
    en: {
        entryChat: string;
        entryFiles: string;
        settingsTitle: string;
        chatTitle: string;
        send: string;
        sendPlaceholder: string;
        close: string;
        fileFilter: string;
        newFile: string;
        newDir: string;
        rename: string;
        remove: string;
        copyPath: string;
        dirtyCount: string;
        refresh: string;
    };
};
export type ShiningKey = keyof typeof dict.zh;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** 璀璨星河设置/文案的字典命名空间。 */
        'shining': ShiningKey;
    }
}
