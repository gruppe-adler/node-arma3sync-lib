let SyncGenerator = require(__dirname + '/../dist/service/SyncGenerationService.js').SyncGenerationService;

let dir = process.argv.pop();
if (!dir) {
    console.error('missing directory argument');
    process.exit(1);
}

console.info('going over directory ' + dir + '...');
setTimeout(() => {
    let s = new SyncGenerator(dir);
    s.generateSync().then(sync => {
        process.stdout.write(JSON.stringify(sync));
    }).catch(e => {
        console.error(e);
    });
});
