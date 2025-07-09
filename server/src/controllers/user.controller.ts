import User, { IUser } from '@/models/user.model';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/utils/AppError';
import FriendReq from '@/models/friendReq.model';
import { getCache, getKey, saveCache } from '@/utils/RedisCache';
import { deleteStreamChannel } from '@/libs/stream';

export const getRecommendedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = req.user?._id;
    const currentUser = req.user;

    const pendingFriendReqs = await FriendReq.find({
      status: 'pending',
      $or: [{ sender: currentUserId }, { recipient: currentUserId }],
    });

    // Collect all user IDs who are in a pending FriendReq with the current user
    const pendingUserIds = pendingFriendReqs
      .filter((req) => req.sender.toString() !== currentUserId.toString())
      .map((req) => req.sender.toString());

    // Prepare the exclusion list: friends + users with pending FriendReq
    const excludeIds = [
      currentUserId,
      ...(currentUser?.friends || []),
      ...pendingUserIds,
    ];

    /**
     * TODO:
     * * finds users who are not the current user
     * * are not friends of the current user
     * * are on the pending state req
     * * have completed on broading
     */
    const recommendedusers = await User.find({
      $and: [{ _id: { $nin: excludeIds } }, { inOnboarded: true }],
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
    const userId = req.user?._id;
    const prefix = 'friends';

    const key = getKey('user', userId.toString(), prefix);

    //Get cached first
    const cachedProfile = await getCache(key);

    if (cachedProfile) {
      // console.log('⚡ Cache hit: ', userId.toString());
      res.json(cachedProfile);
      return;
    }

    const user = await User.findById(req.user?._id)
      .select('friends')
      .populate('friends', ' -password');

    // Save cache if data not found
    await saveCache(key, user?.friends, 300);

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

    // Sau khi cập nhật DB (add friend), cập nhật cache cho cả hai user

    // 1. Cập nhật cache cho sender
    const [sender, recipient] = await Promise.all([
      User.findById(friendReq.sender).select('friends').populate('friends'),
      User.findById(friendReq.recipient).select('friends').populate('friends'),
    ]);

    const senderFriends = (sender?.friends || []).filter(
      (f: any) => f._id.toString() !== friendReq.sender.toString()
    );

    const recipientFriends = (recipient?.friends || []).filter(
      (f: any) => f._id.toString() !== friendReq.recipient.toString()
    );

    const senderKey = getKey('user', friendReq.sender.toString(), 'friends');
    const recipientKey = getKey(
      'user',
      friendReq.recipient.toString(),
      'friends'
    );

    await Promise.all([
      saveCache(senderKey, senderFriends, 300),
      saveCache(recipientKey, recipientFriends, 300),
    ]);

    const senderInfor = await FriendReq.findById(requestId)
      .select('sender')
      .populate('sender', '_id fullname');

    const recipientInfo = await FriendReq.findById(requestId)
      .select('recipient')
      .populate('recipient', '_id fullname');

    res.status(201).json({
      message: 'Friend request accepted',
      senderInfor,
      recipientInfo,
    });
  } catch (error) {
    next(error);
  }
};

export const denyFriendReq = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: requestId } = req.params;

    const friendReq = await FriendReq.findById(requestId);

    if (!friendReq) {
      throw new AppError('Friend request not found', 404);
    }

    // Only the recipient can deny the request
    if (friendReq.recipient.toString() !== req.user._id.toString()) {
      throw new AppError('You are not authorized to deny this request', 403);
    }

    await FriendReq.findByIdAndDelete(requestId);

    res.status(200).json({ message: 'Friend request denied and deleted' });
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
      sender: req.user._id,
      status: 'accepted',
    })
      .populate('recipient', 'fullname img')
      .sort({ updatedAt: -1 });

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
      sender: req.user._id,
      status: 'pending',
    }).populate('recipient', 'fullname img nativeLanguage learningLanguage');

    res.status(200).json(onGoingFriendReqs);
  } catch (error) {
    next(error);
  }
};

export const deleteMyFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const myId = req.user._id;
    let { id: friendId } = req.params;

    // Remove each other from friends list
    await User.findByIdAndUpdate(myId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: myId } });

    // TODO: DELETE FRIEND REQUEST
    await FriendReq.findOneAndDelete({
      $or: [
        { sender: myId, recipient: friendId },
        { sender: friendId, recipient: myId },
      ],
    });

    // TODO: DELETE THE CHANNEL IN STREAM AS WELL
    await deleteStreamChannel('messaging', `${myId}-${friendId}`);

    const senderKey = getKey('user', myId.toString(), 'friends');
    const recipientKey = getKey('user', friendId, 'friends');

    const senderCached = await getCache(senderKey);
    const recipientCached = await getCache(recipientKey);

    if (senderCached) {
      try {
        const updatedFriends = senderCached.filter(
          (friend: IUser) => friend._id.toString() !== friendId.toString()
        );
        console.log('⚡ Cache hit for friends delete, updating cache');

        await saveCache(senderKey, updatedFriends, 300);
      } catch (error) {
        console.error('Failed to parse friend cache', error);
        throw new AppError('Failed to parse friend cache', 500);
      }
    }

    if (recipientCached) {
      try {
        const updatedFriends = recipientCached.filter(
          (friend: IUser) => friend._id.toString() !== myId.toString()
        );
        console.log('⚡ Cache hit for friends delete, updating cache');

        await saveCache(recipientKey, updatedFriends, 300);
      } catch (error) {
        console.error('Failed to parse friend cache', error);
        throw new AppError('Failed to parse friend cache', 500);
      }
    }

    res.status(200).json({
      message:
        'Friend deleted, chat messages and video data still on the Stream storage.',
    });
  } catch (error) {
    next(error);
  }
};
