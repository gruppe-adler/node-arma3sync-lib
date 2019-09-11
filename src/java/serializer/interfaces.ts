export interface Serializer<T> {
    (dto: T, valueCallback: (v) => GenericJObject, threshold: number): GenericJObject
    (dto: T, serializedParent: GenericJObject): GenericJObject
    (dto: T): GenericJObject
}

export interface Deserializer<T, U> {
    (serialized: NormalJObject<T>): U;
}

export interface IObjectFieldDeclaration<T> {
    classname: string
    name: keyof T
    type: "L"
}

export interface IPrimitiveFieldDeclaration<T> {
    name: keyof T
    type: string
}

export type IFieldDefinitions<T> = {
    [P in keyof T]?: NormalJObject<T[P]>|boolean|string|number;
}

export type IFieldDeclaration<T> = IObjectFieldDeclaration<T>|IPrimitiveFieldDeclaration<T>


export interface JClass<T> {
    flags: number
    serialVersionUID: string
    fields: IFieldDeclaration<T>[]
    name: string
    superClass: null|JClass<any>
}

export interface NormalJObject<T> {
    $: IFieldDefinitions<T>
    $class: JClass<T>
    _$?: object|string
}

export interface GenericJObject extends NormalJObject<any> {}
