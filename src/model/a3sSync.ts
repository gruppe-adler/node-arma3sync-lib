export interface A3SSyncTree {
    name: string;
    destinationPath: string;
    updated: boolean;
    deleted: boolean;
    parent?: A3SSyncTree;
    list?: A3SSyncTree[];
}

export class A3SSyncTreeNode implements A3SSyncTree {
    constructor(
        public name: string,
        public markAsAddon: boolean,
        public destinationPath: string,
        public updated: boolean,
        public deleted: boolean,
        public hidden: boolean,
        public parent?: A3SSyncTree,
        public list?: A3SSyncTree[]
    ) {}
}

export class A3SSyncTreeLeaf implements A3SSyncTree {
    constructor(
        public name: string,
        public sha1: string,
        public compressedSize: number, // long
        public complete: number, // long
        public destinationPath: string,
        public localSha1: string,
        public updated: boolean,
        public deleted: boolean,
        public compressed: boolean,
        public parent?: A3SSyncTree,
        public list?: A3SSyncTree[]
    ) {}
}
