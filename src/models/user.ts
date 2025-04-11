import { sql } from '../config/database';

export interface User {
  id: number;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export const createUsersTable = async (): Promise<void> => {
  try {
    await sql.query`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
      CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL UNIQUE,
        email NVARCHAR(100) NOT NULL UNIQUE,
        role NVARCHAR(20) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `;
    console.log('Users table created or already exists');
  } catch (err) {
    console.error('Error creating users table:', err);
    throw err;
  }
};
