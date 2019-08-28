import {GenericJObject, Serializer} from '../interfaces';

export const float: Serializer<number> = function(dto: number): GenericJObject {
    return {
        $: {
            value: dto
        },
        $class: {
            name: '[F',
            serialVersionUID: '836686056779680834',
            flags: 2,
            fields: [],
            superClass: null
        }
    }
};
