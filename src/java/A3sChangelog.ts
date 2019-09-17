import {GenericJObject} from './serializer/interfaces';
import {bool, classField, int} from './serializer/util/field-declarations';
import {java as serializer} from './serializer/implementation';
import {A3sChangelogDto} from '../model/A3sChangelogDto';

export function serializeA3sChangelog(changelog: A3sChangelogDto): GenericJObject {
    return {
        $: {
            contentUpdated: changelog.contentUpdated,
            revision: changelog.revision,
            addons: serializer.util.ArrayList(changelog.addons, x => x),
            buildDate: serializer.util.Date(changelog.buildDate),
            deletedAddons: serializer.util.ArrayList(changelog.deletedAddons, x => x),
            newAddons: serializer.util.ArrayList(changelog.newAddons, x => x),
            updatedAddons: serializer.util.ArrayList(changelog.updatedAddons, x => x),
        },
        $class: {
            name: "fr.soe.a3s.domain.repository.Changelogs",
            serialVersionUID: "7332983755625818660",
            flags: 2,
            fields: [
                bool("contentUpdated"),
                int("revision"),
                classField("java.util.List", "addons"),
                classField("java.util.Date", "buildDate"),
                classField("java.util.List", "deletedAddons"),
                classField("java.util.List", "newAddons"),
                classField("java.util.List", "updatedAddons"),
            ],
            superClass: null,
        }
    };
}
