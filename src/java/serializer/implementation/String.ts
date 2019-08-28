import {GenericJObject, Serializer} from '../interfaces';

export const String: Serializer<string> = function(dto: string): GenericJObject {
    return {
        $: {
            value: dto,
        },
        $class: {
            name : '[Ljava.lang.String;',
            serialVersionUID : '-5921575005990323385',
            flags : 2,
            fields : [],
            superClass : null
        }
    };
};
