import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/login-phone', async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone number are required' });
    }

    const settings = await prisma.systemSetting.findUnique({ where: { id: "1" } });
    if (settings?.maintenanceMode) {
      return res.status(503).json({ error: 'System is currently in maintenance mode. Please try again later.' });
    }

    // Check if user exists by phone
    let user = await prisma.user.findUnique({
      where: { phoneNumber: phone }
    });

    // If not, create them if registrations are enabled
    if (!user) {
      if (settings && !settings.enableRegistrations) {
        return res.status(403).json({ error: 'New registrations are currently disabled.' });
      }

      user = await prisma.user.create({
        data: {
          name,
          phoneNumber: phone,
          role: 'STUDENT',
          isActive: true
        }
      });
    } else {
      // If user exists, you could optionally update their name if it changed
      if (user.name !== name) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name }
        });
      }
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', (req, res) => {
  // MVP placeholder
  res.status(200).json({ message: 'Login endpoint' });
});

export default router;
