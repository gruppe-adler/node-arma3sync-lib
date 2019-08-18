import {expand} from 'src/javaUtil';
import {JObject, normalize} from 'java.io';

export interface A3sEventsDto {
    list: A3sEventDto[]
}

export interface A3sEventDto {
    name: string
    description: string
    addonNames: { [addonName: string]: false }
    userconfigFolderNames: { [folderName: string]: false }
}

export interface AsJava {
    asJava(): JObject<any>;
}

function getThreshold(obj) {
    var len = Object.keys(obj).length;
    var ret = Math.ceil(len / 8) * 6;  //*Math.ceil(amount / 8) * 8 * 0.75*/
    return ret < 12 ? 12 : ret
}

export class HashMap<T> implements AsJava {
    constructor(
        public readonly map: object,
        private valueCallback: (v: T) => JObject<T>,
        private fixedThreshold?: number) {
    }

    public asJava(): JObject<any> {
        const map = {};
        const mapNames = Object.getOwnPropertyNames(this.map);

        mapNames.forEach(name => {
            map[name] = this.valueCallback(this.map[name]);
        });

        return {
            '_$': map,
            '$': {loadFactor: 0.75, threshold: this.fixedThreshold || (mapNames.length ? getThreshold(this.map) : 0)},
            '$class': {
                name: 'java.util.HashMap',
                serialVersionUID: '362498820763181265',
                flags: 3,
                fields: [
                    {type: 'F', name: 'loadFactor'},
                    {type: 'I', name: 'threshold'},
                ],
                superClass: null
            }
        };
    }

}

export class ArrayList<T> implements AsJava {
    constructor(public readonly arr: T[]) {
    }

    public asJava(): JObject<any> {
        return {
            '$': {
                'capacity': this.arr.length,
                'size': this.arr.length
            },
            '$class': {
                'fields': [{
                    'name': 'size',
                    'type': 'I'
                }],
                'flags': 3,
                'name': 'java.util.ArrayList',
                'serialVersionUID': '8683452581122892189',
                'superClass': null
            },
            '_$': this.arr
        };
    }
}

export class A3sEvents implements A3sEventsDto, AsJava {
    constructor(
        public list: A3SEvent[],
    ) {
    }

    asJava(): JObject<A3sEventsDto> {
        const jA3sEventsList = this.list.map(event => new A3SEvent(event.name, event.description, event.addonNames, event.userconfigFolderNames).asJava());
        const jA3sEvents = expand(this, 'fr.soe.a3s.domain.repository.Events');
        jA3sEvents.$.list = new ArrayList(jA3sEventsList).asJava();

        return jA3sEvents;
    }
}

export class A3SEvent implements A3sEventDto, AsJava {
    constructor(
        public name: string,
        public description: string,
        public addonNames: { [p: string]: false },
        public userconfigFolderNames: { [p: string]: false },
    ) {
    }

    public asJava(): JObject<A3sEventsDto> {
        return {
            $: {
                addonNames: new HashMap(this.addonNames, (v) => normalize(v, 'boolean')).asJava(),
                description: normalize(this.description),
                name: normalize(this.name),
                userconfigFolderNames: new HashMap(this.userconfigFolderNames, (v) => normalize(v, 'boolean')).asJava()
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
    }
}
