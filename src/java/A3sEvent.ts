import {java as serializers} from '../java/serializer/implementation'
import {GenericJObject, Serializer} from './serializer/interfaces';
import {A3sEventDto} from '../model/A3sEventDto';

export const a3sEventSerialize: Serializer<A3sEventDto> = function(dto: A3sEventDto): GenericJObject {
    return {
        $: {
            addonNames: serializers.util.HashMap(dto.addonNames, (v) => serializers.boolean(v)),
            description: dto.description,
            name: dto.name,
            userconfigFolderNames: serializers.util.HashMap({}, (v) => v),
        },
        $class: {
            'fields': [{
                'classname': 'Ljava/util/Map;',
                'name': 'addonNames',
                'type': 'L'
            }, {
                'classname': 'Ljava/lang/String;',
                'name': 'description',
                'type': 'L'
            }, {
                'classname': 'Ljava/lang/String;',
                'name': 'name',
                'type': 'L'
            }, {
                'classname': 'Ljava/util/Map;',
                'name': 'userconfigFolderNames',
                'type': 'L'
            }],
            'flags': 2,
            'name': 'fr.soe.a3s.domain.repository.Event',
            'serialVersionUID': '7456226002765813117',
            'superClass': null
        }
    };
};
