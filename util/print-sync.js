#!/usr/bin/env node

fs = require('fs');

function formatAllMemories(mem) {
    const M = 1024*1024;
    const ext = (mem.external / M).toFixed(1);
    const heapTot = (mem.heapTotal / M).toFixed(1);
    const heap = (mem.heapUsed / M).toFixed(1);
    const rss = (mem.rss / M).toFixed(1);

    return `external: ${ext}, heap total: ${heapTot}, heap used: ${heap}, rss: ${rss}`
}

let SyncGenerator = require(__dirname + '/../dist/service/SyncGenerationService.js').SyncGenerationService;

let dir = process.argv.pop();
if (!dir) {
    console.error('missing directory argument');
    process.exit(1);
}
if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    console.error(dir + ' is no directory');
    process.exit(1);
}

console.info('going over directory ' + dir + '...');
setTimeout(() => {

    let s = new SyncGenerator(dir);
    s.generateSync().then(sync => {
        process.stdout.write('\n');
        process.stdout.write(JSON.stringify(sync));
        process.stdout.write('\n');
        process.exit(0);
    }).catch(e => {
        console.error(e);
    });


}, 1000);

setInterval(() => {
    const mem = process.memoryUsage();

    process.stdout.write('\r' + formatAllMemories(mem));
}, 100);
