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
