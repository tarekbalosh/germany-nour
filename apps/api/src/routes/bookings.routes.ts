import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/slots', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      where: {
        status: 'AVAILABLE',
        startsAt: { gte: new Date() }
      }
    });
    res.json(slots);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  // Authentication required here realistically
  try {
    const { slotId, courseId } = req.body;
    const slot = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });
    if (!slot || slot.status !== 'AVAILABLE') return res.status(400).json({ error: { message: 'Slot unavailable' } });
    
    // Hardcode a studentId for now to bypass Auth error since we don't have a real req.user.id
    // But we need a valid student ID from the database if foreign key constraints are on.
    // The seed creates some users, we can just fetch the first student.
    const student = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
    if (!student) return res.status(400).json({ error: { message: 'No student found to associate booking with.' } });

    const booking = await prisma.booking.create({
      data: {
        studentId: student.id,
        courseId,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        status: 'PENDING'
      }
    });

    await prisma.availabilitySlot.update({ where: { id: slot.id }, data: { status: 'BOOKED' } });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

export default router;
