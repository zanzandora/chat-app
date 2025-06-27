import { useOnlineStatusStore } from '@/store/onlineStatusStore';
import useAuthUser from '@/hooks/useAuthUser';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const getSocketUrl = () =>
  import.meta.env.PROD ? window.location.origin : 'http://localhost:3000';

export const useSocketSetup = () => {
  const { authUser } = useAuthUser();
  const { setStatus, setBulkStatus } = useOnlineStatusStore();
  const socketRef = useRef<Socket | null>(null); // !Sử dụng useRef nên không gây re-render

  useEffect(() => {
    if (!authUser) {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
      return;
    }

    // Khởi tạo socket mới nếu chưa có
    if (!socketRef.current) {
      socketRef.current = io(getSocketUrl(), {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        secure: import.meta.env.PROD,
        transports: ['websocket'],
      });
    }

    const socket = socketRef.current;

    const handleConnect = () => {
      socket.emit('authenticate', authUser._id);
    };

    const handleOnlineList = (userIds: string[]) => {
      const statuses = userIds.reduce(
        (acc, id) => ({ ...acc, [id]: true }),
        {}
      );
      setBulkStatus(statuses);
    };

    socket.on('connect', handleConnect);
    socket.on('online-list', handleOnlineList);
    socket.on('user-online', (userId: string) => setStatus(userId, true));
    socket.on('user-offline', (userId: string) => setStatus(userId, false));

    return () => {
      socket.off('connect', handleConnect);
      socket.off('online-list', handleOnlineList);
      socket.off('user-online');
      socket.off('user-offline');
      socket.disconnect();
    };
  }, [authUser, setStatus, setBulkStatus]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return socketRef.current;
};
