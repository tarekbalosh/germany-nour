import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/progress/:studentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const progress = await prisma.progressNote.findMany({
      where: { studentId, visibleToStudent: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

router.get('/materials/:studentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    // Realistically, we'd find the courses the student is enrolled in, and return those materials.
    const enrollments = await prisma.enrollment.findMany({ where: { studentId } });
    const courseIds = enrollments.map((e: any) => e.courseId);
    
    const materials = await prisma.material.findMany({
      where: { courseId: { in: courseIds } }
    });
    res.json(materials);
  } catch (error) {
    next(error);
  }
});

export default router;
