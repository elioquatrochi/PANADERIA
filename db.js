const sql = require('mssql/msnodesqlv8');

const dbConfig = {
  database: 'Prueba',
  server: 'localhost\\SQLEXPRESS',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('✅ Conectado a SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error conectando a la base de datos:', err);
  });

module.exports = {
  sql, poolPromise
};
