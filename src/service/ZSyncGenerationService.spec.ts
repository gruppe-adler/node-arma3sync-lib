import {UpdateResult, ZSyncGenerationService} from './ZSyncGenerationService';
import {readdirSync, statSync} from 'fs';
import {TODO} from '../util/funcs';
import {ncp} from 'ncp';
import {utimesSync} from 'fs';
import {promisify} from 'util';

const stoneAge = new Date('1981-10-11');
const notOld = new Date('1996-12-30');


async function prepareFixture(): Promise<string> {
    const tmp = `/tmp/${Math.random()}`;
    await promisify(ncp)(__dirname + '/../../resources/test/zsync-mock-fs', tmp);
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

    xdescribe('writeSingle', () => {

        it('executes correct cmdline', (done) => {
            let service = new ZSyncGenerationService(
                'http://foo',
                '/var/lib/foo',
                function () {
                    args.push(arguments);
                    return Promise.resolve({stdout: [], stderr: []});
                },
            );
            service.writeSingle('/@mod/x.pbo').then(() => {
                expect(args).toHaveLength(1);
                expect(args[0]).toHaveLength(1);
                expect(args[0][0]).toEqual('zsyncmake -eu http://foo/@mod/x.pbo /var/lib/foo/@mod/x.pbo -o /var/lib/foo/@mod/x.pbo.zsync');
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
    xdescribe('clearAll', () => {

        it('recursively deletes everything named *.zsync', async (done) => {
            const dir = await prepareFixture();

            let service = new ZSyncGenerationService(
                'http://foo',
                dir,
                function () {
                    args.push(arguments);
                    return Promise.resolve({stdout: [], stderr: []});
                },
            );

            const nDeleted = await service.clear('/');

            expect(nDeleted).toBe(4);

            expect(readdirSync(`${dir}/`)).toEqual(['does-not-need-update', 'does-not-need-update2', 'foo']);
            expect(readdirSync(`${dir}/foo`)).toEqual(['bar', 'missing']);
            expect(readdirSync(`${dir}/foo/bar`)).toEqual(['needs-update']);

            done();
        });
    });

    describe('update', () => {

        let service;
        let dir;
        beforeEach(async (done) => {
            dir = await prepareFixture();
            service = new ZSyncGenerationService(
                'http://foo',
                dir,
                function () {
                    args.push(arguments);
                    return Promise.resolve({stdout: [], stderr: []});
                },
            );
            done();
        });

        it('returns good create/update/delete/skip counts', async (done) => {
            const counts = await service.update('');
            expect(counts).toEqual(new UpdateResult(1, 1, 1, 2));
            done();
        });

        it('updates files older than certain date', async (done) => {
            await service.update('');
            expect(args[0]).toContain(`zsyncmake -eu http://foo/foo/bar/needs-update ${dir}/foo/bar/needs-update -o ${dir}/foo/bar/needs-update.zsync`);
            done();
        });
        it('generates missing files', async (done) => {
            await service.update('');
            expect(args[1]).toContain(`zsyncmake -eu http://foo/foo/missing ${dir}/foo/missing -o ${dir}/foo/missing.zsync`);
            done();

        });
    });
});
