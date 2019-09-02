import {exec} from 'child_process';
import {promisify} from 'util';
import {Path} from '../util/aliases';
import {TODO} from '../util/funcs';
import {readdir, unlink} from 'fs';

function sum(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0)
}

/**
 * because we don't have a working zsync implementation in the JS world,
 * use the CLI [zsyncmake](https://linux.die.net/man/1/zsyncmake) tool. yes.
 */
export class ZSyncGenerationService {

    constructor(
        private repoPublicURL: string, /* ex. http://gruppe-adler.de/arma3sync */
        private repoPath: Path,  /* ex. /var/lib/arma3sync */
        private customSpawn: Function = null,
    ) {}

    /**
     * create-overwrite a single zsync file
     */
    public async writeSingle(file: Path): Promise<void> {
        ZSyncGenerationService.checkPath(file);

        const cmdLine = this.getCmdLine(file);
        let execFunc = promisify(exec);
        if (this.customSpawn) {
            execFunc = this.customSpawn as any;
        }
        const result = await execFunc(cmdLine);
        if (result.stdout.length || result.stderr.length > 0) {
            console.warn('output from zsync:');
            console.warn('OUT ' + result.stdout.toString());
            console.warn('ERR ' + result.stderr.toString());
        }
    }

    /**
     * removes all zsync files from path
     * returns number of deleted files
     */
    public async clear(path: Path): Promise<number> {
        const entries = await promisify(readdir)(path, {withFileTypes: true});
        const zsyncs: string[] = entries.filter(dirent => dirent.isFile() && dirent.name.endsWith('.zsync')).map(dirent => dirent.name);
        const subdirs: string[] = entries.filter(dirent => dirent.isDirectory() && dirent.name !== '.' && dirent.name !== '..').map(dirent => dirent.name);
        const recursingPromises: number[] = await Promise.all(subdirs.map(subdir => {
            return this.clear(`${path}/${subdir}`);
        }));
        await Promise.all(zsyncs.map(zsync => {
            return promisify(unlink)(`${path}/${zsync}`);
        }));

        return Promise.resolve(zsyncs.length + sum(recursingPromises));
    }

    /**
     * update all zsyncs if they're older than the files they refer to,
     * or create if not existent
     */
    public async update(path: Path): Promise<void> {
        return Promise.reject(TODO());
    }

    private static checkPath(file: Path) {
        if (file.indexOf('..') !== -1) {
            throw new Error('dont try to escape the repository');
        }
    }

    /**
     *
     * @param file Path  absolute path within repo, e.g. /@mod/addons/foo.pbo
     */
    private getCmdLine(file: Path): string {
        return `zsyncmake -eu ${this.repoPublicURL}${file} ${this.repoPath}${file} -o ${this.repoPath}${file}.zsync`;
    }
}
