import {GenericJObject, NormalJObject} from '../interfaces';

export const HashSet = function <T>(set: T[], valueCallback: (v) => GenericJObject): NormalJObject<any> {
    return {
        $: {},
        $class: {
            "name": "java.util.HashSet",
            "serialVersionUID": "-5024744406713321676",
            "flags": 3,
            "fields": [],
            "superClass": null
        },
        _$: set.map(valueCallback)
    };
};
