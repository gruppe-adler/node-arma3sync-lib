import {exec} from 'child_process';
import {promisify} from 'util';

type Path = string;

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

    public async generateZsyncs(file: Path): Promise<void> {
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
