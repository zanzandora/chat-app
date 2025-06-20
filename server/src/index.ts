import express from 'express';
import './config/env';
import connectDB from './libs/connectDB';

import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from '@/routers/auth.router';
import userRouter from '@/routers/user.router';
import chatRouter from '@/routers/chat.router';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đảm bảo path đúng dù chạy ở src/ hay dist/
const clientDistPath = path.resolve(__dirname, '../client/dist');

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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDistPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
