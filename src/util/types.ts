export interface FileHasher {
    hash(file: string): Promise<string>
}

export interface Logger {
    debug(msg: string): void
    info(msg: string): void
    warn(msg: string): void
    error(msg: string): void
}
