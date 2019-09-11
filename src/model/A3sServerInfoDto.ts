export interface A3sServerInfoDto {
    revision: number
    buildDate: Date
    numberOfFiles: number
    totalFilesSize: number
    hiddenFolderPaths: string[]
    numberOfConnections: number
    noPartialFileTransfer: boolean
    repositoryContentUpdated: boolean
    compressedPboFilesOnly: boolean
}
