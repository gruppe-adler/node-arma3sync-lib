import {EventEmitter} from 'events';
import {ComparisonContext} from './ComparisonContext';
import {SyncTreeBranch} from '../../model/SyncTreeBranch';
import {SyncTreeNode} from '../../model/SyncTreeNode';
import {SyncTreeLeaf} from '../../model/SyncTreeLeaf';

export class ParallelSyncStream {
    private emitter = new EventEmitter();
    private locked = false;
    constructor(private a: SyncTreeBranch, private b: SyncTreeBranch) {
    }

    public onLeaf(cb: (comparisonContext: ComparisonContext) => void) {
        if (this.locked) {
            throw new Error('cannot subscribe to running stream');
        }
        this.emitter.on('leaf', cb);
    }

    public onEnd(cb: () => void) {
        if (this.locked) {
            throw new Error('cannot subscribe to running stream');
        }
        this.emitter.on('end', cb);
    }

    public start(): void {
        this.locked = true;
        this.walk(this.a, this.b);
        this.emitter.emit('end');
    }

    private walk(a: SyncTreeNode|null, b: SyncTreeNode|null): void {
        if (a instanceof SyncTreeLeaf || b instanceof SyncTreeLeaf) {
            this.emitter.emit('leaf', {
                a: a instanceof SyncTreeLeaf ? a : null,
                b: b instanceof SyncTreeLeaf ? b : null,
            });
        }
        this.emitter.emit('node', {a, b});
        this.getSubnodeIntersection(a, b).forEach(subNodeName => {
            const aSubnode = ParallelSyncStream.getElementByName(a, subNodeName);
            const bSubnode = ParallelSyncStream.getElementByName(b, subNodeName);
            this.walk(aSubnode, bSubnode);
        });
    }

    private static getElementByName(node: SyncTreeNode, name: string): SyncTreeNode|null {
        if (node instanceof SyncTreeBranch) {
            return node.branches[name] || node.leaves[name] || null;
        }
        return null;
    }

    private getSubnodeIntersection(a: SyncTreeNode|undefined, b: SyncTreeNode|undefined): string[] {
        const namesInA = (a instanceof SyncTreeBranch) ? Object.keys(a.branches).concat(Object.keys(a.leaves)) : [];
        const namesInB = (b instanceof SyncTreeBranch) ? Object.keys(b.branches).concat(Object.keys(b.leaves)) : [];

        return namesInB.filter(nameInB => namesInA.indexOf(nameInB) === -1).concat(namesInA);
    }
}
