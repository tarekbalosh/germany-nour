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
