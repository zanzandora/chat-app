import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useSocket } from '@/context/SocketProvider';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const MainLayout = ({
  children,
  showSidebar = false,
}: {
  children: React.ReactNode;
  showSidebar: boolean;
}) => {
  const socket = useSocket();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handlerDelete = (payload: { sender: string; action: string }) => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });

      toast.error(`You were removed from friends by ${payload.sender}`);
    };

    const handlerAdded = (payload: { recipient: string; action: string }) => {
      queryClient.invalidateQueries({ queryKey: ['ongoing-friends-reqs'] });
      queryClient.invalidateQueries({ queryKey: ['recommend-users'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });

      toast.error(`You were added from friends by ${payload.recipient}`);
    };

    socket.on('friend:deleted:notify', handlerDelete);
    socket.on('friend:added:notify', handlerAdded);

    return () => {
      socket.off('friend:deleted:notify', handlerDelete);
      socket.off('friend:added:notify', handlerAdded);
    };
  }, [socket, queryClient]);

  return (
    <div className='min-h-screen'>
      <div className='flex'>
        {showSidebar && <Sidebar />}

        <div className='flex-1 flex flex-col'>
          <Navbar />

          <main className='flex-1 overflow-y-auto'>{children}</main>
        </div>
      </div>
    </div>
  );
};
export default MainLayout;
