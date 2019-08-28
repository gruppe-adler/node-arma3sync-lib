import {GenericJObject} from '../interfaces';

export const ArrayList = function <T>(arr: T[], valueCallback: (v) => GenericJObject): GenericJObject {
    return {
        $: {
            capacity: arr.length,
            size: arr.length
        },
        $class: {
            fields: [{
                name: 'size',
                type: 'I'
            }],
            flags: 3,
            name: 'java.util.ArrayList',
            serialVersionUID: '8683452581122892189',
            superClass: null
        },
        _$: arr.map(valueCallback)
    };
};
