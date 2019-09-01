import {SyncGenerationService} from './SyncGenerationService';
import {A3sSyncTreeDirectoryDto, A3sSyncTreeLeafDto} from '../model/a3sSync';
import {readFileSync} from "fs";

const a3sExampleModsDir = __dirname + '/../../resources/test/repo';
const testSyncJsonFile = __dirname + '/../../resources/test/sync-deserialized.json';
const exampleSync = JSON.parse(readFileSync(testSyncJsonFile).toString());

describe(SyncGenerationService.name, () => {
    describe('generateSync', function () {
        const service = new SyncGenerationService(a3sExampleModsDir);
        const generatingSync = service.generateSync();
        it('walks the directory tree', async (done) => {
            const sync = await generatingSync;

            expect(sync).toBeTruthy();
            expect(sync.markAsAddon).toBeFalsy();
            expect(sync.name).toBe('racine');
            expect(sync.list).toHaveLength(1);
            expect(sync.list[0].name).toBe('@tfar_autoswitch');
            const tfar = sync.list[0] as A3sSyncTreeDirectoryDto;
            expect(tfar.markAsAddon).toBe(true);
            const addons = tfar.list.find(a => a.name === 'addons') as A3sSyncTreeDirectoryDto;
            expect(addons.list).toBeTruthy();
            expect(addons.markAsAddon).toBe(false);
            done();
        });
        it('lists & checksums files', async (done) => {
            const sync: any = await generatingSync;
            const addons = sync.list[0].list.find(a => a.name === 'addons') as A3sSyncTreeDirectoryDto;
            expect(addons).toBeTruthy();
            expect(addons.list[0].name).toEqual("tfar_autoswitch.pbo");
            expect(addons.list[0]['sha1']).toBe("ee33a9355460a034896ba06a545fdae14e54c70f");
            expect(addons.list[0]['size']).toBe(2144);
            const modCpp = sync.list[0].list.find(a => a.name === 'mod.cpp') as A3sSyncTreeLeafDto;
            expect(modCpp.size).toBe(192);

            expect(modCpp.sha1).toBe("fbfdc8d4006332b93c0a1bc913f96346919ea576");

            done();
        });
        it('perfectly reproduces the test file', async (done) => {
            const sync = await generatingSync;
            expect(sync).toEqual(exampleSync);
            done();
        });
        it('declares an empty file to have a sha1 of "0" (yes thats how Arma3Sync does it)', async (done) => {
            const sync = await generatingSync;
            const tfar: A3sSyncTreeDirectoryDto = sync.list.find(dir => dir.name === '@tfar_autoswitch') as A3sSyncTreeDirectoryDto;
            const emptyFile: A3sSyncTreeLeafDto = tfar.list.find(file => file.name === 'emptyFile.md') as A3sSyncTreeLeafDto;

            expect(emptyFile.size).toBe(0);
            expect(emptyFile.sha1).toBe("0");
            done();
        })
    });
});
