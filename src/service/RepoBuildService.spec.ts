import {RepoBuildService} from './RepoBuildService';
import {A3sDirectory} from './A3sDirectory';
import {SyncGenerationService} from './sync/SyncGenerationService';
import {UpdateResult, ZSyncGenerationService} from './zsync/ZSyncGenerationService';
import {A3sServerInfoDto} from '../model/A3sServerInfoDto';
import {A3sChangelogsDto} from '../model/A3sChangelogsDto';
import {SyncTreeBranch} from '../model/SyncTreeBranch';
import {SyncTreeLeaf} from '../model/SyncTreeLeaf';
import {SyncComparisonService} from './sync/SyncComparisonService';
import {Changelogs} from '../model/Changelogs';

const publicURL = 'http://foo';
const repoName = 'arma3sync';

const oldServerInfo: A3sServerInfoDto = {
    revision: 1,
    buildDate: new Date('1970-01-01'),
    numberOfFiles: 42,
    totalFilesSize: 137,
    noPartialFileTransfer: false,
    numberOfConnections: 3,
    hiddenFolderPaths: [],
    repositoryContentUpdated: false,
    compressedPboFilesOnly: false,
};

describe(RepoBuildService.name, () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('update', () => {
        it('uses zsyncservice to walk over everything', async (done) => {
            const a3sDirectory = {
                getSync: jest.fn(() => Promise.resolve(new SyncTreeBranch('', '', false, {}, {}))),
                setSync: jest.fn(() => Promise.resolve()),
                getServerInfo: jest.fn(() => Promise.resolve(oldServerInfo)),
                setServerInfo: jest.fn(() => Promise.resolve()),
                getChangelogs: jest.fn(() => Promise.resolve(new Changelogs())),
                setChangelogs: jest.fn(() => Promise.resolve()),
            };
            const expectedSyncTree: SyncTreeBranch = new SyncTreeBranch('', '', false, {
                    '@cba' : new SyncTreeBranch('@cba', '/@cba', true, {}, {
                        'cba.file': new SyncTreeLeaf('cba.file', '@cba', '/@cba/cba.file', 'sha1', 1337)
                    }),
                    '@ace': new SyncTreeBranch('@ace', '/@ace', true, {}, {
                        'ace.file': new SyncTreeLeaf('ace.file', '@ace', '/@ace/ace.file', 'sha1', 42)
                    }),
                } ,{});

            const syncGenerationService = {
                generateSync: jest.fn(() => Promise.resolve(expectedSyncTree))
            };

            const expectedZsyncResult = new UpdateResult(1, 3, 3, 7);
            const zsyncGenerationService = {
                update: jest.fn(() => Promise.resolve(expectedZsyncResult))
            };
            const syncComparisonService = new SyncComparisonService();

            const now = Date.now();
            const repoBuildService = new RepoBuildService(
                a3sDirectory as unknown as A3sDirectory,
                syncGenerationService as unknown as SyncGenerationService,
                zsyncGenerationService as unknown as ZSyncGenerationService,
                syncComparisonService,
                publicURL,
                repoName,
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
            expect(newServerInfo.numberOfConnections).toBe(3);
            expect(newServerInfo.totalFilesSize).toBe(1379);
            expect(newServerInfo.numberOfFiles).toBe(2);

            expect(updateResult.serverInfo).toEqual(newServerInfo);

            // @ts-ignore
            const changelogs = a3sDirectory.setChangelogs.mock.calls[0][0] as A3sChangelogsDto;
            expect(changelogs).toBeInstanceOf(Changelogs);
            expect(changelogs.list).toHaveLength(1);
            const newChangelog = changelogs.list[0];
            expect(newChangelog.revision).toBe(2);
            expect(newChangelog.newAddons).toEqual(['@cba', '@ace']);
            expect(newChangelog.addons).toEqual(['@cba', '@ace']);
            expect(newChangelog.updatedAddons).toEqual([]);
            expect(newChangelog.deletedAddons).toEqual([]);

            done();
        });

        it('updates isAddon correctly when addons folder is added to mod', async (done) => {
            const initialSyncTree: SyncTreeBranch = new SyncTreeBranch('', '', false, {
                    '@empty' : new SyncTreeBranch('@empty', '/@empty', false, {}, {
                        'empty.file': new SyncTreeLeaf('empty.file', '', '/@empty/empty.file', 'sha1', 1337)
                    })
                }, {});
            const expectedSyncTree: SyncTreeBranch = new SyncTreeBranch('', '', false, {
                    '@empty' : new SyncTreeBranch('@empty', '/@empty', true, {
                        'addons': new SyncTreeBranch('addons', '/@empty/addons', false, {}, {})
                    }, {
                        'empty.file': new SyncTreeLeaf('empty.file', '@empty', '/@empty/empty.file', 'sha1', 1337)
                    })
                } ,{});

            const a3sDirectory = {
                getSync: jest.fn(() => Promise.resolve(initialSyncTree)),
                setSync: jest.fn(() => Promise.resolve()),
                getServerInfo: jest.fn(() => Promise.resolve(oldServerInfo)),
                setServerInfo: jest.fn(() => Promise.resolve()),
                getChangelogs: jest.fn(() => Promise.resolve(new Changelogs())),
                setChangelogs: jest.fn(() => Promise.resolve()),
            };

            const syncGenerationService = {
                generateSync: jest.fn(() => Promise.resolve(expectedSyncTree))
            };

            const expectedZsyncResult = new UpdateResult(1, 3, 3, 7);
            const zsyncGenerationService = {
                update: jest.fn(() => Promise.resolve(expectedZsyncResult))
            };
            const syncComparisonService = new SyncComparisonService();

            const repoBuildService = new RepoBuildService(
                a3sDirectory as unknown as A3sDirectory,
                syncGenerationService as unknown as SyncGenerationService,
                zsyncGenerationService as unknown as ZSyncGenerationService,
                syncComparisonService,
                publicURL,
                repoName,
            );

            await repoBuildService.update();

            expect(a3sDirectory.setSync.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setSync.mock.calls[0]).toEqual([expectedSyncTree]);

            done();
        });

        it('updates isAddon correctly when addons folder is removed from mod', async (done) => {
            const initialSyncTree: SyncTreeBranch = new SyncTreeBranch('', '', false, {
                    '@empty' : new SyncTreeBranch('@empty', '/@empty', true, {
                        'addons': new SyncTreeBranch('addons', '/@empty/addons', false, {}, {})
                    }, {
                        'empty.file': new SyncTreeLeaf('empty.file', '@empty', '/@empty/empty.file', 'sha1', 1337)
                    })
                } ,{});
            const expectedSyncTree: SyncTreeBranch = new SyncTreeBranch('', '', false, {
                    '@empty' : new SyncTreeBranch('@empty', '/@empty', false, {}, {
                        'empty.file': new SyncTreeLeaf('empty.file', '', '/@empty/empty.file', 'sha1', 1337)
                    })
                }, {});

            const a3sDirectory = {
                getSync: jest.fn(() => Promise.resolve(initialSyncTree)),
                setSync: jest.fn(() => Promise.resolve()),
                getServerInfo: jest.fn(() => Promise.resolve(oldServerInfo)),
                setServerInfo: jest.fn(() => Promise.resolve()),
                getChangelogs: jest.fn(() => Promise.resolve(new Changelogs())),
                setChangelogs: jest.fn(() => Promise.resolve()),
            };

            const syncGenerationService = {
                generateSync: jest.fn(() => Promise.resolve(expectedSyncTree))
            };

            const expectedZsyncResult = new UpdateResult(1, 3, 3, 7);
            const zsyncGenerationService = {
                update: jest.fn(() => Promise.resolve(expectedZsyncResult))
            };
            const syncComparisonService = new SyncComparisonService();

            const repoBuildService = new RepoBuildService(
                a3sDirectory as unknown as A3sDirectory,
                syncGenerationService as unknown as SyncGenerationService,
                zsyncGenerationService as unknown as ZSyncGenerationService,
                syncComparisonService,
                publicURL,
                repoName,
            );

            await repoBuildService.update();

            expect(a3sDirectory.setSync.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setSync.mock.calls[0]).toEqual([expectedSyncTree]);

            done();
        });
    });

    describe('initializeRepository', () => {
        it('creates all the repo files', async (done) => {
            const a3sDirectory = {
                setRawSync: jest.fn(() => Promise.resolve()),
                getServerInfo: jest.fn(() => Promise.resolve(oldServerInfo)),
                setServerInfo: jest.fn(() => Promise.resolve()),
                setAutoconfig: jest.fn((args) => Promise.resolve()),
                setEvents: jest.fn(() => Promise.resolve()),
                setChangelogs: jest.fn(() => Promise.resolve()),
            };
            const zsyncGenerationService = {};
            const syncGenerationService = {};
            const syncComparisonService = new SyncComparisonService();

            const repoBuildService = new RepoBuildService(a3sDirectory as unknown as A3sDirectory,
                syncGenerationService as unknown as SyncGenerationService,
                zsyncGenerationService as unknown as ZSyncGenerationService,
                syncComparisonService as SyncComparisonService,
                publicURL,
                repoName,
            );
            await repoBuildService.initializeRepository();

            expect(a3sDirectory.setServerInfo.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setRawSync.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setAutoconfig.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setEvents.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setChangelogs.mock.calls).toHaveLength(1);
            expect(a3sDirectory.setChangelogs.mock.calls[0]).toHaveLength(1);
            // @ts-ignore
            const initialChangelogs = a3sDirectory.setChangelogs.mock.calls[0][0] as A3sChangelogsDto;
            expect(initialChangelogs.list[0].revision).toBe(0);
            expect(initialChangelogs.list[0].addons).toHaveLength(0);

            // @ts-ignore
            const serverInfo = a3sDirectory.setServerInfo.mock.calls[0][0] as A3sServerInfoDto;
            expect(serverInfo.numberOfConnections).toBe(1);
            expect(serverInfo.totalFilesSize).toBe(0);
            expect(serverInfo.numberOfFiles).toBe(0);

            expect(a3sDirectory.setAutoconfig.mock.calls).toHaveLength(1);

            const { protocole } = a3sDirectory.setAutoconfig.mock.calls[0][0];
            expect(protocole.port).toBe('80');
            expect(protocole.url).toBe('foo');

            const { protocolType } = protocole;
            expect(protocolType.defaultPort).toBe('80');
            expect(protocolType.description).toBe('HTTP');
            expect(protocolType.name).toBe('HTTP');
            expect(protocolType.prompt).toBe('http://');

            done();
        });

        it('supports HTTPS', async (done) => {
            const publicURL = 'https://foo'

            const a3sDirectory = {
                setRawSync: jest.fn(() => Promise.resolve()),
                getServerInfo: jest.fn(() => Promise.resolve(oldServerInfo)),
                setServerInfo: jest.fn(() => Promise.resolve()),
                setAutoconfig: jest.fn((args) => Promise.resolve()),
                setEvents: jest.fn(() => Promise.resolve()),
                setChangelogs: jest.fn(() => Promise.resolve()),
            };
            const zsyncGenerationService = {};
            const syncGenerationService = {};
            const syncComparisonService = new SyncComparisonService();

            const repoBuildService = new RepoBuildService(a3sDirectory as unknown as A3sDirectory,
                syncGenerationService as unknown as SyncGenerationService,
                zsyncGenerationService as unknown as ZSyncGenerationService,
                syncComparisonService as SyncComparisonService,
                publicURL,
                repoName,
            );
            await repoBuildService.initializeRepository();

            expect(a3sDirectory.setAutoconfig.mock.calls).toHaveLength(1);

            const { protocole } = a3sDirectory.setAutoconfig.mock.calls[0][0];
            expect(protocole.port).toBe('443');
            expect(protocole.url).toBe('foo');

            const { protocolType } = protocole;
            expect(protocolType.defaultPort).toBe('443');
            expect(protocolType.description).toBe('HTTPS');
            expect(protocolType.name).toBe('HTTPS');
            expect(protocolType.prompt).toBe('https://');

            done();
        })
    });
});
