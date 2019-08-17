import {A3sDirectory} from './a3sDirectory';

test('getting events from example file', (done) => {
    const access = new A3sDirectory(__dirname + '/../resources/test/a3s');
    access.getEvents().then(events => {
        expect(events).toHaveProperty('list');
        expect(events.list.length).toBeGreaterThan(0);
        expect(events.list[0].name).toBe('foo');
        expect(events.list[1].name).toBe('event 2');
        expect(events.list[1].addonNames).toStrictEqual({"@tfar_autoswitch": false, GM: false});
        done();
    });
});
