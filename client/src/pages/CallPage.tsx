import useAuthUser from '@/hooks/useAuthUser';
import { getStreamToken } from '@/libs/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  type User,
} from '@stream-io/video-react-sdk';
import toast from 'react-hot-toast';
import ChatLoader from '@/components/ChatLoader';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  // const searchParams = new URLSearchParams(location.search);
  // const targetUserId = searchParams.get('target');

  const { isLoading, authUser } = useAuthUser();

  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();
  const [isConnecting, setIsConnecting] = useState(true);

  const { data: tokenData } = useQuery({
    queryKey: ['stream-token'],
    queryFn: getStreamToken,
    enabled: !!authUser, // only fetch stream token if user is authenticated
  });

  useEffect(() => {
    let callInstance: Call | undefined;
    let videoClient: StreamVideoClient | undefined;
    let isMounted = true;

    const cleanupPreviousSession = async () => {
      // Attempt to leave any previous call and disconnect user before creating new instance
      if (callInstance) {
        try {
          await callInstance.leave();
          console.log('Left previous call successfully');
        } catch (err) {
          console.error('Error leaving previous call:', err);
        }
      }
      if (videoClient) {
        try {
          await videoClient.disconnectUser();
          console.log('Disconnected previous user');
        } catch (err) {
          console.error('Error disconnecting previous user:', err);
        }
      }
    };

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      // Always cleanup before initializing new call
      await cleanupPreviousSession();

      try {
        console.log('Initializing Stream video client...');

        const user: User = {
          id: authUser._id!,
          name: authUser.fullname,
          image: authUser.img,
        };

        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
          options: {
            logLevel: 'debug',
          },
        });

        callInstance = videoClient.call('default', callId);

        // Use getOrCreate if available, otherwise check members as before
        let alreadyJoined = false;
        let callState;
        try {
          callState = await callInstance.get();
          alreadyJoined = callState.members?.some(
            (member) => member.user.id === user.id
          );
        } catch (err) {
          console.error(' Failed to get call state: ', err);

          // If get fails, assume not joined
          alreadyJoined = false;
        }

        if (!alreadyJoined) {
          await callInstance.join({
            create: true,
          });
          console.log('Joined call successfully');
        } else {
          // Optionally, you can skip re-joining if already joined
          // Or force leave and re-join to ensure only one session
          await callInstance.leave();
          await callInstance.join({ create: false });
          console.log('User already in call, re-joining session after leave');
        }

        if (isMounted) {
          setClient(videoClient);
          setCall(callInstance);
        }
      } catch (error) {
        console.error('Error joining call:', error);
        toast.error('Could not join the call. Please try again.');
      } finally {
        if (isMounted) setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      isMounted = false;

      // Cleanup on unmount
      cleanupPreviousSession();
    };
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <ChatLoader />;

  return (
    <div className=' h-full  flex flex-col items-center justify-center'>
      <div className=' relative'>
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <p>Could not initialize call. Pleas refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate('/');
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme className=''>
      <SpeakerLayout participantsBarPosition={'bottom'} />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
