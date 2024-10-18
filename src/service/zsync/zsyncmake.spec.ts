import {zsyncmake, zsyncmakeWithExec} from './zsyncmake';
import {util} from 'config';

util.setModuleDefaults("arma3sync-lib", {
    repoPath: '/var/lib/repo',
    publicURL: 'http://foo'
});

describe(zsyncmake.name, () => {
    it('creates good command line', async (done) => {
        let cmdLine = '';

        await zsyncmakeWithExec('/needs-update', (cmd, callback) => {cmdLine = cmd; callback(null, {stdout: '', stderr: ''});});

        expect(cmdLine).toBe("zsyncmake -eu 'http://foo/needs-update' -o '/var/lib/repo/needs-update.zsync' '/var/lib/repo/needs-update'");
        done();
    })
});
