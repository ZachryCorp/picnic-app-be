import express, { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = express.Router();

// Get all users
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { include } = req.query;
    const result = await prisma.user.findMany({
      include: {
        submissions: include === 'submissions' ? true : false,
      },
    });
    res.json(result);
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
      const { include } = req.query;
      const result = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          submissions: include === 'submissions' ? true : false,
        },
      });
      if (!result) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user', error: err });
    }
  }
);

// Create user
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const result = await prisma.user.create({
      data: { email },
    });
    res.status(201).json(result);
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
      const { email } = req.body;
      const result = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { email },
      });
      if (!result) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(result);
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
      const result = await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      if (!result) {
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
