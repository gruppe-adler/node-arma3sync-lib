import {Dirent, existsSync, readdir, readdirSync, readlinkSync, stat} from 'fs'
import {promisify} from 'util';
import {Path} from '../../util/aliases';
import {getFileHasher, getLogger} from '../../config';
import {SyncTreeBranch} from '../../model/SyncTreeBranch';
import {SyncTreeLeaf} from '../../model/SyncTreeLeaf';
import {toNameMap} from '../../util/funcs';
import {createLimiter, Limiter} from '../../util/limit';

function checkPath(subDir: Path) {
    if (!subDir.startsWith('/')) {
        throw new Error('subdir needs to be absolute on repo path – and start with "/"!');
    }
}

// Matches the libuv threadpool size (UV_THREADPOOL_SIZE, 4 if unset), which serves all async fs reads.
// More parallel hashing would starve other crypto/fs/zlib work.
const uvThreadpoolSize = parseInt(process.env.UV_THREADPOOL_SIZE || '', 10);
export const defaultHashConcurrency = uvThreadpoolSize > 0 ? uvThreadpoolSize : 4;

export class SyncGenerationService {
    private limit: Limiter;

    /**
     * @param hashConcurrency max number of files hashed at the same time
     */
    constructor(private repoPath: string, hashConcurrency: number = defaultHashConcurrency) {
        this.limit = createLimiter(hashConcurrency);
    }

    public generateSync(): Promise<SyncTreeBranch> {
        return this.walk(this.repoPath);
    }

    public generatePartialSync(subDir: Path): Promise<SyncTreeBranch> {
        checkPath(subDir);
        return this.walk(this.repoPath + subDir);
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
        const isAddon = dataDirectories.find(dir => dir.name.toLowerCase() === 'addons') !== undefined;
        addon = isAddon ? name : addon;
        const directoryDtos: { [p: string]: SyncTreeBranch } = toNameMap<SyncTreeBranch>(await Promise.all(
            dataDirectories.map((file) => this.walk(`${currentPath}/${file.name}`, addon))
        ));

        const files = entries.filter((entry: Dirent) => entry.isFile() && !entry.name.endsWith('.zsync'));
        const fileInfos = await Promise.all(files.map((file: Dirent) => this.limit(async () => {
            const filePath = `${currentPath}/${file.name}`;
            const hash = await getFileHasher().hash(filePath);
            const fileStat = await promisify(stat)(filePath);
            return {hash, size: fileStat.size};
        })));

        const leafDtos: SyncTreeLeaf[] = fileInfos.map(({hash, size}, idx) => {
            return new SyncTreeLeaf(
                files[idx].name,
                addon,
                subPath + '/' + files[idx].name,
                hash === 'da39a3ee5e6b4b0d3255bfef95601890afd80709' ? '0' : hash, // thats the hash for an empty file, apparently
                size,
            );
        });

        return new SyncTreeBranch(
            name,
            subPath,
            isAddon,
            directoryDtos,
            toNameMap(leafDtos),
        );
    }
}
