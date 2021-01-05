import {Path} from '../../util/aliases';
import {promisify} from "util";
import {exec} from "child_process";
import {getLogger} from '../../config';
import {util, get} from 'config';

util.setModuleDefaults("arma3sync-lib", {
    repoPath: '/var/lib/repo',
    publicURL: 'http://foo'
});

function checkPath(file: Path) {
    if (file.indexOf('..') !== -1) {
        throw new Error('dont try to escape the repository');
    }
}

function getCmdLine(publicURL: string, rootPath: Path, file: Path): string {
    return `zsyncmake -eu "${publicURL}${file}" "${rootPath}${file}" -o "${rootPath}${file}.zsync"`;
}

export async function zsyncmake(file: Path): Promise<void> {
    return zsyncmakeWithExec(file, exec);
}

export async function zsyncmakeWithExec(file: Path, exec: Function): Promise<void> {
    checkPath(file);
    const cmdLine = getCmdLine(get("arma3sync-lib.publicURL"), get("arma3sync-lib.repoPath"), file);
    const result = await promisify(exec)(cmdLine);
    if (result.stdout.length || result.stderr.length > 0) {
        getLogger().warn('output from zsyncmake:');
        getLogger().warn('OUT ' + result.stdout.toString());
        getLogger().warn('ERR ' + result.stderr.toString());
    }
    return result;
}
