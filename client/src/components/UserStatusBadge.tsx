import { useOnlineStatusStore } from '@/store/onlineStatusStore';
import type { IUser } from '@/types';

interface UserStatusBadgeProps {
  userId: IUser['_id'];
  showText?: boolean;
  className?: string;
}

const UserStatusBadge = ({
  userId,
  showText = false,
  className,
}: UserStatusBadgeProps) => {
  const isOnline = useOnlineStatusStore(
    (state) => state.onlineStatus[userId!] ?? false
  );

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`w-3 h-3 rounded-full mr-2 ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
        title={isOnline ? 'Online' : 'Offline'}
      />
      {showText && (
        <span className='text-sm text-gray-600'>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      )}
    </div>
  );
};

export default UserStatusBadge;
