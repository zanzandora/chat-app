import { getStreanToken } from '@/controllers/chat.controller';

import { authenticateToken } from '@/middleware/authenticateToken';
import { Router } from 'express';

const expressRouter = Router();

expressRouter.get('/token', authenticateToken, getStreanToken);

export default expressRouter;
