import {A3sAutoconfigDto, A3sRepositoryProtocolDto} from '../../dto/A3sAutoconfigDto';
import {classField} from './util/field-declarations';
import {java as serializers} from './implementation'
import {GenericJObject} from './interfaces';

export function serializeA3sAutoconfig(autoconfig: A3sAutoconfigDto): GenericJObject {
    return {
        $: {
            favoriteServers: serializers.util.ArrayList(autoconfig.favoriteServers, x => {throw new Error('not supported');}),
            protocole: serializeProtocole(autoconfig.protocole),
            repositoryName: autoconfig.repositoryName,
        },
        $class: {
            "name": "fr.soe.a3s.domain.repository.AutoConfig",
            "serialVersionUID": "2706280725619197755",
            "flags": 2,
            "fields": [
                classField("java.util.List", "favoriteServers"),
                classField("fr.soe.a3s.domain.AbstractProtocole", "protocole"),
                classField("java.lang.String", "repositoryName"),
            ],
            "superClass": null
        }
    }
}

function serializeProtocole(protocole: A3sRepositoryProtocolDto): GenericJObject {
    if (protocole.encryptionMode) {
        throw new Error('encryptionMode not supported');
    }

    return {
        $: {
            connectionTimeOut: protocole.connectionTimeOut,
            encryptionMode: null,
            login: protocole.login,
            password: protocole.password,
            port: protocole.port,
            protocolType: {
                "$": {
                    "name": protocole.protocolType.name
                },
                "$class": {
                    "name": "fr.soe.a3s.constant.ProtocolType",
                    "serialVersionUID": "0",
                    "flags": 18,
                    "fields": [],
                    "superClass": {
                        "name": "java.lang.Enum",
                        "serialVersionUID": "0",
                        "flags": 18,
                        "fields": [],
                        "superClass": null
                    }
                }
            },
            readTimeOut: protocole.readTimeOut,
            url: protocole.url,
        },
        $class: {
            "name": "fr.soe.a3s.domain.Http",
            "serialVersionUID": "-20",
            "flags": 2,
            "fields": [],
            "superClass": {
                "name": "fr.soe.a3s.domain.AbstractProtocole",
                "serialVersionUID": "-886357032287815203",
                "flags": 2,
                "fields": [
                    classField("java.lang.String", "connectionTimeOut"),
                    classField("fr.soe.a3s.constant.EncryptionMode", "encryptionMode"),
                    classField("java.lang.String", "login"),
                    classField("java.lang.String", "password"),
                    classField("java.lang.String", "port"),
                    classField("fr.soe.a3s.constant.ProtocolType", "protocolType"),
                    classField("java.lang.String", "readTimeOut"),
                    classField("java.lang.String", "url"),
                ],
                "superClass": null
            }
        },

    }
}
