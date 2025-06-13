import { login, logout, onboard, signup } from '@/controllers/auth.controller';
import { authenticateToken } from '@/middleware/authenticateToken';
import { Router } from 'express';

const expressRouter = Router();

expressRouter.post('/signup', signup);
expressRouter.post('/login', login);
expressRouter.post('/logout', logout);

expressRouter.post('/onboarding', authenticateToken, onboard);

// * CHECK IF USER LOGGIN
expressRouter.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default expressRouter;
