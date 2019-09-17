import {ParallelSyncStream} from './ParallelSyncStream';
import {SyncTreeBranch} from '../../model/SyncTreeBranch';
import {SyncTreeLeaf} from '../../model/SyncTreeLeaf';


const emptyTree = new SyncTreeBranch('', '', false, {}, {});

const deepTree = new SyncTreeBranch('', '', false, {
    '@ace': new SyncTreeBranch('@ace', '/@ace', true, {}, {
        'file.file': new SyncTreeLeaf('file.file', '@ace', '/@ace/file.file', 'somehash', 42),
    }),
}, {});

const broadTree = new SyncTreeBranch(
    '',
    '',
    false,
    {
        '@ace': new SyncTreeBranch(
            '@ace',
            '/@ace',
            true,
            {},
            {},
        )
    },
    {
        'file.file': new SyncTreeLeaf(
            'file.file',
            '',
            '/file.file',
            'somehash',
            1337,
        )
    }
);

describe(ParallelSyncStream, () => {
    it('does not emit if given empty roots', (done) => {
        const stream = new ParallelSyncStream(emptyTree, emptyTree);
        let calls = 0;
        stream.onLeaf((comparisonContext) => {
            calls += 1;
        });
        stream.onEnd(() => {
            expect(calls).toBe(0);
            done();
        });
        stream.start();
    });
    it('emits even if one tree does not have the respective node', (done) => {
        const stream = new ParallelSyncStream(deepTree, broadTree);
        const nodeCount = jest.fn();
        stream.onLeaf(nodeCount);
        stream.onEnd(() => {
            expect(nodeCount).toBeCalledTimes(2);

            expect(nodeCount).toHaveBeenCalledWith({
                a: deepTree.branches['@ace'].leaves['file.file'],
                b: null,
            });

            expect(nodeCount).toHaveBeenCalledWith({
                a: null,
                b: broadTree.leaves['file.file'],
            });
            done();
        });
        stream.start();
    });
});
