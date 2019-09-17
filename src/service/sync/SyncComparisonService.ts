import {ParallelSyncStream} from './ParallelSyncStream';
import {ComparisonContext} from './ComparisonContext';
import {SyncTreeBranch} from '../../model/SyncTreeBranch';

export class ModDiffResult {
    constructor(
        public all: string[],
        public newMods: string[],
        public changedMods: string[],
        public deletedMods: string[],
    ) {}
}

export class FileDiffResult {
    constructor(
        public newFiles: string[],
        public changedFiles: string[],
        public deletedFiles: string[],
    ) {}
}

export class FileSizeResult {
    constructor(
        public totalCount: {a: number, b: number} = {a: 0, b: 0},
        public totalSize: {a: number, b: number} = {a: 0, b: 0}
    ) {}

    public add(comparisonContext: ComparisonContext): FileSizeResult {
        if (comparisonContext.a) {
            this.totalCount.a++;
            this.totalSize.a += comparisonContext.a.size;
        }
        if (comparisonContext.b) {
            this.totalCount.b++;
            this.totalSize.b += comparisonContext.b.size;
        }

        return this;
    }
}

export interface DiffResult {
    mods: ModDiffResult
    files: FileDiffResult
    counts: FileSizeResult
}

function intersect(a: Set<string>, b: Set<string>): Set<string> {
    return new Set(Array.from(a).filter(element => b.has(element)));
}

function diff(a: Set<string>, b: Set<string>): Set<string> {
    return new Set(Array.from(a).filter(element => !b.has(element)));
}

export function modDiff(comparisonStream: ParallelSyncStream): Promise<ModDiffResult> {
    const aMods = new Set<string>();
    const bMods = new Set<string>();
    const allMods = new Set<string>();
    const changedMods = new Set<string>();
    comparisonStream.onLeaf((comparisonContext: ComparisonContext) => {
        const a = comparisonContext.a;
        const b = comparisonContext.b;
        if (a && b && (a.addon !== b.addon)) {
            throw new Error('something is wrong here, both files should belong to the same addon!');
        }
        const addon = (a && a.addon) || (b && b.addon);
        if (!addon) {
            return;
        }
        allMods.add(addon);
        if (a) {
            aMods.add(addon);
        }
        if (b) {
            bMods.add(addon);
        }
        if (Boolean(a) !== Boolean(b)) {
            changedMods.add(addon);
        } else {
            if (a.sha1 !== b.sha1) {
                changedMods.add(addon);
            }
        }
    });
    return new Promise((resolve, reject) => {
        comparisonStream.onEnd(() => {

            resolve(new ModDiffResult(
                Array.from(allMods),
                Array.from(diff(bMods, aMods)),
                Array.from(intersect(intersect(changedMods, aMods), bMods)),
                Array.from(diff(aMods, bMods))));
        });
    });
}

export function fileDiff(comparisonStream: ParallelSyncStream): Promise<FileDiffResult> {
    const newFiles = [];
    const changedFiles = [];
    const deletedFiles = [];
    comparisonStream.onLeaf(comparisonContext => {
        const a = comparisonContext.a;
        const b = comparisonContext.b;
        if (!a) {
            newFiles.push(b.name);
            return;
        } else {
            if (!b) {
                deletedFiles.push(a.name);
                return;
            }
        }
        if (!a && !b) {
            throw new Error('are you kidding me?');
        }
        // now, a and b are defined (as there is no case where !a && !b)
        if (a.sha1 !== b.sha1) {
            changedFiles.push(b.name);
        }
    });
    return new Promise((resolve, reject) => {
        comparisonStream.onEnd(() => {
            resolve(new FileDiffResult(
                newFiles,
                changedFiles,
                deletedFiles,
            ));
        });
    });
}

export function fileCount(comparisonStream: ParallelSyncStream): Promise<FileSizeResult> {
    let fileSizeResult = new FileSizeResult();
    comparisonStream.onLeaf(comparisonContext => {
        fileSizeResult = fileSizeResult.add(comparisonContext);
    });
    return new Promise((resolve, reject) => {
        comparisonStream.onEnd(() => resolve(fileSizeResult));
    });
}

export class SyncComparisonService {
    public modDiff = modDiff;
    public fileDiff = fileDiff;
    public fileCount = fileCount;

    public async compare(a: SyncTreeBranch, b: SyncTreeBranch): Promise<DiffResult> {
        const comparisonStream = new ParallelSyncStream(a, b);
        const modPromise = this.modDiff(comparisonStream);
        const filesPromise = this.fileDiff(comparisonStream);
        const countsPromise = this.fileCount(comparisonStream);
        comparisonStream.start();
        return  {
            mods: await modPromise,
            files: await filesPromise,
            counts: await countsPromise,
        }
    }
}
