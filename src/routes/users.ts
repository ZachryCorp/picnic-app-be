import express, { Request, Response } from 'express';
import { pool, sql } from '../config/database';
import { User } from '../models/user';

const router = express.Router();

// Get all users
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.request().query<User[]>`SELECT * FROM users`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// Get user by ID
router.get<{ id: string }>(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await pool.request().query<
        User[]
      >`SELECT * FROM users WHERE id = ${id}`;
      if (result.recordset.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(result.recordset[0]);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user', error: err });
    }
  }
);

// Create user
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, role } = req.body;
    const result = await pool.request().query`
      INSERT INTO users (email, role)
      OUTPUT INSERTED.*
      VALUES (${email}, ${role})
    `;
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});

// Update user
router.put<{ id: string }>(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { email, role } = req.body;
      const result = await pool.request().query`
      UPDATE users
      SET email = ${email}, role = ${role}, updated_at = GETDATE()
      OUTPUT INSERTED.*
      WHERE id = ${id}
    `;
      if (result.recordset.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(result.recordset[0]);
    } catch (err) {
      res.status(500).json({ message: 'Error updating user', error: err });
    }
  }
);

// Delete user
router.delete<{ id: string }>(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await pool.request().query`
      DELETE FROM users
      OUTPUT DELETED.*
      WHERE id = ${id}
    `;
      if (result.recordset.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting user', error: err });
    }
  }
);

export default router;
