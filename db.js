const sql = require("mssql");

// Configuración con variables de entorno (Railway → Variables)
const dbConfig = {
  user: process.env.DB_USER,        // ej: "sa"
  password: process.env.DB_PASSWORD, // clave del usuario
  database: process.env.DB_NAME,     // ej: "Prueba"
  server: process.env.DB_HOST,       // ej: "sqlserver-railway.cloud"
  port: parseInt(process.env.DB_PORT || "1433", 10),
  options: {
    encrypt: true,             // Railway/Azure suelen requerirlo
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log("✅ Conectado a SQL Server en Railway");
    return pool;
  })
  .catch(err => {
    console.error("❌ Error conectando a la base de datos:", err);
  });

module.exports = { sql, poolPromise };
