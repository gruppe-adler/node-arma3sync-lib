#!/usr/bin/env node
// Loads the built package the way a consumer would (via package.json "main")
// and exercises the parts that only break in compiled output, e.g. module interop.
// Run after `npm run build`.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const pkgRoot = path.join(__dirname, '..');
const pkg = require(path.join(pkgRoot, 'package.json'));
const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), 'arma3sync-lib-smoke-'));
const publicURL = 'http://example.invalid/repo';

// Isolate from the repo's config/ directory; `config` reads these on first require.
process.env.NODE_CONFIG_DIR = repoPath;
process.env.SUPPRESS_NO_CONFIG_WARNING = '1';
process.env.NODE_CONFIG = JSON.stringify({
    'arma3sync-lib': {repoName: 'smoke', repoPath, publicURL},
});

async function main() {
    assert.ok(fs.existsSync(path.join(pkgRoot, pkg.types)), `types file ${pkg.types} missing`);

    const lib = require(pkgRoot);
    for (const name of ['setFileHasher', 'setLogger', 'zsyncGenerationService', 'syncGenerationService', 'a3sDirectory', 'repoBuildService']) {
        assert.ok(lib[name], `export "${name}" missing`);
    }
    assert.ok(fs.existsSync(path.join(repoPath, '.a3s')), '.a3s directory was not created');

    const {zsyncmakeWithExec} = require(path.join(pkgRoot, 'dist/service/zsync/zsyncmake'));
    let cmdLine;
    await zsyncmakeWithExec('/@mod/file.pbo', (cmd, cb) => { cmdLine = cmd; cb(null, {stdout: '', stderr: ''}); });
    assert.strictEqual(
        cmdLine,
        `zsyncmake -eu '${publicURL}/@mod/file.pbo' -o '${repoPath}/@mod/file.pbo.zsync' '${repoPath}/@mod/file.pbo'`,
    );

    fs.mkdirSync(path.join(repoPath, '@mod'));
    fs.writeFileSync(path.join(repoPath, '@mod', 'file.pbo'), 'content');
    const sync = await lib.syncGenerationService.generateSync();
    assert.ok(sync, 'generateSync returned nothing');
}

main()
    .then(() => console.log('dist smoke test passed'))
    .catch(err => {
        console.error('dist smoke test failed:', err);
        process.exitCode = 1;
    })
    .finally(() => fs.rmSync(repoPath, {recursive: true, force: true}));
