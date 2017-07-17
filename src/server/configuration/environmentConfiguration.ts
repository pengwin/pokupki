import { injectable } from 'inversify';

import { Configuration } from './configuration';

@injectable()
export class EnvironmentConfiguration extends Configuration {

    get auth() {
        return {
            secret: process.env.SECRET || '123456'
        };
    }

    get server() {
        return {
            port: Number(process.env.PORT) || 3000,
            staticContentPath: './build/client'
        };
    }

    get database() {
        return {
            url: process.env.DATABASE_URL || '',
            maxConnections: 20,
            ssl: true
        };
    }
}
