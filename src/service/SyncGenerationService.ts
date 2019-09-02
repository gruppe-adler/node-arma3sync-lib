import {A3sSyncTreeDirectoryDto, A3sSyncTreeLeafDto} from '../model/a3sSync';
import * as crypto from 'crypto'
import {createReadStream, Dirent, readdir, stat} from 'fs'
import {promisify} from 'util';
import {Path} from '../util/aliases';

function checkPath(subDir: Path) {
    if (!subDir.startsWith('/')) {
        throw new Error('subdir needs to be absolute on repo path – and start with "/"!');
    }
}

export class SyncGenerationService {
    constructor(private repoPath: string) {
    }

    public generateSync(): Promise<A3sSyncTreeDirectoryDto> {
        return this.walk(this.repoPath);
    }

    public generatePartialSync(subDir: Path): Promise<A3sSyncTreeDirectoryDto> {
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

    private async walk(currentPath: string): Promise<A3sSyncTreeDirectoryDto> {
        const subPath = currentPath.slice(this.repoPath.length);
        const name = subPath.split('/').pop() || 'racine';
        const tree: A3sSyncTreeDirectoryDto = {
            deleted: false,
            hidden: false,
            markAsAddon: name.startsWith('@'),
            updated: false,
            list: [],
            name,
        };

        let entries: Dirent[] = [];
        try {
            entries = await promisify(readdir)(currentPath, {withFileTypes: true});
        } catch (e) {
            console.error(e.message);
            return Promise.reject(e);
        }
        const files = entries.filter((entry: Dirent) => entry.isFile() && !entry.name.endsWith('.zsync'));
        const dataDirectories = entries.filter((file) => file.isDirectory() && file.name !== '.a3s');

        const allFileHashes = await Promise.all(
            files.map((file: Dirent) => {
                return this.hash(currentPath + '/' + file.name);
            })
        );
        const fileSizes = await Promise.all(files.map((file: Dirent) => {
            return promisify(stat)(currentPath + '/' + file.name)
        }));
        const leafDtos: (A3sSyncTreeLeafDto | A3sSyncTreeDirectoryDto)[] = allFileHashes.map((hash, idx) => {
            return {
                compressed: false,
                compressedSize: 0,
                deleted: false,
                size: fileSizes[idx].size,
                updated: false,
                name: files[idx].name,
                sha1: hash,
            };
        });
        const directoryDtos: (A3sSyncTreeLeafDto | A3sSyncTreeDirectoryDto)[] = await Promise.all(
            dataDirectories.map((file) => this.walk(currentPath + '/' + file.name))
        );
        tree.list = directoryDtos.concat(leafDtos);

        return tree;
    }
}
