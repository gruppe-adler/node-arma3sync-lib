import {SHA1FileHasher} from './SHA1FileHasher';
import {mkdtempSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';

describe(SHA1FileHasher.name, () => {
    let dir: string;
    const hasher = new SHA1FileHasher();

    beforeAll(() => {
        dir = mkdtempSync(`${tmpdir()}/sha1-`);
        writeFileSync(`${dir}/abc`, 'abc');
        writeFileSync(`${dir}/empty`, '');
    });

    it('hashes file contents', async () => {
        await expect(hasher.hash(`${dir}/abc`)).resolves.toBe('a9993e364706816aba3e25717850c26c9cd0d89d');
    });
    it('hashes empty files', async () => {
        await expect(hasher.hash(`${dir}/empty`)).resolves.toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
    });
    it('rejects when the file cannot be read', async () => {
        await expect(hasher.hash(`${dir}/does-not-exist`)).rejects.toMatchObject({code: 'ENOENT'});
    });
    it('rejects when the path is a directory', async () => {
        await expect(hasher.hash(dir)).rejects.toMatchObject({code: 'EISDIR'});
    });
});
