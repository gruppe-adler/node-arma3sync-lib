import {A3sAccess, A3SFiles} from './a3sAccess';
import {A3SChangelog} from './model/a3sChangelog';
import {A3SAutoconfig} from './model/a3SAutoconfig';
import {A3SServerInfo} from './model/a3sServerInfo';
import {A3sSyncTreeDirectory} from './model/a3sSync';
import {readFile, writeFile} from 'fs';
import {promisify} from 'util';
import {gunzip, gzip} from 'zlib';
import {A3sEvents, A3sEventsDto, AsJava} from './model/a3sEventsDto';
import {InputObjectStream, OutputObjectStream} from 'java.io';

export class A3sDirectory implements A3sAccess {
    constructor(private directory: string)  {}

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
        return this.setFile(A3SFiles.EVENTS, new A3sEvents(events));
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

    public getSync(): Promise<A3sSyncTreeDirectory> {
        return this
            .getFile(A3SFiles.SYNC)
            .then(json => Promise.resolve(json as A3sSyncTreeDirectory));
    }

    private getFile(name: string): Promise<object> {
        const path = this.directory + '/' + name;
        return promisify(readFile)(path)
            .then(rawFile => promisify(gunzip)(rawFile))
            .then((unzippedBuffer: Buffer) => Promise.resolve(new InputObjectStream(unzippedBuffer, false).readObject()));
    }

    private setFile(name: string, contents: AsJava): Promise<void> {
        const path = this.directory + '/' + name;
        let foo = contents.asJava();
        return Promise
            .resolve(new OutputObjectStream().writeObject(foo))
            .then(buffer => promisify(gzip)(buffer))
            .then(rawFile => promisify(writeFile)(path, rawFile))
    }
}
