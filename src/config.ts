import {DummyLogger} from './util/DummyLogger';
import {Logger} from './util/types';

let globalLogger = new DummyLogger();
export function setLogger(logger: Logger): void {
    globalLogger = logger;
}
export function getLogger(): Logger {
    return globalLogger;
}
