import {GenericJObject, Serializer} from '../interfaces';

export const bool: Serializer<boolean> = function(dto: boolean): GenericJObject {
    return {
        $: {
            value: dto,
        },
        $class: {
            name : 'java.lang.Boolean',
            serialVersionUID : '-3665804199014368530',
            flags : 2,
            fields : [{
                type : 'Z',
                name : 'value'
            }],
            superClass : null
        }
    };
};
