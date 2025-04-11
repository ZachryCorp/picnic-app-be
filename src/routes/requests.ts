import express, { Request, Response } from 'express';
import { pool } from '../config/database';
import { Request as RequestModel } from '../models/request';

const router = express.Router();

// Get all requests
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.request().query<
      RequestModel[]
    >`SELECT * FROM requests`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err });
  }
});

// Get request by ID
router.get<{ id: string }>(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await pool.request().query<
        RequestModel[]
      >`SELECT * FROM requests WHERE id = ${id}`;
      if (result.recordset.length === 0) {
        res.status(404).json({ message: 'Request not found' });
        return;
      }
      res.json(result.recordset[0]);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching request', error: err });
    }
  }
);

// Create request
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, title, description, status } = req.body;
    const result = await pool.request().query`
      INSERT INTO requests (user_id, title, description, status)
      OUTPUT INSERTED.*
      VALUES (${user_id}, ${title}, ${description}, ${status || 'pending'})
    `;
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error creating request', error: err });
  }
});

// Update request
router.put<{ id: string }>(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { user_id, title, description, status } = req.body;
      const result = await pool.request().query`
      UPDATE requests
      SET user_id = ${user_id}, title = ${title}, description = ${description}, 
          status = ${status}, updated_at = GETDATE()
      OUTPUT INSERTED.*
      WHERE id = ${id}
    `;
      if (result.recordset.length === 0) {
        res.status(404).json({ message: 'Request not found' });
        return;
      }
      res.json(result.recordset[0]);
    } catch (err) {
      res.status(500).json({ message: 'Error updating request', error: err });
    }
  }
);

// Delete request
router.delete<{ id: string }>(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await pool.request().query`
      DELETE FROM requests
      OUTPUT DELETED.*
      WHERE id = ${id}
    `;
      if (result.recordset.length === 0) {
        res.status(404).json({ message: 'Request not found' });
        return;
      }
      res.json({ message: 'Request deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting request', error: err });
    }
  }
);

export default router;
