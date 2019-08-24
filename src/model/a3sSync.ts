export interface A3sSyncTreeDirectory extends A3sSyncTreeNode {
    list: A3sSyncTreeLeaf[]|A3sSyncTreeNode[]
    parent: A3sSyncTreeDirectory|null
}

export interface A3sSyncTreeNode {
    deleted: boolean
    hidden: boolean
    markAsAddon: boolean
    name: string
    updated: boolean
}

export interface A3sSyncTreeLeaf extends A3sSyncTreeNode {
    compressed: boolean
    compressedSize: number // long
    size: number
    sha1: string
}
