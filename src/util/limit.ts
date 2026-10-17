export type Limiter = <T>(task: () => Promise<T>) => Promise<T>;

/**
 * returns a function that runs at most `concurrency` tasks at a time, queueing the rest
 */
export function createLimiter(concurrency: number): Limiter {
    if (!(concurrency >= 1)) {
        throw new Error('concurrency must be at least 1');
    }
    let active = 0;
    // queue with head index instead of shift(), which is O(n) on large arrays
    let queue: Array<() => void> = [];
    let head = 0;

    const next = () => {
        if (active >= concurrency || head >= queue.length) {
            return;
        }
        active++;
        const run = queue[head];
        queue[head++] = undefined;
        if (head === queue.length) {
            queue = [];
            head = 0;
        }
        run();
    };

    return <T>(task: () => Promise<T>): Promise<T> => new Promise<T>((resolve, reject) => {
        queue.push(() => {
            Promise.resolve()
                .then(task)
                .then(resolve, reject)
                .then(() => {
                    active--;
                    next();
                });
        });
        next();
    });
}
