import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding courses...');
  const courses = [
    {
      titleEn: 'German A1', titleDe: 'Deutsch A1', titleAr: 'الألمانية A1',
      descriptionEn: 'Beginner', descriptionDe: 'Anfänger', descriptionAr: 'مبتدئ',
      level: 'A1', durationHours: 40, price: 150, isPublished: true
    },
    {
      titleEn: 'German A2', titleDe: 'Deutsch A2', titleAr: 'الألمانية A2',
      descriptionEn: 'Elementary', descriptionDe: 'Grundlagen', descriptionAr: 'أساسي',
      level: 'A2', durationHours: 40, price: 150, isPublished: true
    }
  ];

  for (const c of courses) {
    const existing = await prisma.course.findFirst({ where: { level: c.level } });
    if (!existing) {
      await prisma.course.create({ data: c });
    }
  }
  console.log('Done!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
