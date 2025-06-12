import { login, logout, signup } from '@/controllers/auth.controller';
import { Router } from 'express';

const expressRouter = Router();

expressRouter.post('/signup', signup);
expressRouter.post('/login', login);
expressRouter.post('/logout', logout);

export default expressRouter;
