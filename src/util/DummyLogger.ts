import {Logger} from './types';

export class DummyLogger implements Logger {
    debug(msg: string): void {
    }

    error(msg: string): void {
    }

    info(msg: string): void {
    }

    warn(msg: string): void {
    }

}
