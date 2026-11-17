import {createLimiter} from './limit';

function deferred() {
    let resolve: () => void;
    const promise = new Promise<void>(r => resolve = r);
    return {promise, resolve};
}

describe(createLimiter.name, () => {
    it('rejects concurrency below 1', () => {
        expect(() => createLimiter(0)).toThrow();
    });
    it('never runs more than the given number of tasks at once', async () => {
        const limit = createLimiter(2);
        let active = 0;
        let maxActive = 0;
        const results = await Promise.all([1, 2, 3, 4, 5, 6].map(n => limit(async () => {
            active++;
            maxActive = Math.max(maxActive, active);
            await new Promise(r => setTimeout(r, 5));
            active--;
            return n * 2;
        })));
        expect(maxActive).toBe(2);
        expect(results).toEqual([2, 4, 6, 8, 10, 12]);
    });
    it('starts queued tasks once a running task finishes', async () => {
        const limit = createLimiter(1);
        const first = deferred();
        const secondStarted = jest.fn();
        const p1 = limit(() => first.promise);
        const p2 = limit(async () => secondStarted());
        await Promise.resolve();
        expect(secondStarted).not.toHaveBeenCalled();
        first.resolve();
        await Promise.all([p1, p2]);
        expect(secondStarted).toHaveBeenCalledTimes(1);
    });
    it('propagates rejections and keeps processing the queue', async () => {
        const limit = createLimiter(1);
        const failing = limit(() => Promise.reject(new Error('nope')));
        const throwing = limit(() => { throw new Error('sync nope'); });
        const ok = limit(async () => 'ok');
        await expect(failing).rejects.toThrow('nope');
        await expect(throwing).rejects.toThrow('sync nope');
        await expect(ok).resolves.toBe('ok');
    });
});
