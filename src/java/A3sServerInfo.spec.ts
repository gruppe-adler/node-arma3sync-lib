import {serializeA3sServerInfo} from './A3sServerInfo';
import {readFileSync} from 'fs';
import {A3sServerInfoDto} from '../model/A3sServerInfoDto';

const exampleSerializedServerInfo = JSON.parse(readFileSync(__dirname + '/../../resources/test/serverinfo-serialized.json').toString());
const exampleServerInfo = JSON.parse(readFileSync(__dirname + '/../../resources/test/serverinfo-deserialized.json').toString()) as A3sServerInfoDto;

describe(serializeA3sServerInfo.name, () => {
    it('serializes!', () => {
        expect(serializeA3sServerInfo(exampleServerInfo)).toStrictEqual(exampleSerializedServerInfo);
    });
});
