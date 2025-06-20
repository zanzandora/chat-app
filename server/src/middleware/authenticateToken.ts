import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/models/user.model';
import { AppError } from '@/utils/AppError';

export const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      // res.redirect('/login');
      throw new AppError('Unauthorized - Dont have token', 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    if (!decoded) {
      throw new AppError('Unauthorized - Invalid token', 401);
    }

    let userId;
    if (typeof decoded === 'object' && 'userId' in decoded) {
      userId = (decoded as jwt.JwtPayload).userId;
    } else {
      throw new AppError('Unauthorized - Invalid token payload', 401);
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('Unauthorized - User bot found', 401);
    }
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
