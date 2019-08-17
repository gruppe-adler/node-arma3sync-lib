export interface A3sEvents {
    list: A3sEvent[]
}
export interface A3sEvent {
    name: string
    description: string
    addonNames: Map<string, boolean>
    userConfigFolderNames: Map<string, boolean>
}

export function a3sEventToJava(a3sEvent: A3sEvent): object {
    return {};
}
