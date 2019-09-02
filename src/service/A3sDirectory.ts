import {A3sAccess, A3SFiles} from './a3sAccess';
import {A3SChangelog} from '../model/a3sChangelog';
import {A3SAutoconfig} from '../model/a3SAutoconfig';
import {A3SServerInfo} from '../model/a3sServerInfo';
import {A3sSyncTreeDirectoryDto} from '../model/a3sSync';
import {readFile, writeFile} from 'fs';
import {promisify} from 'util';
import {gunzip, gzip} from 'zlib';
import {A3sEventsDto} from '../model/a3sEventsDto';
import {InputObjectStream, OutputObjectStream} from 'java.io';
import {serializeA3sEvents} from '../java/A3sEvents';
import {serializeA3sSyncTreeDirectory} from '../java/A3sSyncTreeDirectory';
import {GenericJObject} from '../java/serializer/interfaces';
import {Path} from '../util/aliases';

export class A3sDirectory implements A3sAccess {
    constructor(private directory: Path)  {}

    public getChangelogs(): Promise<A3SChangelog> {
        return this
            .getFile(A3SFiles.CHANGELOGS)
            .then(json => Promise.resolve(json as A3SChangelog));
    }

    public getEvents(): Promise<A3sEventsDto> {
        return this
            .getFile(A3SFiles.EVENTS)
            .then(json => Promise.resolve(json as A3sEventsDto));
    }

    public setEvents(events: A3sEventsDto): Promise<void> {
        return this.setFile(A3SFiles.EVENTS, serializeA3sEvents(events));
    }

    public getRepository(): Promise<A3SAutoconfig> {
        return this
            .getFile(A3SFiles.AUTOCONFIG)
            .then(json => Promise.resolve(json as A3SAutoconfig));
    }

    public getServerInfo(): Promise<A3SServerInfo> {
        return this
            .getFile(A3SFiles.SERVERINFO)
            .then(json => Promise.resolve(json as A3SServerInfo));
    }

    public getSync(): Promise<A3sSyncTreeDirectoryDto> {
        return this
            .getFile(A3SFiles.SYNC)
            .then(json => Promise.resolve(json as A3sSyncTreeDirectoryDto));
    }

    public setSync(sync: A3sSyncTreeDirectoryDto): Promise<void> {
        return this.setFile(A3SFiles.SYNC, serializeA3sSyncTreeDirectory(sync));
    }

    private getFile(name: string): Promise<object> {
        const path = this.directory + '/' + name;
        return promisify(readFile)(path)
            .then(rawFile => promisify(gunzip)(rawFile))
            .then((unzippedBuffer: Buffer) => Promise.resolve(new InputObjectStream(unzippedBuffer, false).readObject()));
    }

    private setFile(name: string, contents: GenericJObject): Promise<void> {
        const path = this.directory + '/' + name;
        return Promise
            .resolve(new OutputObjectStream().writeObject(contents))
            .then(buffer => promisify(gzip)(buffer))
            .then(rawFile => promisify(writeFile)(path, rawFile))
    }
}
