import { sql } from '../config/database';

export interface Request {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export const createRequestsTable = async (): Promise<void> => {
  try {
    await sql.query`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'requests')
      CREATE TABLE requests (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        title NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX),
        status NVARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    console.log('Requests table created or already exists');
  } catch (err) {
    console.error('Error creating requests table:', err);
    throw err;
  }
};
