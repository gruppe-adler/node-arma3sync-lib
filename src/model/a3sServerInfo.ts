export interface A3SServerInfo {
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
