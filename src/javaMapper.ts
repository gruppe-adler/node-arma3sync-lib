import {normalize} from 'java.io';

export const classes = {
    "fr.soe.a3s.domain.repository.Events": {
        flags: 2,
        serialVersionUID: "-5141643688299352462",
        fields: [{
            "classname": "Ljava/util/List;",
            "name": "list",
            "type": "L"
        }],
        name: "fr.soe.a3s.domain.repository.Events",
        superClass: null
    },
    "fr.soe.a3s.domain.repository.Event": {
        "fields": [{
            "classname": "Ljava/util/Map;",
            "name": "addonNames",
            "type": "L"
        }, {
            "classname": "Ljava/lang/String;",
            "name": "description",
            "type": "L"
        }, {
            "classname": "Ljava/lang/String;",
            "name": "name",
            "type": "L"
        }, {
            "classname": "Ljava/util/Map;",
            "name": "userconfigFolderNames",
            "type": "L"
        }],
        "flags": 2,
        "name": "fr.soe.a3s.domain.repository.Event",
        "serialVersionUID": "7456226002765813117",
        "superClass": null
    }
};

export function expand(obj: object): object {
    const result = {
        $: {}
    };
    Object
        .getOwnPropertyNames(obj)
        .forEach((propName) => {
            const val = obj[propName];
            if (val && typeof val === 'object') {
                result.$[propName] = val;
            }
        });
    return result;
}
