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
      additionalFullTicket = 0,
      additionalMealTicket = 0,
      childrenVerification = false,
      payrollDeduction = false,
      deductionPeriods = 0,
      guest = false,
      pendingDependentChildren = 0,
      notes = '',
    } = req.body;

    // Calculate total tickets to be distributed
    const ticketsToBeDistributed = additionalFullTicket + additionalMealTicket;

    const submission = await prisma.submission.create({
      data: {
        userId,
        park,
        fullTicket,
        mealTicket,
        additionalFullTicket,
        additionalMealTicket,
        ticketsToBeDistributed,
        ticketNumber: '', // Default empty string as per schema
        childrenVerification,
        pendingDependentChildren,
        payrollDeduction,
        deductionPeriods,
        guest,
        notes,
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
      additionalFullTicket,
      additionalMealTicket,
      childrenVerification,
      payrollDeduction,
      deductionPeriods,
      notes,
    } = req.body;
    const submission = await prisma.submission.update({
      where: { id: parseInt(id) },
      data: {
        park,
        fullTicket,
        mealTicket,
        additionalFullTicket,
        additionalMealTicket,
        childrenVerification,
        payrollDeduction,
        deductionPeriods,
        notes,
      },
    });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: 'Error updating submission', error: err });
  }
});

// TODO: Add a route to delete a submission
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.submission.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Submission deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting submission', error: err });
  }
});

export default router;
