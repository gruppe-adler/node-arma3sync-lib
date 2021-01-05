import {promisify} from 'util';
import {Path} from '../../util/aliases';
import {Dirent, readdir, stat, unlink} from 'fs';

function sum(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0)
}

export class UpdateResult {
    constructor(
    public readonly created: number = 0,
    public readonly updated: number = 0,
    public readonly deleted: number = 0,
    public readonly skipped: number = 0
) {}
    public add(other: UpdateResult): UpdateResult {
        return new UpdateResult(
            this.created + other.created,
            this.updated + other.updated,
            this.deleted + other.deleted,
            this.skipped + other.skipped,
        );
    }

    public equals(other: UpdateResult): boolean {
        return this.created === other.created && this.updated === other.updated && this.deleted === other.deleted && this.skipped === other.skipped;
    }

    public static Created = new UpdateResult(1, 0, 0, 0);
    public static Updated = new UpdateResult(0, 1, 0, 0);
    public static Deleted = new UpdateResult(0, 0, 1, 0);
    public static Skipped = new UpdateResult(0, 0, 0, 1);

    public static sum(updateResults: UpdateResult[]): UpdateResult {
        return updateResults.reduce((prev, cur) => {
            return prev.add(cur);
        }, new UpdateResult());
    }
}

/**
 * removes value from array, returns removed element (if any)
 */
function consume<T>(arr: T[], val: T): T|undefined {
    const idx = arr.indexOf(val);
    if (idx === -1) {
        return;
    }

    return arr.splice(idx, 1)[0];
}

const zSyncFilenameExtension = '.zsync';

/**
 * because we don't have a working zsync implementation in the JS world,
 * use the CLI [zsyncmake](https://linux.die.net/man/1/zsyncmake) tool. yes.
 */
export class ZSyncGenerationService {

    constructor(
        private repoPublicURL: string, /* ex. http://gruppe-adler.de/arma3sync */
        private repoPath: Path,  /* ex. /var/lib/arma3sync */
        private zsyncmake: (file: Path) => void,
    ) {}

    /**
     * create-overwrite a single zsync file
     */
    public async writeSingle(file: Path): Promise<void> {
        ZSyncGenerationService.checkPath(file);
        return this.zsyncmake(file);
    }

    private async writeRelativeSingle(relativePath: Path, filename: string): Promise<void> {
        return this.writeSingle(`${relativePath}/${filename}`);
    }

    private getMtimeMs(relativePath: Path, filename: string): Promise<number> {
        return promisify(stat)(`${this.repoPath}${relativePath}/${filename}`)
            .then(stat => stat.mtimeMs);
    }

    private async deleteZsync(relativePath: Path, filename: string): Promise<void> {
        return promisify(unlink)(`${this.repoPath}${relativePath}/${filename}`);
    }

    /**
     * removes all zsync files from path
     * returns number of deleted files
     */
    public async clear(path: Path): Promise<number> {
        if (!this.repoPath || this.repoPath === '/') {
            throw new Error('repo path is filesystem root. this should not be.');
        }
        const absolutePath = this.repoPath + path;
        const entries = await promisify(readdir)(absolutePath, {withFileTypes: true});
        const zsyncs: string[] = entries.filter(dirent => dirent.isFile() && dirent.name.endsWith('.zsync')).map(dirent => dirent.name);
        const subdirs: string[] = entries.filter(dirent => dirent.isDirectory() && dirent.name !== '.' && dirent.name !== '..').map(dirent => dirent.name);
        const recursingPromises: number[] = await Promise.all(subdirs.map(subdir => {
            return this.clear(`${path}/${subdir}`);
        }));
        await Promise.all(zsyncs.map(zsync => {
            return this.deleteZsync(path, zsync);
        }));

        return Promise.resolve(zsyncs.length + sum(recursingPromises));
    }

    /**
     * update all zsyncs if they're older than the files they refer to,
     * or create if not existent
     */
    public async update(relativePath: Path = ''): Promise<UpdateResult> {
        if (!this.repoPath || this.repoPath === '/') {
            throw new Error('repo path is filesystem root. this should not be.');
        }

        return (await this.updateRecursion(relativePath)).add(await this.updateSingleDirectory(relativePath));
    }

    private async updateRecursion(relativePath: Path): Promise<UpdateResult> {
        const absolutePath = this.repoPath + relativePath;
        const entries: Dirent[] = await promisify(readdir)(absolutePath, {withFileTypes: true});
        const subdirs: string[] = entries
            .filter(dirent => dirent.isDirectory() && dirent.name !== '.' && dirent.name !== '..' && dirent.name !== '.a3s')
            .map(dirent => dirent.name);
        return UpdateResult.sum(await Promise.all(subdirs.map(subdir => {
            return this.update(`${relativePath}/${subdir}`);
        })));
    }

    private async updateSingleDirectory(relativePath: Path): Promise<UpdateResult> {
        const absolutePath = this.repoPath + relativePath;
        const entries: Dirent[] = await promisify(readdir)(absolutePath, {withFileTypes: true});
        const files = entries
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);

        const zsyncs: string[] = files.filter(path => path.endsWith(zSyncFilenameExtension));
        const nonZsyncs: string[] = files.filter(path => !path.endsWith(zSyncFilenameExtension));
        let result = await Promise
            .all(nonZsyncs.map(nonZsync => this.updateForFile(relativePath, nonZsync, zsyncs)))
            .then(results => UpdateResult.sum(results));
        result = result.add(await this.deleteZsyncs(relativePath, zsyncs));

        return result;
    }

    private async deleteZsyncs(relativePath: Path, zsyncs: string[]): Promise<UpdateResult> {
        return Promise.all(zsyncs.map(zsync => {
            return this.deleteZsync(relativePath, zsync).then(() => UpdateResult.Deleted);
        })).then(results => UpdateResult.sum(results))
    }

    private async updateForFile(relativePath: Path, nonZsync: string, zsyncs: string[]): Promise<UpdateResult> {
        const zsyncPath = nonZsync + zSyncFilenameExtension;
        if (consume(zsyncs, zsyncPath)) {
            return Promise.all([
                this.getMtimeMs(relativePath, nonZsync),
                this.getMtimeMs(relativePath, zsyncPath),
            ]).then(mtimeMs => {
                if (mtimeMs[0] > mtimeMs[1]) {
                    return this.writeRelativeSingle(relativePath, nonZsync).then(() => UpdateResult.Updated);
                }
                return Promise.resolve(UpdateResult.Skipped);
            });
        }
        return this.writeRelativeSingle(relativePath, nonZsync).then(() => UpdateResult.Created);

    }

    private static checkPath(file: Path) {
        if (file.indexOf('..') !== -1) {
            throw new Error('dont try to escape the repository');
        }
    }
}
