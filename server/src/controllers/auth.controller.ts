import User from '@/models/user.model';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { AppError } from '@/utils/AppError';
import { upsertStreamUser } from '@/libs/stream';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, fullname } = req.body;

    const missingFields: string[] = [];

    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!fullname) missingFields.push('fullname');

    if (missingFields.length > 0) {
      throw new AppError('All fields are required', 400, { missingFields });
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
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: fullname,
        image: randomAvatar || '',
      });
      console.log(`Stream user created for ${newUser.fullname}`);
    } catch (error) {
      throw new AppError(`Error creating Stream user: ${error}`, 400);
    }

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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError('All fields are required', 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: '7d',
    });

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

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const onboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    const { fullname, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    const missingFields: string[] = [];

    if (!fullname) missingFields.push('fullname');
    if (!bio) missingFields.push('bio');
    if (!nativeLanguage) missingFields.push('nativeLanguage');
    if (!learningLanguage) missingFields.push('learningLanguage');
    if (!location) missingFields.push('location');

    if (missingFields.length > 0) {
      throw new AppError('Missing required fields', 401, { missingFields });
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        inOnboarded: true,
      },
      { new: true }
    );

    if (!updateUser) {
      throw new AppError('User not found', 404);
    }

    // TODO: UPDATE USER IN STREAM
    try {
      await upsertStreamUser({
        id: updateUser._id.toString(),
        name: updateUser.fullname,
        image: updateUser.img || '',
      });
      console.log(`Stream user updated for ${updateUser.fullname}`);
    } catch (error) {
      throw new AppError(`Error creating Stream user: ${error}`, 400);
    }

    res.status(200).json({ success: true, user: updateUser });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token', { secure: process.env.NODE_ENV === 'production' });
  res.status(200).json({ success: true, message: 'Logout successful' });
};
