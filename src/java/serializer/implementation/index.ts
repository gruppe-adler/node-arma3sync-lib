import {ArrayList} from './ArrayList';
import {HashMap} from './HashMap';
import {long} from './long';
import {float} from './float';
import {String as JavaString} from './String';
import {Date as JavaDate} from './Date';
import {bool} from './boolean';
import {HashSet} from './HashSet';

export const java = {
    util: {
        ArrayList: ArrayList,
        HashMap: HashMap,
        HashSet: HashSet,
        Date: JavaDate,
    },
    lang: {
        String: JavaString,
    },
    long: long,
    boolean: bool,
    float: float,
};

