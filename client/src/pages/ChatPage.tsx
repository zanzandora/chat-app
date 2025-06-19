import CallBtn from '@/components/CallBtn';
import ChatLoader from '@/components/ChatLoader';
import useAuthUser from '@/hooks/useAuthUser';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getStreamToken } from '@/libs/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import { type Channel as StreamChannel, StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const isMobile = useIsMobile();

  const [chatClient, setChatClient] = useState<StreamChat>();
  const [channel, setChannel] = useState<StreamChannel>();
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ['stream-token'],
    queryFn: getStreamToken,
    enabled: !!authUser, // only fetch stream token if user is authenticated
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser || chatClient) return;

      try {
        console.log('Initializing chat client...');
        const client = StreamChat.getInstance(STREAM_API_KEY);

        if (typeof tokenData.token !== 'string') {
          throw new Error('Invalid token: Token must be a string');
        }

        console.log(tokenData?.token);

        // // Only disconnect if a user is already connected
        // if (client.userID) {
        //   await client.disconnectUser();
        // }

        await client.connectUser(
          {
            id: authUser._id!,
            name: authUser.fullname,
            image: authUser.img,
          },
          tokenData.token
        );

        // !create channel ID based on user IDs
        const channelId = [authUser._id, targetUserId].sort().join('-');

        const currentChannel = client.channel('messaging', channelId, {
          members: [authUser._id!, targetUserId!],
        });

        await currentChannel.watch();

        setChatClient(client);
        setChannel(currentChannel);
      } catch (error) {
        console.error('Error initializing chat client:', error);
        toast.error('Could not connect to chat. Please try again');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, targetUserId, tokenData, chatClient]);

  const handleVideoCall = () => {
    const callUrl = `${window.location.origin}/call/${channel?.id}`;

    channel?.sendMessage({
      text: `I've started a video call. Join me here: ${callUrl}`,
    });

    toast.success('Video call link sent successfully !');
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative h-full flex flex-col'>
            <CallBtn handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
            {isMobile && (
              <div className='h-full w-full'>
                <Thread />
              </div>
            )}
            {!isMobile && <Thread />}
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
