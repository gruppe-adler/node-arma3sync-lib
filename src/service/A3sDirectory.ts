import {A3sAccess, A3SFiles} from './a3sAccess';
import {A3sAutoconfigDto} from '../dto/A3sAutoconfigDto';
import {A3sServerInfoDto} from '../model/A3sServerInfoDto';
import {A3sSyncTreeDirectoryDto} from '../model/a3sSync';
import {existsSync, mkdirSync, readFile, writeFile} from 'fs';
import {promisify} from 'util';
import {gunzip, gzip} from 'zlib';
import {A3sEventsDto} from '../model/A3sEventsDto';
import {InputObjectStream, OutputObjectStream} from 'java.io';
import {serializeA3sEvents} from '../java/A3sEvents';
import {serializeA3sSyncTreeDirectory} from '../java/A3sSyncTreeDirectory';
import {GenericJObject} from '../java/serializer/interfaces';
import {Path} from '../util/aliases';
import {serializeA3sServerInfo} from '../java/A3sServerInfo';
import {A3sChangelogsDto} from '../model/A3sChangelogsDto';
import {serializeA3sChangelogs} from '../java/A3sChangelogs';
import {serializeA3sAutoconfig} from '../java/serializer/A3sAutoconfig';
import {SyncTreeBranch} from '../model/SyncTreeBranch';
import {Changelogs} from '../model/Changelogs';

/**
 * read and write the files in /.a3s : Provides type safety, but does not guarantee consistency across files.
 */
export class A3sDirectory implements A3sAccess {
    constructor(private a3sDirectory: Path)  {
        if (!existsSync(a3sDirectory)) {
            mkdirSync(a3sDirectory);
        }
    }

    public getChangelogs(): Promise<Changelogs> {
        return this
            .getFile(A3SFiles.CHANGELOGS)
            .then(json => Promise.resolve(Changelogs.fromDto(json as A3sChangelogsDto)));
    }

    public setChangelogs(changelogs: A3sChangelogsDto): Promise<void> {
        return this.setFile(A3SFiles.CHANGELOGS, serializeA3sChangelogs(changelogs))
    }

    public getEvents(): Promise<A3sEventsDto> {
        return this
            .getFile(A3SFiles.EVENTS)
            .then(json => Promise.resolve(json as A3sEventsDto));
    }

    public setEvents(events: A3sEventsDto): Promise<void> {
        return this.setFile(A3SFiles.EVENTS, serializeA3sEvents(events));
    }

    public getAutoconfig(): Promise<A3sAutoconfigDto> {
        return this
            .getFile(A3SFiles.AUTOCONFIG)
            .then(json => Promise.resolve(json as A3sAutoconfigDto));
    }

    public setAutoconfig(autoconfig: A3sAutoconfigDto): Promise<void> {
        return this.setFile(A3SFiles.AUTOCONFIG, serializeA3sAutoconfig(autoconfig));
    }

    public getServerInfo(): Promise<A3sServerInfoDto> {
        return this
            .getFile(A3SFiles.SERVERINFO)
            .then(json => Promise.resolve(json as A3sServerInfoDto));
    }

    public setServerInfo(serverInfo: A3sServerInfoDto): Promise<void> {
        return this.setFile(A3SFiles.SERVERINFO, serializeA3sServerInfo(serverInfo));
    }

    public getRawSync(): Promise<A3sSyncTreeDirectoryDto> {
        return this
            .getFile(A3SFiles.SYNC)
            .then(json => Promise.resolve(json as A3sSyncTreeDirectoryDto));
    }

    public getSync(): Promise<SyncTreeBranch> {
        return this.getRawSync().then(_ => {
            return SyncTreeBranch.fromSyncTreeRoot(_);
        });
    }

    public setSync(sync: SyncTreeBranch): Promise<void> {
        return this.setRawSync(sync.toDto());
    }

    public setRawSync(sync: A3sSyncTreeDirectoryDto): Promise<void> {
        return this.setFile(A3SFiles.SYNC, serializeA3sSyncTreeDirectory(sync));
    }

    private getFile(name: string): Promise<object> {
        const path = this.a3sDirectory + '/' + name;
        return promisify(readFile)(path)
            .then(rawFile => promisify(gunzip)(rawFile))
            .then((unzippedBuffer: Buffer) => Promise.resolve(new InputObjectStream(unzippedBuffer, false).readObject()));
    }

    private setFile(name: string, contents: GenericJObject): Promise<void> {
        const path = this.a3sDirectory + '/' + name;
        return Promise
            .resolve(new OutputObjectStream().writeObject(contents))
            .then(buffer => promisify(gzip)(buffer))
            .then(rawFile => promisify(writeFile)(path, rawFile))
    }
}
