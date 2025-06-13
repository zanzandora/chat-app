import { IUser } from '@/models/user.model';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
