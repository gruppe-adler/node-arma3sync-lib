import {GenericJObject} from '../interfaces';

export function Date(v: Date): GenericJObject {
    return {
        $: {},
        $class: {
            "name": "java.util.Date",
            "serialVersionUID": "7523967970034938905",
            "flags": 3,
            "fields": [],
            "superClass": null
        },
        _$: v
    }
}
