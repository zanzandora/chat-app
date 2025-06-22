import NoFriendsFound from '@/components/NoFriendsFound';
import ViewModal from '@/components/ViewModal';
import { deleteFriend, getUserFriends } from '@/libs/api';
import type { IUser } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { getLanguageFlag } from '@/utils/getLanguageFlag';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const FriendsPage = () => {
  const {
    data: friends = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
  });

  const queryClient = useQueryClient();

  const { mutate: deleteFriendMutation, isPending } = useMutation({
    mutationFn: deleteFriend,
    onSuccess: () => {
      toast.success('Remove friend successfully');
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Remove failed');
    },
  });

  if (isLoading) return <div>Loading friends...</div>;
  if (error) return <div>Error loading friends.</div>;

  return (
    <div className='w-full max-w-6xl mx-auto py-10 px-4 space-y-8'>
      <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
        Your Friends
      </h2>
      {isLoading ? (
        <div className='flex justify-center py-20'>
          <span className='loading loading-spinner loading-lg' />
        </div>
      ) : friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {friends.map((friend: IUser) => (
            <div
              key={friend._id}
              className='card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow w-full rounded-3xl overflow-hidden flex flex-col items-center p-8'
            >
              {/* USER AVATAR */}
              <div className='avatar mb-6'>
                <div className='w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden'>
                  <img
                    src={friend.img}
                    alt={friend.fullname}
                    className='object-cover w-full h-full'
                  />
                </div>
              </div>
              {/* USER INFO */}
              <h3 className='font-bold text-2xl mb-2 text-center truncate w-full'>
                {friend.fullname}
              </h3>
              <div className='flex flex-wrap gap-2 mb-6 justify-center'>
                <span className='badge badge-secondary text-sm px-3 py-2'>
                  {getLanguageFlag(friend.nativeLanguage)}
                  <span className='ml-1'>Native: {friend.nativeLanguage}</span>
                </span>
                <span className='badge badge-outline text-sm px-3 py-2'>
                  {getLanguageFlag(friend.learningLanguage)}
                  <span className='ml-1'>
                    Learning: {friend.learningLanguage}
                  </span>
                </span>
              </div>
              {/* ACTIONS */}
              <div className='flex flex-col gap-3 w-full mt-auto'>
                <Link
                  to={`/chat/${friend._id}`}
                  className='btn btn-primary btn-lg w-full text-lg'
                >
                  Chat Message
                </Link>
                {/* <button className='btn btn-outline w-full'>View Profile</button> */}
                <ViewModal friend={friend} />
                {/* Remove Friend Button triggers modal */}

                <button
                  onClick={() => {
                    const modal = document.getElementById(
                      `delete-modal-${friend._id}`
                    ) as HTMLDialogElement;
                    modal?.showModal();
                  }}
                  className='btn btn-ghost w-full text-error'
                  disabled={isPending}
                >
                  Remove Friend
                </button>
                {/* DaisyUI Modal for confirmation */}
                <dialog id={`delete-modal-${friend._id}`} className='modal'>
                  <div className='modal-box'>
                    <h3 className='font-bold text-lg'>Remove Friend</h3>
                    <p className='py-4'>
                      Are you sure you want to remove{' '}
                      <span className='font-semibold'>{friend.fullname}</span>{' '}
                      from your friends?
                    </p>
                    <div className='modal-action'>
                      <form method='dialog' className='flex gap-2'>
                        <button className='btn btn-outline'>Cancel</button>
                        <button
                          type='button'
                          className='btn btn-error'
                          disabled={isPending}
                          onClick={() => {
                            deleteFriendMutation(friend._id!);
                            // Close the modal
                            const modal = document.getElementById(
                              `delete-modal-${friend._id}`
                            ) as HTMLDialogElement;
                            modal?.close();
                          }}
                        >
                          {isPending ? 'Removing...' : 'Remove'}
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
