import {JObject, normalize} from 'java.io';

export interface A3sEventsDto {
    list: A3sEventDto[]
}

export interface A3sEventDto {
    name: string
    description: string
    addonNames: { [addonName: string]: boolean }
    userconfigFolderNames: { [folderName: string]: boolean }
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

export class A3sEvents implements AsJava {
    constructor(
        private dto: A3sEventsDto,
    ) {
    }

    asJava(): JObject<A3sEventsDto> {
        const jA3sEventsList = this.dto.list.map(event => new A3SEvent(event).asJava());
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
        jA3sEvents.$.list = new ArrayList(jA3sEventsList).asJava();

        return jA3sEvents;
    }
}

export class A3SEvent implements AsJava {
    constructor(
        private dto: A3sEventDto
    ) {
    }

    public asJava(): JObject<A3sEventsDto> {
        return {
            $: {
                addonNames: new HashMap(this.dto.addonNames, (v) => normalize(v, 'boolean')).asJava(),
                description: normalize(this.dto.description),
                name: normalize(this.dto.name),
                userconfigFolderNames: new HashMap(this.dto.userconfigFolderNames, (v) => normalize(v, 'boolean')).asJava()
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
