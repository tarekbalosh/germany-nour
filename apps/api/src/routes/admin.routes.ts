import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/dashboard', async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalBookings,
      recentUsers,
      recentEnrollments,
      recentBookings
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.booking.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, phoneNumber: true, role: true, createdAt: true }
      }),
      prisma.enrollment.findMany({
        orderBy: { enrolledAt: 'desc' },
        take: 5,
        include: {
          student: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, titleEn: true, titleDe: true, titleAr: true } }
        }
      }),
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          student: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, titleEn: true, titleDe: true, titleAr: true } }
        }
      })
    ]);

    res.json({
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalBookings
      },
      recentActivity: {
        users: recentUsers,
        enrollments: recentEnrollments,
        bookings: recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
});

// Users
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        phoneNumber: true, 
        role: true, 
        isActive: true, 
        createdAt: true,
        _count: {
          select: { certificates: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;
    // Basic implementation (ideally hash password)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'STUDENT',
        passwordHash: password || 'defaultpasswordhash' 
      }
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Courses
router.get('/courses', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

router.post('/courses', async (req, res, next) => {
  try {
    const { titleEn, titleDe, titleAr, level, descriptionEn, descriptionDe, descriptionAr, durationHours, price, hasFreeTrial } = req.body;
    const newCourse = await prisma.course.create({
      data: {
        titleEn,
        titleDe,
        titleAr,
        level,
        descriptionEn,
        descriptionDe,
        descriptionAr,
        durationHours: parseInt(durationHours) || 0,
        price: parseFloat(price) || 0,
        isPublished: true,
        hasFreeTrial: Boolean(hasFreeTrial)
      }
    });
    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
});

router.put('/courses/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titleEn, titleDe, titleAr, level, descriptionEn, descriptionDe, descriptionAr, durationHours, price, isPublished, hasFreeTrial } = req.body;
    
    const updateData: any = {
      titleEn,
      titleDe,
      titleAr,
      level,
      descriptionEn,
      descriptionDe,
      descriptionAr,
      durationHours: parseInt(durationHours) || 0,
      price: parseFloat(price) || 0
    };

    if (isPublished !== undefined) {
      updateData.isPublished = Boolean(isPublished);
    }
    if (hasFreeTrial !== undefined) {
      updateData.hasFreeTrial = Boolean(hasFreeTrial);
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData
    });
    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
});

router.delete('/courses/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Settings
router.get('/settings', async (req, res, next) => {
  try {
    let settings = await prisma.systemSetting.findUnique({
      where: { id: "1" }
    });
    if (!settings) {
      settings = await prisma.systemSetting.create({
        data: { id: "1" }
      });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

router.put('/settings', async (req, res, next) => {
  try {
    const { academyName, contactEmail, contactPhone, defaultLanguage, timezone, enableRegistrations, maintenanceMode } = req.body;
    const settings = await prisma.systemSetting.upsert({
      where: { id: "1" },
      update: {
        academyName,
        contactEmail,
        contactPhone,
        defaultLanguage,
        timezone,
        enableRegistrations: Boolean(enableRegistrations),
        maintenanceMode: Boolean(maintenanceMode)
      },
      create: {
        id: "1",
        academyName: academyName || "German Academy",
        contactEmail: contactEmail || "admin@germanacademy.com",
        contactPhone: contactPhone || "+49123456789",
        defaultLanguage: defaultLanguage || "English",
        timezone: timezone || "Europe/Berlin (CET)",
        enableRegistrations: Boolean(enableRegistrations),
        maintenanceMode: Boolean(maintenanceMode)
      }
    });
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

export default router;
