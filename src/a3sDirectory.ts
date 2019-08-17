import {A3sAccess} from 'src/a3sAccess';
import {A3SChangelog} from 'src/model/a3sChangelog';
import {A3SRepository} from 'src/model/a3sRepository';
import {A3SServerInfo} from 'src/model/a3sServerInfo';
import {A3SSyncTree} from 'src/model/a3sSync';
import {readFile} from 'fs';
import {promisify} from 'util';
import {gunzip} from 'zlib';
import {A3sEvents} from 'src/model/a3sEvents';
import {InputObjectStream} from 'java.io';

export class A3sDirectory implements A3sAccess {
    constructor(private directory: string)  {}

    public getChangelogs(): Promise<A3SChangelog> {
        return undefined;
    }

    public getEvents(): Promise<A3sEvents> {
        return this.getFile('events').then(json => Promise.resolve(json as A3sEvents));
    }

    public getRepository(): Promise<A3SRepository> {
        return undefined;
    }

    public getServerInfo(): Promise<A3SServerInfo> {
        return undefined;
    }

    public getSync(): Promise<A3SSyncTree> {
        return undefined;
    }

    private getFile(name: string): Promise<object> {
        const path = this.directory + '/' + name;
        return promisify(readFile)(path)
            .then(rawFile => promisify(gunzip)(rawFile))
            .then((unzippedBuffer: Buffer) => Promise.resolve(new InputObjectStream(unzippedBuffer, false).readObject()));
    }
}
