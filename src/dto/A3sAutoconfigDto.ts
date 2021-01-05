
export interface A3sAutoconfigDto {
    favoriteServers: A3sFavoriteServerDto[];
    protocole: A3sRepositoryProtocolDto;
    repositoryName: string;
}

export interface A3sRepositoryProtocolDto {
    connectionTimeOut: string
    encryptionMode?: A3sEncryptionMode
    protocolType: A3sProtocolType
    login: string
    password: string
    port: string
    readTimeOut: string
    url: string
}

export interface A3sProtocolType {
    description: string
    prompt: string
    defaultPort: string
    name: A3sProtocol
}

export interface A3sFavoriteServerDto {
    name: string
    ipAddress: string
    port: number
    password: string
    selected: boolean
    modSetName: string
    repositoryName: string
}

export interface A3sEncryptionMode {
    description: string
    encryption: A3sEncryption
}

export enum A3sProtocol {
    FTP = 'FTP',
    HTTP = 'HTTP',
    HTTPS = 'HTTPS',
    A3S = 'A3S',
    FTP_BITTORRENT = 'FTP_BITTORRENT',
    HTTP_BITTORRENT = 'HTTP_BITTORRENT',
    HTTPS_BITTORRENT = 'HTTPS_BITTORRENT',
    SOCKS4 = 'SOCKS4',
    SOCKS5 = 'SOCKS5'
}

export enum A3sEncryption {
    NO_ENCRYPTION,
    EXPLICIT_SSL,
    IMPLICIT_SSL
}

export const A3sProtocolTypeHTTP: A3sProtocolType = {
    defaultPort: '80',
    description: 'HTTP',
    name: A3sProtocol.HTTP,
    prompt: 'http://'
}

export const A3sProtocolTypeHTTPS: A3sProtocolType = {
    defaultPort: '443',
    description: 'HTTPS',
    name: A3sProtocol.HTTPS,
    prompt: 'https://'
}
