import {A3sServerInfoDto} from '../model/A3sServerInfoDto';
import {NormalJObject} from './serializer/interfaces';
import {java as serializers} from './serializer/implementation/index'
import {bool, classField, int, long} from './serializer/util/field-declarations';

export function serializeA3sServerInfo(serverInfo: A3sServerInfoDto): NormalJObject<A3sServerInfoDto> {
    return {
        $: {
            compressedPboFilesOnly: serverInfo.compressedPboFilesOnly,
            hiddenFolderPaths: serializers.util.HashSet(serverInfo.hiddenFolderPaths, (v) => v),
            noPartialFileTransfer: serverInfo.noPartialFileTransfer,
            numberOfConnections: serverInfo.numberOfConnections,
            numberOfFiles: serverInfo.numberOfFiles,
            repositoryContentUpdated: serverInfo.repositoryContentUpdated,
            revision: serverInfo.revision,
            totalFilesSize: serverInfo.totalFilesSize,
            buildDate: serializers.util.Date(serverInfo.buildDate)
        },
        $class: {
            "name": "fr.soe.a3s.domain.repository.ServerInfo",
            "serialVersionUID": "7697232677958952953",
            "flags": 2,
            "fields": [
                bool("compressedPboFilesOnly"),
                bool("noPartialFileTransfer"),
                int("numberOfConnections"),
                long("numberOfFiles"),
                bool("repositoryContentUpdated"),
                int("revision"),
                long("totalFilesSize"),
                classField("java.util.Date", "buildDate"),
                classField("java.util.Set", "hiddenFolderPaths"),
            ],
            "superClass": null
        },
    }
}
