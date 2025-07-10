import FriendCard from '@/components/FriendCard';
import NoFriendsFound from '@/components/NoFriendsFound';
import { useSocket } from '@/context/SocketProvider';
import {
  getOutGoingFriednReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendReq,
} from '@/libs/api';
import type { IFriendReq, IUser } from '@/types';
import { getLanguageFlag } from '@/utils/getLanguageFlag';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

const HomePage = () => {
  const socket = useSocket();

  const queryClient = useQueryClient();
  const [outgoingReqsIds, setOutgoingReqsIds] = useState(new Set());

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['recommend-users'],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ['ongoing-friends-reqs'],
    queryFn: getOutGoingFriednReqs,
  });

  const { mutate: sendReqMution, isPending } = useMutation({
    mutationFn: sendFriendReq,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['ongoing-friends-reqs'] });

      if (!socket) return;

      socket.emit('new-friend-req', {
        targetUserId: userId,
      });
    },
  });

  const capitialize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // TODO: xác định nhanh những user nào đã được gửi lời mời kết bạn, để hiển thị trạng thái phù hợp trên UI.
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req: IFriendReq) => {
        console.log(req);
        outgoingIds.add(req.recipient._id);
      });

      setOutgoingReqsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  useEffect(() => {
    if (!socket) return;

    const handleFriendRequestDenied = (data: { from: string }) => {
      setOutgoingReqsIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.from);
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ['ongoing-friends-reqs'] });
    };

    socket.on('friend:denied:notify', handleFriendRequestDenied);

    return () => {
      socket.off('friend:denied:notify', handleFriendRequestDenied);
    };
  }, [socket, queryClient]);

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
            Your Friends
          </h2>
          <Link to='/notifications' className='btn btn-outline btn-sm'>
            <UsersIcon className='mr-2 size-4' />
            Friend Requests
          </Link>
        </div>

        {isLoadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {friends.map((friend: IUser) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className='mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
                  Meet New Learners
                </h2>
                <p className='opacity-70'>
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {isLoadingUsers ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className='card bg-base-200 p-6 text-center'>
              <h3 className='font-semibold text-lg mb-2'>
                No recommendations available
              </h3>
              <p className='text-base-content opacity-70'>
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {recommendedUsers.map((user: IUser) => {
                const hasRequestBeenSent = outgoingReqsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className='card bg-base-200 hover:shadow-lg transition-all duration-300'
                  >
                    <div className='card-body p-5 space-y-4'>
                      <div className='flex items-center gap-3'>
                        <div className='avatar size-16 rounded-full'>
                          <img src={user.img} alt={user.fullname} />
                        </div>

                        <div>
                          <h3 className='font-semibold text-lg'>
                            {user.fullname}
                          </h3>
                          {user.location && (
                            <div className='flex items-center text-xs opacity-70 mt-1'>
                              <MapPinIcon className='size-3 mr-1' />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className='flex flex-wrap gap-1.5'>
                        <span className='badge badge-secondary '>
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className='badge badge-outline'>
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className='text-sm opacity-70'>{user.bio}</p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? 'btn-disabled' : 'btn-primary'
                        } `}
                        onClick={() => sendReqMution(user._id!)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className='size-4 mr-2' />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className='size-4 mr-2' />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
