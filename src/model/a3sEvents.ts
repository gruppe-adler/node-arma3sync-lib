export class A3sEvents {
    public list: A3sEvent[];
}
export class A3sEvent {
    constructor(
        public name: string,
        public description: string,
        public addonNames: Map<string, boolean>,
        public userConfigFolderNames: Map<string, boolean>
    ) {}
}
