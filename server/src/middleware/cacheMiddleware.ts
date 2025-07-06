import redisClient from '@/config/redis';
import { NextFunction, Request, Response } from 'express';

export const cacheCheck = (prefix: string, ttlSeconds: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    // 1. Chỉ xử lý GET request
    if (req.method !== 'GET') return next();

    // 2. Tạo cache key
    const key = userId ? `${prefix}:${userId}` : `${prefix}:${req.originalUrl}`;

    try {
      // 3. Thử lấy cache
      const cached = await redisClient.hGetJson(key);

      if (cached) {
        console.log(`⚡ Cache hit [${key}]`);
        res.json(cached);
        return;
      }
    } catch (e) {
      console.warn(`🚫 Cache read error [${key}]:`, (e as Error).message);
    }

    // 4. Thiết lập cơ chế lưu cache
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      // Chỉ lưu cache nếu:
      // - Status 200
      // - Có dữ liệu body
      // - Không có lỗi
      if (res.statusCode === 201 && body && !body.error) {
        // Lưu cache trong background
        setImmediate(async () => {
          try {
            await redisClient.hSetJson(key, body, ttlSeconds);
            console.log(`💾 Cache saved [${key}] (${ttlSeconds}s)`);
          } catch (e) {
            console.warn(
              `🚫 Cache save failed [${key}]:`,
              (e as Error).message
            );
          }
        });
      }
      return originalJson(body);
    };

    next();
  };
};

// Hàm helper để sử dụng trong controller khi cần
// export const clearUserCache = async (prefix: string, userId: string) => {
//   const key = `${prefix}:${userId}`;
//   try {
//     await redisClient.hDel(key);
//     console.log(`🧹 Cache cleared [${key}]`);
//     return true;
//   } catch (e) {
//     console.warn(`🚫 Cache clear failed [${key}]:`, (e as Error).message);
//     return false;
//   }
// };
