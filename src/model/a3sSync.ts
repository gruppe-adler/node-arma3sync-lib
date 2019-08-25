export interface A3sSyncTreeDirectory extends A3sSyncTreeNode {
    list: (A3sSyncTreeLeaf|A3sSyncTreeDirectory)[]
}

export interface A3sSyncTreeNode {
    deleted: boolean
    hidden: boolean
    markAsAddon: boolean
    name: string
    updated: boolean
    parent?: A3sSyncTreeDirectory|null // a3s serialized files always contain the property. keep it optional for input.
}

export interface A3sSyncTreeLeaf extends A3sSyncTreeNode {
    compressed: boolean
    compressedSize: number // long
    size: number
    sha1: string
}
