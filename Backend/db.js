const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gymos',
    password: 'aswin', // Change this to your real Postgres password
    port: 5432,
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL Database!'))
    .catch(err => console.error('PostgreSQL Connection Error:', err.stack));

module.exports = pool;