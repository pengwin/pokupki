import { injectable } from 'inversify';

@injectable()
export abstract class Configuration {
    public readonly database: {
        readonly url: string;
        readonly maxConnections: number;
        readonly ssl: boolean;
    };
    public readonly server: {
        readonly port: number;
        readonly staticContentPath: string;
    };
    public readonly auth: {
        readonly secret: string
    };
}
