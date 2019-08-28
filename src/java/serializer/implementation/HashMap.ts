import {GenericJObject} from '../interfaces';

function getThreshold(obj) {
    const len = Object.keys(obj).length;
    const ret = Math.ceil(len / 8) * 6;  //*Math.ceil(amount / 8) * 8 * 0.75*/
    return ret < 12 ? 12 : ret
}

export const HashMap = function<T>(
    map: T,
    valueCallback: (v: any) => GenericJObject,
    fixedThreshold?: number
): GenericJObject {
    const resultMap = {};
    const mapNames = Object.getOwnPropertyNames(map);

    mapNames.forEach(name => {
        resultMap[name] = valueCallback(map[name]);
    });

    return {
        _$: resultMap,
        $: {loadFactor: 0.75, threshold: fixedThreshold || (mapNames.length ? getThreshold(map) : 0)},
        $class: {
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
};
