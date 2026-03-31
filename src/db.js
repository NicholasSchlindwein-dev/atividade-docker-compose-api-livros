const mysql = require('mysql2/promise');

const {
  DB_HOST = 'db',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASSWORD = 'root',
  DB_NAME = 'atividade_db'
} = process.env;

let pool;

async function connectWithRetry(maxRetries = 20, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      pool = mysql.createPool({
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4'
      });

      await pool.query('SELECT 1');
      await pool.query("SET NAMES utf8mb4");
      console.log('Conexão com MySQL estabelecida.');
      return pool;
    } catch (error) {
      console.error(`Tentativa ${attempt}/${maxRetries} falhou ao conectar no banco: ${error.message}`);

      if (attempt === maxRetries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

function getPool() {
  if (!pool) {
    throw new Error('Pool do banco ainda não foi inicializado.');
  }

  return pool;
}

module.exports = {
  connectWithRetry,
  getPool
};