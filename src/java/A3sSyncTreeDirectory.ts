
import {A3sSyncTreeDirectoryDto, A3sSyncTreeLeafDto} from '../model/a3sSync';
import {java as serializers} from './serializer/implementation/index'
import {java as fieldDeclarations, classField, bool} from './serializer/util/field-declarations'
import {GenericJObject, IFieldDeclaration} from './serializer/interfaces';
import {serializeA3sSyncTreeLeaf} from './A3sSyncTreeLeaf';

export const serializeA3sSyncTreeDirectory = function(
    dto: A3sSyncTreeDirectoryDto,
    serializedParent?: GenericJObject
): GenericJObject {

    const parentClassname = "fr.soe.a3s.domain.repository.SyncTreeDirectory";
    const allFieldDefs: IFieldDeclaration<A3sSyncTreeDirectoryDto>[] = [
        bool('deleted'),
        bool('hidden'),
        bool('markAsAddon'),
        bool('updated'),
        fieldDeclarations.util.List('list'),
        fieldDeclarations.lang.String('name'),
        classField(parentClassname, 'parent'),
    ];

    const retValue: GenericJObject = {
        $: {
            hidden: dto.hidden,
            list: null,
            deleted: dto.deleted,
            markAsAddon: dto.markAsAddon,
            updated: dto.updated,
            name: dto.name,
            parent: serializedParent || null,
        },
        $class: {
            name: "fr.soe.a3s.domain.repository.SyncTreeDirectory",
            serialVersionUID: "-2855304993780573704",
            flags: 2,
            fields: allFieldDefs,
            superClass: null
        },
    };

    retValue.$.list = serializers.util.ArrayList(dto.list, (v: A3sSyncTreeDirectoryDto | A3sSyncTreeLeafDto) => {
        if (typeof (v as A3sSyncTreeDirectoryDto).markAsAddon === 'boolean') {
            return serializeA3sSyncTreeDirectory(v as A3sSyncTreeDirectoryDto, retValue)
        }
        return serializeA3sSyncTreeLeaf(v as A3sSyncTreeLeafDto, retValue);
    });
    return retValue;
};
