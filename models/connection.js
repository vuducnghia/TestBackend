const pgPromise = require('pg-promise');

const pgp = pgPromise({}); // Empty object means no additional config required

const config = {
    host: '127.0.0.1',
    user: 'postgres',
    database: 'demo',
    password: '1',
    port: 5432,
};

const db = pgp(config);
module.exports = {db};