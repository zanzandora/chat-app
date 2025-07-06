import { createClient, RedisClientType } from 'redis';

class RedisService {
  private client: RedisClientType;
  private static instance: RedisService;

  private constructor() {
    this.client = createClient({
      username: 'default',
      password: `${process.env.REDIS_PASSWORD}`,
      socket: {
        host: `${process.env.REDIS_URL}`,
        port: parseInt(process.env.REDIS_PORT!),
      },
    });

    this.client.on('error', (err) => console.error('Redis error:', err));
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async getJson(key: string): Promise<any | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Redis get error:', err);
      return null;
    }
  }

  async setJson(key: string, value: any, ttlSeconds = 60): Promise<boolean> {
    try {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Redis set error:', err);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.client.del(key);
      return true;
    } catch (err) {
      console.error('Redis delete error:', err);
      return false;
    }
  }
}

const redis = RedisService.getInstance();
redis.connect(); // Kết nối ngay khi khởi động

export default redis;
