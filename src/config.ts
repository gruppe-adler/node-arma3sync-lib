import {DummyLogger} from './util/DummyLogger';
import {SHA1FileHasher} from './util/SHA1FileHasher';
import {FileHasher, Logger} from './util/types';

let globalFileHasher = new SHA1FileHasher();
export function setFileHasher(fileHasher: FileHasher): void {
    globalFileHasher = fileHasher;
}
export function getFileHasher(): FileHasher {
    return globalFileHasher;
}

let globalLogger = new DummyLogger();
export function setLogger(logger: Logger): void {
    globalLogger = logger;
}
export function getLogger(): Logger {
    return globalLogger;
}
