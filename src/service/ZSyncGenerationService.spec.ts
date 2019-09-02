import {ZSyncGenerationService} from './ZSyncGenerationService';

describe(ZSyncGenerationService.name, () => {

    let args;
    let service;

    beforeEach(() => {
        args = [];

    });

    it('executes correct cmdline', (done) => {
        service = new ZSyncGenerationService(
            'http://foo',
            '/var/lib/foo',
            function () {  args.push(arguments); return Promise.resolve({stdout: [], stderr: []}); },
        );
        service.generateZsyncs('/@mod/x.pbo').then(() => {
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
        service.generateZsyncs('/@mod/x.pbo').then(() => { fail('bad!'); done();} ).catch((res) => {
            expect(res.stdout.toString()).toEqual('aaaah');
            done();
        });
    });
});
