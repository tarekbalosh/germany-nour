import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const courses = [
  { level: 'A1', title: 'German A1' },
  { level: 'A2.1', title: 'German A2.1' },
  { level: 'A2.2', title: 'German A2.2' },
  { level: 'B1.1', title: 'German B1.1' },
  { level: 'B1.2', title: 'German B1.2' },
  { level: 'C1.1', title: 'German C1.1' },
  { level: 'C2.2', title: 'German C2.2' }
];

async function main() {
  for (const c of courses) {
    // Check if course already exists
    const existing = await prisma.course.findFirst({
      where: { level: c.level }
    });

    if (!existing) {
      await prisma.course.create({
        data: {
          titleEn: c.title,
          titleDe: `Deutsch ${c.level}`,
          titleAr: `الألمانية ${c.level}`,
          level: c.level,
          descriptionEn: `Comprehensive ${c.level} level German course.`,
          descriptionDe: `Umfassender Deutschkurs auf Niveau ${c.level}.`,
          descriptionAr: `دورة لغة ألمانية شاملة للمستوى ${c.level}.`,
          durationHours: 40,
          price: 150,
          isPublished: true
        }
      });
      console.log(`Created course ${c.level}`);
    } else {
      console.log(`Course ${c.level} already exists`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
