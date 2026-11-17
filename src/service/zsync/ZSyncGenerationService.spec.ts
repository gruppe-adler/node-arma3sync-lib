import {UpdateResult, ZSyncGenerationService} from './ZSyncGenerationService';
import {readdirSync, statSync} from 'fs';
import {utimesSync, mkdirSync, writeFileSync, promises as fsPromises} from 'fs';
import {zsyncmake} from './zsyncmake';

const stoneAge = new Date('1981-10-11');
const notOld = new Date('1996-12-30');


async function prepareFixture(): Promise<string> {
    const tmp = `/tmp/${Math.random()}`;
    await fsPromises.cp(__dirname + '/../../../resources/test/zsync-mock-fs', tmp, {recursive: true});
    utimesSync(`${tmp}/does-not-need-update`, stoneAge, stoneAge);
    utimesSync(`${tmp}/does-not-need-update.zsync`, stoneAge, stoneAge);
    utimesSync(`${tmp}/does-not-need-update2`, stoneAge, stoneAge);
    utimesSync(`${tmp}/does-not-need-update2.zsync`, notOld, notOld);
    utimesSync(`${tmp}/foo/missing`, stoneAge, stoneAge);
    utimesSync(`${tmp}/foo/orphaned.zsync`, stoneAge, stoneAge);
    utimesSync(`${tmp}/foo/bar/needs-update.zsync`, stoneAge, stoneAge);
    utimesSync(`${tmp}/foo/bar/needs-update`, notOld, notOld);

    return tmp;
}

describe(ZSyncGenerationService.name, () => {

    let args;
    beforeEach(() => {
        args = [];
    });

    describe('writeSingle', () => {

        it('passes correct value to zsyncmake', (done) => {
            let service = new ZSyncGenerationService(
                'http://foo',
                '/var/lib/foo',
                function () {
                    args.push(arguments);
                    return Promise.resolve();
                },
            );
            service.writeSingle('/@mod/x.pbo').then(() => {
                expect(args).toHaveLength(1);
                expect(args[0]).toHaveLength(1);
                expect(args[0][0]).toEqual('/@mod/x.pbo');
                done();
            });
        });
        it('fails when the command fails', (done) => {
            let service = new ZSyncGenerationService(
                'http://foo',
                '/var/lib/foo',
                function () {
                    args.push(arguments);
                    return Promise.reject({stdout: ['aaaah'], stderr: []});
                },
            );
            service.writeSingle('/@mod/x.pbo').then(() => {
                fail('bad!');
                done();
            }).catch((res) => {
                expect(res.stdout.toString()).toEqual('aaaah');
                done();
            });
        });
    });
    describe('clearAll', () => {

        it('recursively deletes everything named *.zsync', async () => {
            const dir = await prepareFixture();

            let service = new ZSyncGenerationService(
                'http://foo',
                dir,
                zsyncmake,
            );

            const nDeleted = await service.clear('/');

            expect(nDeleted).toBe(4);

            expect(readdirSync(`${dir}/`)).toEqual(['does-not-need-update', 'does-not-need-update2', 'foo']);
            expect(readdirSync(`${dir}/foo`)).toEqual(['bar', 'missing']);
            expect(readdirSync(`${dir}/foo/bar`)).toEqual(['needs-update']);

        });
    });

    describe('update', () => {

        let service;
        let dir;
        beforeEach(async () => {
            dir = await prepareFixture();
            service = new ZSyncGenerationService(
                'http://foo',
                dir,
                function () {
                    args.push(arguments);
                    return Promise.resolve({stdout: [], stderr: []});
                },
            );
        });

        it('returns good create/update/delete/skip counts', async () => {
            const counts = await service.update();
            expect(counts).toEqual(new UpdateResult(1, 1, 1, 2));
        });
        it('updates files older than certain date', async () => {
            await service.update();
            expect(args[0]).toContain('/foo/bar/needs-update');
        });
        it('generates missing files', async () => {
            await service.update();
            expect(args[1]).toContain('/foo/missing');

        });
        it('does *not* walk into the .a3s directory, because that would be stupid', async () => {
            mkdirSync(dir + '/.a3s');
            writeFileSync(dir + '/.a3s/autoconfig', 'foo content');
            await service.update();
            expect(args.every(argset => {
                return argset[0].indexOf('.a3s') === -1;
            })).toBeTruthy();
        });
    });
});
