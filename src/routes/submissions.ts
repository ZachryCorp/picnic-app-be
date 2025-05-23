import express, { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { include } = req.query;
    const submissions = await prisma.submission.findMany({
      include: {
        user: include === 'user' ? true : false,
      },
    });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching submissions', error: err });
  }
});

// TODO: Add a route to get a submission by id

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userId,
      park,
      fullTicket,
      mealTicket,
      childrenVerification,
      payrollDeduction,
      deductionPeriods,
    } = req.body;
    const submission = await prisma.submission.create({
      data: {
        userId,
        park,
        fullTicket,
        mealTicket,
        childrenVerification,
        payrollDeduction,
        deductionPeriods,
      },
    });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: 'Error creating submission', error: err });
  }
});

// TODO: Add a route to update a submission
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      park,
      fullTicket,
      mealTicket,
      childrenVerification,
      payrollDeduction,
      deductionPeriods,
    } = req.body;
    const submission = await prisma.submission.update({
      where: { id: parseInt(id) },
      data: {
        park,
        fullTicket,
        mealTicket,
        childrenVerification,
        payrollDeduction,
        deductionPeriods,
      },
    });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: 'Error updating submission', error: err });
  }
});

// TODO: Add a route to delete a submission

export default router;
