import {readFileSync} from 'fs';
import {A3sSyncTreeDirectoryDto, stripCircularReferences} from '../model/a3sSync';
import {A3sDirectory} from './A3sDirectory';
import {A3sEventsDto} from '../model/a3sEventsDto';

const a3sExamplesDir = __dirname + '/../../resources/test/repo/.a3s';
const testSyncJsonFile = __dirname + '/../../resources/test/sync-deserialized.json';
const testEventsJsonFile = __dirname + '/../../resources/test/events-deserialized.json';

Error.stackTraceLimit = 50; // TODO

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

    describe('getSync', function () {
        it('reads the example sync file', async () => {
            const sync: A3sSyncTreeDirectoryDto = await examplesDirectory.getSync();

            stripCircularReferences(sync);

            expect(sync).toEqual(getExampleSync());
        })
    });

    describe('setSync', () => {
        it('works', (done) => {
            const access = new A3sDirectory('/tmp');
            access.setSync(getExampleSync()).then(result => {
                // re-read to check
                access.getSync().then((writtenSync) => {
                    stripCircularReferences(writtenSync);
                    expect(writtenSync).toEqual(getExampleSync());
                    done();
                });
            });
        });
    });
});
