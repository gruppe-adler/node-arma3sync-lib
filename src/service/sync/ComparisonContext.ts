import {SyncTreeLeaf} from '../../model/SyncTreeLeaf';

export interface ComparisonContext {
    a: SyncTreeLeaf | null,
    b: SyncTreeLeaf | null,
}
