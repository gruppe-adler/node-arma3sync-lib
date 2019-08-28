import {A3sSyncTreeLeafDto} from '../model/a3sSync';
import {GenericJObject} from '../java/serializer/interfaces';
import {bool, classField, java, long} from '../java/serializer/util/field-declarations';

export const serializeA3sSyncTreeLeaf = function(dto: A3sSyncTreeLeafDto, serializedParent: GenericJObject): GenericJObject {
    const parentClassname = "fr.soe.a3s.domain.repository.SyncTreeDirectory";
    return {
        $: {
            compressed: dto.compressed,
            compressedSize: dto.compressedSize,
            deleted: dto.deleted,
            size: dto.size,
            updated: dto.updated,
            name: dto.name,
            sha1: dto.sha1,
            parent: serializedParent
        },
        $class: {
            name: "fr.soe.a3s.domain.repository.SyncTreeLeaf",
            serialVersionUID: "8849248143660225239",
            flags: 2,
            fields: [
                bool('compressed'),
                long('compressedSize'),
                bool('deleted'),
                long('size'),
                bool('updated'),
                java.lang.String('name'),
                classField(parentClassname, "parent"),
                java.lang.String('sha1'),
            ],
            superClass: null
        },
    };
};
