export class A3SChangelog {
    constructor(
        public revision: number,
        public buildDate: Date,
        public contentUpdated: boolean,
        public newAddons: string[],
        public updatedAddons: string[],
        public deletedAddons: string[],
        public addons: string[]
    ) {}
}
