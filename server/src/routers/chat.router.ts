import { getStreanToken } from '@/controllers/chat.controller';
import {
  acceptFriendReq,
  getFriendReq,
  getMyFriends,
  getOnGoingFriendReqs,
  sendFriendReq,
} from '@/controllers/user.controller';
import { authenticateToken } from '@/middleware/authenticateToken';
import { Router } from 'express';

const expressRouter = Router();

expressRouter.get('/token', authenticateToken, getStreanToken);
expressRouter.get('/friends', getMyFriends);

expressRouter.post('/friend-req/:id', sendFriendReq);
expressRouter.put('/friend-req/:id/accept', acceptFriendReq);

expressRouter.get('/friend-req', getFriendReq);
expressRouter.get('/ongoing-friend-reqs', getOnGoingFriendReqs);

export default expressRouter;
