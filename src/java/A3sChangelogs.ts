import {NormalJObject} from './serializer/interfaces';
import {java} from './serializer/util/field-declarations';
import {A3sChangelogsDto} from '../model/A3sChangelogsDto';
import {java as serializer} from './serializer/implementation';
import {serializeA3sChangelog} from './A3sChangelog';

export function serializeA3sChangelogs(changelogs: A3sChangelogsDto): NormalJObject<A3sChangelogsDto> {
    const jObject =  {
        $: {
            list: null,
        },
        $class: {
            name: "fr.soe.a3s.domain.repository.Changelogs",
            serialVersionUID: "7332983755625818660",
            flags: 2,
            fields: [
                java.util.List("list"),
            ],
            superClass: null,
        }
    };

    jObject.$.list = serializer.util.ArrayList(changelogs.list, changelog => serializeA3sChangelog(changelog));

    return jObject;
}
