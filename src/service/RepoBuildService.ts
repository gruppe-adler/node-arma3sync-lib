import {UpdateResult, ZSyncGenerationService} from './zsync/ZSyncGenerationService';
import {A3sDirectory} from './A3sDirectory';
import {SyncGenerationService} from './sync/SyncGenerationService';
import {A3sSyncTreeDirectoryDto} from '../model/a3sSync';
import {A3SServerInfo} from '../model/A3SServerInfo';
import {A3sServerInfoDto} from '../model/A3sServerInfoDto';
import {get} from 'config';
import {mkdirSync} from 'fs';

interface BuildInfo {
    zsyncUpdateInfo: UpdateResult,
    syncUpdateInfo: A3sSyncTreeDirectoryDto,
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
        ) {}


    public async update(): Promise<BuildInfo> {
        const newSync = await this.syncGenerationService.generateSync();
        await this.a3sDirectory.setSync(newSync);
        const serverInfo = new A3SServerInfo(await this.a3sDirectory.getServerInfo()).newRevision();
        const zsyncUpdateInfo = await this.zsyncGenerationService.update();
        await this.a3sDirectory.setServerInfo(serverInfo.getDto());
        return {
            zsyncUpdateInfo: zsyncUpdateInfo,
            syncUpdateInfo: newSync,
            serverInfo: serverInfo.getDto(),
        };
    }

    public async initializeRepository(): Promise<void> {
        const urlBits = get<string>("arma3sync-lib.publicURL").match(/^([a-z]+):\/\/([a-z0-9-.]+)([^\/]*)?(.*)$/);
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
                repositoryName: "new repository"
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
            this.a3sDirectory.setSync({
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
