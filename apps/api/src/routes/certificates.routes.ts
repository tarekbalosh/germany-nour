import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Admin: Upload certificate for a student
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    const { studentId, title } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!studentId || !title) {
      return res.status(400).json({ error: 'studentId and title are required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const certificate = await prisma.certificate.create({
      data: {
        studentId,
        title,
        fileUrl
      }
    });

    res.status(201).json(certificate);
  } catch (error) {
    next(error);
  }
});

// Admin & Student: Get certificates for a student
router.get('/student/:studentId', async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const certificates = await prisma.certificate.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(certificates);
  } catch (error) {
    next(error);
  }
});

// Admin: Delete a certificate
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const certificate = await prisma.certificate.findUnique({ where: { id } });
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    // delete file if exists
    const filePath = path.join(process.cwd(), certificate.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await prisma.certificate.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
