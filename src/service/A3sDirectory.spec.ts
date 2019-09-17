import {readFileSync} from 'fs';
import {A3sSyncTreeDirectoryDto, stripCircularReferences} from '../model/a3sSync';
import {A3sDirectory} from './A3sDirectory';
import {A3sEventsDto} from '../model/A3sEventsDto';
import {A3sServerInfoDto} from '../model/A3sServerInfoDto';
import {A3sChangelogsDto} from '../model/A3sChangelogsDto';
import {A3sAutoconfigDto} from '../dto/A3sAutoconfigDto';
import {util} from 'config';
import {SyncTreeBranch} from '../model/SyncTreeBranch';

util.setModuleDefaults("arma3sync-lib", {
    repoPath: '/var/lib/repo',
    publicURL: 'http://foo'
});

const a3sExamplesDir = __dirname + '/../../resources/test/repo/.a3s';
const testSyncJsonFile = __dirname + '/../../resources/test/sync-deserialized.json';
const testEventsJsonFile = __dirname + '/../../resources/test/events-deserialized.json';
const testServerInfoJsonFile = __dirname + '/../../resources/test/serverinfo-deserialized.json';
const testChangelogJsonFile = __dirname + '/../../resources/test/changelog-deserialized.json';
const testAutoconfigJsonFile = __dirname + '/../../resources/test/autoconfig-deserialized.json';

Error.stackTraceLimit = 50;

function addParents(obj) {
    obj.parent = null;
    Object.getOwnPropertyNames(obj).forEach(name => {
        if (obj[name] && typeof obj[name] === 'object') {
            addParents(obj[name]);
            obj[name].parent = obj;
        }
    });
}

function getExampleSync(withParent: boolean = false): A3sSyncTreeDirectoryDto {
    const exampleSync = JSON.parse(readFileSync(testSyncJsonFile).toString());
    if (withParent) {
        addParents(exampleSync);
    }
    return exampleSync
}

function getExampleEvents(): A3sEventsDto {
    return JSON.parse(readFileSync(testEventsJsonFile).toString());
}

function getExampleServerInfo(): A3sServerInfoDto {
    const exampleServerInfo = JSON.parse(readFileSync(testServerInfoJsonFile).toString()) as A3sServerInfoDto;
    exampleServerInfo.buildDate = new Date(exampleServerInfo.buildDate);

    return exampleServerInfo;
}

function getExampleChangelogs(): A3sChangelogsDto {
    const changelogs = JSON.parse(readFileSync(testChangelogJsonFile).toString()) as A3sChangelogsDto;
    changelogs.list.forEach(changelog => {
        changelog.buildDate = new Date(changelog.buildDate);
    });

    return changelogs;
}

function getExampleAutoconfig(): A3sAutoconfigDto {
    return JSON.parse(readFileSync(testAutoconfigJsonFile).toString()) as A3sAutoconfigDto;
}


describe(A3sDirectory.name, () => {
    const examplesDirectory = new A3sDirectory(a3sExamplesDir);
    describe('setEvents', () => {
        it('aaand saving events will produce the same file again', (done) => {
            const access = new A3sDirectory('/tmp');
            const expectedFile = readFileSync(a3sExamplesDir + '/events');
            const expectedSize = expectedFile.length;
            const events: A3sEventsDto = getExampleEvents();
            access.setEvents(events).then(() => {
                const actualFile = readFileSync('/tmp/events');
                expect(actualFile.length).toBeGreaterThan(expectedSize / 2);
                expect(actualFile.length).toBeLessThan(expectedSize * 2);

                access.getEvents().then(writtenAndReReadEvents => {
                    expect(writtenAndReReadEvents).toEqual(events);
                    done();
                });
            });
        });
    });
    describe('getEvents', () => {
        it('gets events from example file', (done) => {
            examplesDirectory.getEvents().then(events => {
                expect(events).toHaveProperty('list');
                expect(events.list.length).toBeGreaterThan(0);
                expect(events.list[0].name).toBe('foo');
                expect(events.list[1].name).toBe('event 2');
                expect(events.list[1].addonNames).toStrictEqual({'@tfar_autoswitch': false, GM: false});
                done();
            });
        });
    });

    describe('getRawSync', function () {
        it('reads the example sync file', async () => {
            const sync: A3sSyncTreeDirectoryDto = await examplesDirectory.getRawSync();

            stripCircularReferences(sync);

            expect(sync).toEqual(getExampleSync());
        })
    });

    describe('getSync', () => {
        it('skips on the /racine as root name', async (done) => {
            const sync: SyncTreeBranch = await examplesDirectory.getSync();
            expect(sync.name).toBe('');
            expect(sync.path).toBe('');
            expect(sync.branches['@tfar_autoswitch'].name).toBe('@tfar_autoswitch');
            expect(sync.branches['@tfar_autoswitch'].path).toBe('/@tfar_autoswitch');
            done();
        });
    });

    describe('setSync', () => {
        it('nicely puts everything into the dto etc', async (done) => {
            const sync: SyncTreeBranch = await examplesDirectory.getSync();

            const dtoTree = sync.toDto();

            expect(dtoTree).toEqual(getExampleSync());

            done();
        });
    });

    describe('setRawSync', () => {
        it('works', (done) => {
            const access = new A3sDirectory('/tmp');
            access.setRawSync(getExampleSync()).then(result => {
                // re-read to check
                access.getRawSync().then((writtenSync) => {
                    stripCircularReferences(writtenSync);
                    expect(writtenSync).toEqual(getExampleSync());
                    done();
                });
            });
        });
    });

    describe('getServerInfo', () => {
        it('does shit', async (done) => {
            const serverInfo = await examplesDirectory.getServerInfo();
            expect(serverInfo).toEqual(getExampleServerInfo());

            done();
        });
    });
    describe('setServerInfo', () => {
        it('does shit', async (done) => {
            const access = new A3sDirectory('/tmp');
            const serverInfo: A3sServerInfoDto = getExampleServerInfo();

            await access.setServerInfo(serverInfo);
            const reReadServerInfo = await access.getServerInfo();
            expect(reReadServerInfo).toEqual(getExampleServerInfo());
            done();
        });
    });

    describe('setChangelogs', () => {
        it('writes changelog entries', async (done) => {
            const access = new A3sDirectory('/tmp');
            const changelogs: A3sChangelogsDto = getExampleChangelogs();

            await access.setChangelogs(changelogs);
            const reReadChangelog = await access.getChangelogs();
            expect(reReadChangelog).toEqual(getExampleChangelogs());
            done();
        });
    });

    describe('setAutoconfig', () => {
        it('writes autoconfig', async (done) => {
            const access = new A3sDirectory('/tmp');
            const autoconfig = getExampleAutoconfig();
            await access.setAutoconfig(autoconfig);
            const reReadAutoconfig = await access.getAutoconfig();
            expect(reReadAutoconfig).toEqual(getExampleAutoconfig());
            done();
        });
    });
});
