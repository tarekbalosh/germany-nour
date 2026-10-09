const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(__dirname, p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
};

const schema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  STUDENT
  TUTOR
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum EnrollmentStatus {
  ACTIVE
  ARCHIVED
}

model User {
  id             String    @id @default(uuid())
  name           String
  email          String    @unique
  passwordHash   String
  role           Role      @default(STUDENT)
  preferredLocale String   @default("en")
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  sessions       Session[]
  enrollments    Enrollment[]
  bookings       Booking[]
  materials      Material[]
  progressNotes  ProgressNote[]
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tokenHash String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Course {
  id                String       @id @default(uuid())
  titleEn           String
  titleDe           String
  titleAr           String
  level             String
  descriptionEn     String
  descriptionDe     String
  descriptionAr     String
  durationMinutes   Int
  isPublished       Boolean      @default(false)
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  enrollments       Enrollment[]
  bookings          Booking[]
  materials         Material[]
}

model Enrollment {
  id        String           @id @default(uuid())
  studentId String
  student   User             @relation(fields: [studentId], references: [id], onDelete: Cascade)
  courseId  String
  course    Course           @relation(fields: [courseId], references: [id], onDelete: Cascade)
  status    EnrollmentStatus @default(ACTIVE)
  enrolledAt DateTime        @default(now())

  @@unique([studentId, courseId])
}

model AvailabilitySlot {
  id        String   @id @default(uuid())
  startsAt  DateTime
  endsAt    DateTime
  status    String   @default("AVAILABLE")
  createdAt DateTime @default(now())
}

model Booking {
  id             String        @id @default(uuid())
  studentId      String
  student        User          @relation(fields: [studentId], references: [id], onDelete: Cascade)
  courseId       String?
  course         Course?       @relation(fields: [courseId], references: [id], onDelete: SetNull)
  startsAt       DateTime
  endsAt         DateTime
  status         BookingStatus @default(PENDING)
  meetingUrl     String?
  studentMessage String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

model Material {
  id          String   @id @default(uuid())
  title       String
  description String?
  url         String
  courseId    String?
  course      Course?  @relation(fields: [courseId], references: [id], onDelete: SetNull)
  createdById String
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdAt   DateTime @default(now())
}

model ProgressNote {
  id               String   @id @default(uuid())
  studentId        String
  student          User     @relation(fields: [studentId], references: [id], onDelete: Cascade)
  createdById      String
  note             String
  visibleToStudent Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
`;

write('apps/api/prisma/schema.prisma', schema);

const seed = `
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding courses...');
  const courses = [
    {
      titleEn: 'German A1', titleDe: 'Deutsch A1', titleAr: 'الألمانية A1',
      descriptionEn: 'Beginner', descriptionDe: 'Anfänger', descriptionAr: 'مبتدئ',
      level: 'A1', durationMinutes: 60, isPublished: true
    },
    {
      titleEn: 'German A2', titleDe: 'Deutsch A2', titleAr: 'الألمانية A2',
      descriptionEn: 'Elementary', descriptionDe: 'Grundlagen', descriptionAr: 'أساسي',
      level: 'A2', durationMinutes: 60, isPublished: true
    }
  ];

  for (const c of courses) {
    await prisma.course.create({ data: c });
  }
  console.log('Done!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
`;

write('apps/api/prisma/seed.ts', seed);
console.log('Phase 3 files created.');
