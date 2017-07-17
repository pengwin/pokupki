import { injectable } from 'inversify';
import { PoolProvider } from './poolProvider';

interface Query {
    readonly name?: string;
    readonly text: string;
    readonly values?: ReadonlyArray<any>;
}

@injectable()
class Database {

    private get pool() {
        return this.poolProvider.getPool();
    }

    constructor(private poolProvider: PoolProvider) { }

    public query(query: Query) {
        const dbQuery = {
            name: query.name,
            text: query.text,
            values: query.values ? query.values.slice() : undefined
        };
        return this.pool.query(dbQuery)
            .then(res => res.rows)
            .catch(err => { throw new Error(`Query ${query.text} error: ${err.message}, ${err.stack}`); });
    }

    public shutdown() {
        return this.pool.end();
    }
}

export { Database };
