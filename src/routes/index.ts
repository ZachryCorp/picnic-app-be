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

export default router;
