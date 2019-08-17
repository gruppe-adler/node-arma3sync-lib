export interface A3SSyncTree {
    name: string;
    destinationPath: string;
    updated: boolean;
    deleted: boolean;
    parent?: A3SSyncTree;
    list?: A3SSyncTree[];
}

export interface A3SSyncTreeNode extends A3SSyncTree {
    markAsAddon: boolean,
    hidden: boolean
}

export interface A3SSyncTreeLeaf extends A3SSyncTree {
        sha1: string,
        compressedSize: number, // long
        complete: number, // long
        localSha1: string,
        compressed: boolean,
}
