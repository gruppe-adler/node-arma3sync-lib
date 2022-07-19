import * as crypto from 'crypto'
import {createReadStream} from 'fs'

import {FileHasher} from './types';

export class SHA1FileHasher implements FileHasher {
    hash(file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha1');
            hash.on('readable', () => {
                const hashingResult = hash.read();
                if (!hashingResult) {
                    return;
                }
                const hashString = hashingResult.toString('hex');
                resolve(hashString);
            });
            const fStream = createReadStream(file);
            fStream.on('data', (data) => {
                hash.update(data);
            });
            fStream.on('end', () => {
                hash.end();
            });
        });
    }
}
