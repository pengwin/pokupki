import * as pg from 'pg';
import * as url from 'url';

const config = getConfig(process.env.DATABASE_URL);
const pool = createPool(config);

const query = (query: string | pg.QueryConfig) => pool.query(query);
const shutdown = () => pool.end();

function getConfig(databaseUrl?: string): pg.PoolConfig {
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
    port: port,
    database: params.pathname.split('/')[1],
    ssl: true,
    max: 20
  };
}

function createPool(config: pg.PoolConfig) {
  const pool = new pg.Pool(config);

  pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack);
  });

  return pool;
}

export { query };
export { shutdown };


