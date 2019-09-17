export interface A3sChangelogDto {
    revision: number
    buildDate: Date
    contentUpdated: boolean
    newAddons: string[]
    updatedAddons: string[]
    deletedAddons: string[]
    addons: string[]
}
