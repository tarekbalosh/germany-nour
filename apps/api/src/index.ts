import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import { randomUUID } from 'crypto';
import authRoutes from './routes/auth.routes';
import coursesRoutes from './routes/courses.routes';
import bookingsRoutes from './routes/bookings.routes';
import studentRoutes from './routes/student.routes';
import adminRoutes from './routes/admin.routes';
import certificatesRoutes from './routes/certificates.routes';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use((req, res, next) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || randomUUID();
  next();
});

app.use(helmet());
app.use(cors({ origin: process.env.WEB_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', coursesRoutes);
app.use('/api/v1/bookings', bookingsRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/certificates', certificatesRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
