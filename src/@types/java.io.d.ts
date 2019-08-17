declare module 'java.io' {
    export function addObject(classname: any, convertor: any): any;
    function constants(): any;
    export function normalize(obj: boolean|string|number, type?: 'string'|'boolean'|'int'|'short'|'long'|'char'|'byte'|'float'|'double'): object
    export function normalize(obj: object|any[], type: 'string'|'boolean'|'int'|'short'|'long'|'char'|'byte'|'float'|'double'): object

    class InputStream {
        constructor(buf: Buffer, withType: boolean);
        readObject(): any;
    }

    class OutputStream {
        constructor();
        writeObject(obj: object): Buffer;
    }

    export {
        InputStream as InputObjectStream,
        OutputStream as OutputObjectStream
    };
}
