import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const router = Router();
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'dummy@example.com',
    pass: process.env.SMTP_PASS || 'dummy-pass'
  }
});

const createCourseSchema = z.object({
  title: z.string().min(1),
  level: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  durationWeeks: z.number().int().positive()
});

router.get('/', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });
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

router.post('/:id/enroll', async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { studentId } = req.body;
    if (!studentId) return res.status(400).json({ error: { message: 'Student ID required' } });

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId }
      }
    });

    if (existing) {
      return res.status(400).json({ error: { message: 'Already enrolled in this course' } });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        courseId
      },
      include: {
        student: true,
        course: true
      }
    });

    // Send email to admin
    try {
      const settings = await prisma.systemSetting.findFirst();
      const contactEmail = settings?.contactEmail || 'admin@germanacademy.com';
      
      const mailOptions = {
        from: '"German Academy System" <system@germanacademy.com>',
        to: contactEmail,
        subject: `New Enrollment: ${enrollment.course.titleEn}`,
        text: `Hello Admin,

A new student has enrolled in a course.

Student Details:
Name: ${enrollment.student.name}
Email: ${enrollment.student.email || 'N/A'}
Phone: ${enrollment.student.phoneNumber || 'N/A'}

Course Details:
Title: ${enrollment.course.titleEn}
Level: ${enrollment.course.level}

Please confirm the booking with the student.
`
      };

      console.log('Sending email to:', contactEmail);
      transporter.sendMail(mailOptions).catch(err => {
         console.error('Email sending failed (this is expected if SMTP is not configured):', err.message);
      });
    } catch (emailError) {
      console.error('Error preparing email:', emailError);
    }

    res.json(enrollment);
  } catch (error) {
    next(error);
  }
});

export default router;
