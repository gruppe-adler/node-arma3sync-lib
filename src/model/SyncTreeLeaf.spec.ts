import {SyncTreeLeaf} from './SyncTreeLeaf';

describe(SyncTreeLeaf.name, () => {
    it('transforms into dto', () => {
        const leaf = new SyncTreeLeaf('foo.file', '', '/', 'somesha', 42);

        expect(leaf.toDto().size).toBe(42);
    });
});
