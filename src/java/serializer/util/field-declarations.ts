import {IObjectFieldDeclaration, IPrimitiveFieldDeclaration} from '../interfaces';

export const java = {
    lang: {
        String: function <T>(name: keyof T): IObjectFieldDeclaration<T> {
            return classField("java.lang.String", name);
        },
        Boolean: function <T>(name: keyof T): IObjectFieldDeclaration<T> {
            return classField("java.lang.Boolean", name);
        },
        Long: function <T>(name: keyof T): IObjectFieldDeclaration<T> {
            return classField("java.lang.Long", name);
        }
    },
    util: {
        List: function <T>(name: keyof T): IObjectFieldDeclaration<T> {
            return classField("java.util.List", name);
        }
    }
};

const primitiveField = function<T> (type: string, name: keyof T): IPrimitiveFieldDeclaration<T> {
    return {
        type, name
    }
};

export const bool = function<T> (name: keyof T): IPrimitiveFieldDeclaration<T> {
    return primitiveField("Z", name);
};
export const int = function<T> (name: keyof T): IPrimitiveFieldDeclaration<T> {
    return primitiveField("I", name);
};
export const long = function<T> (name: keyof T): IPrimitiveFieldDeclaration<T> {
    return primitiveField("J", name);
};
export const float = function<T> (name: keyof T): IPrimitiveFieldDeclaration<T> {
    return primitiveField("F", name);
};

export const classField = function<T> (classname: string, name: keyof T): IObjectFieldDeclaration<T> {
    return {
        classname: `L${classname.replace(/\./g, "/")};`,
        name,
        type: "L"
    };
};
