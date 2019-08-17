import {A3SChangelog} from 'src/model/a3sChangelog';
import {A3SServerInfo} from 'src/model/a3sServerInfo';
import {A3SSyncTree} from 'src/model/a3sSync';
import {A3SAutoconfig} from 'src/model/a3SAutoconfig';
import {A3sEvents} from 'src/model/a3sEvents';

export enum A3SFiles {
    AUTOCONFIG = 'autoconfig',
    CHANGELOGS = 'changelogs',
    EVENTS = 'events',
    SERVERINFO = 'serverinfo',
    SYNC = 'sync'
}

export interface A3sAccess {
    getEvents(): Promise<A3sEvents>
    getChangelogs():Promise<A3SChangelog>
    getServerInfo(): Promise<A3SServerInfo>
    getSync(): Promise<A3SSyncTree>
    getRepository(): Promise<A3SAutoconfig>
}
