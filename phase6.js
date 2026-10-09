const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(__dirname, p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
};

write('apps/api/src/routes/courses.routes.ts', `
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
`);

const apiIndex = fs.readFileSync(path.resolve(__dirname, 'apps/api/src/index.ts'), 'utf8');
if (!apiIndex.includes('coursesRoutes')) {
  let updatedIndex = apiIndex.replace(
    "import authRoutes from './routes/auth.routes';",
    "import authRoutes from './routes/auth.routes';\nimport coursesRoutes from './routes/courses.routes';"
  );
  updatedIndex = updatedIndex.replace(
    "app.use('/api/v1/auth', authRoutes);",
    "app.use('/api/v1/auth', authRoutes);\napp.use('/api/v1/courses', coursesRoutes);"
  );
  fs.writeFileSync(path.resolve(__dirname, 'apps/api/src/index.ts'), updatedIndex);
}

write('apps/web/src/app/[locale]/courses/page.tsx', `
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

async function getCourses() {
  try {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/v1/courses', { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export default async function CoursesPage() {
  const t = await getTranslations('Courses');
  const courses = await getCourses();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      {courses.length === 0 ? (
        <p>No courses available at the moment.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c: any) => (
            <li key={c.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{c.title}</h2>
              <p className="text-gray-600 mb-2">{c.level} - {c.durationWeeks} Weeks</p>
              <p className="font-bold text-lg text-blue-600 mb-4">€{c.price}</p>
              <Link href={\`/courses/\${c.id}\`} className="bg-blue-600 text-white px-4 py-2 rounded">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
`);

write('apps/web/src/app/[locale]/courses/[id]/page.tsx', `
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

async function getCourse(id: string) {
  try {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + \`/api/v1/courses/\${id}\`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const t = await getTranslations('Courses');
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) return notFound();

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-600 text-lg mb-2">Level: {course.level}</p>
      <p className="text-gray-600 text-lg mb-2">Duration: {course.durationWeeks} Weeks</p>
      <p className="font-bold text-2xl text-blue-600 mb-6">€{course.price}</p>
      <p className="text-gray-800 leading-relaxed">{course.description || 'No description available.'}</p>
    </div>
  );
}
`);

console.log('Phase 6 script complete.');
