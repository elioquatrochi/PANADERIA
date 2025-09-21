const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render lo inyecta
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
