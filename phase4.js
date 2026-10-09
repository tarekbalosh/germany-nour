const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(__dirname, p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
};

write('apps/api/src/middlewares/errorHandler.ts', `
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.errors
      }
    });
  }

  const statusCode = err.status || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;
  
  // Log error safely here without secrets...
  console.error(\`[Error] \${err.message}\`);

  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message
    }
  });
}
`);

write('apps/api/src/index.ts', `
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import { randomUUID } from 'crypto';

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

app.use(errorHandler);

app.listen(port, () => {
  console.log(\`API server is running on port \${port}\`);
});
`);

console.log('Phase 4 files created.');
