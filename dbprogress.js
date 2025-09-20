const { Pool } = require("pg");

const pool = new Pool({
  host: "dpg-d37j45emcj7s73fmj6dg-a",        // dpg-xxxxx
  port: 5432,
  user: "prueba_elsf_user",     // ej: prueba_elsf_user
  password: "",
  database: "prueba_elsf",// ej: prueba_elsf
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
