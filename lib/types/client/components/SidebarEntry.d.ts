/** 侧边栏脚部入口：天圆地方 / 文件 按钮（sidebar.footer.action）。 */
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
type Props = PropsRuntime<'sidebar.footer.action'> & PropsLocale<'shining'>;
/** 天圆地方入口按钮（拱门图标）。 */
export declare function ChatEntry(props: Props): React.ReactNode;
/** 文件栏入口按钮。 */
export declare function FilesEntry(props: Props): React.ReactNode;
export {};
