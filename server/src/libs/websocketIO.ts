import { Server, Socket } from 'socket.io';

const onlineUsers = new Map<string, string>();

export function initSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    let userId: string | null = null;
    let authenticated = false;

    // Đặt timeout xác thực (10 giây)
    const authTimeout = setTimeout(() => {
      if (!authenticated) {
        socket.emit('auth-timeout');
        socket.disconnect();
      }
    }, 10000);

    try {
      // Lắng nghe sự kiện authenticate
      socket.on('authenticate', (id: string) => {
        if (authenticated) return;
        userId = id;
        authenticated = true;
        clearTimeout(authTimeout);

        onlineUsers.set(userId, socket.id);

        // Gửi danh sách online hiện tại
        socket.emit('online-list', Array.from(onlineUsers.keys()));

        // Thông báo user mới online cho các client khác
        socket.broadcast.emit('user-online', userId);

        console.log(
          `User authenticated & connected: ${userId} (socket: ${socket.id})`
        );

        // Xử lý thông báo xóa bạn bè
        socket.on(
          'friend:deleted',
          ({
            targetUserId,
            payload,
          }: {
            targetUserId: string;
            payload: any;
          }) => {
            if (!userId || !authenticated) {
              console.log(`🚫 Unauthenticated friend:deleted attempt`);
              return;
            }

            console.log(
              `🔔 friend:deleted from ${userId} to ${targetUserId}`,
              payload
            );

            const targetSocketId = onlineUsers.get(targetUserId);
            if (!targetSocketId) {
              console.log(
                `❌ ${targetUserId} not online - notification not sent`
              );
              return;
            }

            io.to(targetSocketId).emit('friend:deleted:notify', {
              from: userId,
              ...payload,
            });

            console.log(`✉️ Sent friend:deleted:notify to ${targetUserId}`);
          }
        );

        // Xử lý thông báo thêm bạn bè
        socket.on(
          'friend:added',
          ({
            targetUserId,
            payload,
          }: {
            targetUserId: string;
            payload: any;
          }) => {
            if (!userId || !authenticated) return;

            console.log(
              `🔔 friend:added from ${userId} to ${targetUserId}`,
              payload
            );

            const targetSocketId = onlineUsers.get(targetUserId);
            if (!targetSocketId) {
              console.log(
                `❌ ${targetUserId} not online - notification not sent`
              );
              return;
            }
            if (targetSocketId) {
              io.to(targetSocketId).emit('friend:added:notify', {
                from: userId,
                ...payload,
              });
              console.log(`Sent friend:added:notify to ${targetUserId}`);
            }
          }
        );
      });

      socket.on('disconnect', () => {
        clearTimeout(authTimeout);
        if (!authenticated || !userId) return;

        console.log(`User disconnected: ${userId}`);

        onlineUsers.delete(userId);
        io.emit('user-offline', userId);
      });
    } catch (error) {
      socket.disconnect();
    }
  });
}
