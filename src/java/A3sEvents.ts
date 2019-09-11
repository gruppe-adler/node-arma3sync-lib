import {a3sEventSerialize} from './A3sEvent';
import {A3sEventsDto} from '../model/A3sEventsDto';
import {GenericJObject, Serializer} from './serializer/interfaces';
import {java as serializer} from '../java/serializer/implementation'

export const serializeA3sEvents: Serializer<A3sEventsDto> = function(dto: A3sEventsDto): GenericJObject {
    const jA3sEvents = {
        $: {
            list: null,
        },
        $class: {
            flags: 2,
            serialVersionUID: '-5141643688299352462',
            fields: [{
                'classname': 'Ljava/util/List;',
                'name': 'list',
                'type': 'L'
            }],
            name: 'fr.soe.a3s.domain.repository.Events',
            superClass: null
        }
    };
    jA3sEvents.$.list = serializer.util.ArrayList(dto.list, event => a3sEventSerialize(event));

    return jA3sEvents;
};
