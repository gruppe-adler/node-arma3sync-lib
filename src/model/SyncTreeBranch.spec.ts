import {SyncTreeBranch} from './SyncTreeBranch';

const exampleTree = {
    name: 'foo',
    list: [
        {
            name: 'bar',
            sha1: 'something',
            size: 42,
            compressedSize: 0,
            compressed: false,
            deleted: false,
            updated: false,
        },
        {
            name: 'addons',
            list: [],
            updated: false,
            hidden: false,
            deleted: false,
            markAsAddon: false
        }
    ],
    updated: false,
    hidden: false,
    deleted: false,
    markAsAddon: true,
};

describe(SyncTreeBranch.name, () => {
    describe('fromSyncTreeDirectoryDto', () => {
        it('creates leaves and branches according to its list', () => {
            const branch = SyncTreeBranch.fromSyncTreeDirectoryDto(exampleTree, '/path', 'blub');
            expect(Object.keys(branch.leaves)).toHaveLength(1);
            expect(branch.leaves['bar'].name).toBe('bar');
            expect(branch.leaves['bar'].path).toBe('/path/foo/bar');
            expect(Object.keys(branch.branches)).toHaveLength(1);
            expect(branch.branches['addons'].name).toBe('addons');
            expect(branch.branches['addons'].path).toBe('/path/foo/addons');
        });
        it('passes on its own name as addon, if marked as addon', () => {
            const branch = SyncTreeBranch.fromSyncTreeDirectoryDto(exampleTree, '/path', 'blub');
            expect(branch.leaves['bar'].addon).toBe('foo');
        });
    })
});
