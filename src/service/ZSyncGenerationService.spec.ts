import {ZSyncGenerationService} from './ZSyncGenerationService';
import {writeFileSync, mkdirSync, readdirSync} from 'fs';

describe(ZSyncGenerationService.name, () => {

    let args;
    let service: ZSyncGenerationService;

    beforeEach(() => {
        args = [];
    });

    describe('writeSingle', () => {

        it('executes correct cmdline', (done) => {
            service = new ZSyncGenerationService(
                'http://foo',
                '/var/lib/foo',
                function () {  args.push(arguments); return Promise.resolve({stdout: [], stderr: []}); },
            );
            service.writeSingle('/@mod/x.pbo').then(() => {
                expect(args).toHaveLength(1);
                expect(args[0]).toHaveLength(1);
                expect(args[0][0]).toEqual('zsyncmake -eu http://foo/@mod/x.pbo /var/lib/foo/@mod/x.pbo -o /var/lib/foo/@mod/x.pbo.zsync');
                done();
            });
        });
        it('fails when the command fails', (done) => {
            service = new ZSyncGenerationService(
                'http://foo',
                '/var/lib/foo',
                function () {  args.push(arguments); return Promise.reject({stdout: ['aaaah'], stderr: []}); },
            );
            service.writeSingle('/@mod/x.pbo').then(() => { fail('bad!'); done();} ).catch((res) => {
                expect(res.stdout.toString()).toEqual('aaaah');
                done();
            });
        });
    });
    describe('clearAll', () => {
        it('recursively deletes everything named *.zsync', async (done) => {
            let dir = `/tmp/node-arma3sync-lib-${Date.now()}`;
            mkdirSync(dir);
            mkdirSync(`${dir}/foo`);
            mkdirSync(`${dir}/foo/bar`);
            writeFileSync(`${dir}/a`, 'datafile');
            writeFileSync(`${dir}/a.zsync`, 'datafile');
            writeFileSync(`${dir}/foo/b.pbo`, 'datafile');
            writeFileSync(`${dir}/foo/x.zsync`, 'datafile');
            writeFileSync(`${dir}/foo/bar/xxx.sync`, 'datafile');
            writeFileSync(`${dir}/foo/bar/.zsync`, 'datafile');

            const nDeleted = await service.clear(dir);

            expect(nDeleted).toBe(3);

            expect(readdirSync(dir)).toEqual(['a', 'foo']);
            expect(readdirSync(`${dir}/foo`)).toEqual(['b.pbo', 'bar']);
            expect(readdirSync(`${dir}/foo/bar`)).toEqual(['xxx.sync']);

            done();
        });
    });
});
