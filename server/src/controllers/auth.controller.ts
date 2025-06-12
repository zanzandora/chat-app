import User from '@/models/user.model';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { AppError } from '@/utils/AppError';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, fullname } = req.body;
  try {
    if (!email || !password || !fullname) {
      throw new AppError('All fields are required', 400);
    }

    if (password.lenght < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(
        'Email already exists, please use a diffrent one',
        400
      );
    }

    const idx = Math.floor(Math.random() * 100) + 1; //*generate a num between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullname,
      password,
      img: randomAvatar,
    });

    // TODO: CREATE THE USER IN STREAM AS WELL

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: '7d',
      }
    );

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        // httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      })
    );

    res.status(201).json({ success: true, user: newUser });
  } catch (error: any) {
    next(error);
  }
};

export const login = async (req: Request, res: Response) => {
  res.status(200).json('hi');
};

export const logout = async (req: Request, res: Response) => {
  res.status(200).json('hi');
};
