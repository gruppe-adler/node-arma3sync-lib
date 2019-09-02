
import {Path} from '../util/aliases';
import {A3sDirectory} from './A3sDirectory';
import {TODO} from '../util/funcs';
import {ZSyncGenerationService} from './ZSyncGenerationService';
import {SyncGenerationService} from './SyncGenerationService';
import {A3sSyncTreeDirectoryDto} from '../model/a3sSync';

/**
 * re-create the relevant parts of the sync file & update zsync files for a repo subtree
 */
export class SyncTreeUpdateService {

    constructor(
        private zSyncGenerationService: ZSyncGenerationService,
        private a3sDirectory: A3sDirectory,
        private syncGenerationService: SyncGenerationService,
    ) {
    }

    /**
     *
     * @param subDir e.g. /@ace/addons
     */
    public async updateSync(subDir: Path): Promise<void> {
        let sync = await this.a3sDirectory.getSync();

        let currentSync: A3sSyncTreeDirectoryDto = sync;

        const subTree = this.syncGenerationService.generatePartialSync(subDir);

        // walk into the tree until we find the subdir we're looking for
        subDir.split('/').filter(x => x).forEach(dirname => {
            const elem = currentSync.list.find(item => item.name === dirname);
            if (!(elem as A3sSyncTreeDirectoryDto).list) {
                throw new Error(`cannot walk into subdir ${subDir}, failing at ${dirname}`);
            }
            currentSync = elem as A3sSyncTreeDirectoryDto;
        });

        TODO()
    }
}
