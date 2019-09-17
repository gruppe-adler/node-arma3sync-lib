import {A3sChangelogsDto} from './A3sChangelogsDto';
import {Changelog} from './Changelog';
import {ModDiffResult} from '../service/sync/SyncComparisonService';
import {A3SServerInfo} from './A3SServerInfo';
import {A3sServerInfoDto} from './A3sServerInfoDto';

export class Changelogs implements A3sChangelogsDto {
    constructor(
        public list: Changelog[] = []
    ) {}
    public static fromDto(a3sChangelogs: A3sChangelogsDto): Changelogs {
        return new Changelogs(a3sChangelogs.list.map(_ => Changelog.fromDto(_)));
    }

    public add(changelog: Changelog): Changelogs {
        this.list.push(changelog);

        return this;
    }

    public addFromDiff(diff: ModDiffResult, serverInfo: A3sServerInfoDto): Changelogs {
        const changelog = new Changelog();
        changelog.updatedAddons = diff.changedMods;
        changelog.revision = serverInfo.revision;
        changelog.buildDate = serverInfo.buildDate;
        changelog.addons = diff.all;
        changelog.newAddons = diff.newMods;
        changelog.deletedAddons = diff.deletedMods;
        changelog.contentUpdated = changelog.updatedAddons.length > 0;

        this.list.push(changelog);

        return this;
    }
}
