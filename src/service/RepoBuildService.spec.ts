import {RepoBuildService} from './RepoBuildService';
import {A3sDirectory} from './A3sDirectory';
import {SyncGenerationService} from './sync/SyncGenerationService';
import {UpdateResult, ZSyncGenerationService} from './zsync/ZSyncGenerationService';
import {A3sSyncTreeDirectoryDto} from '../model/a3sSync';
import {A3sServerInfoDto} from '../model/A3sServerInfoDto';
import {util} from 'config';
import {A3sChangelogs} from '../model/A3sChangelogs';

jest.mock('./A3sDirectory');
jest.mock('./sync/SyncGenerationService');
jest.mock('./zsync/ZSyncGenerationService');

util.setModuleDefaults("arma3sync-lib", {
    repoPath: '/var/lib/repo',
    publicURL: 'http://foo'
});

describe(RepoBuildService.name, () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('update', () => {
        it('uses zsyncservice to walk over everything', async (done) => {

            const oldServerInfo: A3sServerInfoDto = {
                revision: 1,
                buildDate: new Date('1970-01-01'),
                numberOfFiles: 42,
                totalFilesSize: 1337,
                noPartialFileTransfer: false,
                numberOfConnections: 3,
                hiddenFolderPaths: [],
                repositoryContentUpdated: false,
                compressedPboFilesOnly: false,
            };

            const a3sDirectory = {
                setSync: jest.fn(() => Promise.resolve()),
                getServerInfo: jest.fn(() => Promise.resolve(oldServerInfo)),
                setServerInfo: jest.fn(() => Promise.resolve()),
            };
            const expectedSyncTree: A3sSyncTreeDirectoryDto = {
                list: [],
                hidden: false,
                markAsAddon: false,
                name: 'racine',
                deleted: false,
                updated: false,
            };
            const syncGenerationService = {
                generateSync: jest.fn(() => Promise.resolve(expectedSyncTree))
            };

            const expectedZsyncResult = new UpdateResult(1, 3, 3, 7);
            const zsyncGenerationService = {
                update: jest.fn(() => Promise.resolve(expectedZsyncResult))
            };

            const now = Date.now();
            const repoBuildService = new RepoBuildService(
                a3sDirectory as unknown as A3sDirectory,
                syncGenerationService as unknown as SyncGenerationService,
                zsyncGenerationService as unknown as ZSyncGenerationService,
            );

            const updateResult = await repoBuildService.update();
            expect(updateResult.zsyncUpdateInfo).toEqual(expectedZsyncResult);
            expect(zsyncGenerationService.update.mock.calls).toHaveLength(1);
            expect(zsyncGenerationService.update.mock.calls[0]).toHaveLength(0);

            expect(updateResult.syncUpdateInfo).toEqual(expectedSyncTree);
            expect(syncGenerationService.generateSync.mock.calls).toHaveLength(1);
            expect(syncGenerationService.generateSync.mock.calls[0]).toHaveLength(0);

            expect(a3sDirectory.setSync.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setSync.mock.calls[0]).toEqual([expectedSyncTree]);
            expect(a3sDirectory.setServerInfo.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setServerInfo.mock.calls[0]).toHaveLength(1);

            // @ts-ignore
            const newServerInfo = a3sDirectory.setServerInfo.mock.calls[0][0] as A3sServerInfoDto;
            expect(newServerInfo.revision).toEqual(2);
            expect(newServerInfo.buildDate.valueOf()).toBeGreaterThanOrEqual(now);

            expect(updateResult.serverInfo).toEqual(newServerInfo);

            done();
        });
    });

    describe('initializeRepository', () => {
        it('creates all the repo files', async (done) => {
            const a3sDirectory = {
                setSync: jest.fn(() => Promise.resolve()),
                setServerInfo: jest.fn(() => Promise.resolve()),
                setAutoconfig: jest.fn(() => Promise.resolve()),
                setEvents: jest.fn(() => Promise.resolve()),
                setChangelogs: jest.fn(() => Promise.resolve()),
            };
            const zsyncGenerationService = {};
            const syncGenerationService = {};

            const repoBuildService = new RepoBuildService(a3sDirectory as unknown as A3sDirectory,
                syncGenerationService as unknown as SyncGenerationService,
                zsyncGenerationService as unknown as ZSyncGenerationService
            );
            await repoBuildService.initializeRepository();

            expect(a3sDirectory.setServerInfo.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setSync.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setAutoconfig.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setEvents.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setChangelogs.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setChangelogs.mock.calls[0]).toHaveLength(1);
            // @ts-ignore
            const initialChangelogs = a3sDirectory.setChangelogs.mock.calls[0][0] as A3sChangelogs;
            expect(initialChangelogs.list[0].revision).toBe(0);
            expect(initialChangelogs.list[0].addons).toHaveLength(0);

            done();
        });
    });
});
