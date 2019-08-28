import {readFileSync} from 'fs';
import {A3sSyncTreeDirectoryDto, stripCircularReferences} from './model/a3sSync';
import {A3sDirectory} from './A3sDirectory';

const a3sExamplesDir = __dirname + '/../resources/test/a3s';

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
    const exampleSync = {
        'deleted': false,
        'hidden': false,
        'list': [{
            'deleted': false,
            'hidden': false,
            'list': [
                {
                    'deleted': false,
                    'hidden': false,
                    'list': [
                        {
                            'compressed': false,
                            'compressedSize': 0,
                            'deleted': false,
                            'name': 'tfar_autoswitch.pbo',
                            'sha1': 'ee33a9355460a034896ba06a545fdae14e54c70f',
                            'size': 2144,
                            'updated': false,
                        },
                    ],
                    'markAsAddon': false,
                    'name': 'addons',
                    'updated': false,
                },
                {
                    'compressed': false,
                    'compressedSize': 0,
                    'deleted': false,
                    'name': 'mod.cpp',
                    'sha1': 'fbfdc8d4006332b93c0a1bc913f96346919ea576',
                    'size': 192,
                    'updated': false,
                },
            ],
            'markAsAddon': true,
            'name': '@tfar_autoswitch',
            'updated': false,
        },
        ],
        'markAsAddon': false,
        'name': 'racine',
        'updated': false,
    };
    if (withParent) {
        addParents(exampleSync);
    }
    return exampleSync
}

describe(A3sDirectory.name, () => {
    const examplesDirectory = new A3sDirectory(a3sExamplesDir);
    describe('setEvents', () => {
        it('aaand saving events will produce the same file again', (done) => {
            const access = new A3sDirectory('/tmp');
            const expectedFile = readFileSync(a3sExamplesDir + '/events');
            const expectedSize = expectedFile.length;
            const events = {
                list: [{
                    name: 'foo',
                    description: 'bar',
                    addonNames: {},
                    userconfigFolderNames: {}

                }, {
                    name: 'event 2',
                    description: 'event 3',
                    addonNames: {
                        'GM': false,
                        '@tfar_autoswitch': false,
                    },
                    userconfigFolderNames: {}

                }]
            };
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
