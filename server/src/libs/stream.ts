import '@/config/env';
import { AppError } from '@/utils/AppError';
import { StreamChat } from 'stream-chat';

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.log('Stream API Key or Stream API Secret is missing');
  throw new Error('Stream API Key or Stream API Secret is missing');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// TODO: CREATE THE USER IN STREAM AS WELL
export const upsertStreamUser = async (userData: any) => {
  try {
    await streamClient.upsertUsers([userData]);

    return userData;
  } catch (error) {
    console.log('Error upsert Stream User');
    throw new AppError('Error upsert Stream User', 400);
  }
};

// TODO: GENERATE A TOKEN FOR THE USER
export const generateStreamToken = async (userId: string) => {
  try {
    return streamClient.createToken(userId);
  } catch (error) {
    console.log('Error upsert Stream User');
    throw new AppError('Error upsert Stream User', 400);
  }
};

// TODO: DELETE A CHANNEL
export const deleteStreamChannel = async (
  channelType: string,
  channelId: string,
  hardDelete: boolean = false
) => {
  try {
    const cid = `${channelType}:${channelId}`;

    // Kiểm tra channel có tồn tại không
    const channel = streamClient.channel(channelType, channelId);
    const state = await channel.query().catch(() => null);

    if (!state) {
      // Channel không tồn tại
      console.log(`Channel ${cid} does not exist. Skipping deletion.`);
      return null;
    }

    // *Stream API cho phép xóa nhiều channel cùng lúc, nhưng ở đây chỉ xóa 1 channel
    const result = await streamClient.deleteChannels([cid], {
      hard_delete: hardDelete,
    });

    console.log('Stream channel delete successful for', cid);
    return result;
  } catch (error) {
    console.log('Error delete Stream Channel', error);
    throw new AppError('Error delete Stream Channel', 400);
  }
};
