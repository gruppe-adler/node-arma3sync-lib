import {GenericJObject, Serializer} from '../interfaces';

export const long: Serializer<number> = function(dto: number): GenericJObject {
    return {
        $: {
            value: dto
        },
        $class: {
            name: '[J',
            serialVersionUID: '8655923659555304851',
            flags: 2,
            fields: [],
            superClass: null
        },
    };
};
