import {A3sDirectory} from './a3sDirectory';
import {readFileSync} from 'fs';

const a3sExamplesDir = __dirname + '/../resources/test/a3s';

test('getting events from example file', (done) => {
    const access = new A3sDirectory(a3sExamplesDir);
    access.getEvents().then(events => {
        expect(events).toHaveProperty('list');
        expect(events.list.length).toBeGreaterThan(0);
        expect(events.list[0].name).toBe('foo');
        expect(events.list[1].name).toBe('event 2');
        expect(events.list[1].addonNames).toStrictEqual({"@tfar_autoswitch": false, GM: false});
        done();
    });
});

test('aaand saving events will produce the same file again', (done) => {
    const access = new A3sDirectory('/tmp');
    const expectedFile = readFileSync(a3sExamplesDir + '/events');
    const expectedSize = expectedFile.length;
    access.setEvents({list: []}).then(() => {
        const actualFile = readFileSync('/tmp/events');
        expect(actualFile.length).toEqual(expectedSize);
        done();
    })
});
