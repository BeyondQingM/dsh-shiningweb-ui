import type { GitChange } from '../../types.ts';
import type { ShiningRemote } from '../remote-types.ts';
export interface GitState {
    branch: string;
    dirtyCount: number;
    changes: GitChange[];
}
export declare function useGitBranch(root: string, remote: ShiningRemote | undefined): {
    state: GitState;
    refresh: () => Promise<void>;
};
