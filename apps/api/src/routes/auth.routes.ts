import { Router } from 'express';
const router = Router();

router.post('/login', (req, res) => {
  // MVP placeholder
  res.status(200).json({ message: 'Login endpoint' });
});

export default router;
