import {A3sServerInfoDto} from './A3sServerInfoDto';

export class A3SServerInfo {
    constructor(private dto: A3sServerInfoDto) {}

    public newRevision(): A3SServerInfo {
        this.dto.buildDate = new Date();
        this.dto.revision = this.dto.revision + 1;

        return this;
    }

    public getDto(): A3sServerInfoDto {
        return this.dto;
    }

    public static emptyServerInfo(): A3SServerInfo {
        return new A3SServerInfo({
            buildDate: new Date(),
            revision: 0,
            numberOfFiles: 0,
            numberOfConnections: 1,
            totalFilesSize: 0,
            hiddenFolderPaths: [],
            noPartialFileTransfer: false,
            repositoryContentUpdated: false,
            compressedPboFilesOnly: false,
        });
    }
}
