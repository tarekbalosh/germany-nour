const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(__dirname, p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
};

write('apps/api/src/routes/student.routes.ts', `
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
    const courseIds = enrollments.map(e => e.courseId);
    
    const materials = await prisma.material.findMany({
      where: { courseId: { in: courseIds } }
    });
    res.json(materials);
  } catch (error) {
    next(error);
  }
});

export default router;
`);

const apiIndex = fs.readFileSync(path.resolve(__dirname, 'apps/api/src/index.ts'), 'utf8');
if (!apiIndex.includes('studentRoutes')) {
  let updatedIndex = apiIndex.replace(
    "import bookingsRoutes from './routes/bookings.routes';",
    "import bookingsRoutes from './routes/bookings.routes';\nimport studentRoutes from './routes/student.routes';"
  );
  updatedIndex = updatedIndex.replace(
    "app.use('/api/v1/bookings', bookingsRoutes);",
    "app.use('/api/v1/bookings', bookingsRoutes);\napp.use('/api/v1/student', studentRoutes);"
  );
  fs.writeFileSync(path.resolve(__dirname, 'apps/api/src/index.ts'), updatedIndex);
}

write('apps/web/src/app/[locale]/portal/page.tsx', `
import { getTranslations } from 'next-intl/server';

export default async function StudentPortalPage() {
  const t = await getTranslations('Index'); // Fallback to index if no portal translations
  // Without actual auth, we cannot fetch data here easily on server without a hardcoded ID.
  // This is a UI skeleton mapping Phase 8 requirements.

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Student Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-bold mb-4">My Materials</h2>
          <p className="text-gray-600">Please log in to view your learning materials.</p>
        </section>
        
        <section className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-bold mb-4">My Progress</h2>
          <p className="text-gray-600">Please log in to view tutor feedback and progress.</p>
        </section>
      </div>
    </div>
  );
}
`);

console.log('Phase 8 script complete.');
