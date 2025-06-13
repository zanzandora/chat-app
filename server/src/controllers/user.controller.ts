import User from '@/models/user.model';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/utils/AppError';
import FriendReq from '@/models/friendReq.model';

export const getRecommendedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = req.user?._id;
    const currentUser = req.user;

    /**
     * TODO:
     * * finds users who are not the current user
     * * are not friends of the current user
     * * have completed on broading
     */
    const recommendedusers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser?.friends } },
        { inOnboarded: true },
      ],
    });

    res.status(201).json(recommendedusers);
  } catch (error) {
    next(error);
  }
};

export const getMyFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id)
      .select('friends')
      .populate('friends', 'fullname img nativeLanguage learningLanguage');

    res.status(201).json(user?.friends);
  } catch (error) {
    next(error);
  }
};

export const sendFriendReq = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const myId = req.user?._id.toString();
    const { id: recipientId } = req.params;

    // prevent sending req to urseft
    if (myId === recipientId) {
      throw new AppError(`You can't send friend request to yourseft`, 400);
    }

    const recipient = await User.findById(recipientId);
    if (!recipientId) {
      throw new AppError(`Recipient not found`, 400);
    }

    if (recipient?.friends?.includes(myId)) {
      throw new AppError(`You are already friends with this user`, 400);
    }

    // *check if a req already exists
    const existingReq = await FriendReq.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingReq) {
      throw new AppError(
        'A friend request already exits between you and this user',
        400
      );
    }

    const friendReq = await FriendReq.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendReq);
  } catch (error) {
    next(error);
  }
};

export const acceptFriendReq = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: requestId } = req.params;

    const friendReq = await FriendReq.findById(requestId);

    if (!friendReq) {
      throw new AppError(`Friend request not found`, 400);
    }

    // *Verify the current user is the recipient
    if (friendReq.recipient.toString() !== req.user._id.toString()) {
      throw new AppError(`You are not authrized to accept this request`, 403);
    }

    friendReq.status = 'accepted';
    await friendReq.save();

    // *add each user to the other's friends array
    await User.findByIdAndUpdate(friendReq.sender, {
      $addToSet: { friends: friendReq.recipient },
    });

    await User.findByIdAndUpdate(friendReq.recipient, {
      $addToSet: { friends: friendReq.sender },
    });
    res.status(201).json({ message: 'Friend request accepted' });
  } catch (error) {
    next(error);
  }
};

export const getFriendReq = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const incomingReqs = await FriendReq.find({
      recipient: req.user._id,
      status: 'pending',
    }).populate('sender', 'fullname img nativeLanguage learningLanguage');

    const acceptedReqs = await FriendReq.find({
      recipient: req.user._id,
      status: 'accepted',
    }).populate('recipient', 'fullname img');
    res.status(201).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    next(error);
  }
};

export const getOnGoingFriendReqs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const onGoingFriendReqs = await FriendReq.find({
      recipient: req.user._id,
      status: 'pending',
    }).populate('sender', 'fullname img nativeLanguage learningLanguage');

    res.status(200).json(onGoingFriendReqs);
  } catch (error) {
    next(error);
  }
};
