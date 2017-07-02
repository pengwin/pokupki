import * as pg from 'pg';
import * as url from 'url';

import { Logger } from '../../utils/logger';

class Database {
    private poolInstance: pg.Pool;
    private config: pg.PoolConfig;

    private get pool() {
        if (!this.poolInstance) {
            // tslint:disable-next-line:no-expression-statement
            this.poolInstance = this.createPool(this.config);
        }
        return this.poolInstance;
    }

    constructor(databaseUrl: string | undefined, maxConnections: number, ssl: boolean) {
        // tslint:disable-next-line:no-expression-statement
        this.config = this.getConfig(databaseUrl, maxConnections, ssl);
    }

    public query(query: pg.QueryConfig) {
        return this.pool.query(query)
            .then(res => res.rows)
            .catch(err => { throw new Error(`Query ${query.text} error: ${err.message}, ${err.stack}`); });
    }

    public shutdown() {
        return this.pool.end();
    }

    private createPool(config: pg.PoolConfig): pg.Pool {
        return new pg.Pool(config)
            .on('error', (err, client) => Logger.error('idle client error', err.message, err.stack));
    }

    private getConfig(databaseUrl: string | undefined, maxConnections?: number, ssl?: boolean): pg.PoolConfig {
        if (!databaseUrl) {
            throw Error('databaseUrl is undefined');
        }

        const params = url.parse(databaseUrl);
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
            max: maxConnections || 10
        };
    }
}

export { Database };
