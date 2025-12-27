db.js  const { Pool } = require('pg');

// Create a connection pool to PostgreSQL
const pool = new Pool({
Add clean database connection module (db.js)  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'database',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'saas_db'
});

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Query function for easy use
const query = (text, params) => pool.query(text, params);

// Get a client for transactions
const getClient = () => pool.connect();

// Close all connections
const close = () => pool.end();

module.exports = {
  pool,
  query,
  getClient,
  close
};
