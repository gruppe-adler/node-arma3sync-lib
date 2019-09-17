import {A3sServerInfoDto} from '../model/A3sServerInfoDto';
import {A3sSyncTreeDirectoryDto} from '../model/a3sSync';
import {A3sAutoconfigDto} from '../dto/A3sAutoconfigDto';
import {A3sEventsDto} from '../model/A3sEventsDto';
import {A3sChangelogsDto} from '../model/A3sChangelogsDto';

export enum A3SFiles {
    AUTOCONFIG = 'autoconfig',
    CHANGELOGS = 'changelogs',
    EVENTS = 'events',
    SERVERINFO = 'serverinfo',
    SYNC = 'sync'
}

export interface A3sAccess {
    getEvents(): Promise<A3sEventsDto>
    getChangelogs():Promise<A3sChangelogsDto>
    getServerInfo(): Promise<A3sServerInfoDto>
    getRawSync(): Promise<A3sSyncTreeDirectoryDto>
    getAutoconfig(): Promise<A3sAutoconfigDto>
}
