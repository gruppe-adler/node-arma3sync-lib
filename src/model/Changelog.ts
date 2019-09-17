import {A3sChangelogDto} from './A3sChangelogDto';

export class Changelog implements A3sChangelogDto {
    public addons: string[];
    public buildDate: Date;
    public contentUpdated: boolean;
    public deletedAddons: string[];
    public newAddons: string[];
    public revision: number;
    public updatedAddons: string[];

    public static fromDto(dto: A3sChangelogDto): Changelog {
        const changelog = new Changelog();
        changelog.addons = dto.addons;
        changelog.buildDate = dto.buildDate;
        changelog.contentUpdated = dto.contentUpdated;
        changelog.deletedAddons = dto.deletedAddons;
        changelog.newAddons = dto.newAddons;
        changelog.revision = dto.revision;
        changelog.updatedAddons = dto.updatedAddons;

        return changelog;
    }
}
