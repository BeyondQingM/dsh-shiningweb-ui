import type { FsEntry } from '../../types.ts';
import type { ShiningRemote } from '../remote-types.ts';
export declare function useFileTree(root: string, showHidden: boolean, remote: ShiningRemote | undefined): {
    children: Record<string, FsEntry[]>;
    expanded: Record<string, boolean>;
    toggle: (relPath: string) => Promise<void>;
    refresh: () => Promise<void>;
};
