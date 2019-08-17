export class A3SServerInfo {
    constructor(
        public revision: number,
        public buildDate: Date,
        public numberOfFiles: number,
        public totalFilesSize: number,
        public hiddenFolderPaths: string[],
        public numberOfConnections: number,
        public noPartialFileTransfer: boolean,
        public repositoryContentUpdated: boolean,
        public compressedPboFilesOnly: boolean
    ) {}
}
