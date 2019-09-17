import {A3sSyncTreeLeafDto} from './a3sSync';
import {Path} from '../util/aliases';

export class SyncTreeLeaf {
    constructor(
        public name: string,
        public addon: string,
        public path: Path,
        public sha1: string,
        public size: number,
    ) {}

    public static fromSyncTreeLeafDto(dto: A3sSyncTreeLeafDto, parentPath: Path, addon: string): SyncTreeLeaf {
        return new SyncTreeLeaf(
            dto.name,
            addon,
            `${parentPath}/${dto.name}`,
            dto.sha1,
            dto.size,
        );
    }

    public toDto(): A3sSyncTreeLeafDto {
        return {
            name: this.name,
            sha1: this.sha1,
            size: this.size,
            compressedSize: 0,
            compressed: false,
            updated: false,
            deleted: false,
        }
    }
}
