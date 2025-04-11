import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);

const connect = async (): Promise<void> => {
  try {
    await pool.connect();
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('SQL Server Connection Error:', err);
    throw err;
  }
};

export { pool, sql, connect };
export type { config as SqlConfig };
