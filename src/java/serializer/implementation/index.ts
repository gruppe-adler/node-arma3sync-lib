import {ArrayList} from './ArrayList';
import {HashMap} from './HashMap';
import {long} from './long';
import {float} from './float';
import {String as JavaString} from './String';
import {bool} from './boolean';

export const java = {
    util: {
        ArrayList: ArrayList,
        HashMap: HashMap,
    },
    lang: {
        String: JavaString,
    },
    long: long,
    boolean: bool,
    float: float,
};

