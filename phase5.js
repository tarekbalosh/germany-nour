const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(__dirname, p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
};

write('apps/api/src/middlewares/auth.ts', `
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Simplistic MVP session check
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No token' } });
  
  const session = await prisma.session.findUnique({ where: { tokenHash: token }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }
  
  (req as any).user = session.user;
  next();
}

export function requireTutor(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'TUTOR') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Tutor access required' } });
  }
  next();
}
`);

write('apps/api/src/routes/auth.routes.ts', `
import { Router } from 'express';
const router = Router();

router.post('/login', (req, res) => {
  // MVP placeholder
  res.status(200).json({ message: 'Login endpoint' });
});

export default router;
`);

write('apps/api/src/index.ts', `
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import { randomUUID } from 'crypto';
import authRoutes from './routes/auth.routes';

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

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(\`API server is running on port \${port}\`);
});
`);

console.log('Phase 5 scaffold complete.');
