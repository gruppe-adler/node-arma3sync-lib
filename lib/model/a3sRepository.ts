
export class A3SRepository {
    public servers: A3SFavoriteServer[];
    public protocol: A3SRepositoryProtocol;
    public name: string;

    constructor({favoriteServers, protocole, repositoryName }: any) {
        this.servers = favoriteServers as A3SFavoriteServer[];
        this.protocol = protocole as A3SRepositoryProtocol;
        this.name = repositoryName as string;
    }
}

export class A3SRepositoryProtocol {
    constructor(
        public connectionTimeOut: string,
        public login: string,
        public password: string,
        public port: string,
        public readTimeOut: string,
        public url: string,
        public encryptionMode?: A3SEncryptionMode,
        public protocolType?: A3SProtocolType
    ) {}
}

export class A3SProtocolType {
    constructor(
        public description: string,
        public prompt: string,
        public defaultPort: string,
        public protocol: A3SProtocol
    ) {}
}

export class A3SFavoriteServer {
    constructor(
        public name: string,
        public ipAddress: string,
        public port: number,
        public password: string,
        public selected: boolean,
        public modSetName: string,
        public repositoryName: string
    ) {}
}

export class A3SEncryptionMode {
    constructor(
        public description: string,
        public encryption: A3SEncryption
    ) {}
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
