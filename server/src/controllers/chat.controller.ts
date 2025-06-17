import { NextFunction, Request, Response } from 'express';
import { generateStreamToken } from '@/libs/stream';
import { AppError } from '@/utils/AppError';

export const getStreanToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await generateStreamToken(req.user._id.toString());

    if (!token) {
      throw new AppError('Failed to generate stream token');
    }
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
