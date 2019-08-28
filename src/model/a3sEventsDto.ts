export interface A3sEventsDto {
    list: A3sEventDto[]
}

export interface A3sEventDto {
    name: string
    description: string
    addonNames: { [addonName: string]: boolean }
    userconfigFolderNames: { [folderName: string]: boolean }
}
