import {ZSyncGenerationService} from './service/zsync/ZSyncGenerationService';
import {zsyncmake} from './service/zsync/zsyncmake';
import {SyncGenerationService} from './service/sync/SyncGenerationService';
import {A3sDirectory} from './service/A3sDirectory';
import * as config from 'config';
import {RepoBuildService} from './service/RepoBuildService';
import {SyncComparisonService} from './service/sync/SyncComparisonService';
export {setLogger} from './config';

if (!config.has('arma3sync-lib.repoName')) {
    throw new Error('repoName not configured');
}
let repoName = config.get<string>('arma3sync-lib.repoName');

if (!config.has('arma3sync-lib.repoPath')) {
    throw new Error('repoPath not configured');
}
let repoPath = config.get<string>('arma3sync-lib.repoPath');

if (!config.has('arma3sync-lib.publicURL')) {
    throw new Error('publicURL not configured');
}
let publicURL = config.get<string>('arma3sync-lib.publicURL');

export const zsyncGenerationService = new ZSyncGenerationService(publicURL, repoPath, zsyncmake);
export const syncGenerationService = new SyncGenerationService(repoPath);
export const a3sDirectory = new A3sDirectory(repoPath + '/.a3s');
export const repoBuildService = new RepoBuildService(
    a3sDirectory,
    syncGenerationService,
    zsyncGenerationService,
    new SyncComparisonService(),
    publicURL,
    repoName,
);
