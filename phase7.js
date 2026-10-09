const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(__dirname, p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
};

write('apps/api/src/routes/bookings.routes.ts', `
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/slots/:courseId', async (req, res, next) => {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      where: {
        tutor: { enrollments: { some: { courseId: req.params.courseId } } },
        isBooked: false,
        startTime: { gte: new Date() }
      }
    });
    res.json(slots);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  // Authentication required here realistically
  try {
    const { slotId } = req.body;
    // MVP pseudo code
    const slot = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });
    if (!slot || slot.isBooked) return res.status(400).json({ error: { message: 'Slot unavailable' } });
    
    // Defer payment as requested
    const booking = await prisma.booking.create({
      data: {
        slotId: slot.id,
        studentId: 'pseudo-student-id', // Replace with req.user.id
        status: 'PENDING',
        paymentStatus: 'DEFERRED'
      }
    });

    await prisma.availabilitySlot.update({ where: { id: slot.id }, data: { isBooked: true } });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

export default router;
`);

const apiIndex = fs.readFileSync(path.resolve(__dirname, 'apps/api/src/index.ts'), 'utf8');
if (!apiIndex.includes('bookingsRoutes')) {
  let updatedIndex = apiIndex.replace(
    "import coursesRoutes from './routes/courses.routes';",
    "import coursesRoutes from './routes/courses.routes';\nimport bookingsRoutes from './routes/bookings.routes';"
  );
  updatedIndex = updatedIndex.replace(
    "app.use('/api/v1/courses', coursesRoutes);",
    "app.use('/api/v1/courses', coursesRoutes);\napp.use('/api/v1/bookings', bookingsRoutes);"
  );
  fs.writeFileSync(path.resolve(__dirname, 'apps/api/src/index.ts'), updatedIndex);
}

console.log('Phase 7 script complete.');
