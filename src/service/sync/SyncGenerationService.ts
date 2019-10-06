import * as crypto from 'crypto'
import {createReadStream, Dirent, existsSync, readdir, readdirSync, readlinkSync, stat} from 'fs'
import {promisify} from 'util';
import {Path} from '../../util/aliases';
import {getLogger} from '../../config';
import {SyncTreeBranch} from '../../model/SyncTreeBranch';
import {SyncTreeLeaf} from '../../model/SyncTreeLeaf';
import {toNameMap} from '../../util/funcs';

function checkPath(subDir: Path) {
    if (!subDir.startsWith('/')) {
        throw new Error('subdir needs to be absolute on repo path – and start with "/"!');
    }
}

export class SyncGenerationService {
    constructor(private repoPath: string) {
    }

    public generateSync(): Promise<SyncTreeBranch> {
        return this.walk(this.repoPath);
    }

    public generatePartialSync(subDir: Path): Promise<SyncTreeBranch> {
        checkPath(subDir);
        return this.walk(this.repoPath + subDir);
    }

    private hash(file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha1');
            hash.on('readable', () => {
                const hashingResult = hash.read();
                if (!hashingResult) {
                    return;
                }
                const hashString = hashingResult.toString('hex');
                // thats the hash for an empty file, apparently
                resolve(hashString === 'da39a3ee5e6b4b0d3255bfef95601890afd80709' ? '0' : hashString);
            });
            const fStream = createReadStream(file);
            fStream.on('data', (data) => {
                hash.update(data);
            });
            fStream.on('end', () => {
                hash.end();
            });
        });
    }

    private async walk(currentPath: string, addon: string = ''): Promise<SyncTreeBranch> {
        const subPath = currentPath.slice(this.repoPath.length);
        const name = subPath.split('/').pop() || '';

        let entries: Dirent[] = [];
        try {
            entries = await promisify(readdir)(currentPath, {withFileTypes: true});
        } catch (e) {
            getLogger().error(e.message);
            return Promise.reject(e);
        }

        const dataDirectories: Dirent[] = entries
            .filter((file) => {
                if (file.name === '.a3s') {
                    return false;
                }
                if (file.isDirectory()) {
                    return true;
                }
                if (file.isSymbolicLink()) {
                    // potential performance hit: sync code
                    const linkTarget = readlinkSync(`${currentPath}/${file.name}`);
                    return existsSync(`${currentPath}/${linkTarget}`);
                }
                return false;
            });
        addon = dataDirectories.find(dir => dir.name === 'addons') ? name : addon;
        const directoryDtos: { [p: string]: SyncTreeBranch } = toNameMap<SyncTreeBranch>(await Promise.all(
            dataDirectories.map((file) => this.walk(`${currentPath}/${file.name}`, addon))
        ));

        const files = entries.filter((entry: Dirent) => entry.isFile() && !entry.name.endsWith('.zsync'));
        const allFileHashes = await Promise.all(
            files.map((file: Dirent) => {
                return this.hash(`${currentPath}/${file.name}`);
            })
        );
        const fileSizes = await Promise.all(files.map((file: Dirent) => {
            return promisify(stat)(`${currentPath}/${file.name}`)
        }));



        const leafDtos: SyncTreeLeaf[] = allFileHashes.map((hash, idx) => {
            return new SyncTreeLeaf(
                files[idx].name,
                addon,
                subPath + '/' + files[idx].name,
                hash,
                fileSizes[idx].size,
            );
        });

        return new SyncTreeBranch(
            name,
            subPath,
            Boolean(directoryDtos['addons']),
            directoryDtos,
            toNameMap(leafDtos),
        );
    }
}
