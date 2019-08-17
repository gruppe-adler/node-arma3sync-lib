
export interface A3SAutoconfig {
    servers: A3SFavoriteServer[];
    protocol: A3SRepositoryProtocol;
    name: string;
}

export interface A3SRepositoryProtocol {
    connectionTimeOut: string
    login: string
    password: string
    port: string
    readTimeOut: string
    url: string
    encryptionMode?: A3SEncryptionMode
    protocolType?: A3SProtocolType
}

export interface A3SProtocolType {
    description: string
    prompt: string
    defaultPort: string
    protocol: A3SProtocol
}

export interface A3SFavoriteServer {
    name: string
    ipAddress: string
    port: number
    password: string
    selected: boolean
    modSetName: string
    repositoryName: string
}

export interface A3SEncryptionMode {
    description: string
    encryption: A3SEncryption
}

export enum A3SProtocol {
    FTP,
    HTTP,
    HTTPS,
    A3S,
    FTP_BITTORRENT,
    HTTP_BITTORRENT,
    HTTPS_BITTORRENT,
    SOCKS4,
    SOCKS5
}

export enum A3SEncryption {
    NO_ENCRYPTION,
    EXPLICIT_SSL,
    IMPLICIT_SSL
}
