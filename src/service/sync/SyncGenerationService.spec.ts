import {SyncGenerationService} from './SyncGenerationService';
import {readFileSync, unlinkSync, symlinkSync} from 'fs';
import {SyncTreeBranch} from '../../model/SyncTreeBranch';

const a3sExampleModsDir = __dirname + '/../../../resources/test/repo';
const testSyncJsonFile = __dirname + '/../../../resources/test/sync-deserialized.json';
const exampleSync = JSON.parse(readFileSync(testSyncJsonFile).toString());

describe(SyncGenerationService.name, () => {
    describe('generateSync', function () {
        const service = new SyncGenerationService(a3sExampleModsDir);
        const generatingSync = service.generateSync();
        it('walks the directory tree', async (done) => {
            const sync = await generatingSync;

            expect(sync).toBeTruthy();
            expect(sync.isAddon).toBeFalsy();
            expect(sync.name).toBe('');
            expect(Object.keys(sync.branches)).toHaveLength(2);
            expect(sync.branches['@tfar_autoswitch'].name).toBe('@tfar_autoswitch');
            const tfar = sync.branches['@tfar_autoswitch'] as SyncTreeBranch;
            expect(tfar.isAddon).toBe(true);
            const addons = tfar.branches['addons'] as SyncTreeBranch;
            expect(addons).toBeInstanceOf(SyncTreeBranch);
            expect(addons.isAddon).toBe(false);
            done();
        });
        it('follows symlinks!', async (done) => {
            const sync = await generatingSync;

            expect(sync).toBeTruthy();
            expect(sync.branches['@symlinkedMod']).toBeInstanceOf(SyncTreeBranch);
            expect(sync.branches['@symlinkedMod'].name).toBe('@symlinkedMod');
            expect(sync.branches['@symlinkedMod'].isAddon).toBe(true);
            expect(sync.branches['@symlinkedMod'].branches['addons'].name).toBe('addons');
            done();
        });
        it('follows symlinks and correctly sha1s an empty file to "0" (yeah thats stupid)', async (done) => {
            const sync = await generatingSync;

            expect(sync).toBeTruthy();
            expect(sync.branches['@symlinkedMod'].name).toBe('@symlinkedMod');
            expect(sync.branches['@symlinkedMod'].branches['addons'].leaves['foo'].sha1).toBe("0");
            done();
        });
        it('lists & checksums files', async (done) => {
            const sync: SyncTreeBranch = await generatingSync;
            const addons = sync.branches['@tfar_autoswitch'].branches['addons'];
            expect(addons).toBeInstanceOf(SyncTreeBranch);
            expect(addons.leaves['tfar_autoswitch.pbo'].name).toEqual("tfar_autoswitch.pbo");
            expect(addons.leaves['tfar_autoswitch.pbo'].sha1).toBe("ee33a9355460a034896ba06a545fdae14e54c70f");
            expect(addons.leaves['tfar_autoswitch.pbo'].size).toBe(2144);
            const modCpp = sync.branches['@tfar_autoswitch'].leaves['mod.cpp'];
            expect(modCpp.size).toBe(192);
            expect(modCpp.sha1).toBe("fbfdc8d4006332b93c0a1bc913f96346919ea576");

            done();
        });
        it('perfectly reproduces the test file', async (done) => {
            const sync = await generatingSync;
            expect(sync).toEqual(SyncTreeBranch.fromSyncTreeRoot(exampleSync));
            done();
        });
        it('declares an empty file to have a sha1 of "0" (yes thats how Arma3Sync does it)', async (done) => {
            const sync = await generatingSync;
            const tfar = sync.branches['@tfar_autoswitch'];
            const emptyFile = tfar.leaves['emptyFile.md'];

            expect(emptyFile.size).toBe(0);
            expect(emptyFile.sha1).toBe("0");
            done();
        });
    });
    describe('generateSync#brokenLink', () => {
        beforeEach(() => {
            symlinkSync('/tmp/i-most-definitely-do-not-exist' + Math.random(), `${a3sExampleModsDir}/@doesNotExist`);
        });
        afterEach(() => {
            unlinkSync(`${a3sExampleModsDir}/@doesNotExist`);
        });
        it('does not fail if symlink target does not exist', async () => {
            const service = new SyncGenerationService(a3sExampleModsDir);
            await expect(service.generateSync()).resolves.toBeTruthy();
        });
        it('does not list symlink target that does not exist', async () => {
            const service = new SyncGenerationService(a3sExampleModsDir);
            const sync = await service.generateSync();

            expect(sync.branches['@doesNotExist']).toBeFalsy();
        });
    });
});
