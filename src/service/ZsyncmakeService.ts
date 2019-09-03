import {Path} from '../util/aliases';
import {promisify} from "util";
import {exec} from "child_process";

function checkPath(file: Path) {
    if (file.indexOf('..') !== -1) {
        throw new Error('dont try to escape the repository');
    }
}

export class ZsyncmakeService {
    constructor(
        private repoPublicURL: string,
        private repoPath: Path,
    ) {}

    public async execForFile(file: Path): Promise<void> {
        const cmdLine = this.getCmdLine(file);
        let execFunc = promisify(exec);
        const result = await execFunc(cmdLine);
        if (result.stdout.length || result.stderr.length > 0) {
            console.warn('output from zsync:');
            console.warn('OUT ' + result.stdout.toString());
            console.warn('ERR ' + result.stderr.toString());
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
