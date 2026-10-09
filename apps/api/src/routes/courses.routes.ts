import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const createCourseSchema = z.object({
  title: z.string().min(1),
  level: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  durationWeeks: z.number().int().positive()
});

router.get('/', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({ where: { isPublished: true } });
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) return res.status(404).json({ error: { message: 'Course not found' } });
    res.json(course);
  } catch (error) {
    next(error);
  }
});

export default router;
