import {A3sSyncTreeDirectoryDto, A3sSyncTreeLeafDto} from './a3sSync';
import {SyncTreeLeaf} from './SyncTreeLeaf';
import {Path} from '../util/aliases';
import {toNameMap} from '../util/funcs';

export class SyncTreeBranch {
    constructor(
        public name: string,
        public path: string,
        public isAddon: boolean,
        public branches: { [name: string]: SyncTreeBranch },
        public leaves: { [name: string]: SyncTreeLeaf }
    ) {
        this.name = name;
        this.path = path;
        this.isAddon = isAddon;
        this.branches = branches;
        this.leaves = leaves;
    }

    public static fromSyncTreeDirectoryDto(dto: A3sSyncTreeDirectoryDto, parentPath: Path, addon: string): SyncTreeBranch {
        if (dto.markAsAddon) {
            addon = dto.name;
        }
        const path = parentPath + '/' + dto.name;

        return new SyncTreeBranch(
            dto.name,
            path,
            dto.markAsAddon,
            toNameMap(dto.list
                .filter(node => (node as any).list)
                .map(node => SyncTreeBranch.fromSyncTreeDirectoryDto(node as A3sSyncTreeDirectoryDto, path, addon))),
            toNameMap(dto.list
                .filter(node => (node as any).sha1)
                .map(node => SyncTreeLeaf.fromSyncTreeLeafDto(node as A3sSyncTreeLeafDto, path, addon))),
        );
    }

    public static fromSyncTreeRoot(dto: A3sSyncTreeDirectoryDto): SyncTreeBranch {
        return SyncTreeBranch.root(
            toNameMap(dto.list
                .filter(node => (node as any).list)
                .map(node => SyncTreeBranch.fromSyncTreeDirectoryDto(node as A3sSyncTreeDirectoryDto, '', ''))),
            toNameMap(dto.list
                .filter(node => (node as any).sha1)
                .map(node => SyncTreeLeaf.fromSyncTreeLeafDto(node as A3sSyncTreeLeafDto, '', ''))));
    }

    public static root(branches: { [name: string]: SyncTreeBranch }, leaves: { [name: string]: SyncTreeLeaf }): SyncTreeBranch {
        return new SyncTreeBranch('', '', false, branches, leaves);
    }

    public toDto(): A3sSyncTreeDirectoryDto {
        return {
            list: []
                .concat(Object.values(this.branches).map(dir => dir.toDto()))
                .concat(Object.values(this.leaves).map(leaf => leaf.toDto())),
            name: this.name || 'racine',
            markAsAddon: this.isAddon,
            deleted: false,
            updated: false,
            hidden: false,
        }
    }

}
