import { injectable } from 'inversify';
import * as pg from 'pg';
import * as url from 'url';

import { Logger } from '../../utils/logger';
import { Configuration } from '../configuration';

@injectable()
export class PoolProvider {
    private readonly pool: pg.Pool;

    constructor(private appConfiguration: Configuration) {
        // tslint:disable-next-line:no-expression-statement
        this.pool = this.createPool(this.getConfig());
    }

    public getPool() {
        return this.pool;
    }

    private getConfig(): pg.PoolConfig {
        if (!this.appConfiguration.database.url) {
            throw Error('databaseUrl is undefined');
        }

        const params = url.parse(this.appConfiguration.database.url);
        if (!params.auth) {
            throw Error('Unable to get auth from process.env.DATABASE_URL');
        }

        const port = Number(params.port);
        if (!port || isNaN(port)) {
            throw Error('Unable to get port from process.env.DATABASE_URL');
        }

        if (!params.pathname) {
            throw Error('Unable to get pathname from process.env.DATABASE_URL');
        }

        const auth = params.auth.split(':');
        return {
            user: auth[0],
            password: auth[1],
            host: params.hostname,
            port,
            database: params.pathname.split('/')[1],
            max: this.appConfiguration.database.maxConnections || 10
        };
    }

    private createPool(config: pg.PoolConfig): pg.Pool {
        return new pg.Pool(config)
            .on('error', (err, client) => Logger.error('idle client error', err.message, err.stack));
    }
}
