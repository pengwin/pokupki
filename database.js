const pg = require('pg');
const url = require('url');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('Couldn\'t find DATABASE_URL env');
}

const params = url.parse(databaseUrl);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true,
  max: 20
};

const pool = new pg.Pool(config);

module.exports.query = (query) => pool.query(query);
module.exports.shutdown = () => pool.end();


