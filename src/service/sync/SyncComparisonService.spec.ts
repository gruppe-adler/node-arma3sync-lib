import {
    fileCount,
    fileDiff,
    FileDiffResult, FileSizeResult,
    modDiff,
    ModDiffResult,
    SyncComparisonService
} from './SyncComparisonService';
import {ComparisonContext} from './ComparisonContext';
import {SyncTreeLeaf} from '../../model/SyncTreeLeaf';
import {SyncTreeBranch} from '../../model/SyncTreeBranch';

const emptyTree = SyncTreeBranch.root({}, {});

describe(SyncComparisonService.name, () => {
    let service;

    beforeEach(() => {
        service = new SyncComparisonService();
    });

    describe('compare', () => {
        it('returns promise', () => {
            const emitter = service.compare(emptyTree, emptyTree);
            expect(emitter).toBeInstanceOf(Promise);
        });
        it('returns return value of modDiff and fileDiff', async () => {
            const modDiffResult = new ModDiffResult([], [], [], []);
            const fileDiffResult = new FileDiffResult([], [], []);
            service.modDiff = jest.fn(() => modDiffResult);
            service.fileDiff = jest.fn(() => fileDiffResult);
            const result = await service.compare(emptyTree, emptyTree);
            expect(result.files).toBe(fileDiffResult);
            expect(result.mods).toBe(modDiffResult);
        });
    });
});

async function runDiffTest<T>(
    comparisonContexts: ComparisonContext[],
    expectations: (result: T) => void,
    done: () => void,
    diffFunction: (ComparisonContext) => Promise<T>
) {
    let modDiffCb: (comparisonContext: ComparisonContext) => void;
    let modDiffEnd: () => void;
    const stream = {
        onLeaf: jest.fn((cb: (comparisonContext: ComparisonContext) => void) => {
            modDiffCb = cb;
        }),
        onEnd: jest.fn((cb: () => void) => {
            modDiffEnd = cb;
        }),
    };
    const promise: Promise<T> = diffFunction(stream as any);

    expect(stream.onLeaf).toHaveBeenCalledTimes(1);
    expect(modDiffCb).toBeTruthy();
    expect(modDiffEnd).toBeTruthy();

    comparisonContexts.forEach(comparisonContext => {
        modDiffCb(comparisonContext);
    });

    modDiffEnd();
    const result: T = await promise;

    expect(stream.onEnd).toHaveBeenCalledTimes(1);

    expectations(result);

    done();
}


describe(modDiff.name, () => {

    it('recognizes removed mods', async (done) => {
        runDiffTest(
            [{
                a: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 42),
                b: null,
            }],
            (result) => {
                expect(result.deletedMods).toEqual(['@ace']);
                expect(result.changedMods).toEqual([]);
                expect(result.newMods).toEqual([]);
            }, done, modDiff);
    });
    it('recognizes identical files', (done) => {
        runDiffTest([{
            a: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 42),
            b: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 42),
        }], (result: ModDiffResult) => {
            expect(result.changedMods).toEqual([]);
            expect(result.newMods).toEqual([]);
            expect(result.deletedMods).toEqual([]);
        }, done, modDiff);
    });
    it('recognizes new mods', (done) => {
        runDiffTest([{
            a: null,
            b: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 42),
        }], (result: ModDiffResult) => {
            expect(result.changedMods).toEqual([]);
            expect(result.newMods).toEqual(['@ace']);
        }, done, modDiff);
    });
    it('recognizes changes within a file', (done) => {
        runDiffTest([{
            a: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something-else', 45),
            b: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 42),
        }], (result: ModDiffResult) => {
            expect(result.changedMods).toEqual(['@ace']);
            expect(result.newMods).toEqual([]);
            expect(result.deletedMods).toEqual([]);
        }, done, modDiff);
    });
    it('recognizes changes in file locations', (done) => {
        runDiffTest([{
            a: null,
            b: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 42),
        }, {
            a: new SyncTreeLeaf('y.file', '@ace', '/@ace/y.file', 'something-else', 45),
            b: null
        }], (result: ModDiffResult) => {
            expect(result.changedMods).toEqual(['@ace']);
            expect(result.newMods).toEqual([]);
            expect(result.deletedMods).toEqual([]);
        }, done, modDiff);
    });
    it('properly handles existance of addons folder', (done) => {
        runDiffTest([{
            a: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 42),
            b: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 42),
        }], (result: ModDiffResult) => {
            expect(result.changedMods).toEqual([]);
            expect(result.newMods).toEqual([]);
        }, done, modDiff);
    });
    it('properly handles lack of addons folder', (done) => {
        runDiffTest([{
            a: new SyncTreeLeaf('x.file', '', '/@ace/x.file', 'something', 42),
            b: new SyncTreeLeaf('x.file', '', '/@ace/x.file', 'something', 42),
        }], (result: ModDiffResult) => {
            expect(result.changedMods).toEqual([]);
            expect(result.newMods).toEqual([]);
        }, done, modDiff);
    });
    it('properly handles addition of addons folder', (done) => {
        runDiffTest([{
            a: new SyncTreeLeaf('x.file', '', '/@ace/x.file', 'something', 42),
            b: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 42),
        }], (result: ModDiffResult) => {
            expect(result.changedMods).toEqual([]);
            expect(result.newMods).toEqual([]);
        }, done, modDiff);
    });
    it('properly handles removal of addons folder', (done) => {
        runDiffTest([{
            a: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 42),
            b: new SyncTreeLeaf('x.file', '', '/@ace/x.file', 'something', 42),
        }], (result: ModDiffResult) => {
            expect(result.changedMods).toEqual([]);
            expect(result.newMods).toEqual([]);
        }, done, modDiff);
    });
    it('properly aggregates over lots of comparisons', (done) => {
        runDiffTest([
            {
                a: null,
                b: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 42),
            },
            {
                a: null,
                b: new SyncTreeLeaf('y.file', '@ace', '/@ace/y.file', 'something-else', 45),
            },
            {
                a: new SyncTreeLeaf('z.file', '@ace', '/@ace/z.file', 'something-else-yet', 45),
                b: new SyncTreeLeaf('z.file', '@ace', '/@ace/z.file', 'something-else-yet', 45),
            },
            {
                a: new SyncTreeLeaf('z.file', '@foo', '/@foo/addons/z.file', 'something-else-yet-still', 45),
                b: null
            },
            ], (result: ModDiffResult) => {
            expect(result.changedMods).toEqual(['@ace']);
            expect(result.deletedMods).toEqual(['@foo']);
        }, done, modDiff);
    });
});

describe(fileDiff.name, () => {

    it('starts every count with zero', (done) => {
        runDiffTest(
            [],
            (result: FileDiffResult) => {
                expect(result.changedFiles).toHaveLength(0);
                expect(result.newFiles).toHaveLength(0);
                expect(result.deletedFiles).toHaveLength(0);
            },
            done, fileDiff
        );
    });
    it('counts correctly new,changed and deleted', (done) => {
        runDiffTest(
            [
                {
                    a: null,
                    b: new SyncTreeLeaf('a.file', '@ace', '/@ace/a.file', 'something', 45),
                },
                {
                    a: null,
                    b: new SyncTreeLeaf('b.file', '@ace', '/@ace/b.file', 'something', 45),
                },
                {
                    a: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 45),
                    b: null,
                },
                {
                    a: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something', 45),
                    b: new SyncTreeLeaf('x.file', '@ace', '/@ace/x.file', 'something-else', 48),
                },

            ],
            (result: FileDiffResult) => {
                expect(result.changedFiles).toHaveLength(1);
                expect(result.newFiles).toHaveLength(2);
                expect(result.deletedFiles).toHaveLength(1);
            },
            done, fileDiff);
    });
});

describe(fileCount.name, () => {
    it('sums up old and new files separately', (done) => {
        runDiffTest([{
            a: null,
            b: new SyncTreeLeaf('', '', '', '', 1),
        }, {
            a: null,
            b: new SyncTreeLeaf('', '', '', '', 2),
        }, {
            a: new SyncTreeLeaf('', '', '', '', 4),
            b: null,
        }], (result: FileSizeResult) => {
            expect(result.totalCount.a).toBe(1);
            expect(result.totalCount.b).toBe(2);

            expect(result.totalSize.a).toBe(4);
            expect(result.totalSize.b).toBe(3);
        }, done, fileCount);
    });
    it('starts at 0', (done) => {
        runDiffTest([], (result: FileSizeResult) => {
            expect(result.totalSize.a).toBe(0);
            expect(result.totalSize.b).toBe(0);
            expect(result.totalCount.a).toBe(0);
            expect(result.totalCount.b).toBe(0);
        }, done, fileCount);
    });
});
