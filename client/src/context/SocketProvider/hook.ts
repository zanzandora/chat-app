import { useOnlineStatusStore } from '@/store/onlineStatusStore';
import useAuthUser from '@/hooks/useAuthUser';
import { useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const getSocketUrl = () => {
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
  // Dùng WSS khi dev với HTTPS
  return window.location.protocol === 'https:'
    ? `wss://localhost:3000`
    : 'http://localhost:3000';
};

export const useSocketSetup = () => {
  const { authUser } = useAuthUser();
  const {
    setStatus,
    setBulkStatus,
    reset: resetOnlineStatus,
  } = useOnlineStatusStore();
  const socketRef = useRef<Socket | null>(null); // !Sử dụng useRef nên không gây re-render

  const handleConnect = useCallback(() => {
    if (authUser && socketRef.current) {
      socketRef.current.emit('authenticate', authUser._id);
    }
  }, [authUser]);

  const handleOnlineList = useCallback(
    (userIds: string[]) => {
      const statuses = userIds.reduce(
        (acc, id) => ({ ...acc, [id]: true }),
        {}
      );
      setBulkStatus(statuses);
    },
    [setBulkStatus]
  );

  const handleUserOnline = useCallback(
    (userId: string) => {
      setStatus(userId, true);
    },
    [setStatus]
  );

  const handleUserOffline = useCallback(
    (userId: string) => {
      setStatus(userId, false);
    },
    [setStatus]
  );

  useEffect(() => {
    if (!authUser) {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      resetOnlineStatus();
      return;
    }

    if (socketRef.current && socketRef.current.connected) {
      console.log(
        '[Client] Socket already connected with authUser. Skipping re-initialization.'
      );
      return;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
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

    // TODO: Đăng ký các event handle cho socket
    console.log('[Client] Socket connecting...');
    socket.on('connect', handleConnect);
    socket.on('online-list', handleOnlineList);
    socket.on('user-online', handleUserOnline);
    socket.on('user-offline', handleUserOffline);
    socket.on('disconnect', (reason) => {
      console.log(`[Client] Socket disconnected: ${reason}`);
      resetOnlineStatus();
    });

    return () => {
      socketRef.current?.off('connect', handleConnect);
      socketRef.current?.off('online-list', handleOnlineList);
      socketRef.current?.off('user-online');
      socketRef.current?.off('user-offline');
      socketRef.current?.off('disconnect');
      socketRef.current?.off('connect_error');
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [
    authUser,
    setStatus,
    setBulkStatus,
    handleConnect,
    handleOnlineList,
    handleUserOffline,
    handleUserOnline,
    resetOnlineStatus,
  ]);

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
