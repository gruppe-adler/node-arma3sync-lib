import {UpdateResult, ZSyncGenerationService} from './zsync/ZSyncGenerationService';
import {A3sDirectory} from './A3sDirectory';
import {SyncGenerationService} from './sync/SyncGenerationService';
import {A3SServerInfo} from '../model/A3SServerInfo';
import {A3sServerInfoDto} from '../model/A3sServerInfoDto';
import {SyncTreeBranch} from '../model/SyncTreeBranch';
import {SyncComparisonService} from './sync/SyncComparisonService';

interface BuildInfo {
    zsyncUpdateInfo: UpdateResult,
    syncUpdateInfo: SyncTreeBranch,
    serverInfo: A3sServerInfoDto
}

/**
 * __high level API__
 *
 * build new repository, or update existing repo according to available files.
 *
 * this may change the following files:
 *   .a3s/sync
 *   .a3s/serverinfo
 *   .a3s/events
 *   **.zsync
 *
 */
export class RepoBuildService {

    constructor(
        private a3sDirectory: A3sDirectory,
        private syncGenerationService: SyncGenerationService,
        private zsyncGenerationService: ZSyncGenerationService,
        private syncComparisonService: SyncComparisonService,
        private publicURL: string,
        private repoName: string,
        ) {}


    public async update(): Promise<BuildInfo> {
        const oldSync = await this.a3sDirectory.getSync();
        const newSync = await this.syncGenerationService.generateSync();
        const diff = await this.syncComparisonService.compare(oldSync, newSync);
        const serverInfo = new A3SServerInfo(await this.a3sDirectory.getServerInfo())
            .newRevision()
            .setTotalFileCount(diff.counts.totalCount.b)
            .setTotalFilesSize(diff.counts.totalSize.b);
        const zsyncUpdateInfo = await this.zsyncGenerationService.update();
        const changelogs = await this.a3sDirectory.getChangelogs();

        await Promise.all([
            this.a3sDirectory.setSync(newSync),
            this.a3sDirectory.setServerInfo(serverInfo.getDto()),
            this.a3sDirectory.setChangelogs(changelogs.addFromDiff(diff.mods, serverInfo.getDto())),
        ]);
        return {
            zsyncUpdateInfo: zsyncUpdateInfo,
            syncUpdateInfo: newSync,
            serverInfo: serverInfo.getDto(),
        };
    }

    public async initializeRepository(): Promise<void> {
        const urlBits = this.publicURL.match(/^([a-z]+):\/\/([a-z0-9-.]+)([^\/]*)?(.*)$/);
        if (!urlBits) {
            throw new Error('could not get proper URL from config');
        }
        let [protocol, host, port, path] = urlBits.slice(1);
        // console.log(protocol); console.log(host); console.log(port); console.log(path);

        if (port) {
            port = port.substr(1);
        } else {
            port = "80";
        }
        if (protocol !== 'http') {
            throw new Error('TODO: support protocols other than HTTP');
        }

        return Promise.all([
            this.a3sDirectory.setAutoconfig({
                favoriteServers: [],
                protocole: {
                    connectionTimeOut: "300000",
                    encryptionMode: null,
                    login: "anonymous",
                    password: "",
                    port: port,
                    readTimeOut: "300000",
                    url: [host, path].join('')
                },
                repositoryName: this.repoName
            }),
            this.a3sDirectory.setChangelogs({
                list: [{
                    revision: 0,
                    buildDate: new Date(),
                    addons: [],
                    newAddons: [],
                    deletedAddons: [],
                    updatedAddons: [],
                    contentUpdated: false,
                }],
            }),
            this.a3sDirectory.setEvents({
                list: [],
            }),
            this.a3sDirectory.setServerInfo(A3SServerInfo.emptyServerInfo().getDto()),
            this.a3sDirectory.setRawSync({
                deleted: false,
                hidden: false,
                markAsAddon: false,
                updated: false,
                list: [],
                name: 'racine',
            }),
        ]).then(() => Promise.resolve())
    }
}
