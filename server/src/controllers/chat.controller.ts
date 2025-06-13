import User from '@/models/user.model';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/utils/AppError';
import FriendReq from '@/models/friendReq.model';
import { generateStreamToken } from '@/libs/stream';

export const getStreanToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = generateStreamToken(req.user._id.toString());

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
