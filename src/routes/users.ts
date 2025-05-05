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

// Get user by EIN
router.get<{ ein: string }>(
  '/:ein',
  async (req: Request<{ ein: string }>, res: Response): Promise<void> => {
    try {
      const { ein } = req.params;
      const { lastName } = req.query;

      // Ensure lastName is provided
      if (!lastName || typeof lastName !== 'string') {
        res
          .status(400)
          .json({ message: 'Missing or invalid lastName query parameter' });
        return;
      }

      const result = await prisma.user.findFirst({
        where: {
          ein: parseInt(ein),
          lastName: lastName as string,
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
    const { lastName, firstName, ein, jobNumber, email, children, guest } =
      req.body;
    const result = await prisma.user.create({
      data: {
        lastName,
        firstName,
        ein,
        jobNumber,
        email,
        children,
        guest,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});

// Authenticate user
router.post(
  '/authenticate',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { ein, lastName } = req.body;
      const result = await prisma.user.findFirst({
        where: {
          ein: parseInt(ein),
          lastName,
        },
      });
      if (!result) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(result);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error authenticating user', error: err });
    }
  }
);

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
