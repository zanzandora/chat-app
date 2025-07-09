import express from 'express';
import './config/env';
import connectDB from './libs/connectDB';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';

import authRouter from '@/routers/auth.router';
import userRouter from '@/routers/user.router';
import chatRouter from '@/routers/chat.router';
import path from 'path';
import { fileURLToPath } from 'url';

import { Server } from 'socket.io';
import { initSocket } from './libs/websocketIO';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const httpServer = createServer(app);

// TODO: KHỞI TẠO SOCKET.IO SERVER

// Cấu hình Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
  transports: ['websocket'], // Chỉ dùng WebSocket để tối ưu
});

//logic xử lý WebSocket
initSocket(io);

// Đảm bảo path đúng dù chạy ở src/ hay dist/
const clientDist = path.resolve(__dirname, '../../client/dist');

// TODO: Thiết lập CORS cho API

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', true); // Cần thiết để dùng x-forwarded headers

// TODO: Redirect sang HTTPS nếu đang ở production và truy cập qua HTTP

app.use((req, res, next) => {
  if (
    req.header('x-forwarded-proto') !== 'https' &&
    process.env.NODE_ENV === 'production' &&
    req.header('x-forwarded-proto')
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// TODO: Định nghĩa các route API

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/chat', chatRouter);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(`[${req.method}] ${req.originalUrl} - ${err.message}`);
    res.status(err.statusCode || 500).json({
      message: err.message,
      missingFields: err.missingFields,
      status: err.statusCode,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  }
);

// TODO: Nếu ở production, phục vụ file tĩnh của client (SPA)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist));

  app.get(/(.*)/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// TODO: Khởi động server HTTP và kết nối database

httpServer.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
