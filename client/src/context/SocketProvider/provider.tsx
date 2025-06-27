import { useSocketSetup } from './hook';
import { SocketContext } from './context';
import { useEffect } from 'react';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocketSetup();

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
