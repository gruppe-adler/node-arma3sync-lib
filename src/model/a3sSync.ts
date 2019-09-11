import {Child} from './child';

export function stripCircularReferences(obj: {parent?: object, list?: any[]}): void {
    delete obj.parent;
    if (obj.list) {
        obj.list.forEach(stripCircularReferences)
    }
}

export interface A3sSyncTreeDirectoryDto extends A3sSyncTreeNodeDto {
    list: (A3sSyncTreeLeafDto|A3sSyncTreeDirectoryDto)[]
    hidden: boolean
    markAsAddon: boolean
}

export interface A3sSyncTreeNodeDto extends Child<A3sSyncTreeDirectoryDto> {
    deleted: boolean
    name: string
    updated: boolean
    parent?: A3sSyncTreeDirectoryDto // a3s serialized files always contain the property. keep it optional for input.
}

export interface A3sSyncTreeLeafDto extends A3sSyncTreeNodeDto {
    compressed: boolean
    compressedSize: number
    size: number
    sha1: string
}
