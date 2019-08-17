export interface A3sEvents {
    list: A3sEvent[]
}
export interface A3sEvent {
    name: string
    description: string
    addonNames: Map<string, boolean>
    userConfigFolderNames: Map<string, boolean>
}
