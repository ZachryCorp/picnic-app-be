import express from 'express';
import userRoutes from './users';
import requestRoutes from './requests';
import { Request, Response } from 'express';
import { pool } from '../config/database';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/requests', requestRoutes);

// Health check endpoint
router.get('/health', (req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

// Example endpoint that queries the database
router.get('/test-db', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.request().query('SELECT 1 as test');
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

export default router;
