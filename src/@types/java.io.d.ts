declare module 'java.io' {
    function OutputObjectStream(): any;
    function addObject(classname: any, convertor: any): any;
    function normalize(): any;
    function constants(): any;

    class InputStream {
        constructor(buf: Buffer, withType: boolean);
        readObject(): any;
    }
    export {InputStream as InputObjectStream};
}
