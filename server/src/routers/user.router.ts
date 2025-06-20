import {
  acceptFriendReq,
  denyFriendReq,
  getFriendReq,
  getMyFriends,
  getOnGoingFriendReqs,
  getRecommendedUsers,
  sendFriendReq,
} from '@/controllers/user.controller';
import { authenticateToken } from '@/middleware/authenticateToken';
import { Router } from 'express';

const expressRouter = Router();

expressRouter.use(authenticateToken);

expressRouter.get('/', getRecommendedUsers);
expressRouter.get('/friends', getMyFriends);

expressRouter.post('/friend-req/:id', sendFriendReq);
expressRouter.put('/friend-req/:id/accept', acceptFriendReq);
expressRouter.put('/friend-req/:id/deny', denyFriendReq);

expressRouter.get('/friend-req', getFriendReq);
expressRouter.get('/ongoing-friend-reqs', getOnGoingFriendReqs);

export default expressRouter;
