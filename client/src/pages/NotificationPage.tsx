import NoNotificationsFound from '@/components/NoNotificationsFound';
import { useSocket } from '@/context/SocketProvider';
import { acceptFriendReq, denyriendReq, getFriendReqs } from '@/libs/api';
import { timePassed } from '@/utils/timePassed';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
  UserXIcon,
} from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const NotificationPage = () => {
  const socket = useSocket();

  const queryClient = useQueryClient();

  const { data: FriendReqs, isLoading } = useQuery({
    queryKey: ['friend-reqs'],
    queryFn: getFriendReqs,
  });

  const { mutate: acceptedReqMutate, isPending: isPendingAcceptedReq } =
    useMutation({
      mutationFn: acceptFriendReq,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['friend-reqs'] });
        queryClient.invalidateQueries({ queryKey: ['friends'] });
        toast.success('Friend request accepted successfully!');

        if (socket?.connected) {
          socket.emit('friend:added', {
            targetUserId: data?.senderInfor.sender._id,
            payload: {
              action: 'added',
              timestamp: new Date().toISOString(),
              sender: data?.senderInfor.sender.fullname,
              recipient: data?.recipientInfo.recipient.fullname,
            },
          });
          console.log('Friend deletion event emitted');
        }
      },
    });

  const { mutate: deniedReqMutate, isPending: isPendingDeniedReq } =
    useMutation({
      mutationFn: denyriendReq,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['friend-reqs'] });
        queryClient.invalidateQueries({ queryKey: ['friends'] });

        if (socket?.connected) {
          socket.emit('friend:denied', {
            targetUserId: data?.senderInfor.sender._id,
          });
          console.log('Friend deletion event emitted');
        }

        toast.success('Friend request denied successfully!');
      },
    });

  const inComingReqs = FriendReqs?.incomingReqs || [];
  const acceptReqs = FriendReqs?.acceptedReqs || [];
  const deniedReqs = FriendReqs?.deniedReqs || [];

  useEffect(() => {
    if (!socket) return;

    const handleNotifyRequest = () => {
      queryClient.invalidateQueries({ queryKey: ['friend-reqs'] });
    };

    socket.on('new-friend-req:notify', handleNotifyRequest);
    socket.on('friend:denied:notify', handleNotifyRequest);
    socket.on('friend:added:notify', handleNotifyRequest);

    return () => {
      socket.off('new-friend-req:notify', handleNotifyRequest);
      socket.off('friend:denied:notify', handleNotifyRequest);
      socket.off('friend:added:notify', handleNotifyRequest);
    };
  }, [socket, queryClient]);

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto max-w-4xl space-y-8'>
        <h1 className='text-2xl sm:text-3xl font-bold tracking-tight mb-6'>
          Notifications
        </h1>

        {isLoading ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : (
          <>
            {inComingReqs?.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <UserCheckIcon className='h-5 w-5 text-primary' />
                  Friend Requests
                  <span className='badge badge-primary ml-2'>
                    {inComingReqs.length}
                  </span>
                </h2>

                <div className='space-y-3'>
                  {inComingReqs.map((request) => (
                    <div
                      key={request._id}
                      className='card bg-base-200 shadow-sm hover:shadow-md transition-shadow'
                    >
                      <div className='card-body p-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='avatar w-14 h-14 rounded-full bg-base-300'>
                              <img
                                src={request.sender.img}
                                alt={request.sender.fullname}
                              />
                            </div>
                            <div>
                              <h3 className='font-semibold'>
                                {request.sender.fullname}
                              </h3>
                              <div className='flex flex-wrap gap-1.5 mt-1'>
                                <span className='badge badge-secondary badge-sm'>
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className='badge badge-outline badge-sm'>
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className='flex md:flex-row flex-col items-center justify-center gap-4'>
                            <button
                              className='btn btn-primary btn-sm'
                              onClick={() => acceptedReqMutate(request._id!)}
                              disabled={isPendingAcceptedReq}
                            >
                              Accept
                            </button>

                            <button
                              className='btn btn-error btn-sm text-black'
                              onClick={() => deniedReqMutate(request._id!)}
                              disabled={isPendingDeniedReq}
                            >
                              Deny
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptReqs.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <BellIcon className='h-5 w-5 text-success' />
                  New Connections
                </h2>

                <div className='space-y-3'>
                  {acceptReqs.map((notification) => (
                    <div
                      key={notification._id}
                      className='card bg-base-200 shadow-sm'
                    >
                      <div className='card-body p-4'>
                        <div className='flex items-start gap-3'>
                          <div className='avatar mt-1 size-10 rounded-full'>
                            <img
                              src={notification.recipient.img}
                              alt={notification.recipient.fullname}
                            />
                          </div>
                          <div className='flex-1'>
                            <h3 className='font-semibold'>
                              {notification.recipient.fullname}
                            </h3>
                            <p className='text-sm my-1'>
                              {notification.recipient.fullname} accepted your
                              friend request
                            </p>
                            <p className='text-xs flex items-center opacity-70'>
                              <ClockIcon className='h-3 w-3 mr-1' />
                              {timePassed(notification.updatedAt)}
                            </p>
                          </div>
                          <div className='badge badge-success'>
                            <MessageSquareIcon className='h-3 w-3 mr-1' />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* DENIED REQS NOTIFICATONS */}
            {deniedReqs.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <UserXIcon className='h-5 w-5 text-error' />
                  Denied
                </h2>

                <div className='space-y-3'>
                  {deniedReqs.map((notification) => (
                    <div
                      key={notification._id}
                      className='card bg-base-200 shadow-sm'
                    >
                      <div className='card-body p-4'>
                        <div className='flex items-start gap-3'>
                          <div className='avatar mt-1 size-10 rounded-full'>
                            <img
                              src={notification.recipient.img}
                              alt={notification.recipient.fullname}
                            />
                          </div>
                          <div className='flex-1'>
                            <h3 className='font-semibold'>
                              {notification.recipient.fullname}
                            </h3>
                            <p className='text-sm my-1'>
                              {notification.recipient.fullname} denied your
                              friend request
                            </p>
                            <p className='text-xs flex items-center opacity-70'>
                              <ClockIcon className='h-3 w-3 mr-1' />
                              {timePassed(notification.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {inComingReqs.length === 0 && acceptReqs.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
